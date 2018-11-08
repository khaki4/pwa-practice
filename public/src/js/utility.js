let dbPromise = idb.open('feed-store', 1, (db) => {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id'});
  }
});

const writeData = (st, data) => {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    });
};

const readAllData = (st) => {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, 'readonly');
      let store = tx.objectStore(st);
      return store.getAll();
    });
};

const clearAllData = (st) => {
  return dbPromise
    .then(db => {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    })
};

const deleteItemFromData = async (st, id) => {
  return dbPromise
    .then(db => {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      console.log('item deleted!');
    });
};

