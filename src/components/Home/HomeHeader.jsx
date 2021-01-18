import React, {useContext} from 'react';
import {View, Animated, Easing} from 'react-native';
import {Text, IconHelper, Avatar} from '../Helper';
import ProgressDialog from 'react-native-popup-progress-bar';
import {RealmContext} from '../../contexts';
import {useRealmObjects} from '../../hooks';
import util from '../../utils';

/**
 * Hanya titik merah kecil yang menandakan ada notifikasi baru yang belum
 * dilihat oleh pengguna
 */
const NotifBadge = props => {
  const notifications = useRealmObjects('notifications');

  return (
    <>
      {notifications.some(notif => notif.hasOpened === false) ? (
        <View
          style={{
            width: 8,
            height: 8,
            marginTop: 6,
            marginBottom: -14,
            marginLeft: 14,
            backgroundColor: 'red',
            borderRadius: 8,
            zIndex: 1,
          }}
          pointerEvents='none'
        ></View>
      ) : (
        <View></View>
      )}
    </>
  );
};

const initialRotate = new Animated.Value(0);

const rotateIcon = Animated.loop(
  Animated.timing(initialRotate, {
    toValue: 1,
    duration: 1024,
    easing: Easing.linear,
    useNativeDriver: true,
  }),
);

const rotateValue = initialRotate.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

const HomeHeader = props => {
  const {navigate} = props;
  const {Realm} = useContext(RealmContext);
  const user = useRealmObjects('user')[0];

  return (
    <View style={{flexDirection: 'row', marginBottom: 24}}>
      <Avatar
        uri={user.photo}
        size={72}
        onImageChange={base64 => {
          Realm.write(() => {
            user.photo = base64;
          });
        }}
      />

      <View style={{flex: 1, marginLeft: 8, marginTop: 8}}>
        <Text bold>{user.name}</Text>
        <Text size={14} hint>
          {user.companyName}
        </Text>
      </View>

      <View style={{flex: 1, alignItems: 'flex-end', marginTop: 8}}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Animated.View style={{transform: [{rotate: rotateValue}]}}>
            <IconHelper
              name='refresh-outline'
              size={20}
              onPress={async () => {
                rotateIcon.start();

                ProgressDialog.show({
                  title: 'Please Wait...',
                  message: 'Refreshing notification...',
                  isCancelable: false,
                });

                await util.checkOnProcessCustomers(Realm);
                await util.checkOnWarrantyCustomers(Realm);

                /**
                 * Make it more delayed because is too fast without it
                 */
                setTimeout(() => {
                  rotateIcon.stop();
                  initialRotate.setValue(0);
                  ProgressDialog.dismiss();
                }, 1024);
              }}
            />
          </Animated.View>

          <View>
            <NotifBadge />
            <IconHelper
              name='bell-outline'
              size={20}
              onPress={() => {
                Realm.write(() => {
                  const notifications = Realm.objects('notifications');

                  /**
                   * Status notifikasi "hasOpened" menjadi "true", yang
                   * berarti Notifikasi tersebut telah dibuka dan dilihat oleh pengguna.
                   */
                  if (notifications.some(notif => notif.hasOpened === false)) {
                    notifications.forEach((notif, i) => {
                      if (!notif.hasOpened) {
                        notifications[i].hasOpened = true;
                      }
                    });
                  }

                  /**
                   * Arahkan pengguna ke Screen "Notifications"
                   */
                  navigate('Notifications');
                });
              }}
            />
          </View>

          <IconHelper
            name='settings-outline'
            size={20}
            onPress={() => navigate('Settings')}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
