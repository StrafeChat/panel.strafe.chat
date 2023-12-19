'use client';
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function AuthService({ children }: { children: JSX.Element }) {

    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname == "/login") return;
        if (!cookie.get("token")) router.push("/login");
    }, [user, pathname, router]);

    return (
        <>{children}</>
    )
}