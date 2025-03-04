import { Firestore } from "firebase-admin/firestore";
import { ISalon } from "../types/salon";
import { CollectionName } from "@/services/firistore/constants";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";
export class SalonRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(salonId: string): Promise<ISalon | null> {
    try {
      console.log("[Repository] Getting salon:", salonId);
      
      const salonDocRef = this.db.collection(CollectionName.Salons).doc(salonId);
      console.log("[Repository] Document reference:", salonDocRef.path);

      const salonDoc = await salonDocRef.get();
      console.log("[Repository] Document exists:", salonDoc.exists);
      
      if (!salonDoc.exists) {
        console.log("[Repository] Salon not found");
        return null;
      }

      const salonData = salonDoc.data();
      console.log("[Repository] Raw Firestore data:", salonData);

      if (!salonData) {
        console.log("[Repository] Salon data is null");
        return null;
      }

      const salon: ISalon = {
        id: salonId,
        name: salonData.name || "",
        address: salonData.address || "",
        phone: salonData.phone || "",
        email: salonData.email || "",
        distinationId: salonData.distinationId || "",
        password: salonData.password || ""
      };

      console.log("[Repository] Returning salon:", salon);
      return salon;

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

  async set(salon: ISalon): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Salons)
        .doc()
        .set(salon);
    } catch (error) {
      console.error("[Repository] Create salon error:", error);
      throw error;
    }
  }

  async update(salonId: string, data: Partial<ISalon>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Salons)
        .doc(salonId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<ISalon[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Salons).get();
      return docSnap.docs.map((doc) => doc.data() as ISalon);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDoc(): Promise<DocumentReference<DocumentData>> {
    return this.db.collection(CollectionName.Salons).doc();
  }

  async hasEmail(email: string): Promise<boolean> {
    const snapshot = await this.db.collection(CollectionName.Salons).where("email", "==", email).get();
    return !snapshot.empty;
  }

  async getByEmail(email: string): Promise<ISalon | null> {
    const snapshot = await this.db.collection(CollectionName.Salons).where("email", "==", email).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data() as ISalon;
  }

  private handleError(error: unknown): Error {
    console.error("Firestore error:", error);
    return new Error(
      error instanceof Error ? error.message : "Firestore operation failed"
    );
  }
}