import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  ForwardedRef,
} from 'react';
import {View} from 'react-native';

import Datepicker from '@react-native-community/datetimepicker';
import {Icon, Input} from '@ui-kitten/components';
import _ from 'lodash';
import moment from 'moment';

import {Input as InputHelper, Avatar} from '../../Helper';
import {AvatarMethods} from '../../Helper/Avatar';

const initialInputData = {
  createdAt: 0,
  name: '',
  photo: '',
  deviceBrand: '',
};

const initialUIState = {
  showDatepicker: false,
  statusCustomerNameField: 'basic',
  statusDeviceBrandField: 'basic',
};

type SetInputDataParam = Partial<typeof initialInputData>;
type SetUIStateParam = Partial<typeof initialUIState>;

type FirstColumnInputProps = {
  onSubmitAtLastField: () => void;
};

export type FirstColumnInputMethods = {
  setInputData: (data: SetInputDataParam) => void;
  getInputData: () => typeof initialInputData;
  setFieldError: (fieldName: 'name' | 'deviceBrand') => void;
  resetValues: () => void;
};

const FowardedFirstColumnInputs = forwardRef(function FirstColumnInputs(
  props: FirstColumnInputProps,
  ref: ForwardedRef<FirstColumnInputMethods>,
) {
  const [inputData, setInputData] = useState(initialInputData);
  const [UIState, setUIState] = useState(initialUIState);

  const avatarRef = useRef<AvatarMethods>(null);
  const customerNameField = useRef<Input>(null);
  const deviceBrandField = useRef<Input>(null);

  /**
   * Used when only on edit mode
   */
  const currentCreatedAt = useRef(0);

  const dispatchInputData = (newState: SetInputDataParam) =>
    setInputData((prevState) => ({...prevState, ...newState}));

  const dispatchUIState = (newState: SetUIStateParam) =>
    setUIState((prevState) => ({...prevState, ...newState}));

  useImperativeHandle(ref, () => ({
    setInputData: (data) => {
      dispatchInputData(data);
      currentCreatedAt.current = data.createdAt || 0;
    },
    getInputData: () => ({
      ...inputData,
      createdAt: inputData.createdAt ? inputData.createdAt : Date.now(),
      photo: avatarRef.current?.getImgSrc() || '',
    }),
    setFieldError: (fieldName) => {
      if (fieldName === 'name') {
        customerNameField.current?.focus();
        dispatchUIState({
          statusCustomerNameField: 'danger',
        });
      }

      if (fieldName === 'deviceBrand') {
        deviceBrandField.current?.focus();
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
        ref={avatarRef}
      />

      <InputHelper
        label='Tanggal'
        accessoryRight={(propsAcc) => (
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

            if (_.isDate(selectedDate)) {
              dispatchInputData({
                createdAt: selectedDate.valueOf(),
              });
            } else if (currentCreatedAt.current > 0) {
              dispatchInputData({
                createdAt: currentCreatedAt.current,
              });
            } else {
              dispatchInputData({
                createdAt: selectedDate,
              });
            }
          }}
        />
      )}

      <View style={{flexDirection: 'row'}}>
        <InputHelper
          label='Nama Pelanggan'
          placeholder='Asep'
          returnKeyType='next'
          autoCorrect={false}
          value={inputData.name}
          status={UIState.statusCustomerNameField}
          style={{flex: 1, marginRight: 8}}
          onChangeText={(text) => {
            dispatchInputData({name: text});

            if (UIState.statusCustomerNameField !== 'basic') {
              dispatchUIState({statusCustomerNameField: 'basic'});
            }
          }}
          onSubmitEditing={() => deviceBrandField.current?.focus()}
          ref={customerNameField}
        />

        <InputHelper
          label='Brand Perangkat'
          placeholder='Samsung'
          returnKeyType='next'
          value={inputData.deviceBrand}
          status={UIState.statusDeviceBrandField}
          style={{flex: 1}}
          onChangeText={(text) => {
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

export default FowardedFirstColumnInputs;
