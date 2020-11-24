import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {Layout, Icon, Button} from '@ui-kitten/components';
import SelectDateRange from './SelectDateRange';
import SelectOrderBy from './SelectOrderBy';
import SelectStatusDataAndBrand from './SelectStatusDataAndBrand';
import {Text, Input} from '../../Helper';
import _ from 'lodash';

/**
 * Component Form untuk menyaring data pelanggan
 */
const FormFilterOptions = memo(
  props => {
    const {onSubmit, onPressReset} = props;
    const {
      fromDate,
      untilDate,
      orderBy,
      isReverseOrder,
      byBrand,
      byStatusData,
    } = props.currentFilterOptions;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setSearchMode] = useState(false);
    const [visibleFormFilters, showFormFilters] = useState(false);

    let SelectDateRange_ref;
    let SelectOrderBy_ref;
    let SelectStatusDataAndBrand_ref;

    /**
     * This Object same as "props.currentFilterOptions"
     */
    const getFormData = () => ({
      ...SelectDateRange_ref.getValues(),
      ...SelectOrderBy_ref.getValues(),
      ...SelectStatusDataAndBrand_ref.getValues(),
      bySearchQuery: searchQuery,
    });

    /**
     * Comparing "Submited Filter Options" with "Default Filter Options",
     * If the same "setSearchMode" to "false"
     */
    const isEqualWithDefaultOptions = () => {
      /**
       * Didn't include "untilDate" property because the value of "untilDate" property
       * is too complex plus it's an optional property
       */
      const copyDefaultOptions = props.defaultFilterOptions;
      delete copyDefaultOptions.untilDate;
      const copyFormData = getFormData();
      delete copyFormData.untilDate;

      return _.isEqual(copyFormData, copyDefaultOptions);
    };

    return (
      <Layout style={{...props.parentStyle}}>
        <View style={{flexDirection: 'row'}}>
          <Button
            appearance={visibleFormFilters ? 'filled' : 'outline'}
            accessoryLeft={props => <Icon {...props} name='funnel-outline' />}
            style={{marginRight: 8, marginBottom: 4}}
            onPress={() => showFormFilters(!visibleFormFilters)}
          />

          <View style={{flex: 1}}>
            <Input
              accessoryLeft={props => <Icon {...props} name='search-outline' />}
              placeholder='Cari Nama Pelanggan'
              value={searchQuery}
              returnKeyType='search'
              onChangeText={text => setSearchQuery(text)}
              onSubmitEditing={() => {
                if (visibleFormFilters) {
                  setSearchMode(!isEqualWithDefaultOptions());
                  onSubmit(getFormData());
                } else {
                  setSearchMode(searchQuery.length > 0);
                  onSubmit({bySearchQuery: searchQuery});
                }
              }}
            />
          </View>
        </View>

        {isSearchMode && !visibleFormFilters && (
          <Button
            size='small'
            status='danger'
            accessoryLeft={props => <Icon {...props} name='close-outline' />}
            onPress={() => {
              setSearchMode(false);
              setSearchQuery('');
              onPressReset();
            }}
          >
            Reset Pencarian
          </Button>
        )}

        {visibleFormFilters && (
          <>
            <Text size={14} bold hint style={{marginTop: 16, marginBottom: 12}}>
              Saring Data Pelanggan
            </Text>

            <SelectDateRange
              currentFromDate={fromDate}
              currentUntilDate={untilDate}
              ref={ref => (SelectDateRange_ref = ref)}
            />

            <SelectOrderBy
              currentOrderBy={orderBy}
              isCurrentlyReverseOrder={isReverseOrder}
              ref={ref => (SelectOrderBy_ref = ref)}
            />

            <SelectStatusDataAndBrand
              currentBrand={byBrand}
              currentStatusData={byStatusData}
              ref={ref => (SelectStatusDataAndBrand_ref = ref)}
            />

            <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
              <Button
                size='small'
                accessoryLeft={props => (
                  <Icon {...props} name='search-outline' />
                )}
                onPress={() => {
                  setSearchMode(!isEqualWithDefaultOptions());
                  onSubmit(getFormData());
                }}
              >
                Saring
              </Button>

              {isSearchMode && (
                <Button
                  size='small'
                  status='danger'
                  accessoryLeft={props => (
                    <Icon {...props} name='close-outline' />
                  )}
                  style={{marginLeft: 8}}
                  onPress={() => {
                    setSearchMode(false);
                    setSearchQuery('');
                    onPressReset();
                  }}
                >
                  Reset Pencarian
                </Button>
              )}
            </View>
          </>
        )}
      </Layout>
    );
  },
  (prevProps, nextProps) =>
    _.isEqual(prevProps.currentFilterOptions, nextProps.currentFilterOptions),
);

export default FormFilterOptions;
