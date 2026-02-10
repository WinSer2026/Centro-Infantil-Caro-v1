import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';

export const firestoreService = {
  // Get all documents from a collection
  async getAll(collectionName: string) {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add a new document
  async add(collectionName: string, data: any) {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  // Update a document
  async update(collectionName: string, id: string, data: any) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Real-time listener for a collection
  subscribe(collectionName: string, callback: (data: any[]) => void, constraints: QueryConstraint[] = []) {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};
