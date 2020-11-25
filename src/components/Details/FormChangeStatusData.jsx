import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View, Dimensions} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import {TextInputMask} from 'react-native-masked-text';
import {Text, IconHelper, Input, NativePicker, Modal} from '../Helper';
import {TextEncoder} from 'fastestsmallesttextencoderdecoder';
import Joi from 'joi';
import util from '../../utils';

/**
 * Hanya Component peringatan biasa sebelum pengguna mengubah
 * status data yang sekarang ke status data lain
 */
const RenderAttention = props => {
  return (
    <Text
      size={14}
      align='center'
      status={props.status}
      style={{
        marginBottom: 16,
        ...props.style,
      }}
    >
      {props.message}
    </Text>
  );
};

/**
 * Saya tidak memasukkan status "complete" karena "onwarranty" dan "complete"
 * ini sama tujuannya yang artinya, jika pengguna memilih menu "onwarranty"
 * dan tidak mengisi waktu garansinya, maka secara otomatis data akan berubah
 * menjadi "complete"
 */
const statusDataMenu = [
  {label: 'Dalam proses', value: 'onprocess'},
  {label: 'Selesai & Belum diambil', value: 'saved'},
  {label: 'Selesai & Sudah diambil', value: 'onwarranty'},
  {label: 'Batalkan data ini', value: 'canceled'},
];

const FormComponent = props => {
  const {currentServiceStatus, currentWarrantyTime} = props;
  const [selectedStatusData, setSelectedStatusData] = useState('onprocess');
  const [warrantyTime, setWarranty] = useState('');

  useEffect(() => {
    statusDataMenu.forEach((status, index) => {
      /**
       * Tujuan status "onwarranty" dan "complete" adalah sama
       */
      if (
        status.value === currentServiceStatus ||
        (currentServiceStatus === 'complete' && status.value === 'onwarranty')
      ) {
        setSelectedStatusData(statusDataMenu[index].value);
      }
    });

    setWarranty(currentWarrantyTime == 0 ? '' : currentWarrantyTime);
  }, []);

  return (
    <View
      style={{
        maxWidth: Dimensions.get('window').width - 48,
        padding: 24,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <IconHelper
          name='edit-2-outline'
          style={{marginRight: 8}}
          color='#3366ff'
        />
        <Text status='primary' bold>
          Ubah status data
        </Text>
      </View>

      {currentServiceStatus === 'onwarranty' ? (
        <RenderAttention
          status='warning'
          message='Pengubahan ke Status lain Tidak akan mempengaruhi Waktu Garansi'
        />
      ) : currentServiceStatus === 'complete' ? (
        <RenderAttention
          status='danger'
          message='Sangat tidak disarankan mengubah Status Data yang Telah Selesai!'
        />
      ) : (
        <View></View>
      )}

      <Text size={14} hint>
        Pilih status data
      </Text>
      <NativePicker
        mode='dropdown'
        renderItems={statusDataMenu}
        selectedValue={selectedStatusData}
        parentStyle={{maringBottom: 12}}
        onValueChange={(v, i) => setSelectedStatusData(v)}
      />

      {(selectedStatusData == 'onwarranty' ||
        selectedStatusData == 'complete') && (
        <>
          <RenderAttention
            status='info'
            message='Jika tidak diisi atau 0 Garansi maka Data dianggap "Telah Selesai"'
            style={{marginBottom: 12}}
          />

          <TextInputMask
            customTextInput={Input}
            label='Isi/Ubah Garansi'
            placeholder='Garansi berapa hari?'
            returnKeyType='done'
            type={'only-numbers'}
            value={warrantyTime}
            maxLength={3}
            includeRawValueInChangeText={true}
            onChangeText={(maskVal, rawVal) => setWarranty(rawVal)}
          />
        </>
      )}

      <Button
        size='small'
        accessoryLeft={props => <Icon {...props} name='edit-2-outline' />}
        style={{marginTop: 24}}
        onPress={() => props.onSubmit(selectedStatusData, warrantyTime)}
      >
        Ubah status
      </Button>

      <Button
        size='small'
        status='basic'
        appearance='outline'
        style={{marginTop: 8}}
        onPress={props.onCancel}
      >
        Batal
      </Button>
    </View>
  );
};

const FormChangeStatusData = forwardRef((props, ref) => {
  const Modal_Ref = useRef();

  useImperativeHandle(ref, () => ({
    show: () => Modal_Ref.current.show(),
    hide: () => Modal_Ref.current.hide(),
  }));

  return (
    <Modal ref={Modal_Ref}>
      <FormComponent
        currentServiceStatus={props.currentServiceStatus}
        currentWarrantyTime={props.currentWarrantyTime}
        onSubmit={async (statusData, warrantyTime) => {
          try {
            const validStatusData = await Joi.string()
              .valid('onprocess', 'saved', 'onwarranty', 'complete', 'canceled')
              .validateAsync(statusData);

            const validWarrantyTime = await Joi.number()
              .min(0)
              .empty('')
              .default(0)
              .validateAsync(warrantyTime);

            /** Kirim response ke Parent Component via props */
            props.onPressSubmit(validStatusData, validWarrantyTime);

            Modal_Ref.current.hide();
          } catch (error) {
            util.snackbar.show(
              'error',
              'Gagal mengubah status data pelanggan!',
              false,
            );
          }
        }}
        onCancel={() => Modal_Ref.current.hide()}
      />
    </Modal>
  );
});

export default FormChangeStatusData;
