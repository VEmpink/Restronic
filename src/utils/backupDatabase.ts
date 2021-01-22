import {GoogleSignin} from '@react-native-community/google-signin';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

import {Userdata} from '../types';

import GoogleDrive from './googleDrive';
import snackbar from './snackbar';

const {fs} = RNFetchBlob;

type BackupOptions = {
  realm: Realm;
  dirStorageLocation?: string;
  onProgress: (progress: number) => void;
};

/**
 * Backup database to device storage and or to
 * Google Drive if user goggle account has been connected
 */
async function backup({
  realm,
  dirStorageLocation = `${fs.dirs.SDCardDir}/Backups`,
  onProgress,
}: BackupOptions): Promise<void> {
  try {
    const D = Date.now();
    const fileName =
      `restronic.backup.date${moment(D).format('DD-MM-YYYY')}` +
      `.time${moment(D).format('HH-mm')}.${D}.realm`;
    const pathLocation = `${dirStorageLocation}/${fileName}`;

    /**
     * Ambil data pengguna dan ubah tanggal terakhir kali pengguna mencadangkan
     * database-nya
     */
    const user = realm.objects<Userdata>('user')[0];

    /**
     * Selalu pastikan directory atau folder tersedia untuk mencegah
     * Error Directory Not Found
     */
    try {
      await fs.mkdir(dirStorageLocation);
    } catch (error) {}

    /**
     * Cadangkan secara local maka file akan disimpan ke "pathFile"
     * oleh si Realm
     */
    realm.writeCopyTo(pathLocation);

    try {
      /**
       * Upload Realm yang telah dicadangkan secara local ke Google Drive
       * jika Akun Google pengguna sudah terhubung dengan Aplikasi
       */
      const hasSignIn = await GoogleSignin.isSignedIn();
      if (hasSignIn) {
        const {accessToken} = await GoogleSignin.getTokens();

        /**
         * File Realm berekstensi ".realm", yang bukan termasuk
         * valid "mime type"
         */
        const noneMime = 'application/octet-stream';

        /**
         * "uploadType=resumable" mendukung pengunggahan file yang melebihi 5MB,
         * sebelum mengunggah saya harus mendapatkan "URL" khususnya terlebih dahulu
         * yang nantinya akan digunakan untuk mengunggah file saya.
         */
        const requestUpload = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json; charset=UTF-8',
              'X-Upload-Content-Type': noneMime,
            },
            body: JSON.stringify({
              name: fileName,
              mimeType: noneMime,
              description: 'Restronic Database',
              parents: ['appDataFolder'],
            }),
          },
        );

        if (requestUpload.ok) {
          /**
           * Ambil "URL" khususnya, dan "URL" ini akan digunakan
           * untuk mengunggah file.
           */
          const uploadURL = requestUpload.headers.get('location');

          /**
           * Terakhir unggah file dengan menggunakan module `rn-fetch-blob`
           */
          const uploadData = await RNFetchBlob.config({timeout: 7000})
            .fetch(
              'PUT',
              uploadURL || '',
              {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream',
              },
              RNFetchBlob.wrap(pathLocation),
            )
            .uploadProgress((bytesWritten, totalFileSize) => {
              const percentage = (bytesWritten / totalFileSize) * 100;
              onProgress(percentage);
            });

          const {respInfo} = uploadData;

          if (respInfo.status >= 200 || respInfo.status < 300) {
            const currentUploadedFileId = uploadData.json().id;
            const exitingFiles = await GoogleDrive.getFiles(accessToken);

            /**
             * Remove all exiting files except the current Uploaded file.
             */
            if (exitingFiles && exitingFiles.length) {
              exitingFiles.forEach(async (file, i) => {
                if (exitingFiles[i].id !== currentUploadedFileId) {
                  await GoogleDrive.removeFile(accessToken, exitingFiles[i].id);
                }
              });
            }

            /**
             * Ubah tanggal terakhir kali pengguna mencadangkan database-nya ke
             * Local Storage dan ke Google Drive
             */
            realm.write(() => {
              user.lastLocalBackupAt = Date.now();
              user.lastCloudBackupAt = Date.now();
            });

            snackbar.show(
              'success',
              'Database telah dicadangkan ke Local Storage dan ke Google Drive!',
            );
          } else {
            throw new Error('Upload data failed!');
          }
        } else {
          throw new Error('Request upload failed!');
        }
      } else {
        throw new Error('Google Account not available!');
      }
    } catch (error) {
      /**
       * Ubah tanggal terakhir kali pengguna mencadangkan database-nya secara Local
       */
      realm.write(() => {
        user.lastLocalBackupAt = Date.now();
      });

      snackbar.show('warning', 'Database hanya dicadangkan ke Local Storage!');
    }
  } catch (error) {
    snackbar.show('error', 'Gagal mencadangkan Database!');
  }
}

export default backup;
