import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {Text, NativePicker} from '../../Helper';

const menuOrderBy = [
  {label: 'Tanggal terbaru', objKey: 'createdAt', isReverseOrder: true},
  {label: 'Tanggal terlama', objKey: 'createdAt', isReverseOrder: false},
  {label: 'Nama dari A - Z', objKey: 'name', isReverseOrder: false},
  {label: 'Nama dari Z - A', objKey: 'name', isReverseOrder: true},
];

const SelectOrderBy = forwardRef((props, ref) => {
  const {currentOrderBy, isCurrentlyReverseOrder} = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      orderBy: menuOrderBy[selectedIndex].objKey,
      isReverseOrder: menuOrderBy[selectedIndex].isReverseOrder,
    }),
  }));

  useEffect(() => {
    /**
     * "useEffect()" disini difungsikan untuk mengisi nilai pengaturan
     * penyaringan data pelanggan yang sekarang atau yang sedang digunakan
     */
    menuOrderBy.forEach((v, i) => {
      if (
        v.objKey === currentOrderBy &&
        v.isReverseOrder === isCurrentlyReverseOrder
      ) {
        setSelectedIndex(i);
      }
    });
  }, [currentOrderBy, isCurrentlyReverseOrder]);

  return (
    <>
      <Text size={14} hint>
        Urutkan berdasarkan
      </Text>
      <NativePicker
        mode='dropdown'
        renderItems={menuOrderBy.map((v, i) => ({label: v.label, value: i}))}
        selectedValue={selectedIndex}
        parentStyle={{marginBottom: 12}}
        onValueChange={(v, i) => {
          setSelectedIndex(v);
        }}
      />
    </>
  );
});

export default SelectOrderBy;
