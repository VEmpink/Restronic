import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Layout} from '@ui-kitten/components';
import Modal from 'react-native-modal';

/**
 * `react-native-modal`
 *
 * Methods:
 * * `.show()` Show a Modal
 * * `.hide()` Hide a Modal
 *
 * Props:
 * * `contentContrainerStyle`
 * * `disablePressOutside`
 */
const ModalHelper = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const {width, height} = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
  }));

  return (
    <Modal
      isVisible={visible}
      deviceWidth={width}
      deviceHeight={height}
      backdropColor={'rgb(0, 0, 0)'}
      backdropOpacity={0.56}
      useNativeDriver={true}
      animationIn='fadeIn'
      animationOut='fadeOut'
      animationInTiming={120}
      animationOutTiming={120}
      backdropTransitionInTiming={120}
      backdropTransitionOutTiming={120}
      hideModalContentWhileAnimating={true}
      onBackdropPress={() => {
        !props.disablePressOutside && setVisible(false);
      }}
      onBackButtonPress={() => {
        !props.disablePressOutside && setVisible(false);
      }}
      {...props}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Layout
          style={{
            borderRadius: 4,
            ...props.contentContrainerStyle,
          }}
        >
          {props.children}
        </Layout>
      </View>
    </Modal>
  );
});

export default ModalHelper;
