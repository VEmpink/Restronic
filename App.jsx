import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {GoogleSignin} from '@react-native-community/google-signin';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import locale from 'moment/locale/id';
import {ThemeContext} from './src/contexts';
import util from './src/utils';

/**
 * Screens
 */
import Screens from './src/screens';

const App = props => {
  const [themeUI, setThemeUI] = useState('eva');
  const [themeMode, setThemeMode] = useState('light');

  /**
   * Configure Moment locale, Google API, dan Notification System
   */
  useEffect(() => {
    moment.locale('id');

    PushNotification.configure({
      onRegistrationError: function (err) {
        util.snackbar.show('error', 'Kesalahan Sistem Notifikasi!', false);
      },

      requestPermissions: Platform.OS === 'ios',
    });

    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
      ],
      webClientId:
        '921744316354-9v5v142o93bg2rcr74fhajtmrbhhkoui.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider
        value={{themeUI, setThemeUI, themeMode, setThemeMode}}
      >
        <ApplicationProvider {...eva} theme={eva[themeMode]}>
          <NavigationContainer>
            <Screens />
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
