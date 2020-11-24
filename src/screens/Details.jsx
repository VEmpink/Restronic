import React, {useEffect, useState} from 'react';
import BodyCustomerDataDetails from '../components/Details';
import {Contrainer, TopNavigation} from '../components/Helper';
import {useRealmObjects} from '../hooks';
import _ from 'lodash';

/**
 * The screen for displaying a Customer data in detail
 */
const CustomerDataDetails = props => {
  const {navigation} = props;
  const {navigate} = navigation;
  const [screenHasFocus, setHasFocus] = useState(false);

  /**
   * "props.route.params.selectedCustomerId" is sended by CustomerCard at
   * the Home screen Component
   */
  const customerData = useRealmObjects('customers').filtered(
    `_id == ${props.route.params.selectedCustomerId}`,
  )[0];

  const serviceStatus = _.isObject(customerData)
    ? customerData.serviceStatus
    : 'onprocess';

  useEffect(() => {
    navigation.addListener('focus', () => {
      setHasFocus(true);
    });
  }, []);

  return (
    <>
      <TopNavigation
        title={
          serviceStatus == 'onprocess'
            ? 'Data ini Dalam Proses'
            : serviceStatus == 'saved'
            ? 'Data selesai & Belum diambil'
            : serviceStatus == 'onwarranty'
            ? 'Data masih Garansi'
            : serviceStatus == 'complete'
            ? 'Data telah Selesai'
            : 'Data telah Dibatalkan'
        }
        bgColor={
          serviceStatus == 'onprocess'
            ? '#FFAA00'
            : serviceStatus == 'saved'
            ? '#00E096'
            : serviceStatus == 'onwarranty'
            ? '#F2994A'
            : serviceStatus == 'complete'
            ? '#00B383'
            : '#FF3D71'
        }
        onPress={() => navigation.goBack()}
      />

      <Contrainer>
        {screenHasFocus && _.isObject(customerData) && (
          <BodyCustomerDataDetails
            customerData={customerData}
            navigate={navigate}
          />
        )}
      </Contrainer>
    </>
  );
};

export default CustomerDataDetails;
