"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactTimeago from "react-timeago";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Formatting } from "@/scripts/Formatting";

export default function Spaces() {
  const [query, setQuery] = useState("");
  const [targetSpace, setTargetSpace] = useState<any | null>(null);
  const [saveData, setSaveData] = useState(targetSpace);
  const [badgeState, setBadgeState] = useState(0);

  const { toast } = useToast();

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isNaN(parseInt(query)))
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "The search query must be a user id for now!",
        variant: "destructive",
      });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/panel/spaces/${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")!,
        },
      }
    );

    const data = await res.json();

    if (!res.ok)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: data.message,
        variant: "destructive",
      });

      console.log(data)

    setTargetSpace({
      ...data
    });
    setSaveData({
      ...data
    });
  };

  const handleSave = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/panel/spaces/${targetSpace.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")!,
        },
        body: JSON.stringify(saveData),
      }
    );

    const data = await res.json();

    if (!res.ok)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: data.message,
        variant: "destructive",
      });

    setTargetSpace(saveData);
  };

  return (
    <div>
      {JSON.stringify(targetSpace) != JSON.stringify(saveData) && (
        <Button className="fixed bottom-5 right-5" onClick={handleSave}>
          Save
        </Button>
      )}
      <div className="w-full p-4 flex flex-col justify-center space-y-2">
        <Label htmlFor="query">Search For Space By ID</Label>
        <form className="w-full flex gap-8" onSubmit={handleSearch}>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type={"search"}
            placeholder={Date.now().toString()}
            id="query"
          />
          <Button>Search</Button>
        </form>
      </div>
      <div className="py-4 px-4 md:px-10 flex justify-center">
        {!targetSpace ? (
          <div>Search for a space to get started.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              <Card>
                <CardHeader>
                  <CardTitle>Icon</CardTitle>
                  <CardDescription>
                    Edit{" "}
                    {`${targetSpace.name}'s icon.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="w-fit h-fit relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      { targetSpace.icon ? <img
                        src={
                          saveData.icon == targetSpace.icon
                            ? Formatting.icon(
                                targetSpace.id,
                                targetSpace.icon
                              )
                            : saveData.icon
                        }
                        className="w-[128px] h-[128px] aspect-square rounded-full"
                        alt="icon"
                      /> : <div className="w-[128px] h-[128px] aspect-square rounded-full items-center flex justify-center bg-[#262626]"> 
                            <h1 className="text-center text-xl">{targetSpace.name_acronym}</h1> 
                        </div>
                      }
                      <Input
                        onChange={(event) => {
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
                        }}
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        className="w-[128px] h-[128px] absolute top-0 left-0 rounded-full opacity-0 cursor-pointer"
                      />
                      {targetSpace.icon != saveData.icon && (
                        <Button
                          className="absolute top-0 right-2 rounded-full danger w-8 h-8 font-bold"
                          onClick={() =>
                            setSaveData({
                              ...saveData,
                              avatar: targetSpace.icon,
                            })
                          }
                        >
                          X
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Name and Description</CardTitle>
                  <CardDescription>
                    Edit{" "}
                    {`${targetSpace.name}.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <Label htmlFor="username">Name</Label>
                    <Input
                      onChange={(event) =>
                        setSaveData({
                          ...saveData,
                          name: event.target.value,
                        })
                      }
                      placeholder={targetSpace.name}
                      id="name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      onChange={(event) =>
                        setSaveData({
                          ...saveData,
                          description: event.target.value,
                        })
                      }
                      placeholder={targetSpace.description || "No description set."}
                      id="description"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                  <CardDescription>Information on {targetSpace.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                <div>
                    <Label>Created At</Label>
                    <p>{new Date(targetSpace.created_at).toLocaleString()} (<ReactTimeago date={targetSpace.created_at} className="flex-shrink-0 text-sm" />)</p>
                  </div>
                  <div className="mt-2">
                    <Label>Owner</Label>
                    <p><a href="/users">{targetSpace.owner.username + "#" + targetSpace.owner.discriminator.toString().padStart(4, "0")} ({targetSpace.owner.id})</a></p>
                  </div>
                  <div className="mt-2">
                    <Label>Member Count</Label>
                    <p>{targetSpace.member_count || "Unkown"}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Manage Space</CardTitle>
                  <CardDescription>Perform actions on this space.</CardDescription>
                </CardHeader>
                <CardContent className="inline-block justify-center">
                  <Button className="danger mr-2 my-1">Pause Invites</Button>
                  <Button className="danger my-1">Delete Space</Button>
                </CardContent>
              </Card>
              <div className="w-full h-[1.25rem]"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
