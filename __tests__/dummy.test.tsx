import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

it('works', () => {
  const result = render(<View><Text>Hello World</Text></View>);
  console.log('Result keys:', Object.keys(result));
  throw new Error('Force fail to see log');
});
