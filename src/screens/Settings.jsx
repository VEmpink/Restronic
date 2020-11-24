import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {TabBar, Tab, Icon} from '@ui-kitten/components';
import {Contrainer, TopNavigation} from '../components/Helper';
import ProfileSettings from '../components/Settings/ProfileSettings';
import ApplicationSettings from '../components/Settings/ApplicationSettings';

const Settings = props => {
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
      <Contrainer>
        {hasFocusScreen && (
          <>
            <TabBar
              selectedIndex={activeIndex}
              onSelect={i => setActiveIndex(i)}
            >
              <Tab
                icon={props => <Icon {...props} name='person-outline' />}
                title='Profil'
              />
              <Tab
                icon={props => <Icon {...props} name='browser-outline' />}
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
      </Contrainer>
    </>
  );
};

export default Settings;
