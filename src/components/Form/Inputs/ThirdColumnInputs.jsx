import React, {forwardRef, useImperativeHandle, useState, useRef} from 'react';
import {View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {Input} from '../../Helper';

const initialInputData = {
  servicePrice: 0,
  serviceDownPayment: 0,
  notes: '',
};

const ThirdColumnInputs = forwardRef((props, ref) => {
  const [inputData, setInputData] = useState(initialInputData);

  const servicePriceField = useRef();
  const serviceDownPaymentField = useRef();
  const notesField = useRef();

  /**
   * @param {initialInputData} newState
   */
  const dispatchInputData = newState =>
    setInputData(prevState => ({...prevState, ...newState}));

  useImperativeHandle(ref, () => ({
    setInputData: data => dispatchInputData(data),
    getInputData: () => inputData,
    focus: () => serviceDownPaymentField.current.focus(),
    resetValues: () => dispatchInputData(initialInputData),
  }));

  return (
    <View style={{marginBottom: 12}}>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <TextInputMask
          customTextInput={Input}
          label='DP/Tanda jadi'
          placeholder='Rp 100.000'
          returnKeyType='next'
          type={'money'}
          options={{precision: 0, delimiter: '.', unit: 'Rp '}}
          value={inputData.serviceDownPayment}
          style={{flex: 1, marginRight: 8}}
          includeRawValueInChangeText={true}
          onChangeText={(maskVal, rawVal) =>
            dispatchInputData({serviceDownPayment: rawVal})
          }
          onSubmitEditing={() => servicePriceField.current.focus()}
          refInput={ref => (serviceDownPaymentField.current = ref)}
        />

        <TextInputMask
          customTextInput={Input}
          label='Harga'
          placeholder='Rp 300.000'
          returnKeyType='next'
          type='money'
          options={{precision: 0, delimiter: '.', unit: 'Rp '}}
          value={inputData.servicePrice}
          style={{flex: 1}}
          includeRawValueInChangeText={true}
          onChangeText={(maskVal, rawVal) =>
            dispatchInputData({servicePrice: rawVal})
          }
          onSubmitEditing={() => notesField.current.focus()}
          refInput={ref => (servicePriceField.current = ref)}
        />
      </View>

      <Input
        label='Catatan'
        placeholder='Polanya huruf Z'
        multiline={true}
        value={inputData.notes}
        onChangeText={text => dispatchInputData({notes: text})}
        ref={notesField}
      />
    </View>
  );
});

export default ThirdColumnInputs;
