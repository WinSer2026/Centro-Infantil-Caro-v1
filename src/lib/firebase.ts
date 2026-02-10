import Gun from 'gun';
import 'gun/lib/then.js';

let gun: any;

if (typeof window !== 'undefined') {
  // Inicializar GunDB apenas no cliente
  gun = Gun({
    peers: [
      'https://gun-manhattan.herokuapp.com/gun',
      'https://relay.peer.ooo/gun'
    ],
    localStorage: true
  });
} else {
  // Mock básico para o servidor (SSR)
  gun = {
    get: () => gun,
    map: () => gun,
    put: () => gun,
    on: () => {},
    once: () => {}
  };
}

const db = gun;
const auth = {
  currentUser: { uid: 'temporary-user' },
  onAuthStateChanged: (callback: any) => {
    if (typeof window !== 'undefined') {
      callback({ uid: 'temporary-user' });
    }
    return () => {};
  }
};

export { gun as app, db, auth };
