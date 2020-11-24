import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import snackbar from './snackbar';

/**
 * Requesting a User for connection his Google Account and then Get the
 * basic info from that Account also Get the `accessToken` that will
 * be used for accessing his Google Drive.
 */
const connect = async () => {
  try {
    const hasSignIn = await GoogleSignin.isSignedIn();

    if (!hasSignIn) {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
    }

    const userInfo = await GoogleSignin.getCurrentUser();
    let tokens;

    /**
     * BUG unhandled promise rejection so I use nested try catch like this
     */
    try {
      tokens = await GoogleSignin.getTokens();
    } catch (error) {
      snackbar.show(
        'error',
        'Gagal terhubung ke server Google, ' +
          'mohon periksa jaringan internet!',
      );
    }

    return {userInfo, tokens};
  } catch (error) {
    switch (error.code) {
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        snackbar.show('error', 'Layanan Google Play tidak tersedia!');
        break;

      case statusCodes.IN_PROGRESS:
        snackbar.show(
          'warning',
          'Sedang menghubungkan ke server Google, mohon tunggu...!',
        );
        break;

      default:
        snackbar.show(
          'error',
          'Gagal terhubung ke server Google, ' +
            'mohon periksa jaringan internet!',
        );
        break;
    }
  }
};

/**
 * @param {string} accessToken
 * @param {'drive' | 'appDataFolder' | 'photos'} spaces
 * @returns {Promise<[{
 *  id: string,
 *  name: string,
 *  mimeType: string,
 *  kind: string
 * }]>} List file
 */
const getFiles = async (accessToken, spaces = 'appDataFolder') => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=${spaces}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const list = await response.json();

    if (!list.files) {
      snackbar.show('error', 'Gagal menghubungkan ke server Google!');
    }

    return list.files;
  } catch (error) {
    snackbar.show('error', 'Gagal menghubungkan ke server Google!');
  }
};

/**
 * For now this method is optional so, I didn't add anything inside
 * a `catch` block
 * @param {string} accessToken
 * @param {string} fileId
 */
const removeFile = async (accessToken, fileId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
  } catch (error) {}
};

export default {
  connect,
  getFiles,
  removeFile,
};
