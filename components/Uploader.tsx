import React, {useCallback, useEffect, useState} from "react"
import {FileRejection, useDropzone} from "react-dropzone"
import { EmptyState, ErrorState, UploadedState, UploadingdState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { ConstructedUrl } from "@/hooks/object-url";

interface UploadState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  isDeleting: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProps {
  value?: string,
  onChange?: (value: string) => void;
  fileTypeRequired: "video" | "image";
}

const FileUploader = ({value, onChange, fileTypeRequired}: UploaderProps) => {

    const fileUrl = ConstructedUrl(value || "");

    const [fileState, setFileState] = useState<UploadState>({
      id: null,
      error: false,
      file: null,
      uploading: false,
      progress: 0,
      isDeleting: false,
      fileType: fileTypeRequired,
      key: value,
      objectUrl: value ? fileUrl : undefined,
    });

    const uploadFile = useCallback(async(file: File) => {
        setFileState((prev) => ({
          ...prev,
        uploading: true,
        progress: 0,
        }))

        try {
          
          const presignedResponse = await fetch("/api/s3/upload", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
              size: file.size,
              isImage: fileTypeRequired === "image" ? true : false, 
              }),
            });

            if(!presignedResponse.ok) {
              toast.error("Failed to get presigned URL");
              setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
              }));

              return; 
            }

            const { presignedUrl, key} = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();

              xhr.upload.onprogress = (event) => {
                if(event.lengthComputable) {
                  const percentageCompleted = (event.loaded / event.total) * 100;
                  setFileState((prev) => ({
                    ...prev,
                  progress: Math.round(percentageCompleted),
                  }))
                }
              }

              xhr.onload = () => {
                if(xhr.status === 200 || xhr.status === 204) {
                  setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 100,
                    key: key,
                  }))

                  onChange?.(key);

                  toast.success("File uploaded successfully.");

                  resolve();
                } else {
                  reject(new Error("Upload failed."));
                }
              }

              xhr.onerror = () => {
                  reject(new Error("Upload failed."));
                }
              xhr.open("PUT", presignedUrl);
              xhr.setRequestHeader("Content-Type", file.type)
              xhr.send(file);
            }) 
        } catch {
          toast.error("Something went wrong.")
          setFileState((prev) => ({
              ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }))
        }
      }, [fileTypeRequired, onChange]
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {

        if(acceptedFiles.length > 0) {
          const file = acceptedFiles[0];

          if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
          }

          setFileState({
            id: uuidv4(),
            file: file,
            uploading: false,
            progress: 0,
            objectUrl: URL.createObjectURL(file),
            error: false,
            isDeleting: false,
            fileType: fileTypeRequired
          });

          uploadFile(file);
        }
    }, [fileState.objectUrl, uploadFile, fileTypeRequired]);

    async function handleRemoveFile() {
      if(fileState.isDeleting || !fileState.objectUrl) return;

      try {
        setFileState((prev) => ({
            ...prev,
          isDeleting: true,
        }))

        const response = await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            key: fileState.key,
          }),
        })

        if(!response.ok) {
          toast.error("There was an issue removing the file.");
          setFileState((prev) => ({
            ...prev,
            isDeleting: true,
            error: true,
          }));

          return; 
        }

        if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        onChange?.("");

        setFileState(() => ({
          file: null,
          uploading: false,
          progress: 0,
          error: false,
          fileType: fileTypeRequired,
          id: null,
          isDeleting: false,
        }));

        toast.success("File removed successfully.")
        
      } catch {
        toast.error("Error removing file. Please try again.")
          setFileState((prev) => ({
            ...prev,
            isDeleting: false,
            error: true,
        }));
      }
    }

    function rejectedFiles(fileRejection: FileRejection[]) {
      if (fileRejection.length > 0) {
        const tooManyFiles = fileRejection.find((rejection) =>
          rejection.errors[0].code === "too-many-files")

        const fileTooLarge = fileRejection.find((rejection) =>
          rejection.errors[0].code === "file-too-large")

        const fileTypeError = fileRejection.find((rejection) =>
          rejection.errors[0].code === "file-invalid-type")

        if (fileTooLarge) {
          toast.error("File is too large. Maximum size is 10MB.");
        }

        if (tooManyFiles) {
          toast.error("Too many files selected. Please select only one file.");
        }

        if (fileTypeError) {
          toast.error("Invalid file type. Only images and videos are allowed.");
        }
      } 
    }

    function RenderContent() {
      if(fileState.uploading) {
        return <UploadingdState progress={fileState.progress} file={fileState.file as File} />
      }

      if(fileState.error) {
        return <ErrorState />
      }

      if(fileState.objectUrl) {
        return (
          <UploadedState 
          filePreview={fileState.objectUrl}
          handleRemoveFile={handleRemoveFile} 
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
          /> 
        )
      }

      return <EmptyState isDragActive={isDragActive} />

    }

    useEffect(() => {
      return () => {
        if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
        }
      }
    }, [fileState.objectUrl])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
      accept: fileTypeRequired === "video" ? {"video/*": []} : {"image/*": []},
      maxFiles: 1,
      maxSize: 15 * 1024 * 1024, // 10 MB
      multiple: false,
      onDropRejected: rejectedFiles,
      disabled: fileState.uploading || !!fileState.objectUrl
    });

  return (
    <Card {...getRootProps()} 
    className={cn("relative border-dashed border-2 transition-colors ease-in-out duration-200 w-full h-64",
        isDragActive 
        ? "border-muted bg-muted/20 border-solid" 
        : "border-border hover:bg-muted/50 hover:border-primary/50"
    )}>
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {RenderContent()}
      </CardContent>
    </Card>
  )
}

export default FileUploader;