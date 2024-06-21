"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Login() {

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const { toast } = useToast()

    const router = useRouter();

    const handleSumbit = async (event: FormEvent) => {
        event.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(login)
        });

        const data = await res.json();

        if (!res.ok) return toast({ title: "Uh oh! Something went wrong.", description: data.message, variant: "destructive" });

        localStorage.setItem("token", data.token);
        router.replace("/");
    }

    return (
        <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
            <h1 className="mb-8 text-5xl font-bold mt-[-75px]">Admin Panel</h1>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login via Strafe</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSumbit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input autoComplete="email" placeholder="bobbyjoe@strafe.chat" id="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} type="email" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input autoComplete="current-password" placeholder="********" id="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} type="password" />
                            </div>
                            <Button className="text-white">Login</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div >
  )
}