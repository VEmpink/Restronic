import React, {useState, useContext, useRef} from 'react';
import {View} from 'react-native';

import {Icon, Button, Input} from '@ui-kitten/components';
import _ from 'lodash';

import {RealmContext} from '../../context';
import {validateUserBasicInfo} from '../../schema/joi.schema';
import {Userdata} from '../../types';
import util from '../../utils';
import {Input as InputHelper, Avatar} from '../Helper';
import {AvatarMethods} from '../Helper/Avatar';

type SetStateStatusFieldParam = {
  name?: string;
  companyName?: string;
};

function ProfileSettings(): React.ReactElement {
  const {Realm} = useContext(RealmContext);
  const user = Realm.objects<Userdata>('user')[0];
  const [userName, setUserName] = useState(user.name);
  const [companyName, setCompanyName] = useState(user.companyName);

  const [statusField, setStatusField] = useState({
    name: 'basic',
    companyName: 'basic',
  });

  const avatarRef = useRef<AvatarMethods>(null);
  const nameField = useRef<Input>(null);
  const companyNameField = useRef<Input>(null);

  const dispatchStatusField = (newState: SetStateStatusFieldParam) =>
    setStatusField((prevState) => ({...prevState, ...newState}));

  return (
    <>
      <Avatar
        uri={user.photo}
        parentStyle={{marginBottom: 12}}
        ref={avatarRef}
      />

      <InputHelper
        label='Nama Pengguna'
        placeholder='Nama Pengguna'
        status={statusField.name}
        value={userName}
        returnKeyType='next'
        style={{marginBottom: 12}}
        onChangeText={(text) => {
          setUserName(text);

          if (statusField.name !== 'basic') {
            dispatchStatusField({name: 'basic'});
          }
        }}
        onSubmitEditing={() => companyNameField.current?.focus()}
        ref={nameField}
      />

      <InputHelper
        label='Nama Toko/Usaha'
        placeholder='Nama Toko'
        status={statusField.companyName}
        value={companyName}
        onChangeText={(text) => {
          setCompanyName(text);

          if (statusField.companyName !== 'basic') {
            dispatchStatusField({companyName: 'basic'});
          }
        }}
        style={{marginBottom: 12}}
        ref={companyNameField}
      />

      <View style={{alignItems: 'flex-start'}}>
        <Button
          accessoryLeft={(props) => <Icon {...props} name='save-outline' />}
          onPress={async () => {
            try {
              const formData = await validateUserBasicInfo({
                name: userName,
                companyName,
              });

              formData.photo = avatarRef.current?.getImgSrc();

              const currentUseData = {
                name: user.name,
                companyName: user.companyName,
                photo: user.photo,
              };

              /**
               * Mencegah pengguna memasukkan data yang sama
               */
              if (!_.isEqual(formData, currentUseData)) {
                Realm.write(() => {
                  user.name = formData.name;
                  user.companyName = formData.companyName;
                  user.photo = formData.photo;

                  util.snackbar.show('success', 'Berhasil mengubah Profil!');
                });
              } else {
                util.snackbar.show('warning', 'Tidak ada yang diubah!');
              }
            } catch (error) {
              if (error.name === 'ValidationError') {
                const errorLabel = error.details[0].context.label;

                if (errorLabel === 'name') {
                  nameField.current?.focus();
                  dispatchStatusField({name: 'danger'});
                } else {
                  companyNameField.current?.focus();
                  dispatchStatusField({companyName: 'danger'});
                }

                util.snackbar.show('error', error.details[0].message);
              } else {
                util.snackbar.show('error', 'Gagal mengubah Profil!', false);
              }
            }
          }}
        >
          Simpan
        </Button>
      </View>
    </>
  );
}

export default ProfileSettings;
