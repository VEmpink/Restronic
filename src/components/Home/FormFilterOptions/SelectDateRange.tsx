import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  ForwardedRef,
} from 'react';
import {View} from 'react-native';

import Datepicker from '@react-native-community/datetimepicker';
import {Icon, Button} from '@ui-kitten/components';
import moment from 'moment';

import {Text} from '../../Helper';

/**
 * Change a time from a date to time 00:00:00 AM
 */
const convertTimeFromDateTo0000 = (date: Date) =>
  moment(moment.isDate(date) ? date : new Date())
    .set('hours', 0)
    .set('minutes', 0)
    .set('seconds', 0)
    .valueOf();

/**
 * Change a time from a date to time 23:59:59 PM
 */
const convertTimeFromDateTo2359 = (date: Date) =>
  moment(moment.isDate(date) ? date : new Date())
    .set('hours', 23)
    .set('minutes', 59)
    .set('seconds', 59)
    .valueOf();

type SelectDateRangeProps = {
  currentFromDate: number;
  currentUntilDate?: number;
};

export type SelectDateRangeMethods = {
  getValues: () => {fromDate: number; untilDate: number};
};

const FowardedSelectDateRange = forwardRef(function SelectDateRange(
  props: SelectDateRangeProps,
  ref: ForwardedRef<SelectDateRangeMethods>,
) {
  const {currentFromDate, currentUntilDate} = props;
  const [fromDate, setFromDate] = useState(0);
  const [untilDate, setUntilDate] = useState(0);

  /**
   * Karena ada dua tombol yang difungsikan untuk menampilkan
   * "Datepicker" saya menggunakan state ini untuk memberi tahu
   * si "Datepicker" kemana hasil nilai yang dimasukkan pengguna
   * akan diisi, jika:
   *
   * "0" Maka state "fromDate" akan tersisi, dan
   * "1" Maka state "untilDate" akan tersisi
   */
  const [currentClickedButton, setCurrentClickedButton] = useState(0);

  /** State untuk "Datepicker" */
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const dates = {
        fromDate: fromDate > 0 ? fromDate : 0,
        untilDate: untilDate > 0 ? untilDate : Date.now(),
      };

      /**
       * Kode ini difungsikan untuk mencegah pengguna memasukkan tanggal
       * secara tidak benar ATAU tidak akan ada efeknya ketika pengguna
       * salah memasukan jarak tanggal yang seharusnya dari yang terkecil
       * "fromDate" dan sampai yang terbesar "untilDate"
       */
      if (dates.fromDate > dates.untilDate) {
        const copyFromDate = dates.fromDate;
        const copyUntilDate = dates.untilDate;

        dates.fromDate = convertTimeFromDateTo0000(new Date(copyUntilDate));
        dates.untilDate = convertTimeFromDateTo2359(new Date(copyFromDate));
      }

      return dates;
    },
  }));

  /**
   * "useEffect()" disini difungsikan untuk mengisi nilai pengaturan
   * penyaringan data pelanggan yang sekarang atau yang sedang digunakan
   */
  useEffect(() => {
    if (currentFromDate > 0 && currentUntilDate !== undefined) {
      setFromDate(convertTimeFromDateTo0000(new Date(currentFromDate)));
      setUntilDate(convertTimeFromDateTo2359(new Date(currentUntilDate)));
    }

    if (currentFromDate === 0 && currentUntilDate === undefined) {
      setFromDate(0);
      setUntilDate(0);
    }
  }, [currentFromDate, currentUntilDate]);

  return (
    <>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View style={{flex: 1, marginRight: 8}}>
          <Button
            size='small'
            appearance='outline'
            accessoryLeft={(propsButton) => (
              <Icon {...propsButton} name='calendar-outline' />
            )}
            onPress={() => {
              setVisible(true);
              setCurrentClickedButton(0);
            }}
          >
            Dari Tanggal
          </Button>
          {fromDate > 0 && (
            <Text size={14} align='center' bold hint style={{marginTop: 4}}>
              {moment(fromDate).format('dddd, DD/MM/YYYY HH:mm')}
            </Text>
          )}
        </View>

        <View style={{flex: 1}}>
          <Button
            size='small'
            appearance='outline'
            onPress={() => {
              setVisible(true);
              setCurrentClickedButton(1);
            }}
          >
            Sampai Tanggal
          </Button>
          {untilDate > 0 && (
            <Text size={14} align='center' bold hint style={{marginTop: 4}}>
              {moment(untilDate).format('dddd, DD/MM/YYYY HH:mm')}
            </Text>
          )}
        </View>
      </View>

      {visible && (
        <Datepicker
          value={new Date()}
          maximumDate={new Date()}
          onChange={(e, date) => {
            setVisible(false);

            if (date !== undefined) {
              if (currentClickedButton === 0) {
                setFromDate(convertTimeFromDateTo0000(date));
              } else {
                setUntilDate(convertTimeFromDateTo2359(date));
              }
            }
          }}
        />
      )}
    </>
  );
});

FowardedSelectDateRange.defaultProps = {
  currentUntilDate: 0,
};

export default FowardedSelectDateRange;
