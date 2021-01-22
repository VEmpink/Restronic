import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {NavigationProp} from '@react-navigation/native';
import {TabBar, Tab, Icon} from '@ui-kitten/components';

import {Container, TopNavigation} from '../components/Helper';
import ApplicationSettings from '../components/Settings/ApplicationSettings';
import ProfileSettings from '../components/Settings/ProfileSettings';
import {RootStackParamList} from '../types';

type SettingsProps = {
  navigation: NavigationProp<RootStackParamList>;
};

function Settings(props: SettingsProps): React.ReactElement {
  const {navigation} = props;
  const [hasFocusScreen, setFocusScreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setFocusScreen(true);
    });
  }, []);

  return (
    <>
      <TopNavigation title='Pengaturan' onPress={() => navigation.goBack()} />

      <Container>
        {hasFocusScreen && (
          <>
            <TabBar
              selectedIndex={activeIndex}
              onSelect={(i) => setActiveIndex(i)}
            >
              <Tab
                icon={(propsTab) => (
                  <Icon {...propsTab} name='person-outline' />
                )}
                title='Profil'
              />
              <Tab
                icon={(propsTab) => (
                  <Icon {...propsTab} name='browser-outline' />
                )}
                title='Aplikasi'
              />
            </TabBar>

            <View style={{flex: 1, marginTop: 24}}>
              {activeIndex === 0 ? (
                <ProfileSettings />
              ) : (
                <ApplicationSettings />
              )}
            </View>
          </>
        )}
      </Container>
    </>
  );
}

export default Settings;
