"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useSignOut = () => {
      
    const router = useRouter();

    async function handleLogout() {
        await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
            router.push("/");
            toast.success("Logged out successfully.");
            },
        },
      });
    }

    return handleLogout;
  }

export default useSignOut;