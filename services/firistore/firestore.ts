import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Firebase Adminの初期化
const apps = getApps()

if (!apps.length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        })
    } catch (error) {
        console.error('Firebase admin initialization error:', error)
    }
}

// Firestoreインスタンスの取得
export const firestore = getFirestore()
