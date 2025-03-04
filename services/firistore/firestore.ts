
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { AdminRepository } from "./Repositories/AdminRepository";
import { CustomerRepository } from "./Repositories/CustomerRepository";
import { StaffRepository } from "./Repositories/StaffRepository";
import { SalonRepository } from "./Repositories/SalonRepository";
import { MenusRepository } from "./Repositories/MenusRepository";
import { ReservationRepository } from "./Repositories/ReservationRepository";

class FirestoreService {
  private static instance: FirestoreService | null = null;
  private readonly db;
  public readonly admin: AdminRepository;
  public readonly customer: CustomerRepository;
  public readonly staff: StaffRepository;
  public readonly salon: SalonRepository;
  public readonly menus: MenusRepository;
  public readonly reservation: ReservationRepository;
  private constructor() {
    try {
      const apps = getApps();
      const app = apps.length ? apps[0] : initializeApp({
                    credential: cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    }),
                });
      this.db = getFirestore(app);
      this.admin = new AdminRepository(this.db);
      this.customer = new CustomerRepository(this.db);
      this.staff = new StaffRepository(this.db);
      this.salon = new SalonRepository(this.db);
      this.menus = new MenusRepository(this.db);
      this.reservation = new ReservationRepository(this.db);

    } catch (error) {
      console.error("[FirestoreService] Initialization error:", {
        error,
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      console.log("[FirestoreService] Creating new instance");
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }
}
export const firestore = FirestoreService.getInstance();