import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Modal} from '@ui-kitten/components';
import Text from './Text';

const ModalComponent = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
  }));

  return (
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, .56)'}}
    >
      {props.children}
    </Modal>
  );
});

/**
 * Methods:
 * * `.show()`
 * * `.hide()`
 * * `.setProgress(number)`
 */
const ModalProgress = forwardRef((props, ref) => {
  const [progress, setProgress] = useState(0);
  const Modal_Ref = useRef();

  useImperativeHandle(ref, () => ({
    show: () => Modal_Ref.current.show(),
    hide: () => {
      Modal_Ref.current.hide();
      setProgress(0);
    },
    setProgress: n => setProgress(n),
  }));

  return (
    <ModalComponent ref={Modal_Ref}>
      <View>
        <ActivityIndicator color='#FFF' size='large' />
        <Text style={{color: '#FFF', marginTop: 8}}>
          {progress ? 'Data terkirim ' + progress + '%' : 'Mohon tunggu...'}
        </Text>
      </View>
    </ModalComponent>
  );
});

export default ModalProgress;
