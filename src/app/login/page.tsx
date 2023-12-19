"use client";
import { FormEvent, useState } from "react";

export default function Page() {

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const handleSumbit = async (event: FormEvent) => {
        event.preventDefault();
        console.log({ ...login });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/panel/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(login)
        })

        const data = await res.json();

        if (!res.ok) return console.log(data);
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <form onSubmit={handleSumbit}>
                <h1 className="text-4xl uppercase font-bold text-center mb-2">Login</h1>
                <div className="flex flex-col gap-2">
                    <div>
                        <label>Email</label>
                        <input value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} type="email" className="w-[350px]" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} type="password" className="w-[350px]" />
                    </div>
                    <div className="mt-2">
                        <button className="w-[350px] primary">Login</button>
                    </div>
                </div>
            </form>
        </div>)
}