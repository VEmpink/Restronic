import {useState, useEffect, useContext} from 'react';
import {RealmContext} from '../contexts';

/**
 * Ini adalah metode `Realm.objects()`
 *
 * Mengambil data dari database (Realm) dengan menggunakan Hook ini
 * akan menyebabkan Component menjadi reactive atau melakukan render ulang
 * secara otomatis ketika data yang diambil mengalami Perubahan, Dihapus,
 * atau Ditambahkan
 * @param {string} collectionName It's like MongoDB collection
 * @returns {Realm.Results}
 */
const useRealmObjects = collectionName => {
  const {Realm} = useContext(RealmContext);
  const [state, setState] = useState(() => {
    const collections = Realm.objects(collectionName);

    return {
      collections,
    };
  });

  useEffect(() => {
    state.collections.addListener((newCollections, changes) => {
      if (
        changes.insertions.length ||
        changes.newModifications.length ||
        changes.deletions.length
      ) {
        setState(prev => ({
          ...prev,
          collections: newCollections,
        }));
      }
    });

    return () => state.collections.removeAllListeners();
  }, []);

  return state.collections;
};

export {useRealmObjects};
