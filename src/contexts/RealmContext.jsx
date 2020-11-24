import {createContext} from 'react';

/**
 * Realm context
 */
const RealmContext = createContext({
  /**
   * @type {Realm}
   */
  Realm,
  setRealm: () => {},
});

export default RealmContext;
