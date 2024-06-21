"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/UserContext";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const { user } = useAuth();
  
  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const date = new Date();
      const hour = date.getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting(`Good Morning`);
      } else if (hour >= 12 && hour < 18) {
        setGreeting(`Good Afternoon`);
      } else if (hour >= 18 && hour < 22) {
        setGreeting(`Good Evening`);
      } else {
        setGreeting(`Good Night`);
      }
    };

    getTimeBasedGreeting();
 });

  return (
    <>
      <div className="flex-col justify-center mt-10">
        <h1 className="text-center text-[45px] font-bold">{greeting}, {user.global_name ?? user.username}.</h1>
        <p className="text-center text-xl">Lets see what&apos;s strafing today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-5 mt-10">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Label>Total Accounts</Label>
              <p>No about me set.</p>
            </div>
            <div className="mt-2">
              <Label>Banned</Label>
              <p>j</p>
            </div>
            <div className="mt-2">
              <Label>Presence</Label>
              <p>Online: </p>
            </div>
          </CardContent>
        </Card>
        <div className="w-full h-[1.25rem]"></div>
      </div>
    </>
  );
}