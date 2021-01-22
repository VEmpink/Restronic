import React, {useEffect, useState} from 'react';

import {NavigationProp, RouteProp} from '@react-navigation/native';

import BodyMainForm from '../components/Form';
import {Container, TopNavigation} from '../components/Helper';
import {RootStackParamList} from '../types';

type MainFormProps = {
  route: RouteProp<RootStackParamList, 'Form'>;
  navigation: NavigationProp<RootStackParamList>;
};

/**
 * A screen for Inserting or Updating Customer data
 */
function MainForm(props: MainFormProps): React.ReactElement {
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
        backgroundColor={route.params ? '#F2994A' : '#3366FF'}
        onPress={() => navigation.goBack()}
      />

      <Container>
        {screenHasFocus && (
          <BodyMainForm
            isEditMode={!!route.params}
            selectedCustomerId={route.params?.selectedCustomerId}
            navigation={navigation}
          />
        )}
      </Container>
    </>
  );
}

export default MainForm;
