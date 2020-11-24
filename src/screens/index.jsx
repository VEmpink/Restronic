import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RealmContext} from '../contexts';

/**
 * Screens
 */
import Initial from './Initial';
import Setup from './Setup';
import Login from './Login';
import Home from './Home';
import Notifications from './Notifications';
import Settings from './Settings';
import Form from './Form';
import Details from './Details';
import ErrorScreen from './Error';

const Stack = createStackNavigator();
const StackScreens = props => {
  const [Realm, setRealm] = useState(null);
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

  return (
    <RealmContext.Provider value={{Realm, setRealm}}>
      {responseInitialScreen.hasLoaded ? (
        responseInitialScreen.hasUserData ? (
          responseInitialScreen.hasLogin ? (
            /**
             * This is Main or Home screen
             */
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName='Home'
            >
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='Notifications' component={Notifications} />
              <Stack.Screen name='Settings' component={Settings} />
              <Stack.Screen name='Form' component={Form} />
              <Stack.Screen name='Details' component={Details} />
              <Stack.Screen name='Error' component={ErrorScreen} />
            </Stack.Navigator>
          ) : (
            /**
             * SOON!
             */
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name='Login' component={Login} />
            </Stack.Navigator>
          )
        ) : (
          /**
           * A screen for registering a user data
           */
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Setup'>
              {props => (
                <Setup
                  {...props}
                  onResponse={data => setResponse(prev => ({...prev, ...data}))}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )
      ) : (
        /**
         * A first loaded screen
         */
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Initial'>
            {props => (
              <Initial
                {...props}
                onResponse={data => setResponse(prev => ({...prev, ...data}))}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </RealmContext.Provider>
  );
};

export default StackScreens;
