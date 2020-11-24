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
  const [nameOfUser, setNameOfUser] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fieldStatus, setFieldStatus] = useState({
    first: 'basic',
    second: 'basic',
  });
  const ModalProgress_Ref = useRef();
  let FirstField;
  let SecondField;
  let Avatar_ref;

  /**
   * Recheck user data
   */
  const handleDialogActions = () => {
    if (Realm.objects('user').isEmpty()) {
      util.snackbar.show('error', 'Gagal membuat data pengguna!');
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

        <Avatar
          parentStyle={{marginVertical: 16}}
          ref={ref => (Avatar_ref = ref)}
        />

        <View>
          <Input
            label='Nama Anda'
            placeholder='Ramdani'
            value={nameOfUser}
            status={fieldStatus.first}
            returnKeyType='next'
            onChangeText={text => {
              setNameOfUser(text);
              setFieldStatus(prev => ({...prev, first: 'basic'}));
            }}
            onSubmitEditing={() => SecondField.focus()}
            ref={ref => (FirstField = ref)}
          />

          <Input
            label='Nama Usaha/Toko/Perusahaan'
            placeholder='Redux Cell'
            value={companyName}
            status={fieldStatus.second}
            style={{marginVertical: 16}}
            returnKeyType='next'
            onChangeText={text => {
              setCompanyName(text);
              setFieldStatus(prev => ({...prev, second: 'basic'}));
            }}
            ref={ref => (SecondField = ref)}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              accessoryLeft={propsAcc => (
                <Icon {...propsAcc} name='done-all-outline' />
              )}
              onPress={async () => {
                try {
                  const formData = await validateUserBasicInfo({
                    nameOfUser,
                    companyName,
                  });

                  Realm.write(() => {
                    Realm.create('user', {
                      name: formData.nameOfUser,
                      companyName: formData.companyName,
                      photo: Avatar_ref.getImgSrc(),
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
                    const fieldNameOfError = error.details[0].context.label;

                    if (fieldNameOfError === 'nameOfUser') {
                      FirstField.focus();
                      setFieldStatus(prev => ({...prev, first: 'danger'}));
                    } else {
                      SecondField.focus();
                      setFieldStatus(prev => ({...prev, second: 'danger'}));
                    }

                    util.snackbar.show('error', error.details[0].message);
                  } else {
                    util.snackbar.show(
                      'error',
                      'Gagal memasukkan data pengguna ke Database!',
                      false,
                    );
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
