import React, {memo} from 'react';
import {View} from 'react-native';
import {Button, Icon} from '@ui-kitten/components';
import {Text} from '../../Helper';
import _ from 'lodash';

const Pagination = memo(
  props => {
    const {
      /**
       * Total halaman paginasi.
       */
      totalPage,

      /**
       * Halaman paginasi yang sekarang atau yang sedang aktif
       */
      currentPage,

      /**
       * Fungsi yang dikirim ke Parent melalui props,
       * parameternya bernilai halaman paginasi
       */
      onPress,
    } = props;

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          ...props.parentStyle,
        }}
      >
        <Text size={12} style={{marginBottom: 8}} hint>
          Halaman saat ini
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            size='small'
            appearance='outline'
            onPress={() => {
              /**
               * Tombol menuju ke halaman paginasi yang pertama
               */
              onPress(1);
            }}
            accessoryLeft={propsAcc => (
              <Icon
                {...propsAcc}
                style={{...propsAcc.style, marginHorizontal: 0}}
                name='arrowhead-left-outline'
              />
            )}
          />

          <Button
            size='small'
            appearance='outline'
            style={{marginHorizontal: 8}}
            onPress={() => {
              /**
               * Tombol menuju ke halaman paginasi yang sebelumnya
               */
              onPress(currentPage != 1 ? currentPage - 1 : 1);
            }}
            accessoryLeft={propsAcc => (
              <Icon
                {...propsAcc}
                style={{...propsAcc.style, marginHorizontal: 0}}
                name='arrow-ios-back-outline'
              />
            )}
          />

          <View style={{flexDirection: 'row'}}>
            <Text bold>{currentPage}</Text>
            <Text hint style={{marginHorizontal: 8}}>
              dari
            </Text>
            <Text bold>{totalPage}</Text>
          </View>

          <Button
            size='small'
            appearance='outline'
            style={{marginHorizontal: 8}}
            onPress={() => {
              /**
               * Tombol menuju ke halaman paginasi yang selanjutnya
               */
              onPress(currentPage != totalPage ? currentPage + 1 : totalPage);
            }}
            accessoryLeft={propsAcc => (
              <Icon
                {...propsAcc}
                style={{...propsAcc.style, marginHorizontal: 0}}
                name='arrow-ios-forward-outline'
              />
            )}
          />

          <Button
            size='small'
            appearance='outline'
            onPress={() => {
              /**
               * Tombol untuk menuju ke halaman paginasi yang terakhir
               */
              onPress(totalPage);
            }}
            accessoryLeft={propsAcc => (
              <Icon
                {...propsAcc}
                style={{...propsAcc.style, marginHorizontal: 0}}
                name='arrowhead-right-outline'
              />
            )}
          />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) =>
    _.isEqual(
      {totalPage: prevProps.totalPage, currentPage: prevProps.currentPage},
      {totalPage: nextProps.totalPage, currentPage: nextProps.currentPage},
    ),
);

export default Pagination;
