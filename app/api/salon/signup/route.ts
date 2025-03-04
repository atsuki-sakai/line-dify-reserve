import { NextResponse } from "next/server";
import { firestore } from "@/services/firistore/firestore";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, address, phone, email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    if (!name || !address || !phone) {
      return new NextResponse("Missing name, address, or phone", { status: 400 });
    }

    // メールアドレスの重複チェック
    const hasEmail = await firestore.salon.hasEmail(email);

    if (hasEmail) {
      console.log("[API] Email already exists");
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // 自動生成IDのドキュメント参照を作成
    const salonDocRef = await firestore.salon.createDoc();
    const salon = {
      id: salonDocRef.id,
      name,
      address,
      phone,
      email,
      password,
      distinationId: null
    };

    // 作成した参照を使用してドキュメントを保存
    await salonDocRef.set(salon);

    // ロールに応じてリダイレクト先を変更
    const redirectUrl = "/login";
    
    return NextResponse.json({
      message: "Salon Signup Success",
      redirectUrl
    });
  } catch (error) {
    return new NextResponse("Create Salon Error: " + error, { status: 500 });
  }
}
