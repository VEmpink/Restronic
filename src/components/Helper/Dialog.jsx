import React, {forwardRef, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {Button} from '@ui-kitten/components';
import Text from './Text';
import Icon from './IconHelper';
import Modal from './Modal';

/**
 * Usage:
 * ```jsx
 * <Dialog
 *   message={String}
 *   status={String} // Valid value is: "info", "success", "danger", "warning"
 *   hideCancelButton={Boolean}
 *   textCancel={String}
 *   textConfirm={String}
 *   onPressOutside={Function}
 *   onCancel={Function}
 *   onConfirm={Function}
 * />
 * ```
 */
const Dialog = forwardRef((props, ref) => {
  const {status} = props;
  let Modal_ref;

  useImperativeHandle(ref, () => ({
    show: () => Modal_ref.show(),
    hide: () => Modal_ref.hide(),
  }));

  return (
    <Modal onModalHide={props.onPressOutside} ref={ref => (Modal_ref = ref)}>
      <View style={{padding: 24}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            style={{marginRight: 4}}
            name={
              status === 'info'
                ? 'info-outline'
                : status === 'success'
                ? 'checkmark-square-outline'
                : status === 'warning'
                ? 'alert-circle-outline'
                : 'alert-triangle-outline'
            }
            color={
              status === 'info'
                ? '#0095ff'
                : status === 'success'
                ? '#00e096'
                : status === 'warning'
                ? '#ffaa00'
                : '#ff3d71'
            }
          />
          <Text
            size={24}
            status={status || 'danger'}
            style={{marginBottom: 4}}
            bold
          >
            {status === 'info'
              ? 'Info!'
              : status === 'success'
              ? 'Yay!'
              : status === 'warning'
              ? 'Hmmm?'
              : 'Whoops!'}
          </Text>
        </View>

        <Text hint>{props.message || 'Example message'}</Text>

        <View style={{flexDirection: 'row', marginTop: 24}}>
          {props.hideCancelButton ? (
            <View></View>
          ) : (
            <Button
              size='small'
              status='basic'
              appearance='outline'
              style={{marginRight: 4}}
              onPress={() => {
                Modal_ref.hide();
                props.onCancel?.();
              }}
            >
              {props.textCancel || 'Tutup'}
            </Button>
          )}

          <Button
            size='small'
            style={{marginLeft: 4}}
            onPress={() => {
              Modal_ref.hide();
              props.onConfirm?.();
            }}
            status={status || 'danger'}
          >
            {props.textConfirm || 'Konfirmasi'}
          </Button>
        </View>
      </View>
    </Modal>
  );
});

export default Dialog;
