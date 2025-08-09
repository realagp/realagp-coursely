"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserTable } from "@/app/data/admin/get-all-users";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { updateUserRole } from "../action";
import { tryCatch } from "@/hooks/try-catch";

export function RoleSelect({ user }: { user: UserTable }) {
  const initialRole = user.role || "user";
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    if (!pendingRole) return;

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateUserRole(user.id, pendingRole as "user" | "admin")
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setSelectedRole(pendingRole);
        setPendingRole(null);
        setOpen(false);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      {/* Role Select */}
      <Select
        value={selectedRole}
        onValueChange={(newRole) => {
          if (newRole !== selectedRole) {
            setPendingRole(newRole);
            setOpen(true);
          }
        }}
        disabled={isPending || open}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change <strong>{user.name}</strong>’s role
              to <strong>{pendingRole}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setPendingRole(null);
                setSelectedRole(initialRole);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Updating
                </>
              ) : (
                <>Confirm</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

