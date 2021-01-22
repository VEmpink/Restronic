import React, {useContext, useEffect} from 'react';

import {NavigationProp} from '@react-navigation/native';
import {Icon, Button} from '@ui-kitten/components';
import SplashScreen from 'react-native-splash-screen';

import {Container, Text} from '../components/Helper';
import CustomerDataReportShowcase from '../components/Home/CustomerDataReportShowcase';
import CustomerDataShowcase from '../components/Home/CustomerDataShowcase';
import HomeHeader from '../components/Home/HomeHeader';
import {RealmContext} from '../context';
import {Customer, RootStackParamList} from '../types';

type HomeProps = {
  navigation: NavigationProp<RootStackParamList>;
};

function Home(props: HomeProps): React.ReactElement {
  const {navigation} = props;
  const {Realm} = useContext(RealmContext);
  const {navigate} = navigation;

  useEffect(() => {
    const minimumDate = Realm.objects<Customer>('user')[0]._id;
    let dateValidationTimer: NodeJS.Timeout;

    navigation.addListener('focus', () => {
      dateValidationTimer = setInterval(() => {
        if (Date.now() <= minimumDate) {
          clearInterval(dateValidationTimer);
          navigate('ErrorScreen');
        }
      }, 1000);
    });

    navigation.addListener('blur', () => {
      clearInterval(dateValidationTimer);
    });

    SplashScreen.hide();

    return () => clearInterval(dateValidationTimer);
  }, []);

  return (
    <>
      <Container>
        <HomeHeader />

        <CustomerDataReportShowcase />

        <CustomerDataShowcase />

        <Text size={12} align='center' hint>
          Created in 2020 by VEmpink
        </Text>
      </Container>

      <Button
        size='giant'
        onPress={() => navigate('Form')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          paddingHorizontal: 0,
          paddingVertical: 0,
          borderRadius: 56,
          zIndex: 3,
        }}
        accessoryLeft={(propsAcc) => (
          <Icon
            name='plus-outline'
            style={[{marginHorizontal: 0}, propsAcc?.style]}
          />
        )}
      />
    </>
  );
}

export default Home;
