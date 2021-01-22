import {createContext, Dispatch, SetStateAction} from 'react';
import Realm from 'realm';

type RealmContextTypes = {
  Realm: Realm;
  setRealm: Dispatch<SetStateAction<Realm>>;
};

/**
 * Realm context
 */
const RealmContext = createContext<RealmContextTypes>({
  Realm: new Realm(),
  setRealm: () => {},
});

export default RealmContext;
