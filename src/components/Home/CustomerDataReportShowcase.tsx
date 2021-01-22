import React, {memo, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {useRealmObjects} from '../../hooks';
import {Customer} from '../../types';
import util from '../../utils';
import {Text, IconHelper, NativePicker} from '../Helper';

type DataShowcaseProps = {
  icon: string;
  color: string;
  value: string;
  caption: string;
};

const MemoizedDataShowcase = memo(
  function DataShowcase(props: DataShowcaseProps) {
    return (
      <View style={{flex: 1}}>
        <IconHelper name={props.icon} size={18} color={props.color} />
        <Text size={20} bold>
          {props.value}
        </Text>
        <Text size={14} hint>
          {props.caption}
        </Text>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);

const menuAverageIncome = [
  {label: 'Per Hari', value: 1},
  {label: 'Per Minggu', value: 7},
  {label: 'Per Bulan', value: 31},
  {label: 'Per Tahun', value: 365},
];

type AverageIncomeProps = {
  income: number;
  totalDay: number;
};

function AverageIncome(props: AverageIncomeProps) {
  const {income, totalDay} = props;
  const [day, setDay] = useState(1);

  return (
    <View style={{flex: 1}}>
      <MemoizedDataShowcase
        icon='activity-outline'
        color='#f2994a'
        caption='Rata-rata Penghasilan'
        value={util.shortNumber(Math.ceil(income / Math.ceil(totalDay / day)))}
      />

      <NativePicker
        mode='dropdown'
        renderItems={menuAverageIncome}
        selectedValue={day}
        parentStyle={{marginTop: 8}}
        onValueChange={(value) => {
          setDay(value);
        }}
      />
    </View>
  );
}

const CSS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});

function CustomerDataReportShowcase(): React.ReactElement {
  /**
   * Sengaja diurutkan dari tanggal terbaru karena akan digunakan
   * oleh "getTotalDay()"
   */
  const customers = useRealmObjects<Customer>('customers').sorted(
    'createdAt',
    true,
  );

  /**
   * Menghitung jarak waktu data pelanggan  terlama dengan yang
   * terbaru, hasilnya digunakan untuk menghitung rata - rata penghasilan
   * dalam per hari, per minggu, per bulan dan per tahun
   */
  const getTotalDay = () => {
    if (customers.length > 1) {
      const newestCustomerData = customers[0].createdAt;
      const oldestCustomerData = customers[customers.length - 1].createdAt;
      const milliseconds = newestCustomerData - oldestCustomerData;
      const oneDay = 864e5;

      return Math.ceil(milliseconds / oneDay);
    }

    return 1;
  };

  return (
    <View>
      <View style={CSS.row}>
        <MemoizedDataShowcase
          icon='credit-card-outline'
          color='#2f80ed'
          caption='Total Penghasilan'
          value={util.shortNumber(
            customers
              .filtered(`serviceStatus == "complete"`)
              .sum('servicePrice') || 0,
          )}
        />

        <AverageIncome
          income={
            customers
              .filtered(`serviceStatus == "complete"`)
              .sum('servicePrice') || 0
          }
          totalDay={getTotalDay()}
        />
      </View>

      <View style={CSS.row}>
        <MemoizedDataShowcase
          icon='people-outline'
          value={`${customers.length}`}
          color='#2f80ed'
          caption='Total Data'
        />
        <MemoizedDataShowcase
          icon='checkmark-square-outline'
          color='#27ae60'
          caption='Telah Selesai'
          value={`${customers.filtered(`serviceStatus == "complete"`).length}`}
        />
      </View>

      <View style={CSS.row}>
        <MemoizedDataShowcase
          icon='save-outline'
          color='#27ae60'
          caption='Disimpan'
          value={`${customers.filtered(`serviceStatus == "saved"`).length}`}
        />
        <MemoizedDataShowcase
          icon='clock-outline'
          color='#e2b93b'
          caption='Dalam Proses'
          value={`${customers.filtered(`serviceStatus == "onprocess"`).length}`}
        />
      </View>

      <View style={CSS.row}>
        <MemoizedDataShowcase
          icon='calendar-outline'
          color='#f2994a'
          caption='Masih Garansi'
          value={`${
            customers.filtered(`serviceStatus == "onwarranty"`).length
          }`}
        />
        <MemoizedDataShowcase
          icon='close-circle-outline'
          color='#ff3d71'
          caption='Dibatalkan'
          value={`${customers.filtered(`serviceStatus == "canceled"`).length}`}
        />
      </View>
    </View>
  );
}

export default CustomerDataReportShowcase;
