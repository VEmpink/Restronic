import React from 'react';
import {Layout} from '@ui-kitten/components';
import {Text} from '../components/Helper';

/**
 * A Screen for displaying an Error, a specially if date in User Device is invalid
 */
const Error = props => {
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text size={14} status='danger' align='center' bold>
        {'Tanggal dan Waktu\ndi Perangkat Anda tidak valid!'}
      </Text>
    </Layout>
  );
};

export default Error;
