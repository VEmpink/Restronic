import React, {memo, useContext, useRef} from 'react';
import {View, Alert, StyleProp, ViewStyle} from 'react-native';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Icon, Divider, Button} from '@ui-kitten/components';
import _ from 'lodash';
import moment from 'moment';
import AutoHeightImage from 'react-native-auto-height-image';

import {logo} from '../../assets/images';
import {RealmContext} from '../../context';
import {RootStackParamList, Customer} from '../../types';
import util from '../../utils';
import {Text, Avatar} from '../Helper';

import FowardedFormChangeStatusData from './FormChangeStatusData';

const formatDate = (date: Date | number | moment.Moment) =>
  moment(date).format('dddd, DD/MM/YYYY HH:mm');

type DataShowcaseProps = {
  title: string;
  value: string;
  isRight?: boolean;
  isLeft?: boolean;
  style?: StyleProp<ViewStyle>;
};

function DataShowcase(props: DataShowcaseProps): React.ReactElement {
  const {title, value, isRight, isLeft, style} = props;

  return (
    <View
      style={[
        {
          flex: 1,
          ...((isLeft && {marginRight: 4}) || (isRight && {marginLeft: 4})),
        },
        style,
      ]}
    >
      <Text size={14} hint>
        {title}
      </Text>
      <Text bold>{value}</Text>
    </View>
  );
}

DataShowcase.defaultProps = {
  isRight: false,
  isLeft: false,
  style: {},
};

const MemoizedDataShowcase = memo(DataShowcase, (prevProps, nextProps) =>
  _.isEqual(
    {title: prevProps.title, value: prevProps.value},
    {title: nextProps.title, value: nextProps.value},
  ),
);

type CustomerDeviceBrandProps = {
  deviceBrand: string;
};

const MemoizedCustomerDeviceBrand = memo(
  function CustomerDeviceBrand({deviceBrand}: CustomerDeviceBrandProps) {
    return (
      <>
        {typeof logo[deviceBrand.toLowerCase()] !== 'undefined' ? (
          <AutoHeightImage
            width={80}
            source={logo[deviceBrand.toLowerCase()]}
            style={{marginBottom: 24}}
          />
        ) : (
          <MemoizedDataShowcase
            title='Merek Perangkat'
            value={deviceBrand}
            style={{marginBottom: 12}}
          />
        )}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.deviceBrand === nextProps.deviceBrand,
);

type BodyCustomerDataDetailProps = {
  customerData: Customer;
};

function BodyCustomerDataDetails(
  props: BodyCustomerDataDetailProps,
): React.ReactElement {
  const {customerData} = props;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {Realm} = useContext(RealmContext);
  const customer = customerData;
  const {serviceStatus} = customer;
  const modalFormRef = useRef();

  return (
    <>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <View
          style={{
            marginBottom: 12,
            backgroundColor: '#edf1f7',
            overflow: 'hidden',
            borderRadius: 4,
          }}
        >
          <Avatar
            uri={customer.photo}
            onImageChange={(base64) => {
              Realm.write(() => {
                customer.photo = base64;
              });
            }}
          />
        </View>

        <Text size={14} hint>
          Nama Pelanggan
        </Text>
        <Text size={20} bold>
          {customer.name}
        </Text>
        <Text size={12} hint>
          {customer._id}
        </Text>

        <View style={{flexDirection: 'row', marginTop: 16}}>
          <Button
            size='small'
            status='warning'
            accessoryLeft={(buttonProps) => (
              <Icon {...buttonProps} name='edit-outline' />
            )}
            onPress={() => {
              navigation.navigate('Form', {selectedCustomerId: customer._id});
            }}
          />

          <Button
            size='small'
            accessoryLeft={(buttonProps) => (
              <Icon {...buttonProps} name='edit-2-outline' />
            )}
            style={{marginHorizontal: 8}}
            onPress={() => {
              /**
               * Tombol untuk menampilkan Modal Form pengubah status data pelanggan
               * yang telah ditampilkan di screen ini
               */
              modalFormRef.current?.show();
            }}
          >
            Ubah Status
          </Button>

          <Button
            size='small'
            status='danger'
            accessoryLeft={(buttonProps) => (
              <Icon {...buttonProps} name='trash-2-outline' />
            )}
            onPress={() => {
              Alert.alert(
                'Hmmm?',
                'Yakin ingin menghapus data ini?',
                [
                  {text: 'Batal'},
                  {
                    text: 'Ya Hapus!',
                    onPress: () => {
                      Realm.write(() => {
                        Realm.delete(customer);
                        util.snackbar.show('success', 'Data berhasil dihapus!');
                        navigation.navigate('Home');
                      });
                    },
                  },
                ],
                {cancelable: true},
              );
            }}
          />
        </View>

        <FowardedFormChangeStatusData
          currentServiceStatus={serviceStatus}
          currentWarrantyTime={customer.timeWarranty}
          onPressSubmit={(selectedStatusData, warrantyTime) => {
            if (serviceStatus !== selectedStatusData) {
              Realm.write(() => {
                if (selectedStatusData === 'onwarranty') {
                  customer.serviceFinishDate = Date.now();
                  customer.timeWarranty = warrantyTime;

                  /**
                   * Jika wakti garansi tidak diisi atau 0
                   * maka data akan dianggap "Telah selesai" atau
                   * "complete"
                   */
                  if (warrantyTime === 0) {
                    customer.serviceStatus = 'complete';
                  } else {
                    customer.serviceStatus = 'onwarranty';
                  }
                } else {
                  customer.serviceStatus = selectedStatusData;
                }

                customer.updatedAt = Date.now();
                util.snackbar.show('success', 'Status data berhasil diubah!');
              });
            }
          }}
          ref={modalFormRef}
        />
      </View>

      <View>
        <MemoizedCustomerDeviceBrand deviceBrand={customer.deviceBrand} />
      </View>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <MemoizedDataShowcase
          title='Nama Perangkat'
          value={customer.deviceName}
          isLeft
        />
        <MemoizedDataShowcase
          title='Warna Perangkat'
          value={customer.deviceColor}
          isRight
        />
      </View>
      <MemoizedDataShowcase
        title='Kerusakan'
        value={customer.deviceDamage}
        style={{marginBottom: 24}}
      />
      <Divider style={{marginBottom: 24}} />

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <MemoizedDataShowcase
          title='Uang Muka/DP'
          value={util.shortNumber(customer.serviceDownPayment)}
          isLeft
        />
        <MemoizedDataShowcase
          title='Harga Servisan'
          value={util.shortNumber(customer.servicePrice)}
          isRight
        />
      </View>
      <Divider style={{marginBottom: 24}} />

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <MemoizedDataShowcase
          title='Tanggal Dibuat'
          value={formatDate(customer.createdAt)}
          isLeft
        />
        <MemoizedDataShowcase
          title='Terakhir kali Diubah'
          value={formatDate(customer.updatedAt)}
          isRight
        />
      </View>

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <MemoizedDataShowcase
          title='Perkiraan Selesai'
          value={`${customer.timeEstimate} Hari`}
          isLeft
        />
        <MemoizedDataShowcase
          title='Tanggal Selesai'
          value={
            serviceStatus === 'onwarranty' || serviceStatus === 'complete'
              ? formatDate(customer.serviceFinishDate)
              : '-'
          }
          isRight
        />
      </View>

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <MemoizedDataShowcase
          title='Waktu Garansi'
          value={
            serviceStatus === 'onwarranty' || serviceStatus === 'complete'
              ? `${customer.timeWarranty} Hari`
              : '-'
          }
          isLeft
        />
        <MemoizedDataShowcase
          title='Tanggal Garansi Habis'
          value={
            serviceStatus === 'onwarranty' || serviceStatus === 'complete'
              ? formatDate(
                  moment(customer.serviceFinishDate).add(
                    customer.timeWarranty,
                    'day',
                  ),
                )
              : '-'
          }
          isRight
        />
      </View>
      <Divider style={{marginBottom: 24}} />

      <MemoizedDataShowcase title='Catatan' value={customer.notes} />
    </>
  );
}

export default BodyCustomerDataDetails;
