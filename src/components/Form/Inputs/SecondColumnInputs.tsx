import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  ForwardedRef,
} from 'react';
import {View} from 'react-native';

import {Input} from '@ui-kitten/components';
import _ from 'lodash';
import {TextInputMask} from 'react-native-masked-text';

import {Input as InputHelper} from '../../Helper';

const initialInputData = {
  deviceName: '',
  deviceColor: '',
  deviceDamage: '',
  timeEstimate: 0,
};

const initialUIState = {
  statusDeviceColorField: 'basic',
  statusDeviceDamageField: 'basic',
};

type SetInputDataParam = Partial<typeof initialInputData>;
type SetUIStateParam = Partial<typeof initialUIState>;

type SecondColumnInputProps = {
  onSubmitAtLastField: () => void;
};

export type SecondColumnInputMethods = {
  setInputData: (data: SetInputDataParam) => void;
  getInputData: () => typeof initialInputData;
  setFieldError: (fieldName: 'deviceColor' | 'deviceDamage') => void;
  focus: () => void;
  resetValues: () => void;
};

const FowardedSecondColumnInputs = forwardRef(function SecondColumnInputs(
  props: SecondColumnInputProps,
  ref: ForwardedRef<SecondColumnInputMethods>,
) {
  const [inputData, setInputData] = useState(initialInputData);
  const [UIState, setUIState] = useState(initialUIState);

  const deviceNameFieldRef = useRef<Input>(null);
  const deviceColorFieldRef = useRef<Input>(null);
  const deviceDamageFieldRef = useRef<Input>(null);
  const timeEstimateFieldRef = useRef<Input>();

  /**
   * @param {initialInputData} newState
   */
  const dispatchInputData = (newState: SetInputDataParam) =>
    setInputData((prevState) => ({...prevState, ...newState}));

  /**
   * @param {initialUIState} newState
   */
  const dispatchUIState = (newState: SetUIStateParam) =>
    setUIState((prevState) => ({...prevState, ...newState}));

  useImperativeHandle(ref, () => ({
    setInputData: (data) => dispatchInputData(data),
    getInputData: () => inputData,
    setFieldError: (fieldName) => {
      if (fieldName === 'deviceColor') {
        deviceColorFieldRef.current?.focus();
        dispatchUIState({
          statusDeviceColorField: 'danger',
        });
      }

      if (fieldName === 'deviceDamage') {
        deviceDamageFieldRef.current?.focus();
        dispatchUIState({
          statusDeviceDamageField: 'danger',
        });
      }
    },
    focus: () => deviceNameFieldRef.current?.focus(),
    resetValues: () => dispatchInputData(initialInputData),
  }));

  return (
    <View style={{marginBottom: 12}}>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <InputHelper
          label='Nama Perangkat'
          placeholder='J1 Ace'
          returnKeyType='next'
          value={inputData.deviceName}
          style={{flex: 1, marginRight: 8}}
          onChangeText={(text) => dispatchInputData({deviceName: text})}
          onSubmitEditing={() => deviceColorFieldRef.current?.focus()}
          ref={deviceNameFieldRef}
        />

        <InputHelper
          label='Warna Perangkat'
          placeholder='Hitam, Biru'
          returnKeyType='next'
          value={inputData.deviceColor}
          status={UIState.statusDeviceColorField}
          style={{flex: 1}}
          onChangeText={(text) => {
            dispatchInputData({deviceColor: text});

            if (UIState.statusDeviceColorField !== 'basic') {
              dispatchUIState({statusDeviceColorField: 'basic'});
            }
          }}
          onSubmitEditing={() => deviceDamageFieldRef.current?.focus()}
          ref={deviceColorFieldRef}
        />
      </View>

      <View style={{flexDirection: 'row'}}>
        <InputHelper
          label='Kerusakan Perangkat'
          placeholder='LCD, Touchscreen'
          returnKeyType='next'
          value={inputData.deviceDamage}
          status={UIState.statusDeviceDamageField}
          style={{flex: 1, marginRight: 8}}
          onChangeText={(text) => {
            dispatchInputData({deviceDamage: text});

            if (UIState.statusDeviceDamageField !== 'basic') {
              dispatchUIState({statusDeviceDamageField: 'basic'});
            }
          }}
          onSubmitEditing={() => timeEstimateFieldRef.current?.focus()}
          ref={deviceDamageFieldRef}
        />

        <TextInputMask
          customTextInput={InputHelper}
          customTextInputProps={{
            label: 'Perkiraan selesai?',
          }}
          placeholder='Berapa hari?'
          returnKeyType='next'
          type='only-numbers'
          value={
            inputData.timeEstimate ? inputData.timeEstimate.toString() : ''
          }
          maxLength={2}
          style={{flex: 1}}
          includeRawValueInChangeText
          onChangeText={(maskVal, rawVal) => {
            dispatchInputData({timeEstimate: _.parseInt(rawVal || '0')});
          }}
          onSubmitEditing={props.onSubmitAtLastField}
          refInput={(refInput) => {
            timeEstimateFieldRef.current = refInput;
          }}
        />
      </View>
    </View>
  );
});

export default FowardedSecondColumnInputs;
