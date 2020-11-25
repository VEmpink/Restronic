import React, {useContext, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {Button, Icon} from '@ui-kitten/components';
import {Text, ModalProgress} from '../../Helper';
import {RealmContext} from '../../../contexts';
import {useRealmObjects} from '../../../hooks';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import _ from 'lodash';
import util from '../../../utils';

const fs = RNFetchBlob.fs;

const BackupDatabaseButton = props => {
  const {Realm} = useContext(RealmContext);
  const user = useRealmObjects('user')[0];
  const [realmFileSize, setRealmFileSize] = useState('');
  const ModalProgress_Ref = useRef();

  useEffect(() => {
    (async () => {
      try {
        const realmFileStat = await fs.stat(
          fs.dirs.DocumentDir + '/restronic.realm',
        );

        const getMB = realmFileStat.size / (1024 * 1024);
        const getKB = realmFileStat.size / 1024;
        setRealmFileSize(
          getMB >= 0.1 ? _.floor(getMB, 2) + 'MB' : _.ceil(getKB, 2) + 'KB',
        );
      } catch (error) {}
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
          accessoryLeft={props => (
            <Icon {...props} name='cloud-upload-outline' />
          )}
          onPress={async () => {
            ModalProgress_Ref.current.show();
            await util.backupDatabase(Realm, percent => {
              ModalProgress_Ref.current.setProgress(_.floor(percent, 1));
            });

            /**
             * Executed too fast, so I use this method
             */
            setTimeout(() => {
              ModalProgress_Ref.current.hide();
            }, 128);
          }}
        >
          Cadangkan
        </Button>
      </View>

      <ModalProgress ref={ModalProgress_Ref} />

      <Text size={14} hint style={{marginBottom: 8}}>
        Ukuran file Database: {realmFileSize}
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
        {fs.dirs.SDCardDir}/Backups
      </Text>
    </>
  );
};

export default BackupDatabaseButton;
