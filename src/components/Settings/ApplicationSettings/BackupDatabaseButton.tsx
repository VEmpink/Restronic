import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';

import {Button, Icon} from '@ui-kitten/components';
import _ from 'lodash';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

import {RealmContext} from '../../../context';
import {useRealmObjects} from '../../../hooks';
import {Userdata} from '../../../types';
import util from '../../../utils';
import {Text, ModalProgress} from '../../Helper';
import {ModalHelperMethods} from '../../Helper/Modal';

const {fs} = RNFetchBlob;

function BackupDatabaseButton(): React.ReactElement {
  const {Realm} = useContext(RealmContext);
  const user = useRealmObjects<Userdata>('user')[0];
  const [realmFileSize, setRealmFileSize] = useState('');
  const modalProgressRef = useRef<ModalHelperMethods>(null);

  useEffect(() => {
    (async () => {
      try {
        const realmFileStat = await fs.stat(
          `${fs.dirs.DocumentDir}/restronic.realm`,
        );

        const getMB = realmFileStat.size / (1024 * 1024);
        const getKB = realmFileStat.size / 1024;
        setRealmFileSize(
          getMB >= 0.1 ? `${_.floor(getMB, 2)} MB` : `${_.ceil(getKB, 2)} KB`,
        );
      } catch (error) {
        util.snackbar.show('error', `Error while getting file size`);
      }
    })();
  }, [user.lastLocalBackupAt]);

  return (
    <>
      <Text style={{marginVertical: 8}}>Secara manual</Text>
      <Text size={14} hint>
        {'Data yang ada di Aplikasi ini akan dicadangkan ' +
          'termasuk foto, data pengguna, dan data pelanggan'}
      </Text>

      <View style={{alignItems: 'flex-start', marginVertical: 8}}>
        <Button
          size='small'
          accessoryLeft={(props) => (
            <Icon {...props} name='cloud-upload-outline' />
          )}
          onPress={async () => {
            modalProgressRef.current?.show();
            await util.backupDatabase(Realm, (percent) => {
              modalProgressRef.current?.setProgress(_.floor(percent, 1));
            });

            /**
             * Executed too fast, so I use this method
             */
            setTimeout(() => {
              modalProgressRef.current?.hide();
            }, 128);
          }}
        >
          Cadangkan
        </Button>
      </View>

      <ModalProgress ref={modalProgressRef} />

      <Text size={14} hint style={{marginBottom: 8}}>
        Ukuran file Database:
        {realmFileSize}
      </Text>

      <Text size={14} hint>
        Terakhir kali dicadangkan secara lokal:
      </Text>
      <Text size={14} hint style={{marginBottom: 8}}>
        {user._id === user.lastLocalBackupAt
          ? 'Belum pernah'
          : moment(user.lastLocalBackupAt).format('dddd, DD/MM/YYYY, HH:mm')}
      </Text>

      <Text size={14} hint>
        Terakhir kali dicadangkan ke Google Drive:
      </Text>
      <Text size={14} hint style={{marginBottom: 8}}>
        {user._id === user.lastCloudBackupAt
          ? 'Belum pernah'
          : moment(user.lastCloudBackupAt).format('dddd, DD/MM/YYYY, HH:mm')}
      </Text>

      <Text size={14} hint>
        Lokasi Folder Penyimpanan:
      </Text>
      <Text size={14} hint>
        {fs.dirs.SDCardDir}
        /Backups
      </Text>
    </>
  );
}

export default BackupDatabaseButton;
