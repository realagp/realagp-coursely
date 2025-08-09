import { cn } from "@/lib/utils";
import { 
  CloudUploadIcon, 
  ImageIcon,
  Loader2,
  Trash2Icon, 
  UploadCloud,} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export function EmptyState ({isDragActive}:{isDragActive: boolean}) {
  return (
    <div className="text-center">
        <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
            <CloudUploadIcon 
            className={cn(
                "size-6 text-green-600", 
                isDragActive && "text-green-500")} />
        </div>
        <p className={cn(
                "text-muted-foreground text-base font-normal", 
                isDragActive && "text-foreground")}>
          Drop files here or 
            <span className={cn(
                "text-green-600 cursor-pointer", 
                isDragActive && "text-green-500")}> click to upload
            </span>
        </p>
    </div>
  )
}

export function ErrorState () {
  return (
    <div className="text-center">
        <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
            <ImageIcon 
            className={cn(
                "size-6 text-destructive")} />
        </div>
        <p className="text-destructive text-base font-normal">Upload Failed</p>
        <p className="text-muted-foreground text-sm mt-1 italic">Something went wrong.</p>
        <Button type="button" variant="outline" className="mt-4" >
          Retry <UploadCloud className="size-5 text-green-600" />
        </Button>
    </div>
  )
}

export function UploadedState ({
  filePreview, 
  isDeleting,
  fileType, 
  handleRemoveFile}:{
    filePreview: string 
    isDeleting: boolean,
    handleRemoveFile: () => void;
    fileType: "image" | "video";
  }) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "video" ? (
        <video src={filePreview} controls className="rounded-md w-full h-full" />
      ):(
        <Image 
        src={filePreview} 
        alt="Uploaded File"
        fill
        className="object-contain p-2"
      />
      )}
      <Button
        size="icon"
        variant="outline" 
        className={cn("absolute top-4 right-4 text-destructive hover:text-destructive")}
        onClick={handleRemoveFile}
        disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ):(
            <Trash2Icon className="size-4" />
          )}
      </Button>
    </div>
  )
}

export function UploadingdState ({progress, file}:{progress: number, file: File}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
    </div>
  )
}