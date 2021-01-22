import {useState, useEffect, useContext, useCallback} from 'react';
import {Collection, CollectionChangeSet} from 'realm';
import {RealmContext} from '../context';

/**
 * Ini adalah metode `Realm.objects()`
 *
 * Mengambil data dari database (Realm) dengan menggunakan Hook ini
 * akan menyebabkan Component menjadi reactive atau melakukan render ulang
 * secara otomatis ketika data yang diambil mengalami Perubahan, Dihapus,
 * atau Ditambahkan
 */
function useRealmObjects<T>(collectionName: string): Realm.Results<T> {
  const {Realm} = useContext(RealmContext);
  const [state, setState] = useState(() => {
    const collections = Realm.objects<T>(collectionName);

    return {
      collections,
    };
  });

  const handleChanges = useCallback(
    (newCollections: any, changes: CollectionChangeSet) => {
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
    },
    [],
  );

  useEffect(() => {
    state.collections.addListener(handleChanges);

    return () => {
      state.collections.removeListener(handleChanges);
    };
  }, []);

  return state.collections;
}

export {useRealmObjects};
