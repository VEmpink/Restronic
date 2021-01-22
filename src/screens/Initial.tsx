import React, {useContext, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import REALM from 'realm';

import {ThemeContext, RealmContext} from '../context';
import REALM_SCHEMA from '../schema/realm.schema';
import {ResponseScreens} from '../types';
import util from '../utils';

type InitialLoadingProps = {
  /**
   * A response to the Parent Component
   */
  onResponse: (data: ResponseScreens) => void;
};

/**
 * The first loaded screen
 */
function InitialLoading(props: InitialLoadingProps): JSX.Element {
  const {setRealm} = useContext(RealmContext);
  const {setThemeMode} = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      try {
        /**
         * Start Realm Server
         */
        const RealmMethods = await REALM.open({
          path: 'restronic.realm',
          schema: REALM_SCHEMA,
        });

        /**
         * Check Application settings
         */
        await AsyncStorage.mergeItem(
          'settings',
          JSON.stringify({isDarkMode: false}),
        );
        const settings = await AsyncStorage.getItem('settings');

        setThemeMode(
          JSON.parse(settings || '{}').isDarkMode ? 'dark' : 'light',
        );

        /**
         * Insert Realm Methods to "RealmContext"
         */
        setRealm(RealmMethods);

        /**
         * Check status data customers
         */
        if (!RealmMethods.objects('customers').isEmpty()) {
          await util.checkOnProcessCustomers(RealmMethods);
          await util.checkOnWarrantyCustomers(RealmMethods);
        }

        /**
         * Check auto backup date
         */
        if (!RealmMethods.objects('user').isEmpty()) {
          await util.checkAutoBackupDate(RealmMethods);
        }

        props.onResponse({
          hasLoaded: true,

          /**
           * Check user data
           */
          hasUserData: !RealmMethods.objects('user').isEmpty(),
        });
      } catch (error) {
        SplashScreen.hide();
        util.snackbar.show('error', `Gagal melakukan pemuatan awal!`, false);
      }
    })();
  }, []);

  return <></>;
}

export default InitialLoading;
