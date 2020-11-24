import React, {forwardRef, useImperativeHandle, useState, useRef} from 'react';
import {View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {Input} from '../../Helper';

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

const SecondColumnInputs = forwardRef((props, ref) => {
  const [inputData, setInputData] = useState(initialInputData);
  const [UIState, setUIState] = useState(initialUIState);

  const deviceNameField = useRef();
  const deviceColorField = useRef();
  const deviceDamageField = useRef();
  const timeEstimateField = useRef();

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
    setInputData: data => dispatchInputData(data),
    getInputData: () => inputData,
    setFieldError: fieldName => {
      if (fieldName === 'deviceColor') {
        deviceColorField.current.focus();
        dispatchUIState({
          statusDeviceColorField: 'danger',
        });
      }

      if (fieldName === 'deviceDamage') {
        deviceDamageField.current.focus();
        dispatchUIState({
          statusDeviceDamageField: 'danger',
        });
      }
    },
    focus: () => deviceNameField.current.focus(),
    resetValues: () => dispatchInputData(initialInputData),
  }));

  return (
    <View style={{marginBottom: 12}}>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <Input
          label='Nama Perangkat'
          placeholder='J1 Ace'
          returnKeyType='next'
          value={inputData.deviceName}
          style={{flex: 1, marginRight: 8}}
          onChangeText={text => dispatchInputData({deviceName: text})}
          onSubmitEditing={() => deviceColorField.current.focus()}
          ref={deviceNameField}
        />

        <Input
          label='Warna Perangkat'
          placeholder='Hitam, Biru'
          returnKeyType='next'
          value={inputData.deviceColor}
          status={UIState.statusDeviceColorField}
          style={{flex: 1}}
          onChangeText={text => {
            dispatchInputData({deviceColor: text});

            if (UIState.statusDeviceColorField !== 'basic') {
              dispatchUIState({statusDeviceColorField: 'basic'});
            }
          }}
          onSubmitEditing={() => deviceDamageField.current.focus()}
          ref={deviceColorField}
        />
      </View>

      <View style={{flexDirection: 'row'}}>
        <Input
          label='Kerusakan Perangkat'
          placeholder='LCD, Touchscreen'
          returnKeyType='next'
          value={inputData.deviceDamage}
          status={UIState.statusDeviceDamageField}
          style={{flex: 1, marginRight: 8}}
          onChangeText={text => {
            dispatchInputData({deviceDamage: text});

            if (UIState.statusDeviceDamageField !== 'basic') {
              dispatchUIState({statusDeviceDamageField: 'basic'});
            }
          }}
          onSubmitEditing={() => timeEstimateField.current.focus()}
          ref={deviceDamageField}
        />

        <TextInputMask
          customTextInput={Input}
          label='Perkiraan selesai?'
          placeholder='Berapa hari?'
          returnKeyType='next'
          type={'only-numbers'}
          value={inputData.timeEstimate ? inputData.timeEstimate : ''}
          maxLength={2}
          style={{flex: 1}}
          includeRawValueInChangeText={true}
          onChangeText={(maskVal, rawVal) =>
            dispatchInputData({timeEstimate: rawVal})
          }
          onSubmitEditing={props.onSubmitAtLastField}
          refInput={ref => (timeEstimateField.current = ref)}
        />
      </View>
    </View>
  );
});

export default SecondColumnInputs;
