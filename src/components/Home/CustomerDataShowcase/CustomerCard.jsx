import React, {memo, useContext, useState} from 'react';
import {View, Pressable} from 'react-native';
import {Text, Avatar} from '../../Helper';
import AutoHeightImage from 'react-native-auto-height-image';
import {logo} from '../../../assets/images';
import {ThemeContext} from '../../../contexts';
import _ from 'lodash';

/**
 * Alternatif datatable untuk menampilkan data pelanggan
 */
const CustomerCard = memo(
  props => {
    const customer = props.customerData;
    const deviceBrand = customer.deviceBrand;
    const serviceStatus = customer.serviceStatus;
    const {themeMode} = useContext(ThemeContext);
    const [bgColor, setBgColor] = useState('transparent');

    return (
      <Pressable
        onPressIn={() =>
          setBgColor(themeMode === 'light' ? '#EDF1F7' : '#151A30')
        }
        onPress={props.onPress}
        onPressOut={() => setBgColor('transparent')}
      >
        <View
          style={{
            flexDirection: 'row',
            marginBottom: props.index === props.lastIndex ? 0 : 24,
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: bgColor,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: themeMode === 'light' ? '#EDF1F7' : '#151A30',
          }}
        >
          <Avatar
            uri={customer.photo}
            size={64}
            parentStyle={{marginRight: 12}}
            disabled
          />

          <View style={{flex: 1}}>
            <View style={{marginBottom: 16}}>
              {typeof logo[deviceBrand.toLowerCase()] !== 'undefined' ? (
                <AutoHeightImage
                  width={64}
                  source={logo[deviceBrand.toLowerCase()]}
                />
              ) : (
                <View>
                  <Text size={14} hint>
                    Merek Perangkat
                  </Text>
                  <Text bold>{deviceBrand}</Text>
                </View>
              )}
            </View>

            <View style={{marginBottom: 12}}>
              <Text size={14} style={{marginBottom: 4}} hint>
                Status
              </Text>
              <Text
                size={14}
                bold
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor:
                    serviceStatus == 'onprocess'
                      ? '#FFAA00'
                      : serviceStatus == 'saved'
                      ? '#00E096'
                      : serviceStatus == 'onwarranty'
                      ? '#f2994a'
                      : serviceStatus == 'complete'
                      ? '#00B383'
                      : '#FF3D71',
                  color: '#fff',
                  borderRadius: 4,
                }}
              >
                {serviceStatus == 'onprocess'
                  ? 'Dalam Proses'
                  : serviceStatus == 'saved'
                  ? 'Selesai & Belum diambil'
                  : serviceStatus == 'onwarranty'
                  ? 'Masih Garansi'
                  : serviceStatus == 'complete'
                  ? 'Telah Selesai'
                  : 'Dibatalkan'}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: 12}}>
              <View style={{flex: 1, marginRight: 6}}>
                <Text size={14} hint>
                  Nama Pelanggan
                </Text>
                <Text bold>{customer.name}</Text>
              </View>
              <View style={{flex: 1, marginLeft: 6}}>
                <Text size={14} hint>
                  Nama Perangkat
                </Text>
                <Text bold>{customer.deviceName}</Text>
              </View>
            </View>
            <View>
              <Text size={14} hint>
                Kerusakan
              </Text>
              <Text bold>{customer.deviceDamage}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    _.isEqual(prevProps.customerData, nextProps.customerData),
);

export default CustomerCard;
