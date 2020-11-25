import React, {memo, useContext, useRef} from 'react';
import {View, Alert} from 'react-native';
import {Icon, Divider, Button} from '@ui-kitten/components';
import AutoHeightImage from 'react-native-auto-height-image';
import moment from 'moment';
import {Text, Avatar} from '../Helper';
import {logo} from '../../images';
import FormChangeStatusData from './FormChangeStatusData';
import {RealmContext} from '../../contexts';
import _ from 'lodash';
import util from '../../utils';

const formatDate = date => moment(date).format('dddd, DD/MM/YYYY HH:mm');

const DataShowcase = memo(
  props => {
    return (
      <View
        style={{
          flex: 1,
          ...((props.isLeft && {marginRight: 4}) ||
            (props.isRight && {marginLeft: 4})),
          ...props.style,
        }}
      >
        <Text size={14} hint>
          {props.title}
        </Text>
        <Text bold>{props.value}</Text>
      </View>
    );
  },
  (prevProps, nextProps) =>
    _.isEqual(
      {title: prevProps.title, value: prevProps.value},
      {title: nextProps.title, value: nextProps.value},
    ),
);

const CustomerDeviceBrand = memo(
  ({deviceBrand}) => (
    <>
      {typeof logo[deviceBrand.toLowerCase()] !== 'undefined' ? (
        <AutoHeightImage
          width={80}
          source={logo[deviceBrand.toLowerCase()]}
          style={{marginBottom: 24}}
        />
      ) : (
        <DataShowcase
          title='Merek Perangkat'
          value={deviceBrand}
          style={{marginBottom: 12}}
        />
      )}
    </>
  ),
  (prevProps, nextProps) => prevProps.deviceBrand === nextProps.deviceBrand,
);

const BodyCustomerDataDetails = props => {
  const {navigate} = props;
  const {Realm} = useContext(RealmContext);
  const customer = props.customerData;
  const serviceStatus = customer.serviceStatus;
  const ModalForm_Ref = useRef();

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
            onImageChange={base64 => {
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
            accessoryLeft={props => <Icon {...props} name='edit-outline' />}
            onPress={() =>
              /**
               * Tombol untuk mengubah data pelanggan yang telah ditampilkan
               * di screen ini yang akan mengarahkan pengguna ke Form Utama
               * dan disana Form Utama akan secara otomatis akan mengaktifkan
               * "EDIT_MODE"
               */
              navigate('Form', {selectedCustomerId: customer._id})
            }
          />

          <Button
            size='small'
            accessoryLeft={props => <Icon {...props} name='edit-2-outline' />}
            style={{marginHorizontal: 8}}
            onPress={() => {
              /**
               * Tombol untuk menampilkan Modal Form pengubah status data pelanggan
               * yang telah ditampilkan di screen ini
               */
              ModalForm_Ref.current.show();
            }}
          >
            Ubah Status
          </Button>

          <Button
            size='small'
            status='danger'
            accessoryLeft={props => <Icon {...props} name='trash-2-outline' />}
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
                        navigate('Home');
                      });
                    },
                  },
                ],
                {cancelable: true},
              );
            }}
          />
        </View>

        <FormChangeStatusData
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
                  if (warrantyTime == 0) {
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
          ref={ModalForm_Ref}
        />
      </View>

      <View>
        <CustomerDeviceBrand deviceBrand={customer.deviceBrand} />
      </View>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <DataShowcase
          title='Nama Perangkat'
          value={customer.deviceName}
          isLeft
        />
        <DataShowcase
          title='Warna Perangkat'
          value={customer.deviceColor}
          isRight
        />
      </View>
      <DataShowcase
        title='Kerusakan'
        value={customer.deviceDamage}
        style={{marginBottom: 24}}
      />
      <Divider style={{marginBottom: 24}} />

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <DataShowcase
          title='Uang Muka/DP'
          value={util.shortNumber(customer.serviceDownPayment)}
          isLeft
        />
        <DataShowcase
          title='Harga Servisan'
          value={util.shortNumber(customer.servicePrice)}
          isRight
        />
      </View>
      <Divider style={{marginBottom: 24}} />

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <DataShowcase
          title='Tanggal Dibuat'
          value={formatDate(customer.createdAt)}
          isLeft
        />
        <DataShowcase
          title='Terakhir kali Diubah'
          value={formatDate(customer.updatedAt)}
          isRight
        />
      </View>

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <DataShowcase
          title='Perkiraan Selesai'
          value={`${customer.timeEstimate} Hari`}
          isLeft
        />
        <DataShowcase
          title='Tanggal Selesai'
          value={
            serviceStatus == 'onwarranty' || serviceStatus == 'complete'
              ? formatDate(customer.serviceFinishDate)
              : '-'
          }
          isRight
        />
      </View>

      <View style={{flexDirection: 'row', marginBottom: 24}}>
        <DataShowcase
          title='Waktu Garansi'
          value={
            serviceStatus == 'onwarranty' || serviceStatus == 'complete'
              ? `${customer.timeWarranty} Hari`
              : '-'
          }
          isLeft
        />
        <DataShowcase
          title='Tanggal Garansi Habis'
          value={
            serviceStatus == 'onwarranty' || serviceStatus == 'complete'
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

      <DataShowcase title='Catatan' value={customer.notes} />
    </>
  );
};

export default BodyCustomerDataDetails;
