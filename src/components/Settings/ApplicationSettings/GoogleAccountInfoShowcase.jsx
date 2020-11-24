import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Avatar, Button} from '@ui-kitten/components';
import {Text} from '../../Helper';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import util from '../../../utils';

const GoogleAccountInfoShowcase = props => {
  const [googleUserInfo, setGoogleUserInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const hasSignIn = await GoogleSignin.isSignedIn();

        if (hasSignIn) {
          const signInInfo = await GoogleSignin.getCurrentUser();
          setGoogleUserInfo(signInInfo);
        }
      } catch (error) {
        util.snackbar.show('error', 'Gagal terhubung ke Akun Google Anda!');
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
            source={{uri: googleUserInfo.user.photo, cache: 'force-cache'}}
            style={{marginBottom: 8}}
          />
          <Text>{googleUserInfo.user.name}</Text>
          <Text size={14} hint>
            {googleUserInfo.user.email}
          </Text>
          <Button
            size='small'
            style={{marginTop: 8}}
            onPress={async () => {
              try {
                await GoogleSignin.signOut();
                setGoogleUserInfo(null);
              } catch (error) {
                util.snackbar.show(
                  'error',
                  'Gagal mengeluarkan Akun Google Anda!',
                );
              }
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
            const {userInfo} = await util.GoogleDrive.connect();

            if (userInfo) {
              setGoogleUserInfo(userInfo);
            }
          }}
        />
      ) : (
        <View></View>
      )}
    </>
  );
};

export default GoogleAccountInfoShowcase;
