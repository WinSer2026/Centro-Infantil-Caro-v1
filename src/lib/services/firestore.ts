import { db } from '../firebase';

export const firestoreService = {
  // Get all documents from a collection
  async getAll(collectionName: string) {
    if (typeof window === 'undefined') return [];
    
    return new Promise<any[]>((resolve) => {
      const results: any[] = [];
      const seen = new Set();
      
      // Criamos um timeout para não travar a UI se a rede estiver lenta
      const timeout = setTimeout(() => resolve(results), 800);

      db.get(collectionName).map().once((data: any, id: string) => {
        if (data && !seen.has(id)) {
          seen.add(id);
          results.push({ id, ...data });
        }
      });
    });
  },

  // Add a new document
  async add(collectionName: string, data: any) {
    if (typeof window === 'undefined') return null;
    
    const id = Math.random().toString(36).substring(2, 11);
    try {
      await db.get(collectionName).get(id).put({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).then(); // Usando .then() do gun/lib/then
      return id;
    } catch (error) {
      console.error("Erro ao adicionar no GunDB:", error);
      return null;
    }
  },

  // Update a document
  async update(collectionName: string, id: string, data: any) {
    if (typeof window === 'undefined') return;
    
    try {
      await db.get(collectionName).get(id).put({
        ...data,
        updatedAt: new Date().toISOString(),
      }).then();
    } catch (error) {
      console.error("Erro ao atualizar no GunDB:", error);
    }
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    if (typeof window === 'undefined') return;
    db.get(collectionName).get(id).put(null);
  },

  // Real-time listener for a collection
  subscribe(collectionName: string, callback: (data: any[]) => void, constraints: any[] = []) {
    if (typeof window === 'undefined') return () => {};
    
    const resultsMap = new Map();
    
    const ref = db.get(collectionName).map();
    
    ref.on((data: any, id: string) => {
      if (data === null) {
        resultsMap.delete(id);
      } else {
        // GunDB retorna metadados internos em _, limpamos eles
        const { _, ...cleanData } = data;
        resultsMap.set(id, { id, ...cleanData });
      }
      callback(Array.from(resultsMap.values()));
    });

    return () => {
      if (ref.off) ref.off();
    };
  }
};
