import { Firestore } from "firebase-admin/firestore";
import { IAdmin } from "../types/admin";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";
import { CollectionName } from "@/services/firistore/constants";

export class AdminRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(userId: string): Promise<IAdmin | null> {
    try {
      console.log("[Repository] Getting user:", userId);
      
      const userDocRef = this.db.collection(CollectionName.Admins).doc(userId);
      console.log("[Repository] Document reference:", userDocRef.path);

      const userDoc = await userDocRef.get();
      console.log("[Repository] Document exists:", userDoc.exists);
      
      if (!userDoc.exists) {
        console.log("[Repository] User not found");
        return null;
      }

      const userData = userDoc.data();
      console.log("[Repository] Raw Firestore data:", userData);

      if (!userData) {
        console.log("[Repository] User data is null");
        return null;
      }

      const user: IAdmin = {
        id: userId,
        email: userData.email || "",
        password: userData.password || "",
        role: userData.role || ""
      };

      console.log("[Repository] Returning user:", user);
      return user;

    } catch (error) {
      console.error("[Repository] Get user error:", error);
      // エラーの詳細をログ出力
      if (error instanceof Error) {
        console.error("[Repository] Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  async set(admin: IAdmin): Promise<void> {
    try {
      // IDを使用してドキュメントを保存
      await this.db
        .collection(CollectionName.Admins)
        .doc(admin.id)
        .set(admin);
    } catch (error) {
      console.error("[Repository] Create admin error:", error);
      throw error;
    }
  }

  async update(userId: string, data: Partial<IAdmin>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Admins)
        .doc(userId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<IAdmin[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Admins).get();
      return docSnap.docs.map((doc) => doc.data() as IAdmin);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async hasEmail(email: string): Promise<boolean> {
    const snapshot = await this.db.collection(CollectionName.Admins).where("email", "==", email).get();
    return !snapshot.empty;
  }

  async getByEmail(email: string): Promise<IAdmin | null> {
    const snapshot = await this.db.collection(CollectionName.Admins).where("email", "==", email).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data() as IAdmin;
  }

  async createDoc(): Promise<DocumentReference<DocumentData>> {
    return this.db.collection(CollectionName.Admins).doc();
  }

  private handleError(error: unknown): Error {
    console.error("Firestore error:", error);
    return new Error(
      error instanceof Error ? error.message : "Firestore operation admin failed"
    );
  }
}