import React, {useContext} from 'react';
import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ThemeContext} from '../../contexts';

/**
 * `'@react-native-picker/picker'`
 *
 * props `renderItems` and `selectedValue` is required
 * @example
 * <NativePicker
 *   renderItems={[
 *     {label: 'SomeLabel', value: 'SomeValue'}
 *   ]}
 *   selectedValue='SomeValue'
 *   parentStyle={{}} // <ViewStyle>
 * />
 */
const NativePicker = props => {
  const {themeMode} = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: themeMode === 'light' ? '#f7f9fc' : '#1a2138',
        borderWidth: 1,
        borderColor: themeMode === 'light' ? '#e4e9f2' : '#101426',
        borderRadius: 4,
        ...props.parentStyle,
      }}
    >
      <Picker
        style={{height: 32, color: themeMode === 'light' ? '#222b45' : '#fff'}}
        {...props}
      >
        {props.renderItems.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

export default NativePicker;
