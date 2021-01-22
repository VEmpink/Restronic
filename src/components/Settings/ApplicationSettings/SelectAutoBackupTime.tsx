import React, {useContext, useEffect, useState} from 'react';

import {RealmContext} from '../../../context';
import {useRealmObjects} from '../../../hooks';
import {Userdata} from '../../../types';
import {Text, NativePicker} from '../../Helper';

const menuAutoBackup = [
  {label: 'Nonaktif', value: null},
  {label: 'Setiap Hari', value: 1},
  {label: 'Setiap Minggu', value: 7},
  {label: 'Setiap Bulan', value: 30},
];

function SelectAutoBackupTime(): React.ReactElement {
  const {Realm} = useContext(RealmContext);
  const user = useRealmObjects<Userdata>('user')[0];
  const [autoBackupTime, setAutoBackupTime] = useState(user.autoBackupTime);

  useEffect(() => {
    if (autoBackupTime !== user.autoBackupTime) {
      setAutoBackupTime(user.autoBackupTime);
    }
  }, [user.autoBackupTime]);

  return (
    <>
      <Text style={{marginVertical: 8}}>Secara otomatis</Text>
      <Text size={14} hint>
        {'Data akan dicadangkan secara otomatis ketika ' +
          'Aplikasi dibuka, untuk mengaktifkannya pilih Jadwalnya dibawah ini:'}
      </Text>

      <NativePicker
        mode='dropdown'
        renderItems={menuAutoBackup}
        selectedValue={autoBackupTime}
        parentStyle={{marginTop: 8}}
        onValueChange={(v, i) => {
          Realm.write(() => {
            setAutoBackupTime(v);
            user.autoBackupStartDate = Date.now();
            user.autoBackupTime = v;
          });
        }}
      />
    </>
  );
}

export default SelectAutoBackupTime;
