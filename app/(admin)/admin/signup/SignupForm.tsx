"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // 登録成功時の処理
        const data = await res.json();
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        // 登録失敗時の処理
        const data = await res.json();
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.log(error);
      setError("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>管理者登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive text-destructive-foreground p-2 rounded">
                {error}
              </div>
            )}
            <Input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="パスワード（確認）"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
          <a
            href="/admin/login"
            className="block text-indigo-500 underline text-end w-full mt-5 text-sm"
          >
            ログインはこちら
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
