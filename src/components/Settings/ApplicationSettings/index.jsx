import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from '../../Helper';

import ToogleDarkModeButton from './ToogleDarkModeButton';
import BackupDatabaseButton from './BackupDatabaseButton';
import SelectAutoBackupTime from './SelectAutoBackupTime';
import GoogleAccountInfoShowcase from './GoogleAccountInfoShowcase';
import RestoreDatabaseButton from './RestoreDatabaseButton';

const ApplicationSettings = props => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
    </ScrollView>
  );
};

export default ApplicationSettings;
