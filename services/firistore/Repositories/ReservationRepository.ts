import { Firestore } from "firebase-admin/firestore";
import { IReservation } from "@/services/firistore/types/reservation";
import { CollectionName } from "@/services/firistore/constants";

export class ReservationRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async get(reservationId: string): Promise<IReservation | null> {
    try {
      console.log("[Repository] Getting reservation:", reservationId);
      
      const reservationDocRef = this.db.collection(CollectionName.Reservations).doc(reservationId);
      console.log("[Repository] Document reference:", reservationDocRef.path);

      const reservationDoc = await reservationDocRef.get();
      console.log("[Repository] Document exists:", reservationDoc.exists);
      
      if (!reservationDoc.exists) {
        console.log("[Repository] Reservation not found");
        return null;
      }

      const reservationData = reservationDoc.data();
      console.log("[Repository] Raw Firestore data:", reservationData);

      if (!reservationData) {
        console.log("[Repository] Reservation data is null");
        return null;
      }

      const reservation: IReservation = {
        id: reservationId,
        customerId: reservationData.customerId || "",
        menuId: reservationData.menuId || "",
        reservationDate: reservationData.reservationDate || new Date(),
        staffId: reservationData.staffId || "",
        status: reservationData.status || ""
      };

      console.log("[Repository] Returning reservation:", reservation);
      return reservation;

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

  async set(reservation: IReservation): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Reservations)
        .doc()
        .set(reservation);
    } catch (error) {
      console.error("[Repository] Create reservation error:", error);
      throw error;
    }
  }

  async update(reservationId: string, data: Partial<IReservation>): Promise<void> {
    try {
      await this.db
        .collection(CollectionName.Reservations)
        .doc(reservationId)
        .update(data);
    } catch (error) {
      console.error("[Repository] Update user error:", error);
      throw error;
    }
  }

  async getAll(): Promise<IReservation[]> {
    try {
      const docSnap = await this.db.collection(CollectionName.Reservations).get();
      return docSnap.docs.map((doc) => doc.data() as IReservation);
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