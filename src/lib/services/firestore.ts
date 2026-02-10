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
    if (!db) {
      console.warn(`Firestore não inicializado. Não é possível buscar ${collectionName}.`);
      return [];
    }
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Add a new document
  async add(collectionName: string, data: any) {
    if (!db) {
      console.error(`Firestore não inicializado. Não é possível adicionar em ${collectionName}.`);
      return null;
    }
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
    if (!db) {
      console.error(`Firestore não inicializado. Não é possível atualizar ${collectionName}/${id}.`);
      return;
    }
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    if (!db) {
      console.error(`Firestore não inicializado. Não é possível deletar ${collectionName}/${id}.`);
      return;
    }
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Real-time listener for a collection
  subscribe(collectionName: string, callback: (data: any[]) => void, constraints: QueryConstraint[] = []) {
    if (!db) {
      console.warn(`Firestore não inicializado. Real-time listener desativado para ${collectionName}.`);
      return () => {}; // No-op unsubscribe
    }
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};
