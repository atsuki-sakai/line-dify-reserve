import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'
import bcrypt from 'bcrypt'
import { bycryptSaltRounds } from '@/services/firistore/constants'

export async function GET() {
    return NextResponse.json({ message: 'admins api' })
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    // メールアドレスの重複チェック
    const hasEmail = await firestore.admin.hasEmail(email)


    console.log(hasEmail)
    if (hasEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const docRef = await firestore.admin.createDoc();
    const hashedPassword = await bcrypt.hash(password, bycryptSaltRounds);
    const rehashPassword = await bcrypt.compare(password, hashedPassword)
    console.log(rehashPassword)
    const admin = {
      id: docRef.id,
      email,
      password: hashedPassword,
      role: "admin"
    };

    // 作成した参照を使用してドキュメントを保存
    await firestore.admin.set(admin)

    const redirectUrl = "/admin/login"
    
    return NextResponse.json({
      message: "Admin registered",
      redirectUrl
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Create admin failed: " + error,
      error: error
    }, { status: 500 })
  }
}
