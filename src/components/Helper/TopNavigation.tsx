import React from 'react';

import {TopNavigation, Text} from '@ui-kitten/components';

import Icon from './IconHelper';

type TopNavigationHelperProps = {
  title?: string;
  backgroundColor?: string;
  onPress?: () => void;
};

function TopNavigationHelper(
  props: TopNavigationHelperProps,
): React.ReactElement {
  const {title, backgroundColor, onPress} = props;

  return (
    <TopNavigation
      appearance='control'
      accessoryLeft={() => (
        <Icon name='arrow-back' color='#FFF' onPress={onPress} />
      )}
      title={(propsTitle) => (
        <Text
          {...propsTitle}
          style={[
            propsTitle?.style,
            {
              marginLeft: 8,
              color: '#FFF',
              fontWeight: 'bold',
            },
          ]}
        >
          {title}
        </Text>
      )}
      style={{backgroundColor}}
    />
  );
}

TopNavigationHelper.defaultProps = {
  title: 'Title',
  backgroundColor: '#3366FF',
  onPress: undefined,
};

export default TopNavigationHelper;
