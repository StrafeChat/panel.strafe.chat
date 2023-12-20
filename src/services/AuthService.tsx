"use client";
import { useEffect } from "react";
import cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Formatting } from "@/scripts/Formatting";
import Loading from "@/components/Loading";

export default function AuthService({ children }: { children: JSX.Element }) {
    const pathname = usePathname();
    const router = useRouter();

    const { user, setUser } = useAuth();

    useEffect(() => {
        const handleContextMenu = (event: Event) => {
            event.preventDefault();
        }

        document.addEventListener("contextmenu", handleContextMenu);

        return () => document.removeEventListener("contextmenu", handleContextMenu);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/panel/@me`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": cookie.get("token")!
                    }
                });

                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                setUser({ ...data });
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push("/login");
            }
        };

        if (pathname !== "/login") {
            fetchData();
        }
    }, [pathname, router, setUser]);

    if (!user && pathname !== "/login") {
        return <Loading />;
    }

    return (
        <>
            {user && (
                <NavigationMenu className="p-4 flex max-w-full justify-between items-center border-b">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href={"/"} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href={"/rooms"} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Rooms</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href={"/users"} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Users</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href={"/users"} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle() + " !p-0"}>
                                    <Avatar>
                                        <AvatarImage width={40} height={40} src={Formatting.avatar(user.id, user.avatar)} />
                                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            )}
            <div className={(user ? "h-[calc(100%-79px)]" : "h-full") + " overflow-y-auto"}>
                {children}
            </div>
        </>
    );
}
