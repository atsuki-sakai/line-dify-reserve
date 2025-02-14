import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
import { firestore } from "@/services/firistore/firestore";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    // メールアドレスの重複チェック
    const snapshot = await firestore
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // 自動生成IDのドキュメント参照を作成
    const docRef = firestore.collection("users").doc();

    const user = {
      id: docRef.id,  // 自動生成IDを保存
      email,
      password,
      role
    };

    // 作成した参照を使用してドキュメントを保存
    await docRef.set(user);

    // ロールに応じてリダイレクト先を変更
    const redirectUrl = role === "admin" ? "/admin/login" : "/auth/login";
    
    return NextResponse.json({ 
      message: "User registered", 
      redirectUrl 
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
