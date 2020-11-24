import React, {useContext, useState} from 'react';
import {View, Switch} from 'react-native';
import {IconHelper} from '../../Helper';
import {ThemeContext} from '../../../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * "true" is "Dark Mode"
 */
const ToogleDarkModeButton = props => {
  const {themeMode, setThemeMode} = useContext(ThemeContext);
  const [isDarkMode, setDarkMode] = useState(themeMode === 'dark');

  return (
    <View
      style={{marginBottom: 12, justifyContent: 'center', alignItems: 'center'}}
    >
      <IconHelper name={isDarkMode ? 'moon-outline' : 'sun-outline'} />

      <Switch
        trackColor={{
          false: '#C5CEE0',
          true: '#3366FF',
        }}
        thumbColor={isDarkMode ? '#FFF' : '#8F9BB3'}
        onValueChange={async bool => {
          setDarkMode(bool);

          await AsyncStorage.mergeItem(
            'settings',
            JSON.stringify({isDarkMode: bool}),
          );

          setThemeMode(bool ? 'dark' : 'light');
        }}
        value={isDarkMode}
        style={{marginTop: 8}}
      />
    </View>
  );
};

export default ToogleDarkModeButton;
