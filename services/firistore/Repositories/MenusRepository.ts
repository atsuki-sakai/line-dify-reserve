import { Firestore } from "firebase-admin/firestore";
import { IMenu } from "../types/menu";
import { CollectionName } from "@/services/firistore/constants";

export class MenusRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(menuId: string): Promise<IMenu | null> {
    try {
      console.log("[Repository] Getting menu:", menuId);
      
      const menuDocRef = this.db.collection(CollectionName.Menus).doc(menuId);
      console.log("[Repository] Document reference:", menuDocRef.path);

      const menuDoc = await menuDocRef.get();
      console.log("[Repository] Document exists:", menuDoc.exists);
      
      if (!menuDoc.exists) {
        console.log("[Repository] Menu not found");
        return null;
      }

      const menuData = menuDoc.data();
      console.log("[Repository] Raw Firestore data:", menuData);

      if (!menuData) {
        console.log("[Repository] Menu data is null");
        return null;
      }

      const menu: IMenu = {
        id: menuId,
        name: menuData.name || "",
        price: menuData.price || 0,
        description: menuData.description || ""
      };

      console.log("[Repository] Returning menu:", menu);
      return menu;

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

  async set(menu: IMenu): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Menus)
        .doc()
        .set(menu);
    } catch (error) {
      console.error("[Repository] Create menu error:", error);
      throw error;
    }
  }

  async update(menuId: string, data: Partial<IMenu>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Menus)
        .doc(menuId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<IMenu[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Menus).get();
      return docSnap.docs.map((doc) => doc.data() as IMenu);
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