import React, {useContext, useRef} from 'react';
import {View} from 'react-native';
import {Button, Icon} from '@ui-kitten/components';
import {Text, ModalProgress} from '../../Helper';
import {RealmContext} from '../../../contexts';
import _ from 'lodash';
import util from '../../../utils';

const RestoreDatabaseButton = props => {
  const {Realm} = useContext(RealmContext);
  const ModalProgress_Ref = useRef();

  return (
    <>
      <Text size={14} hint>
        Pulihkan data lama Anda termasuk data pengguna dan data pelanggan.
      </Text>

      <View style={{alignItems: 'flex-start', marginTop: 8}}>
        <Button
          size='small'
          accessoryLeft={props => <Icon {...props} name='hard-drive-outline' />}
          onPress={async () => {
            util.showRestoreDataDialog({
              Realm,
              handlePress: () => {
                ModalProgress_Ref.current.show();
              },
              onSuccess: () => {
                ModalProgress_Ref.current.hide();
              },
              onFinally: () => {
                ModalProgress_Ref.current.hide();
              },
            });
          }}
        >
          Pulihkan Data Lama
        </Button>
      </View>

      <ModalProgress ref={ModalProgress_Ref} />
    </>
  );
};

export default RestoreDatabaseButton;
