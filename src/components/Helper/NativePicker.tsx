import React, {useContext} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {PickerProps} from '@react-native-picker/picker/typings/Picker';

import {ThemeContext} from '../../context';

type NativePickerProps = PickerProps & {
  renderItems: {label: string; value: number}[];
  parentStyle?: StyleProp<ViewStyle>;
};

/**
 * `'@react-native-picker/picker'`
 */
function NativePicker(props: NativePickerProps): React.ReactElement {
  const {parentStyle, renderItems} = props;
  const {themeMode} = useContext(ThemeContext);

  return (
    <View
      style={[
        {
          backgroundColor: themeMode === 'light' ? '#f7f9fc' : '#1a2138',
          borderWidth: 1,
          borderColor: themeMode === 'light' ? '#e4e9f2' : '#101426',
          borderRadius: 4,
        },
        parentStyle,
      ]}
    >
      <Picker
        style={{height: 32, color: themeMode === 'light' ? '#222b45' : '#fff'}}
        {...props}
      >
        {renderItems.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

NativePicker.defaultProps = {
  parentStyle: {},
};

export default NativePicker;
