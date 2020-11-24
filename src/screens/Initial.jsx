import React, {useContext, useEffect} from 'react';
import {Contrainer} from '../components/Helper';
import REALM from 'realm';
import REALM_SCHEMA from '../schemas/realm.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext, RealmContext} from '../contexts';
import util from '../utils';
import SplashScreen from 'react-native-splash-screen';

/**
 * The first loaded screen
 */
const InitialLoading = props => {
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

        setThemeMode(JSON.parse(settings).isDarkMode ? 'dark' : 'light');

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

        /**
         * Send response to the Parent Component via props
         */
        props.onResponse({
          hasLoaded: true,

          /**
           * Check user data
           */
          hasUserData: !RealmMethods.objects('user').isEmpty(),
        });
      } catch (error) {
        console.error(error);
        SplashScreen.hide();
        util.snackbar.show('error', `Gagal melakukan pemuatan awal!`, false);
      }
    })();
  }, []);

  return <Contrainer></Contrainer>;
};

export default InitialLoading;
