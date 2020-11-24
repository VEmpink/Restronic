import React from 'react';
import {TopNavigation, Text} from '@ui-kitten/components';
import Icon from './IconHelper';

const TopNavigationHelper = props => (
  <TopNavigation
    appearance='control'
    accessoryLeft={() => (
      <Icon name='arrow-back' color='#FFF' onPress={props.onPress} />
    )}
    title={propsTitle => (
      <Text
        {...propsTitle}
        style={{
          ...propsTitle.style,
          marginLeft: 8,
          color: '#FFF',
          fontWeight: 'bold',
        }}
      >
        {props.title || 'Title'}
      </Text>
    )}
    style={{backgroundColor: props.bgColor || '#3366FF'}}
  />
);

export default TopNavigationHelper;
