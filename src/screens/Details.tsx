import React, {useEffect, useState} from 'react';

import {NavigationProp, RouteProp} from '@react-navigation/native';
import _ from 'lodash';

import BodyCustomerDataDetails from '../components/Details';
import {Container, TopNavigation} from '../components/Helper';
import {useRealmObjects} from '../hooks';
import {Customer, RootStackParamList} from '../types';

type DetailsProps = {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: NavigationProp<RootStackParamList>;
};

/**
 * The screen for displaying a Customer data in detail
 */
function Details(props: DetailsProps): React.ReactElement {
  const {navigation, route} = props;
  const {navigate} = navigation;
  const [screenHasFocus, setHasFocus] = useState(false);

  /**
   * "props.route.params.selectedCustomerId" is sended by CustomerCard at
   * the Home screen Component
   */
  const customerData = useRealmObjects<Customer>('customers').filtered(
    `_id == ${route.params.selectedCustomerId}`,
  )[0];

  const serviceStatus = _.isObject(customerData)
    ? customerData.serviceStatus
    : 'onprocess';

  useEffect(() => {
    navigation.addListener('focus', () => {
      setHasFocus(true);
    });
  }, []);

  const getTitle = () => {
    switch (serviceStatus) {
      case 'onprocess':
        return 'Data ini Dalam Proses';
        break;

      case 'saved':
        return 'Data selesai & Belum diambil';
        break;

      case 'onwarranty':
        return 'Data masih Garansi';
        break;

      case 'complete':
        return 'Data telah Selesai';
        break;

      default:
        return 'Data telah Dibatalkan';
        break;
    }
  };

  const getBackgroundColor = () => {
    switch (serviceStatus) {
      case 'onprocess':
        return '#FFAA00';
        break;

      case 'saved':
        return '#00E096';
        break;

      case 'onwarranty':
        return '#F2994A';
        break;

      case 'complete':
        return '#00B383';
        break;

      default:
        return '#FF3D71';
        break;
    }
  };

  return (
    <>
      <TopNavigation
        title={getTitle()}
        backgroundColor={getBackgroundColor()}
        onPress={() => navigation.goBack()}
      />

      <Container>
        {screenHasFocus && _.isObject(customerData) && (
          <BodyCustomerDataDetails
            customerData={customerData}
            navigate={navigate}
          />
        )}
      </Container>
    </>
  );
}

export default Details;
