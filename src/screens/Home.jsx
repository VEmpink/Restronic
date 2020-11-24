import React, {useContext, useEffect} from 'react';
import {Icon, Button} from '@ui-kitten/components';
import {Contrainer, Text} from '../components/Helper';
import HomeHeader from '../components/Home/HomeHeader';
import CustomerDataReportShowcase from '../components/Home/CustomerDataReportShowcase';
import CustomerDataShowcase from '../components/Home/CustomerDataShowcase';
import {RealmContext} from '../contexts';
import SplashScreen from 'react-native-splash-screen';

const Home = props => {
  const {navigation} = props;
  const {Realm} = useContext(RealmContext);
  const {navigate} = navigation;

  useEffect(() => {
    const minimumDate = Realm.objects('user')[0]._id;
    let dateValidationTimer;

    navigation.addListener('focus', () => {
      dateValidationTimer = setInterval(() => {
        if (Date.now() <= minimumDate) {
          clearInterval(dateValidationTimer);
          navigate('Error');
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
      <Contrainer>
        <HomeHeader navigate={navigate} />

        <CustomerDataReportShowcase />

        <CustomerDataShowcase navigate={navigate} />

        <Text size={12} align='center' hint>
          Created in 2020 by VEmpink
        </Text>
      </Contrainer>

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
        accessoryLeft={propsAcc => (
          <Icon
            name='plus-outline'
            style={{...propsAcc.style, marginHorizontal: 0}}
          />
        )}
      />
    </>
  );
};

export default Home;
