import { Firestore } from "firebase-admin/firestore";
import { IStaff } from "../types/staff";
import { CollectionName } from "@/services/firistore/constants";

export class StaffRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(staffId: string): Promise<IStaff | null> {
    try {
      console.log("[Repository] Getting staff:", staffId);
      
      const staffDocRef = this.db.collection(CollectionName.Staffs).doc(staffId);
      console.log("[Repository] Document reference:", staffDocRef.path);

      const staffDoc = await staffDocRef.get();
      console.log("[Repository] Document exists:", staffDoc.exists);
      
      if (!staffDoc.exists) {
        console.log("[Repository] Staff not found");
        return null;
      }

      const staffData = staffDoc.data();
      console.log("[Repository] Raw Firestore data:", staffData);

      if (!staffData) {
        console.log("[Repository] Staff data is null");
        return null;
      }

      const staff: IStaff = {
        id: staffId,
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        menuIds: staffData.menuIds || []
      };

      console.log("[Repository] Returning staff:", staff);
      return staff;

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

  async set(staff: IStaff): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Staffs)
        .doc()
        .set(staff);
    } catch (error) {
      console.error("[Repository] Create staff error:", error);
      throw error;
    }
  }

  async update(staffId: string, data: Partial<IStaff>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Staffs)
        .doc(staffId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<IStaff[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Staffs).get();
      return docSnap.docs.map((doc) => doc.data() as IStaff);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    console.error("Firestore error:", error);
    return new Error(
      error instanceof Error ? error.message : "Firestore operation failed"
    );
  }
}