import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-community/google-signin';

import snackbar from './snackbar';

export type ResponseGoogleConnected = {
  userInfo?: User;
  tokens: {idToken: string; accessToken: string};
};

function handleConnectError(error: {code: unknown}): void {
  switch (error.code) {
    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      snackbar.show('error', 'Layanan Google Play tidak tersedia!');
      break;

    case statusCodes.SIGN_IN_CANCELLED:
      snackbar.show('warning', 'Anda membatalkannya!');
      break;

    case statusCodes.IN_PROGRESS:
      snackbar.show(
        'warning',
        'Sedang menghubungkan ke server Google, mohon tunggu...',
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

/**
 * Requesting a User for connecting his Google Account and then Get the
 * basic info from that Account also Get the `accessToken` that will
 * be used for accessing his Google Drive.
 */
async function connect(): Promise<ResponseGoogleConnected> {
  const hasSignIn = await GoogleSignin.isSignedIn();

  if (!hasSignIn) {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
  }

  const userInfo = await GoogleSignin.getCurrentUser();
  const tokens = await GoogleSignin.getTokens();

  return {userInfo: userInfo || undefined, tokens};
}

type ListFiles = {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
}[];

async function getFiles(
  accessToken: string,
  spaces: 'drive' | 'appDataFolder' | 'photos' = 'appDataFolder',
): Promise<ListFiles> {
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
}

async function removeFile(
  accessToken: string,
  fileId: string,
): Promise<Response> {
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
}

const googleDrive = {
  connect,
  handleConnectError,
  getFiles,
  removeFile,
};

export default googleDrive;
