import React, {ForwardedRef, forwardRef} from 'react';

import {Input, InputProps} from '@ui-kitten/components';

const FowardedInputHelper = forwardRef(function InputHelper(
  props: InputProps,
  ref: ForwardedRef<Input>,
) {
  return (
    <Input
      {...props}
      textStyle={{borderWidth: 0, marginVertical: 0}}
      ref={ref}
    />
  );
});

export default FowardedInputHelper;
