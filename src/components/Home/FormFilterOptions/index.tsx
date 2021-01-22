import React, {memo, useRef, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {Layout, Icon, Button} from '@ui-kitten/components';
import _ from 'lodash';

import {FilterOptions, PaginationOptions} from '../../../types';
import {Text, Input} from '../../Helper';

import FowardedSelectDateRange, {
  SelectDateRangeMethods,
} from './SelectDateRange';
import FowardedSelectOrderBy, {MSelectOrderBy} from './SelectOrderBy';
import FowardedSelectStatusDataAndBrand, {
  SelectStatusDataAndBrandMethods,
} from './SelectStatusDataAndBrand';

type FormFilterOptionsProps = {
  defaultFilterOptions: FilterOptions;
  currentFilterOptions: Partial<FilterOptions & PaginationOptions>;
  parentStyle: StyleProp<ViewStyle>;
  onSubmit: (opts: {
    bySearchQuery?: string;
    byBrand?: string;
    byStatusData?: string;
    orderBy?: string;
    isReverseOrder?: boolean;
    fromDate?: number;
    untilDate?: number;
  }) => void;
  onPressReset: () => void;
};

/**
 * Form component for filter displayed customer data at Home screen
 */
const FormFilterOptions = memo(
  (props: FormFilterOptionsProps) => {
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

    const selectDateRangeRef = useRef<SelectDateRangeMethods>(null);
    const selectOrderByRef = useRef<MSelectOrderBy>(null);
    const selectStatusDataAndBrandRef = useRef<SelectStatusDataAndBrandMethods>(
      null,
    );

    /**
     * This Object same as "props.currentFilterOptions"
     */
    const getFormData = () => ({
      ...selectDateRangeRef.current?.getValues(),
      ...selectOrderByRef.current?.getValues(),
      ...selectStatusDataAndBrandRef.current?.getValues(),
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
      <Layout style={props.parentStyle}>
        <View style={{flexDirection: 'row'}}>
          <Button
            appearance={visibleFormFilters ? 'filled' : 'outline'}
            accessoryLeft={(buttonProps) => (
              <Icon {...buttonProps} name='funnel-outline' />
            )}
            style={{marginRight: 8, marginBottom: 4}}
            onPress={() => showFormFilters(!visibleFormFilters)}
          />

          <View style={{flex: 1}}>
            <Input
              accessoryLeft={(inputProps) => (
                <Icon {...inputProps} name='search-outline' />
              )}
              placeholder='Cari Nama Pelanggan'
              value={searchQuery}
              returnKeyType='search'
              onChangeText={(text) => setSearchQuery(text)}
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
            accessoryLeft={(buttonProps) => (
              <Icon {...buttonProps} name='close-outline' />
            )}
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

            <FowardedSelectDateRange
              currentFromDate={fromDate || 0}
              currentUntilDate={untilDate}
              ref={selectDateRangeRef}
            />

            <FowardedSelectOrderBy
              currentOrderBy={orderBy}
              isCurrentlyReverseOrder={isReverseOrder}
              ref={selectOrderByRef}
            />

            <FowardedSelectStatusDataAndBrand
              currentBrand={byBrand}
              currentStatusData={byStatusData}
              ref={selectStatusDataAndBrandRef}
            />

            <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
              <Button
                size='small'
                accessoryLeft={(buttonProps) => (
                  <Icon {...buttonProps} name='search-outline' />
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
                  accessoryLeft={(buttonProps) => (
                    <Icon {...buttonProps} name='close-outline' />
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
