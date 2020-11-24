import React, {useState, useContext, memo} from 'react';
import {View, Pressable, FlatList} from 'react-native';
import {Layout} from '@ui-kitten/components';
import {
  Contrainer,
  Text,
  TopNavigation,
  IconHelper,
} from '../components/Helper';
import {ThemeContext, RealmContext} from '../contexts';
import {useRealmObjects} from '../hooks';
import moment from 'moment';
import _ from 'lodash';

const NotificationItem = memo(
  props => {
    const {themeMode} = useContext(ThemeContext);
    const {Realm} = useContext(RealmContext);
    const [bgColor, setBgColor] = useState(
      themeMode === 'light' ? '#EDF1F7' : '#1A2138',
    );
    const notif = props.data;

    return (
      <Pressable
        onPressIn={() =>
          setBgColor(themeMode === 'light' ? '#E4E9F2' : '#151A30')
        }
        style={{
          flex: 1,
          padding: 12,
          marginBottom: props.index === props.lastIndex ? 0 : 12,
          backgroundColor: bgColor,
          borderRadius: 4,
        }}
        onPress={props.onPress}
        onPressOut={() =>
          setBgColor(themeMode === 'light' ? '#EDF1F7' : '#1A2138')
        }
      >
        <View style={{flexDirection: 'row'}}>
          <IconHelper
            color={notif.name === 'reminder' ? '#FF3D71' : '#0095FF'}
            name={
              notif.name === 'reminder'
                ? 'alert-triangle-outline'
                : notif.name === 'backup'
                ? 'hard-drive-outline'
                : 'info-outline'
            }
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
  (prevProps, nextProps) =>
    _.isEqual(
      JSON.parse(JSON.stringify(prevProps.data)),
      JSON.parse(JSON.stringify(nextProps.data)),
    ),
);

const Notifications = props => {
  const {navigation} = props;

  /**
   * Diurutkan dari tanggal terbaru masuknya notifikasi
   */
  const notificationData = useRealmObjects('notifications').sorted(
    'createdAt',
    true,
  );

  return (
    <>
      <TopNavigation title='Notifikasi' onPress={() => navigation.goBack()} />
      <Contrainer>
        {notificationData.isEmpty() ? (
          <Layout level='3' style={{padding: 12}}>
            <Text size={14} align='center' hint>
              Tidak ada Notifikasi.
            </Text>
          </Layout>
        ) : (
          <FlatList
            data={notificationData}
            keyExtractor={notif => notif._id.toString()}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            renderItem={items => {
              const notif = items.item;

              return (
                <NotificationItem
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
      </Contrainer>
    </>
  );
};

export default Notifications;
