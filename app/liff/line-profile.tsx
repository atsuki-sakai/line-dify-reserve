"use client";
import { useLiff } from "@/components/providers/liff-provider";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  email?: string;
}

export function Profile() {
  const { liff, isLoggedIn } = useLiff();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState<LineProfile | null>(null);

  useEffect(() => {
    if (liff?.isLoggedIn()) {
      (async () => {
        try {
          // LINEプロフィールの取得
          const lineProfile = await liff.getProfile();
          setProfile(lineProfile);
          const response = await fetch(`/api/line/${lineProfile.userId}`);
          const { data } = await response.json();
          setPhoneNumber(data.phoneNumber);
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
          setPhoneNumber("");
        }
      })();
    }
  }, [liff, isLoggedIn]);

  const handleLogout = () => {
    liff?.logout();
    window.location.reload();
  };

  const handleLogin = () => {
    if (!liff?.isInClient()) {
      liff?.login();
    }
  };
  const handleUpdate = async () => {
    if (!profile?.userId || !phoneNumber) return;

    // try {
    //   const response = await fetch(`/api/line/${profile.userId}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ phoneNumber }),
    //   });

    //   const data = await response.json();
    //   console.log("Response data:", data); // デバッグログ追加
    // } catch (error) {
    //   console.error("更新エラー:", error);
    // }
  };
  const handleRegister = async () => {
    if (!profile?.userId || !phoneNumber) return;

    // try {
    //   const response = await fetch("/api/line", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       userId: profile.userId,
    //       displayName: profile.displayName,
    //       pictureUrl: profile.pictureUrl ?? null,
    //       phoneNumber: phoneNumber,
    //     }),
    //   });

    //   const data = await response.json();
    //   console.log("Response data:", data); // デバッグログ追加
    // } catch (error) {
    //   console.error(
    //     "登録エラー:",
    //     error instanceof Error ? error.message : error
    //   );
    // }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value || "");
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Line予約</CardTitle>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={profile.pictureUrl}
                  alt={profile.displayName}
                />
                <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{profile.displayName}</h3>
                {profile.email && (
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="090-1234-5678"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>

            <div className="flex jusity-center gap-2">
              <Button
                variant="default"
                onClick={handleRegister}
                className="w-2/5 bg-green-600 font-bold text-white"
              >
                登録
              </Button>
              <Button
                variant="default"
                onClick={handleUpdate}
                className="w-2/5 font-bold bg-gray-500 text-white"
              >
                更新
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-1/5 font-bold text-white"
              >
                ログアウト
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="bg-green-600 font-bold text-white"
            onClick={handleLogin}
          >
            LINEでログイン
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
