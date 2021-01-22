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
  servicePrice: 0,
  serviceDownPayment: 0,
  notes: '',
};

type SetInputDataParam = Partial<typeof initialInputData>;

export type ThirdColumnInputMethods = {
  setInputData: (data: SetInputDataParam) => void;
  getInputData: () => typeof initialInputData;
  focus: () => void;
  resetValues: () => void;
};

const FowardedThirdColumnInputs = forwardRef(function ThirdColumnInputs(
  props,
  ref: ForwardedRef<ThirdColumnInputMethods>,
) {
  const [inputData, setInputData] = useState(initialInputData);

  const servicePriceFieldRef = useRef<Input>();
  const serviceDownPaymentFieldRef = useRef<Input>();
  const notesFieldRef = useRef<Input>(null);

  /**
   * @param {initialInputData} newState
   */
  const dispatchInputData = (newState: SetInputDataParam) =>
    setInputData((prevState) => ({...prevState, ...newState}));

  useImperativeHandle(ref, () => ({
    setInputData: (data) => dispatchInputData(data),
    getInputData: () => inputData,
    focus: () => serviceDownPaymentFieldRef.current?.focus(),
    resetValues: () => dispatchInputData(initialInputData),
  }));

  return (
    <View style={{marginBottom: 12}}>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <TextInputMask
          customTextInput={InputHelper}
          customTextInputProps={{label: 'DP/Tanda jadi'}}
          placeholder='Rp 100.000'
          returnKeyType='next'
          type='money'
          options={{precision: 0, delimiter: '.', unit: 'Rp '}}
          value={inputData.serviceDownPayment.toString()}
          style={{flex: 1, marginRight: 8}}
          includeRawValueInChangeText
          onChangeText={(maskVal, rawVal) => {
            dispatchInputData({serviceDownPayment: _.parseInt(rawVal || '0')});
          }}
          onSubmitEditing={() => servicePriceFieldRef.current?.focus()}
          refInput={(refInput) => {
            serviceDownPaymentFieldRef.current = refInput;
          }}
        />

        <TextInputMask
          customTextInput={InputHelper}
          customTextInputProps={{label: 'Harga'}}
          placeholder='Rp 300.000'
          returnKeyType='next'
          type='money'
          options={{precision: 0, delimiter: '.', unit: 'Rp '}}
          value={inputData.servicePrice.toString()}
          style={{flex: 1}}
          includeRawValueInChangeText
          onChangeText={(maskVal, rawVal) => {
            dispatchInputData({servicePrice: _.parseInt(rawVal || '0')});
          }}
          onSubmitEditing={() => notesFieldRef.current?.focus()}
          refInput={(refInput) => {
            servicePriceFieldRef.current = refInput;
          }}
        />
      </View>

      <InputHelper
        label='Catatan'
        placeholder='Polanya huruf Z'
        multiline
        value={inputData.notes}
        onChangeText={(text) => dispatchInputData({notes: text})}
        ref={notesFieldRef}
      />
    </View>
  );
});

export default FowardedThirdColumnInputs;
