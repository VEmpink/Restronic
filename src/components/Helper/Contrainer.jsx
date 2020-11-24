import React from 'react';
import {View, ScrollView} from 'react-native';
import {Layout} from '@ui-kitten/components';

const Contrainer = props => {
  return (
    <Layout style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingTop: 24, paddingHorizontal: 24}}
      >
        {props.children}
        <View style={{marginBottom: 48}}></View>
      </ScrollView>
    </Layout>
  );
};

export default Contrainer;
