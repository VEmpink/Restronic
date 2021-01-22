import React, {useState} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import REALM from 'realm';

import {RealmContext} from '../context';
import REALM_SCHEMA from '../schema/realm.schema';
import {RootStackParamList} from '../types';

import Details from './Details';
import ErrorScreen from './Error';
import Form from './Form';
import Home from './Home';
import Initial from './Initial';
import Login from './Login';
import Notifications from './Notifications';
import Settings from './Settings';
import Setup from './Setup';

const Stack = createStackNavigator<RootStackParamList>();

function StackScreens(): JSX.Element {
  const [Realm, setRealm] = useState(() => {
    const RealmMethods = new REALM({
      path: 'restronic.realm',
      schema: REALM_SCHEMA,
    });

    return RealmMethods;
  });

  const [responseInitialScreen, setResponse] = useState({
    /**
     * This two property is sended by Initial or Setup screen
     */
    hasLoaded: false,
    hasUserData: false,

    /**
     * SOON!
     */
    hasLogin: true,
  });

  const HasLoginScreens = () => {
    if (responseInitialScreen.hasLogin) {
      return (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName='Home'
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Notifications' component={Notifications} />
          <Stack.Screen name='Settings' component={Settings} />
          <Stack.Screen name='Form' component={Form} />
          <Stack.Screen name='Details' component={Details} />
          <Stack.Screen name='ErrorScreen' component={ErrorScreen} />
        </Stack.Navigator>
      );
    }

    return (
      /**
       * SOON!
       */
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={Login} />
      </Stack.Navigator>
    );
  };

  const HasUserdataScreens = () => {
    if (responseInitialScreen.hasUserData) {
      return <HasLoginScreens />;
    }

    return (
      /**
       * A screen for registering a user data
       */
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Setup'>
          {(props) => (
            <Setup
              {...props}
              onResponse={(data) => setResponse((prev) => ({...prev, ...data}))}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  const HasLoadedScreens = () => {
    if (responseInitialScreen.hasLoaded) {
      return <HasUserdataScreens />;
    }

    return (
      /**
       * A first loaded screen
       */
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Initial'>
          {(props) => (
            <Initial
              {...props}
              onResponse={(data) => setResponse((prev) => ({...prev, ...data}))}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  return (
    <RealmContext.Provider value={{Realm, setRealm}}>
      <HasLoadedScreens />
    </RealmContext.Provider>
  );
}

export default StackScreens;
