import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from '@react-native-community/google-signin';
import {Avatar, Button} from '@ui-kitten/components';

import util from '../../../utils';
import {Text} from '../../Helper';

function GoogleAccountInfoShowcase(): React.ReactElement {
  const [googleUserInfo, setGoogleUserInfo] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const hasSignIn = await GoogleSignin.isSignedIn();

      if (hasSignIn) {
        const signInInfo = await GoogleSignin.getCurrentUser();
        setGoogleUserInfo(signInInfo);
      }
    })();
  }, []);

  return (
    <>
      <Text style={{marginTop: 8}}>
        {googleUserInfo
          ? 'Google Drive telah terhubung'
          : 'Hubungkan ke Google Drive'}
      </Text>

      {googleUserInfo && (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 12}}
        >
          <Avatar
            source={{
              uri: googleUserInfo.user.photo || undefined,
              cache: 'force-cache',
            }}
            style={{marginBottom: 8}}
          />
          <Text>{googleUserInfo.user.name || ''}</Text>
          <Text size={14} hint>
            {googleUserInfo.user.email}
          </Text>
          <Button
            size='small'
            style={{marginTop: 8}}
            onPress={async () => {
              await GoogleSignin.signOut();
              setGoogleUserInfo(null);
            }}
          >
            Nonaktifkan
          </Button>
        </View>
      )}

      <Text size={14} hint>
        {'Anda dapat menyimpan data cadangan ke Akun Google Drive Anda ' +
          'dan pastikan koneksi atau jaringan internet Anda stabil. '}
      </Text>

      {!googleUserInfo ? (
        <GoogleSigninButton
          style={{width: 192, height: 48, marginTop: 8}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            const resConnect = await util.GoogleDrive.connect();

            if (resConnect && resConnect.userInfo) {
              setGoogleUserInfo(resConnect.userInfo);
            }
          }}
        />
      ) : (
        <View />
      )}
    </>
  );
}

export default GoogleAccountInfoShowcase;
