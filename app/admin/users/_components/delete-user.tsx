"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "../action";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";

export function DeleteUserButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isConfirmed = confirmText.trim() === "Confirm"; // exact match required

  return (
    <AlertDialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (v) setConfirmText(""); // reset whenever dialog opens
    }}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-destructive hover:text-destructive/80"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this user
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* confirm input + hint area */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {/* left: input */}
          <div>
            <label className="block text-sm font-medium mb-2">Type <strong>"Confirm"</strong> to enable delete</label>
            <input
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "Confirm"'
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
            />
          </div>

          {/* right: extra warning/info */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              This will permanently remove the user and their associated data.
            </p>
            <p>
              Make sure you really want to delete this account. Typing <em>Confirm</em> prevents accidental deletions.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              // guard double-run if not confirmed
              if (!isConfirmed) return;

              startTransition(async () => {
                const { data: result, error } = await tryCatch(deleteUser(userId));

                if (error) {
                  toast.error("An unexpected error occurred. Please try again.");
                  return;
                }

                if (result.status === "success") {
                  toast.success(result.message);
                  setOpen(false);
                  router.refresh();
                } else {
                  toast.error(result.message);
                }
              });
            }}
            className="bg-destructive text-white hover:bg-destructive/80"
            disabled={!isConfirmed || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" />
                Deleting
              </>
            ) : (
              <>
                <Trash2 className="size-4 mr-1" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

