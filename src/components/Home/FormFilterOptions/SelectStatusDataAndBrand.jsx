import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {View} from 'react-native';
import {Text, NativePicker} from '../../Helper';
import brands from '../../../api/brands.json';

const menuStatusData = [
  {label: 'Pilih status data', value: ''},
  {label: 'Dalam proses', value: 'onprocess'},
  {label: 'Disimpan', value: 'saved'},
  {label: 'Masih garansi', value: 'onwarranty'},
  {label: 'Telah selesai', value: 'complete'},
  {label: 'Yang dibatalkan', value: 'canceled'},
];

const SelectStatusDataAndBrand = forwardRef((props, ref) => {
  const {currentStatusData, currentBrand} = props;
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatusData, setSelectedStatusData] = useState('');

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      byBrand: selectedBrand,
      byStatusData: selectedStatusData,
    }),
  }));

  /**
   * "useEffect()" disini difungsikan untuk mengisi nilai pengaturan
   * penyaringan data pelanggan yang sekarang atau yang sedang digunakan
   */
  useEffect(() => {
    menuStatusData.forEach((v, i) => {
      if (v.value === currentStatusData) {
        setSelectedStatusData(v.value);
      }
    });

    brands.forEach((v, i) => {
      if (v.name === currentBrand) {
        setSelectedBrand(v.name);
      }
    });
  }, [currentStatusData, currentBrand]);

  return (
    <View style={{flexDirection: 'row', marginBottom: 12}}>
      <View style={{flex: 1}}>
        <Text size={14} hint>
          Saring status data
        </Text>
        <NativePicker
          mode='dropdown'
          renderItems={menuStatusData}
          selectedValue={selectedStatusData}
          onValueChange={(v, i) => {
            setSelectedStatusData(v);
          }}
        />
      </View>

      <View style={{flex: 1, marginLeft: 8}}>
        <Text size={14} hint>
          Saring brand
        </Text>
        <NativePicker
          mode='dropdown'
          renderItems={brands.map(v => ({
            label: v.name === '' ? 'Pilih brand' : v.name,
            value: v.name,
          }))}
          selectedValue={selectedBrand}
          onValueChange={(v, i) => {
            setSelectedBrand(v);
          }}
        />
      </View>
    </View>
  );
});

export default SelectStatusDataAndBrand;
