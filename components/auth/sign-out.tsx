"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export default function SignOutButton({
    variant = "default",
}: {
    variant: "navbar" | "default";
}) {
    const router = useRouter();

    const isNavbar = variant === "navbar";

    return (
        <form
            onSubmit={async () => {
                await authClient.signOut();
                router.refresh();
            }}
        >
            <Button
                type="submit"
                variant={isNavbar ? "outline" : "secondary"}
                {...(isNavbar ? { size: "icon" } : {})}
            >
                <LogOut />
                {!isNavbar && "Log Out"}
            </Button>
        </form>
    );
}
