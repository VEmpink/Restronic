import React from 'react';
import {Text} from '@ui-kitten/components';

const TextComponent = props => (
  <Text
    {...props}
    appearance={props.hint ? 'hint' : 'default'}
    style={{
      fontSize: props.size || 16,
      fontWeight: props.bold ? 'bold' : 'normal',
      textAlign: props.align || 'left',
      ...props.style,
    }}
  />
);

export default TextComponent;
