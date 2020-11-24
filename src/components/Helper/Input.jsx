import React, {forwardRef} from 'react';
import {Input} from '@ui-kitten/components';

const InputComponent = forwardRef((props, ref) => {
  return (
    <Input
      {...props}
      textStyle={{borderWidth: 0, marginVertical: 0}}
      ref={ref}
    />
  );
});

export default InputComponent;
