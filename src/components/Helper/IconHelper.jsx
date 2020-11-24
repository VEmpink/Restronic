import React, {memo, useContext} from 'react';
import {TouchableHighlight} from 'react-native';
import {Icon} from '@ui-kitten/components';
import {ThemeContext} from '../../contexts';

/**
 * A `Icon` from `@ui-kitten/components`
 *
 * All props is optional
 * @example
 * <IconHelper
 *   name={string}
 *   size={number}
 *   color={string}
 *   underlayColor={string} // TouchableHighlight "underlayColor" props
 *   style={{}} // <StyleProp>
 *   onPress={() => {}}
 * />
 */
const IconHelper = memo(props => {
  const {size, color, onPress} = props;
  const {themeMode} = useContext(ThemeContext);

  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={1}
      underlayColor={props.underlayColor || 'rgba(143, 155, 179, 0.24)'}
      style={{padding: onPress ? 4 : 0, borderRadius: 4}}
    >
      <Icon
        name={props.name || 'question-mark-outline'}
        style={{
          width: size || 24,
          height: size || 24,
          tintColor: color ? color : themeMode === 'light' ? '#092c4c' : '#fff',
          ...props.style,
        }}
      />
    </TouchableHighlight>
  );
});

export default IconHelper;
