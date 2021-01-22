import React, {memo, useContext} from 'react';
import {OpaqueColorValue, TouchableHighlight} from 'react-native';

import {Icon} from '@ui-kitten/components';

import {ThemeContext} from '../../context';

type IconHelperProps = {
  name?: string;
  size?: number;
  color?: string;
  underlayColor?: string | typeof OpaqueColorValue;
  style?: Record<string, unknown>;
  onPress?: () => void;
};

function IconHelper(props: IconHelperProps): React.ReactElement {
  const {name, size, color, underlayColor, style, onPress} = props;
  const {themeMode} = useContext(ThemeContext);

  const colorConditional = () => {
    if (typeof color === 'string') {
      return color;
    }

    if (themeMode === 'light') {
      return '#092C4C';
    }

    return '#FFF';
  };

  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={1}
      underlayColor={underlayColor}
      style={{padding: onPress ? 4 : 0, borderRadius: 4}}
    >
      <Icon
        name={name}
        style={{
          width: size || 24,
          height: size || 24,
          tintColor: colorConditional(),
          ...style,
        }}
      />
    </TouchableHighlight>
  );
}

IconHelper.defaultProps = {
  name: 'question-mark-outline',
  size: 24,
  color: undefined,
  underlayColor: 'rgba(143, 155, 179, 0.24)',
  style: undefined,
  onPress: undefined,
};

/**
 * A `Icon` from `@ui-kitten/components`
 *
 */
const MemoizedIconHelper = memo(IconHelper, () => true);

export default MemoizedIconHelper;
