import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, useWindowDimensions, Alert} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import {
  Contrainer,
  Text,
  Input,
  Avatar,
  ModalProgress,
} from '../components/Helper';
import {validateUserBasicInfo} from '../schemas/joi.schema';
import {RealmContext} from '../contexts';
import util from '../utils';
import SplashScreen from 'react-native-splash-screen';

const SetupScreen = props => {
  const {onResponse} = props;
  const {Realm} = useContext(RealmContext);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [statusField, setStatusField] = useState({
    name: 'basic',
    companyName: 'basic',
  });

  const Avatar_Ref = useRef();
  const nameField = useRef();
  const companyNameField = useRef();
  const ModalProgress_Ref = useRef();

  /**
   * @param {statusField} newState
   */
  const dispatchStatusField = newState =>
    setStatusField(prevState => ({...prevState, ...newState}));

  /**
   * Recheck user data
   */
  const handleDialogActions = () => {
    if (Realm.objects('user').isEmpty()) {
      util.snackbar.show('error', 'Gagal membuat Profil!');
    } else {
      /**
       * Send a response to the Parent Component via props
       */
      onResponse({
        hasUserData: true,
      });
    }
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Contrainer>
      <View
        style={{
          minHeight: useWindowDimensions().height - 74,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text size={40} status='primary' bold>
          Halo!
        </Text>
        <Text size={14} hint>
          Mohon isi standar informasi dibawah ini
        </Text>

        <Avatar parentStyle={{marginVertical: 16}} ref={Avatar_Ref} />

        <View>
          <Input
            label='Nama Anda'
            placeholder='Ramdani'
            value={userName}
            status={statusField.name}
            returnKeyType='next'
            onChangeText={text => {
              setUserName(text);

              if (statusField.name !== 'basic') {
                dispatchStatusField({name: 'basic'});
              }
            }}
            onSubmitEditing={() => companyNameField.current.focus()}
            ref={nameField}
          />

          <Input
            label='Nama Usaha/Toko/Perusahaan'
            placeholder='Doctrine Cell'
            value={companyName}
            status={statusField.companyName}
            style={{marginVertical: 16}}
            onChangeText={text => {
              setCompanyName(text);

              if (statusField.companyName !== 'basic') {
                dispatchStatusField({companyName: 'basic'});
              }
            }}
            ref={companyNameField}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              accessoryLeft={propsAcc => (
                <Icon {...propsAcc} name='done-all-outline' />
              )}
              onPress={async () => {
                try {
                  const formData = await validateUserBasicInfo({
                    name: userName,
                    companyName,
                  });

                  Realm.write(() => {
                    Realm.create('user', {
                      name: formData.name,
                      companyName: formData.companyName,
                      photo: Avatar_Ref.current.getImgSrc(),
                    });

                    Alert.alert(
                      'Halo disana! :D',
                      'Selamat datang di Restronic!',
                      [
                        {
                          text: 'Ke Beranda!',
                          onPress: () => handleDialogActions(),
                        },
                      ],
                      {
                        cancelable: true,
                        onDismiss: () => handleDialogActions(),
                      },
                    );
                  });
                } catch (error) {
                  if (error.name === 'ValidationError') {
                    const errorLabel = error.details[0].context.label;

                    if (errorLabel === 'name') {
                      nameField.current.focus();
                      dispatchStatusField({name: 'danger'});
                    } else {
                      companyNameField.current.focus();
                      dispatchStatusField({companyName: 'danger'});
                    }

                    util.snackbar.show('error', error.details[0].message);
                  } else {
                    util.snackbar.show('error', 'Gagal membuat Profil!', false);
                  }
                }
              }}
            >
              Selesai
            </Button>

            <Text size={14} style={{marginVertical: 16}} hint>
              Atau
            </Text>

            <Button
              accessoryLeft={propsAcc => (
                <Icon {...propsAcc} name='hard-drive-outline' />
              )}
              onPress={() => {
                util.showRestoreDataDialog({
                  Realm,
                  handlePress: () => {
                    ModalProgress_Ref.current.show();
                  },
                  onSuccess: () => {
                    ModalProgress_Ref.current.hide();

                    /**
                     * BUG where executing "onResponse" is too fast,
                     * so this why I use "setTimeout"
                     */
                    setTimeout(() => {
                      /**
                       * Send a response to the Parent Component via props
                       */
                      onResponse({
                        hasUserData: true,
                      });
                    }, 128);
                  },
                  onFinally: () => {
                    ModalProgress_Ref.current.hide();
                  },
                });
              }}
            >
              Pulihkan Data Lama
            </Button>

            <ModalProgress ref={ModalProgress_Ref} />
          </View>
        </View>
      </View>
    </Contrainer>
  );
};

export default SetupScreen;
