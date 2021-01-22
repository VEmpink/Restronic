import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleProp, useWindowDimensions, View, ViewStyle} from 'react-native';

import {Layout} from '@ui-kitten/components';
import Modal from 'react-native-modal';

type ModalHelperProps = {
  disablePressOutside?: boolean;
  contentContrainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export type ModalHelperMethods = {
  show: () => void;
  hide: () => void;
};

/**
 * `react-native-modal`
 */
const FowardedModalHelper = forwardRef(function ModalHelper(
  props: ModalHelperProps,
  ref: ForwardedRef<ModalHelperMethods>,
) {
  const [visible, setVisible] = useState(false);
  const {width, height} = useWindowDimensions();

  useImperativeHandle(
    ref,
    () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [],
  );

  return (
    <Modal
      isVisible={visible}
      deviceWidth={width}
      deviceHeight={height}
      backdropColor='rgb(0, 0, 0)'
      backdropOpacity={0.56}
      useNativeDriver
      animationIn='fadeIn'
      animationOut='fadeOut'
      animationInTiming={120}
      animationOutTiming={120}
      backdropTransitionInTiming={120}
      backdropTransitionOutTiming={120}
      hideModalContentWhileAnimating
      onBackdropPress={() => {
        if (!props.disablePressOutside) setVisible(false);
      }}
      onBackButtonPress={() => {
        if (!props.disablePressOutside) setVisible(false);
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Layout
          style={[
            {
              borderRadius: 4,
            },
            props.contentContrainerStyle,
          ]}
        >
          {props.children}
        </Layout>
      </View>
    </Modal>
  );
});

FowardedModalHelper.defaultProps = {
  disablePressOutside: false,
  contentContrainerStyle: {},
};

export default FowardedModalHelper;
