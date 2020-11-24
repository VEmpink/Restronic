import React, {useEffect, useState} from 'react';
import BodyMainForm from '../components/Form';
import {Contrainer, TopNavigation} from '../components/Helper';

/**
 * A screen for Inserting or Updating Customer data
 */
const MainForm = props => {
  const {route, navigation} = props;
  const [screenHasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setHasFocus(true);
    });
  }, []);

  return (
    <>
      <TopNavigation
        title={route.params ? 'Ubah data pelanggan' : 'Buat data baru'}
        bgColor={route.params ? '#F2994A' : '#3366FF'}
        onPress={() => navigation.goBack()}
      />

      <Contrainer>
        {screenHasFocus && (
          <BodyMainForm
            isEditMode={!!route.params}
            selectedCustomerId={route.params?.selectedCustomerId}
            navigation={navigation}
          />
        )}
      </Contrainer>
    </>
  );
};

export default MainForm;
