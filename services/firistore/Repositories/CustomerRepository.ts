import { Firestore } from "firebase-admin/firestore";
import { ICustomer } from "../types/cutomer";
import { CollectionName } from "@/services/firistore/constants";

export class CustomerRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(lineId: string): Promise<ICustomer | null> {
    try {
      console.log("[Repository] Getting customer:", lineId);
      
      const customerDocRef = this.db.collection(CollectionName.Customers).doc(lineId);
      console.log("[Repository] Document reference:", customerDocRef.path);

      const customerDoc = await customerDocRef.get();
      console.log("[Repository] Document exists:", customerDoc.exists);
      
      if (!customerDoc.exists) {
        console.log("[Repository] Customer not found");
        return null;
      }

      const customerData = customerDoc.data();
      console.log("[Repository] Raw Firestore data:", customerData);

      if (!customerData) {
        console.log("[Repository] Customer data is null");
        return null;
      }

      const customer: ICustomer = {
        lineId: customerData.lineId || "",
        name: customerData.name || "",
        destination: customerData.destination || "",
        phone: customerData.phone || ""
      };

      console.log("[Repository] Returning customer:", customer);
      return customer;

    } catch (error) {
      console.error("[Repository] Get customer error:", error);
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

  async set(customer: ICustomer): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Customers)
        .doc()
        .set(customer);
    } catch (error) {
      console.error("[Repository] Create customer error:", error);
      throw error;
    }
  }

  async update(lineId: string, data: Partial<ICustomer>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Customers)
        .doc(lineId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<ICustomer[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Customers).get();
      return docSnap.docs.map((doc) => doc.data() as ICustomer);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(lineId: string): Promise<void> {
    try {
      await this.db.collection(CollectionName.Customers).doc(lineId).delete();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    console.error("Firestore error:", error);
    return new Error(
      error instanceof Error ? error.message : "Firestore operation customer failed"
    );
  }
}