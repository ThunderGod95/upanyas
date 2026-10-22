"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

export default function AuthScrollRegion({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const ref = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <main
            ref={ref}
            className="auth-scroll relative z-10 h-full w-full overflow-y-auto overscroll-contain"
        >
            {children}
        </main>
    );
}
