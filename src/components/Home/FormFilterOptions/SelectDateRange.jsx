import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {View} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import Datepicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Text} from '../../Helper';

/**
 * Untuk mengubah Jam dari sebuah tanggal ke Jam 00:00 AM
 * @param {Date} date
 */
const toHour_00 = date =>
  moment(moment.isDate(date) ? date : new Date())
    .set('hours', 0)
    .set('minutes', 0)
    .set('seconds', 0)
    .valueOf();

/**
 * Untuk mengubah Jam dari sebuah tanggal ke Jam 23:59 PM
 * @param {Date} date
 */
const toHour_23 = date =>
  moment(moment.isDate(date) ? date : new Date())
    .set('hours', 23)
    .set('minutes', 59)
    .set('seconds', 59)
    .valueOf();

const SelectDateRange = forwardRef((props, ref) => {
  const {currentFromDate, currentUntilDate} = props;
  const [fromDate, setFromDate] = useState('');
  const [untilDate, setUntilDate] = useState('');

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

        dates.fromDate = toHour_00(new Date(copyUntilDate));
        dates.untilDate = toHour_23(new Date(copyFromDate));
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
      setFromDate(toHour_00(new Date(currentFromDate)));
      setUntilDate(toHour_23(new Date(currentUntilDate)));
    }

    if (currentFromDate === 0 && currentUntilDate === undefined) {
      setFromDate('');
      setUntilDate('');
    }
  }, [currentFromDate, currentUntilDate]);

  return (
    <>
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View style={{flex: 1, marginRight: 8}}>
          <Button
            size='small'
            appearance='outline'
            accessoryLeft={props => <Icon {...props} name='calendar-outline' />}
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
                setFromDate(toHour_00(date));
              } else {
                setUntilDate(toHour_23(date));
              }
            }
          }}
        />
      )}
    </>
  );
});

export default SelectDateRange;
