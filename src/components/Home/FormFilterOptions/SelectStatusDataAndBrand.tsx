import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  ForwardedRef,
} from 'react';
import {View} from 'react-native';

import brands from '../../../assets/json/brands.json';
import {Text, NativePicker} from '../../Helper';

const menuStatusData = [
  {label: 'Pilih status data', value: ''},
  {label: 'Dalam proses', value: 'onprocess'},
  {label: 'Disimpan', value: 'saved'},
  {label: 'Masih garansi', value: 'onwarranty'},
  {label: 'Telah selesai', value: 'complete'},
  {label: 'Yang dibatalkan', value: 'canceled'},
];

type SelectStatusDataAndBrandProps = {
  currentStatusData: string;
  currentBrand: string;
};

export type SelectStatusDataAndBrandMethods = {
  getValues: () => {byBrand: string; byStatusData: string};
};

const FowardedSelectStatusDataAndBrand = forwardRef(
  function SelectStatusDataAndBrand(
    props: SelectStatusDataAndBrandProps,
    ref: ForwardedRef<SelectStatusDataAndBrandMethods>,
  ) {
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
      menuStatusData.forEach((v) => {
        if (v.value === currentStatusData) {
          setSelectedStatusData(v.value);
        }
      });

      brands.forEach((v) => {
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
            onValueChange={(v) => {
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
            renderItems={brands.map((v) => ({
              label: v.name === '' ? 'Pilih brand' : v.name,
              value: v.name,
            }))}
            selectedValue={selectedBrand}
            onValueChange={(v) => {
              setSelectedBrand(v);
            }}
          />
        </View>
      </View>
    );
  },
);

export default FowardedSelectStatusDataAndBrand;
