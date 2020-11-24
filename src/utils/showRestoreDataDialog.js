import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FilePicker from 'react-native-document-picker';
import REALM from 'realm';
import realmSchema from '../schemas/realm.schema';
import GoogleDrive from './GoogleDrive';
import _ from 'lodash';
import snackbar from './snackbar';

const fs = RNFetchBlob.fs;

/**
 *
 * @param {Realm} currentRealm
 * @param {string} oldRealmFilePath
 * @param {Function} cb Success callback
 */
const handleRestoreData = async (currentRealm, oldRealmFilePath, cb) => {
  try {
    /**
     * Open old Realm file
     */
    const oldRealm = await REALM.open({
      path: oldRealmFilePath,
      schema: realmSchema,
    });

    /**
     * Get all data from the old Realm
     */
    const oldUserData = oldRealm.objects('user').toJSON()[0];
    const oldCustomers = oldRealm.objects('customers').toJSON();
    const oldNotifications = oldRealm.objects('notifications').toJSON();

    /**
     * Get all data from the current Realm
     */
    const currentUserData = currentRealm.objects('user');
    const currentCustomers = currentRealm.objects('customers');
    const currentNotifications = currentRealm.objects('notifications');

    /**
     * Get all Customer Ids from the current Realm
     */
    let listCurrentCustomerIds = [];
    if (!currentCustomers.isEmpty()) {
      currentCustomers.forEach(currentCustomer =>
        listCurrentCustomerIds.push(currentCustomer._id),
      );
    }

    /**
     * Get all Notification Ids from the current Realm
     */
    let listCurrentNotificationIds = [];
    if (!currentNotifications.isEmpty()) {
      currentNotifications.forEach(notif =>
        listCurrentNotificationIds.push(notif._id),
      );
    }

    currentRealm.write(() => {
      if (currentUserData.isEmpty()) {
        /**
         * Insert the old user data if the current user data
         * is Empty
         */
        currentRealm.create('user', oldUserData);
      } else {
        /**
         * Do Not insert the old user data If the current user data
         * is the same Id with the old user data
         */
        if (currentUserData[0]._id !== oldUserData._id) {
          currentRealm.create('user', oldUserData);

          /**
           * In here i passing "[1]" or index 1 because the "oldUserData"
           * will be the "[0]" or index 0
           */
          currentRealm.delete(currentUserData[1]);
        }
      }

      if (oldCustomers.length > 0) {
        oldCustomers.forEach(oldCustomer => {
          /**
           * Insert every Customer data If the Id is not available in
           * "listCurrentCustomerIds"
           */
          if (!listCurrentCustomerIds.includes(oldCustomer._id)) {
            currentRealm.create('customers', oldCustomer);
          }
        });
      }

      if (oldNotifications.length > 0) {
        oldNotifications.forEach(oldNotif => {
          /**
           * Insert every Notification data If the Id is not available in
           * "listCurrentNotificationIds"
           */
          if (!listCurrentNotificationIds.includes(oldNotif._id)) {
            currentRealm.create('notifications', oldNotif);
          }
        });
      }

      /**
       * Close the old Realm
       */
      oldRealm.close();
      snackbar.show('success', 'Berhasil memulihkan Database!');

      /**
       * Response success callback
       */
      cb?.();
    });
  } catch (error) {
    snackbar.show('error', 'Gagal memulihkan Database!');
  }

  /**
   * Optional. Clear cache from the old Realm
   */
  try {
    const splitPath = oldRealmFilePath.split('/');
    const oldRealmFileName = _.last(splitPath);
    const oldRealmDirPath = _.dropRight(splitPath).join('/');
    const oldRealmCacheFiles = await fs.lstat(oldRealmDirPath);

    oldRealmCacheFiles.forEach(async cache => {
      const oldRealmFileNameWithoutEXT = oldRealmFileName.replace('.realm', '');

      if (
        cache.filename.includes(oldRealmFileNameWithoutEXT) &&
        cache.filename !== oldRealmFileName
      ) {
        await fs.unlink(`${oldRealmDirPath}/${cache.filename}`);
      }
    });
  } catch (error) {
    snackbar.show(
      'warning',
      'Kesalahan membersihkan sampah dari file cadangan!',
    );
  }
};

/**
 * A Dialog for Restoring Application Database, a user can choose between
 * Restore Data from Google Drive or Restore Data from Local Storage
 *
 * Dialog use `Alert` from `react-native`
 * @param {object} config
 * @param {Realm} config.Realm
 * @param {() => void} config.handlePress On press some button
 * @param {() => void} config.onSuccess Success callback
 * @param {() => void} config.onFinally After all code has been executed. Error is ignored
 */
const showRestoreDataDialog = ({Realm, handlePress, onSuccess, onFinally}) => {
  Alert.alert(
    'Pulihkan data lama?',
    'Dimana lokasi data lama Anda disimpan?',
    [
      {
        text: 'Google Drive',
        onPress: async () => {
          handlePress?.();

          try {
            const {tokens} = await GoogleDrive.connect();

            if (tokens) {
              const files = await GoogleDrive.getFiles(tokens.accessToken);

              if (files && files.length) {
                const fileId = files[0].id;
                const fileName = files[0].name;
                const dirPath = fs.dirs.SDCardDir + '/Backups';
                const filePath = `${dirPath}/${fileName}`;

                /**
                 * Always make sure a Directory Path is available
                 */
                try {
                  await fs.mkdir(dirPath);
                } catch (error) {}

                const {data} = await RNFetchBlob.config({
                  timeout: 7000,
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    title: 'Sedang memulihkan Database...',
                    description: 'Mohon tunggu...',
                    notification: true,
                    path: filePath,
                    mime: 'application/octet-stream',
                  },
                }).fetch(
                  'GET',
                  `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                  {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                );

                if (data) {
                  await handleRestoreData(Realm, data, () => {
                    /**
                     * Response success callback
                     */
                    onSuccess?.();
                  });
                } else {
                  throw new Error('Android Download Manager has been failed');
                }
              } else {
                snackbar.show(
                  'warning',
                  'Tidak ada data yang telah dicadangkan ke akun Google Drive Anda!',
                );
              }
            } else {
              throw new Error('Failed connectiong to Google!');
            }
          } catch (error) {
            snackbar.show(
              'error',
              'Gagal memulihkan Database dari Google Drive!',
            );
          }

          onFinally?.();
        },
      },

      {
        text: 'Local Storage',
        onPress: async () => {
          handlePress?.();

          try {
            const selectedFile = await FilePicker.pick({
              type: ['application/*'],
            });
            const selectedFilePath = selectedFile.uri.replace('file://', '');
            const selectedFileExt = _.last(selectedFilePath.split('.'));

            if (selectedFileExt === 'realm') {
              await handleRestoreData(Realm, selectedFilePath, () => {
                /**
                 * Response success callback
                 */
                onSuccess?.();
              });
            } else {
              snackbar.show('error', 'File yang dipilih tidak valid!');
            }
          } catch (error) {
            if (error.code !== 'DOCUMENT_PICKER_CANCELED') {
              snackbar.show('error', 'Gagal membuka file cadangan!');
            }
          }

          onFinally?.();
        },
      },
    ],
    {cancelable: true},
  );
};

export default showRestoreDataDialog;
