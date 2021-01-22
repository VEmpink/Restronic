import React, {useContext, useRef} from 'react';
import {View} from 'react-native';

import {Button, Icon} from '@ui-kitten/components';

import {RealmContext} from '../../../context';
import util from '../../../utils';
import {Text, ModalProgress} from '../../Helper';
import {ModalHelperMethods} from '../../Helper/Modal';

function RestoreDatabaseButton(): React.ReactElement {
  const {Realm} = useContext(RealmContext);
  const modalProgressRef = useRef<ModalHelperMethods>(null);

  return (
    <>
      <Text size={14} hint>
        Pulihkan data lama Anda termasuk data pengguna dan data pelanggan.
      </Text>

      <View style={{alignItems: 'flex-start', marginTop: 8}}>
        <Button
          size='small'
          accessoryLeft={(props) => (
            <Icon {...props} name='hard-drive-outline' />
          )}
          onPress={async () => {
            util.showRestoreDataDialog({
              Realm,
              handlePress: () => {
                modalProgressRef.current?.show();
              },
              onSuccess: () => {
                modalProgressRef.current?.hide();
              },
              onFinally: () => {
                modalProgressRef.current?.hide();
              },
            });
          }}
        >
          Pulihkan Data Lama
        </Button>
      </View>

      <ModalProgress ref={modalProgressRef} />
    </>
  );
}

export default RestoreDatabaseButton;
