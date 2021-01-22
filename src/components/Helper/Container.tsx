import React, {ReactNode} from 'react';
import {View, ScrollView} from 'react-native';

import {Layout} from '@ui-kitten/components';

type ContainerProps = {
  children?: ReactNode;
};

function Container({children}: ContainerProps): React.ReactElement {
  return (
    <Layout style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingTop: 24, paddingHorizontal: 24}}
      >
        {children}
        <View style={{marginBottom: 48}} />
      </ScrollView>
    </Layout>
  );
}

Container.defaultProps = {
  children: <></>,
};

export default Container;
