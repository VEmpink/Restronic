import React from 'react';
import {StyleProp, TextStyle} from 'react-native';

import {Text, TextProps} from '@ui-kitten/components';

type TextHelperProps = TextProps & {
  size?: number;
  bold?: boolean;
  hint?: boolean;
  align?: 'center' | 'left' | 'auto' | 'right' | 'justify';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

function TextHelper(props: TextHelperProps): React.ReactElement {
  const {size, hint, bold, align, style, children} = props;

  return (
    <Text
      {...props}
      appearance={hint ? 'hint' : 'default'}
      style={[
        {
          fontSize: size,
          fontWeight: bold ? 'bold' : 'normal',
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

TextHelper.defaultProps = {
  size: 16,
  bold: false,
  hint: false,
  align: 'left',
  style: {},
};

export default TextHelper;
