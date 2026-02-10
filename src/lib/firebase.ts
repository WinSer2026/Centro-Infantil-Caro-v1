import Gun from 'gun';

// Inicializar GunDB com relays públicos gratuitos para sincronização
const gun = Gun({
  peers: [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://relay.peer.ooo/gun'
  ]
});

// Mantemos os nomes antigos para não quebrar os imports, mas usamos Gun por baixo
const db = gun;
const auth = {
  // Mock de autenticação simples que não precisa de servidor
  currentUser: { uid: 'temporary-user' },
  onAuthStateChanged: (callback: any) => {
    callback({ uid: 'temporary-user' });
    return () => {};
  }
};

export { gun as app, db, auth };
