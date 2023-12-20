"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import cookie from "js-cookie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Formatting } from "@/scripts/Formatting";
import {
    faBugSlash,
    faCode,
    faCrown,
    faGlobe,
    faHammer,
    faMoneyBillWave,
    faScrewdriverWrench,
    faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page() {

    const [query, setQuery] = useState("");
    const [targetUser, setTargetUser] = useState<any | null>(null);
    const [saveData, setSaveData] = useState(targetUser);
    const [badgeState, setBadgeState] = useState(0);

    const { toast } = useToast();

    const badgeMap = [
        {
            key: 1 << 1,
            value: <FontAwesomeIcon title="Founder" icon={faCrown} className={"text-yellow-500"} />,
        },
        {
            key: 1 << 2,
            value: <FontAwesomeIcon title="Developer" icon={faCode} className={"text-green-500"} />,
        },
        {
            key: 1 << 3,
            value: <FontAwesomeIcon title="Admin" icon={faScrewdriverWrench} className={"text-red-500"} />,
        },
        {
            key: 1 << 4,
            value: <FontAwesomeIcon title="Moderator" icon={faHammer} className={"text-blue-500"} />,
        },
        {
            key: 1 << 5,
            value: <FontAwesomeIcon title="Contributor" icon={faCode} className={"text-blue-600"} />,
        },
        {
            key: 1 << 6,
            value: <FontAwesomeIcon title="Translator" icon={faGlobe} className={"text-blue-400"} />,
        },
        {
            key: 1 << 7,
            value: <FontAwesomeIcon title="Bug Hunter" icon={faBugSlash} className={"text-red-600"} />,
        },
        {
            key: 1 << 8,
            value: (
                <FontAwesomeIcon title="Early Supporter" icon={faMoneyBillWave} className={"text-orange-500"} />
            ),
        },
        {
            key: 1 << 9,
            value: (
                <FontAwesomeIcon title="Supporter" icon={faMoneyBillWave} className={"text-green-600"} />
            ),
        },
        {
            key: 1 << 10,
            value: <FontAwesomeIcon title="Early Adopter" icon={faStar} className={"text-orange-600"} />,
        },
    ];

    const handleSearch = async (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (isNaN(parseInt(query))) return toast({ title: "Uh oh! Something went wrong.", description: "The search query must be a user id for now!", variant: "destructive" });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/panel/users/${query}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookie.get("token")!
            }
        });

        const data = await res.json();

        if (!res.ok) return toast({ title: "Uh oh! Something went wrong.", description: data.message, variant: "destructive" });

        setTargetUser({ ...data, discriminator: data.discriminator.toString().padStart(4, '0') });
        setSaveData({ ...data, discriminator: data.discriminator.toString().padStart(4, '0') });
        setBadgeState(data.flags);
    }

    const toggleBadge = (badgeKey: number) => {
        const updatedBadgeState = badgeState ^ badgeKey;
        setBadgeState(updatedBadgeState);
        setSaveData({ ...saveData, flags: updatedBadgeState });
    };

    const handleSave = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/panel/users/${targetUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookie.get("token")!
            },
            body: JSON.stringify(saveData)
        });

        const data = await res.json();

        if (!res.ok) return toast({ title: "Uh oh! Something went wrong.", description: data.message, variant: "destructive" });

        setTargetUser(saveData);
    }

    return (
        <div>
            {JSON.stringify(targetUser) != JSON.stringify(saveData) && <Button className="fixed bottom-5 right-5" onClick={handleSave}>Save</Button>}
            <div className="w-full p-4 flex flex-col justify-center space-y-2">
                <Label htmlFor="query">Search For User By ID</Label>
                <form className="w-full flex gap-8" onSubmit={handleSearch}>
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} type={"search"} placeholder={Date.now().toString()} id="query" />
                    <Button>Search</Button>
                </form>
            </div>
            <div className="py-4 px-4 md:px-10 flex justify-center">
                {!targetUser ? <div>Search for a user to get started</div> : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle>Avatar</CardTitle>
                                    <CardDescription>Edit {`${targetUser.username}#${targetUser.discriminator}'s avatar`}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center">
                                        <div className="w-fit h-fit relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={saveData.avatar == targetUser.avatar ? Formatting.avatar(targetUser.id, targetUser.avatar) : saveData.avatar} className="w-[128px] h-[128px] aspect-square rounded-full" alt="profile" />
                                            <Input onChange={(event) => {
                                                if (event.target.files) {
                                                    if (event.target.files.length > 0) {
                                                        let reader = new FileReader();
                                                        reader.readAsDataURL(event.target.files[0]);
                                                        reader.onload = (loaded) => {
                                                            setSaveData({
                                                                ...saveData,
                                                                avatar: loaded.target?.result?.toString()!,
                                                            });
                                                        };
                                                    }
                                                }
                                            }} type="file" accept="image/png, image/gif, image/jpeg" className="w-[128px] h-[128px] absolute top-0 left-0 rounded-full opacity-0 cursor-pointer" />
                                            {targetUser.avatar != saveData.avatar && <Button className="absolute top-0 right-2 rounded-full danger w-8 h-8 font-bold" onClick={() => setSaveData({ ...saveData, avatar: targetUser.avatar })}>X</Button>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle>Email, Username, and Discriminator</CardTitle>
                                    <CardDescription>Edit {`${targetUser.username}#${targetUser.discriminator}'s username ad discriminator`}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input value={saveData.email} onChange={(event) => setSaveData({ ...saveData, email: event.target.value })} placeholder={targetUser.email} id="email" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="username">Username</Label>
                                        <Input value={saveData.username} onChange={(event) => setSaveData({ ...saveData, username: event.target.value })} placeholder={targetUser.username} id="username" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="discriminator">Discriminator</Label>
                                        <Input value={saveData.discriminator} onChange={(event) => setSaveData({ ...saveData, discriminator: event.target.value })} placeholder={targetUser.discriminator} maxLength={4} id="discriminator" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle>Badges</CardTitle>
                                    <CardDescription>Edit {`${targetUser.username}#${targetUser.discriminator}'s badges`}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-x-2 gap-y-4">
                                        {badgeMap.map((badge, key) => <button onClick={() => toggleBadge(badge.key)} key={key} className="w-fit h-fit p-1 rounded-full" style={{ background: saveData.flags & badge.key ? "#14532d" : "#7f1d1d" }}>{badge.value}</button>)}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="w-full h-[1.25rem]"></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}