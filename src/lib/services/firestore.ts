import { db } from '../firebase';

export const firestoreService = {
  // Get all documents from a collection
  async getAll(collectionName: string) {
    return new Promise<any[]>((resolve) => {
      const results: any[] = [];
      db.get(collectionName).map().once((data: any, id: string) => {
        if (data) {
          results.push({ id, ...data });
        }
      });
      // GunDB é assíncrono e baseado em stream, usamos um timeout curto para "resolver" a lista inicial
      setTimeout(() => resolve(results), 500);
    });
  },

  // Add a new document
  async add(collectionName: string, data: any) {
    const id = Math.random().toString(36).substr(2, 9);
    const docRef = db.get(collectionName).get(id);
    await docRef.put({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return id;
  },

  // Update a document
  async update(collectionName: string, id: string, data: any) {
    const docRef = db.get(collectionName).get(id);
    await docRef.put({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    db.get(collectionName).get(id).put(null);
  },

  // Real-time listener for a collection
  subscribe(collectionName: string, callback: (data: any[]) => void, constraints: any[] = []) {
    const resultsMap = new Map();
    
    const ref = db.get(collectionName).map();
    
    const listener = ref.on((data: any, id: string) => {
      if (data === null) {
        resultsMap.delete(id);
      } else {
        resultsMap.set(id, { id, ...data });
      }
      callback(Array.from(resultsMap.values()));
    });

    return () => {
      // GunDB não tem um "unsubscribe" direto da mesma forma, mas o on() pode ser gerenciado
    };
  }
};
