import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View, Dimensions, StyleProp, TextStyle} from 'react-native';

import {Icon, Button} from '@ui-kitten/components';
import {TextEncoder} from 'fastestsmallesttextencoderdecoder';
import Joi from 'joi';
import _ from 'lodash';
import {TextInputMask} from 'react-native-masked-text';

import {CustomerServiceStatus} from '../../types';
import util from '../../utils';
import {Text, IconHelper, Input, NativePicker, Modal} from '../Helper';
import {ModalHelperMethods} from '../Helper/Modal';

type MessageProps = {
  status: 'warning' | 'danger' | 'basic' | 'info';
  text: string;
  style?: StyleProp<TextStyle>;
};

function Message(props: MessageProps): React.ReactElement {
  const {status, text, style} = props;

  return (
    <Text
      size={14}
      align='center'
      status={status}
      style={[
        {
          marginBottom: 16,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}

Message.defaultProps = {
  style: {},
};

type StatusDataMenu = {
  label: string;
  value: CustomerServiceStatus;
}[];

/**
 * Saya tidak memasukkan status "complete" karena "onwarranty" dan "complete"
 * ini sama tujuannya yang artinya, jika pengguna memilih menu "onwarranty"
 * dan tidak mengisi waktu garansinya, maka secara otomatis data akan berubah
 * menjadi "complete"
 */
const statusDataMenu: StatusDataMenu = [
  {label: 'Dalam proses', value: 'onprocess'},
  {label: 'Selesai & Belum diambil', value: 'saved'},
  {label: 'Selesai & Sudah diambil', value: 'onwarranty'},
  {label: 'Batalkan data ini', value: 'canceled'},
];

type FormComponentProps = {
  currentServiceStatus: CustomerServiceStatus;
  currentWarrantyTime: number;
  onSubmit: (statusData: CustomerServiceStatus, warranty: number) => void;
  onCancel: () => void;
};

function FormComponent(props: FormComponentProps): React.ReactElement {
  const {currentServiceStatus, currentWarrantyTime, onSubmit, onCancel} = props;
  const [selectedStatusData, setSelectedStatusData] = useState<
    CustomerServiceStatus
  >('onprocess');
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

    setWarranty(
      currentWarrantyTime === 0 ? '' : currentWarrantyTime.toString(),
    );
  }, []);

  const ConditionalMessage = () => {
    switch (currentServiceStatus) {
      case 'onwarranty':
        return (
          <Message
            status='warning'
            text='Pengubahan ke Status lain Tidak akan mempengaruhi Waktu Garansi'
          />
        );
        break;

      case 'complete':
        return (
          <Message
            status='danger'
            text='Sangat tidak disarankan mengubah Status Data yang Telah Selesai!'
          />
        );
        break;

      default:
        return <View />;
        break;
    }
  };

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

      <ConditionalMessage />

      <Text size={14} hint>
        Pilih status data
      </Text>

      <NativePicker
        mode='dropdown'
        renderItems={statusDataMenu}
        selectedValue={selectedStatusData}
        parentStyle={{maringBottom: 12}}
        onValueChange={(v) => {
          setSelectedStatusData(v);
        }}
      />

      {(selectedStatusData === 'onwarranty' ||
        selectedStatusData === 'complete') && (
        <>
          <Message
            status='info'
            text='Jika tidak diisi atau 0 Garansi maka Data dianggap "Telah Selesai"'
            style={{marginBottom: 12}}
          />

          <TextInputMask
            customTextInput={Input}
            customTextInputProps={{label: 'Isi/Ubah Garansi'}}
            placeholder='Garansi berapa hari?'
            returnKeyType='done'
            type='only-numbers'
            value={warrantyTime}
            maxLength={3}
            includeRawValueInChangeText
            onChangeText={(maskVal, rawVal) => {
              setWarranty(rawVal || '');
            }}
          />
        </>
      )}

      <Button
        size='small'
        accessoryLeft={(buttonProps) => (
          <Icon {...buttonProps} name='edit-2-outline' />
        )}
        style={{marginTop: 24}}
        onPress={() => {
          onSubmit(selectedStatusData, _.parseInt(warrantyTime));
        }}
      >
        Ubah status
      </Button>

      <Button
        size='small'
        status='basic'
        appearance='outline'
        style={{marginTop: 8}}
        onPress={onCancel}
      >
        Batal
      </Button>
    </View>
  );
}

type FowardedFormChangeStatusDataProps = {
  currentServiceStatus: CustomerServiceStatus;
  currentWarrantyTime: number;
  onPressSubmit: (statusData: CustomerServiceStatus, warranty: number) => void;
};

export type FowardedFormChangeStatusDataMethods = {
  show: () => void;
  hide: () => void;
};

const FowardedFormChangeStatusData = forwardRef(function FormChangeStatusData(
  props: FowardedFormChangeStatusDataProps,
  ref: ForwardedRef<FowardedFormChangeStatusDataMethods>,
) {
  const modalRef = useRef<ModalHelperMethods>(null);

  useImperativeHandle(ref, () => ({
    show: () => modalRef.current?.show(),
    hide: () => modalRef.current?.hide(),
  }));

  return (
    <Modal ref={modalRef}>
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

            modalRef.current?.hide();
          } catch (error) {
            util.snackbar.show(
              'error',
              'Gagal mengubah status data pelanggan!',
              false,
            );
          }
        }}
        onCancel={() => modalRef.current?.hide()}
      />
    </Modal>
  );
});

export default FowardedFormChangeStatusData;
