import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import {Input, Avatar} from '../../components/Helper';
import {RealmContext} from '../../contexts';
import _ from 'lodash';
import util from '../../utils';

const ProfileSettings = () => {
  const {Realm} = useContext(RealmContext);
  const user = Realm.objects('user')[0];
  const [nameOfUser, setNameOfUser] = useState('');
  const [companyName, setCompanyName] = useState('');
  let Avatar_ref;

  useEffect(() => {
    setNameOfUser(user.name);
    setCompanyName(user.companyName);
    Avatar_ref.setImgSrc(user.photo);
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Avatar
        parentStyle={{marginBottom: 12}}
        ref={ref => (Avatar_ref = ref)}
      />

      <Input
        label='Nama Pengguna'
        placeholder='Nama Pengguna'
        value={nameOfUser}
        onChangeText={text => setNameOfUser(text)}
        style={{marginBottom: 12}}
      />

      <Input
        label='Nama Toko'
        placeholder='Nama Toko'
        value={companyName}
        onChangeText={text => setCompanyName(text)}
        style={{marginBottom: 12}}
      />

      <View style={{alignItems: 'flex-start'}}>
        <Button
          accessoryLeft={props => <Icon {...props} name='save-outline' />}
          onPress={() => {
            const formData = {
              name: nameOfUser,
              companyName,
              photo: Avatar_ref.getImgSrc(),
            };

            const currentUseData = {
              name: user.name,
              companyName: user.companyName,
              photo: user.photo,
            };

            Realm.write(() => {
              /**
               * Mencegah pengguna memasukkan data yang sama
               */
              if (!_.isEqual(currentUseData, formData)) {
                user.name = nameOfUser;
                user.companyName = companyName;
                user.photo = Avatar_ref.getImgSrc();
              }

              util.snackbar.show('success', 'Berhasil mengubah Profile!');
            });
          }}
        >
          Simpan
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileSettings;
