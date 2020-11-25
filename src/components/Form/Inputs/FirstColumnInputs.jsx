import React, {forwardRef, useImperativeHandle, useState, useRef} from 'react';
import {View} from 'react-native';
import {Icon} from '@ui-kitten/components';
import {Input, Avatar} from '../../Helper';
import Datepicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const initialInputData = {
  createdAt: undefined,
  name: '',
  photo: '',
  deviceBrand: '',
};

const initialUIState = {
  showDatepicker: false,
  statusCustomerNameField: 'basic',
  statusDeviceBrandField: 'basic',
};

const FirstColumnInputs = forwardRef((props, ref) => {
  const [inputData, setInputData] = useState(initialInputData);
  const [UIState, setUIState] = useState(initialUIState);

  const Avatar_Ref = useRef();
  const customerNameField = useRef();
  const deviceBrandField = useRef();

  /**
   * Hanya digunakan ketika Form Utama dalam mode edit, nilainya adalah
   * tanggal "createdAt" dari data pelanggan yang ingin diubah
   */
  const currentCreatedAt = useRef();

  /**
   * @param {initialInputData} newState
   */
  const dispatchInputData = newState =>
    setInputData(prevState => ({...prevState, ...newState}));

  /**
   * @param {initialUIState} newState
   */
  const dispatchUIState = newState =>
    setUIState(prevState => ({...prevState, ...newState}));

  useImperativeHandle(ref, () => ({
    setInputData: data => {
      dispatchInputData(data);
      currentCreatedAt.current = data.createdAt;
    },
    getInputData: () => ({
      ...inputData,
      createdAt: inputData.createdAt ? inputData.createdAt : Date.now(),
      photo: Avatar_Ref.current.getImgSrc(),
    }),
    setFieldError: fieldName => {
      if (fieldName === 'name') {
        customerNameField.current.focus();
        dispatchUIState({
          statusCustomerNameField: 'danger',
        });
      }

      if (fieldName === 'deviceBrand') {
        deviceBrandField.current.focus();
        dispatchUIState({
          statusDeviceBrandField: 'danger',
        });
      }
    },
    resetValues: () => dispatchInputData(initialInputData),
  }));

  return (
    <View style={{marginBottom: 12}}>
      <Avatar
        uri={inputData.photo}
        parentStyle={{marginBottom: 12}}
        ref={Avatar_Ref}
      />

      <Input
        label='Tanggal'
        accessoryRight={propsAcc => (
          <Icon {...propsAcc} name='calendar-outline' />
        )}
        value={moment(inputData.createdAt).format('dddd, DD/MM/YYYY')}
        onFocus={() => dispatchUIState({showDatepicker: true})}
        style={{marginBottom: 12}}
      />

      {UIState.showDatepicker && (
        <Datepicker
          value={
            inputData.createdAt ? new Date(inputData.createdAt) : new Date()
          }
          maximumDate={new Date()}
          onChange={(e, selectedDate) => {
            dispatchUIState({showDatepicker: false});
            dispatchInputData({
              createdAt: selectedDate
                ? selectedDate.valueOf()
                : !selectedDate && currentCreatedAt.current
                ? currentCreatedAt.current
                : selectedDate,
            });
          }}
        />
      )}

      <View style={{flexDirection: 'row'}}>
        <Input
          label='Nama Pelanggan'
          placeholder='Asep'
          returnKeyType='next'
          autoCorrect={false}
          value={inputData.name}
          status={UIState.statusCustomerNameField}
          style={{flex: 1, marginRight: 8}}
          onChangeText={text => {
            dispatchInputData({name: text});

            if (UIState.statusCustomerNameField !== 'basic') {
              dispatchUIState({statusCustomerNameField: 'basic'});
            }
          }}
          onSubmitEditing={() => deviceBrandField.current.focus()}
          ref={customerNameField}
        />

        <Input
          label='Brand Perangkat'
          placeholder='Samsung'
          returnKeyType='next'
          value={inputData.deviceBrand}
          status={UIState.statusDeviceBrandField}
          style={{flex: 1}}
          onChangeText={text => {
            dispatchInputData({deviceBrand: text});

            if (UIState.statusDeviceBrandField !== 'basic') {
              dispatchUIState({statusDeviceBrandField: 'basic'});
            }
          }}
          onSubmitEditing={props.onSubmitAtLastField}
          ref={deviceBrandField}
        />
      </View>
    </View>
  );
});

export default FirstColumnInputs;
