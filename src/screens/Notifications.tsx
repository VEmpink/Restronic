import React, {useState, useContext, memo} from 'react';
import {View, Pressable, FlatList} from 'react-native';

import {NavigationProp} from '@react-navigation/native';
import {Layout} from '@ui-kitten/components';
import _ from 'lodash';
import moment from 'moment';

import {Container, Text, TopNavigation, IconHelper} from '../components/Helper';
import {ThemeContext, RealmContext} from '../context';
import {useRealmObjects} from '../hooks';
import {RootStackParamList, Notification} from '../types';

type NotificationItemProps = {
  data: Notification;
  index: number;
  lastIndex: number;
  onPress: () => void;
};

const MemoizedNotificationItem = memo(
  function NotificationItem(props: NotificationItemProps) {
    const {themeMode} = useContext(ThemeContext);
    const {Realm} = useContext(RealmContext);
    const [bgColor, setBgColor] = useState(
      themeMode === 'light' ? '#EDF1F7' : '#1A2138',
    );
    const notif = props.data;

    const getIcon = () => {
      switch (notif.name) {
        case 'reminder':
          return 'alert-triangle-outline';
          break;

        case 'backup':
          return 'hard-drive-outline';
          break;

        default:
          return 'info-outline';
          break;
      }
    };

    return (
      <Pressable
        onPressIn={() => {
          setBgColor(themeMode === 'light' ? '#E4E9F2' : '#151A30');
        }}
        style={{
          flex: 1,
          padding: 12,
          marginBottom: props.index === props.lastIndex ? 0 : 12,
          backgroundColor: bgColor,
          borderRadius: 4,
        }}
        onPress={props.onPress}
        onPressOut={() => {
          setBgColor(themeMode === 'light' ? '#EDF1F7' : '#1A2138');
        }}
      >
        <View style={{flexDirection: 'row'}}>
          <IconHelper
            color={notif.name === 'reminder' ? '#FF3D71' : '#0095FF'}
            name={getIcon()}
            style={{marginRight: 8}}
          />
          <Text size={14} style={{flex: 1, marginBottom: 4}}>
            {notif.message}
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text size={12} hint>
            {moment(notif.createdAt).fromNow()}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <IconHelper
              size={20}
              color='#FF3D71'
              name='trash-2-outline'
              underlayColor='#E4E9F2'
              onPress={() => {
                Realm.write(() => {
                  Realm.delete(notif);
                });
              }}
            />
          </View>
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => _.isEqual(prevProps.data, nextProps.data),
);

type NotificationsProps = {
  navigation: NavigationProp<RootStackParamList>;
};

function Notifications(props: NotificationsProps): React.ReactElement {
  const {navigation} = props;

  /**
   * Diurutkan dari tanggal terbaru masuknya notifikasi
   */
  const notificationData = useRealmObjects<Notification>(
    'notifications',
  ).sorted('createdAt', true);

  return (
    <>
      <TopNavigation title='Notifikasi' onPress={() => navigation.goBack()} />

      <Container>
        {notificationData.isEmpty() ? (
          <Layout level='3' style={{padding: 12}}>
            <Text size={14} align='center' hint>
              Tidak ada Notifikasi.
            </Text>
          </Layout>
        ) : (
          <FlatList
            data={notificationData}
            keyExtractor={(notif) => notif._id.toString()}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            renderItem={(items) => {
              const notif = items.item;

              return (
                <MemoizedNotificationItem
                  data={notif}
                  index={items.index}
                  lastIndex={notificationData.length - 1}
                  onPress={() => {
                    /**
                     * Arahkan pengguna ke Screen "CustomerDataDetails" ketika menekan
                     * salah satu notifikasi yang telah ditampilkan
                     */
                    if (notif.name === 'info' || notif.name === 'reminder') {
                      navigation.navigate('Details', {
                        selectedCustomerId: notif._id,
                      });
                    }
                  }}
                />
              );
            }}
          />
        )}
      </Container>
    </>
  );
}

export default Notifications;
