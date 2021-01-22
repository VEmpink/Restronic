import React from 'react';
import {View} from 'react-native';

import {Text} from '../../Helper';

import BackupDatabaseButton from './BackupDatabaseButton';
import GoogleAccountInfoShowcase from './GoogleAccountInfoShowcase';
import RestoreDatabaseButton from './RestoreDatabaseButton';
import SelectAutoBackupTime from './SelectAutoBackupTime';
import ToogleDarkModeButton from './ToogleDarkModeButton';

function ApplicationSettings(): React.ReactElement {
  return (
    <>
      <ToogleDarkModeButton />

      <Text bold hint>
        Cadangkan data Aplikasi
      </Text>
      <View style={{paddingLeft: 24}}>
        <BackupDatabaseButton />
        <SelectAutoBackupTime />
        <GoogleAccountInfoShowcase />
      </View>

      <Text bold hint style={{marginVertical: 8}}>
        Pulihkan data Aplikasi
      </Text>
      <View style={{paddingLeft: 24}}>
        <RestoreDatabaseButton />
      </View>
    </>
  );
}

export default ApplicationSettings;
