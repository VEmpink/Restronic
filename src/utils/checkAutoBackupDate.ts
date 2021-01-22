import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import RNFetchBlob from 'rn-fetch-blob';

import {Userdata} from '../types';

const {fs} = RNFetchBlob;

/**
 * Check if this time to auto backup
 */
async function checkAutoBackupDate(Realm: Realm): Promise<void> {
  const user = Realm.objects<Userdata>('user')[0];

  if (typeof user.autoBackupTime === 'number') {
    const autoBackupDate =
      user.autoBackupStartDate + user.autoBackupTime * 864e5;

    if (Date.now() >= autoBackupDate) {
      const D = Date.now();
      const dirPath = `${fs.dirs.SDCardDir}/Backups`;
      const fileName =
        `restronic.backup.date${moment(D).format('DD-MM-YYYY')}` +
        `.time${moment(D).format('HH-mm')}.${D}.realm`;
      const pathFile = `${dirPath}/${fileName}`;

      /**
       * Selalu pastikan directory atau folder tersedia untuk mencegah
       * Error Directory Not Found
       */
      try {
        await fs.mkdir(dirPath);
      } catch (error) {}

      /**
       * Cadangkan secara local maka file akan disimpan ke "pathFile"
       * oleh si Realm
       */
      Realm.writeCopyTo(pathFile);

      /**
       * Kirim notifikasi keberanda
       */
      Realm.write(() => {
        Realm.create('notifications', {
          _id: Date.now(),
          createdAt: Date.now(),
          name: 'backup',
          title: 'Berhasil mencadangkan data!',
          message: `Database berhasil dicadangkan secara otomatis ke Local Storage!`,
        });

        user.autoBackupStartDate = Date.now();
      });

      /**
       * Kirim notifikasi ke sistem OS
       */
      PushNotification.localNotification({
        channelId: 'com.vempink.restronic.notification.info',
        title: 'Restronic: Info!',
        message: `Database dicadangkan secara auto ke Local Storage!`,
        allowWhileIdle: false,
      });
    }
  }
}

export default checkAutoBackupDate;
