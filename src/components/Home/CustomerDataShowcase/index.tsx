import React, {useState, useEffect} from 'react';
import {View, FlatList, ActivityIndicator, LogBox} from 'react-native';

import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Layout} from '@ui-kitten/components';
import _ from 'lodash';

import {useRealmObjects} from '../../../hooks';
import {
  Customer,
  FilterOptions,
  RootStackParamList,
  PaginationOptions,
} from '../../../types';
import {Text} from '../../Helper';
import FormFilterOptions from '../FormFilterOptions';

import MemoizedCustomerCard from './CustomerCard';
import MemoizedPagination from './Pagination';

type MessageProps = {
  text: string;
};

/**
 * Component untuk menampilkan pesan jika data tidak ditemukan
 * atau tidak ada data didalam database (Realm)
 */
function Message({text}: MessageProps) {
  return (
    <Layout
      level='3'
      style={{
        padding: 12,
        borderRadius: 4,
      }}
    >
      <Text size={14} hint align='center'>
        {text}
      </Text>
    </Layout>
  );
}

type LoadingIndicatorProps = {
  onShow: () => void;
};

/**
 * Component ini seharusnya muncul sebelum data paginasi dimuat
 */
function LoadingIndicator(props: LoadingIndicatorProps) {
  useEffect(() => {
    props.onShow();
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <ActivityIndicator size='large' color='#3366ff' />
    </View>
  );
}

type ListShowcaseProps = {
  hasCustomers: boolean;
  totalFiltered: number;
  paginatedCustomers: Customer[];
};

function ListShowcase(props: ListShowcaseProps) {
  const {hasCustomers, totalFiltered, paginatedCustomers} = props;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  /**
   * Jika pengguna tidak memiliki data pelanggan yang tersimpan
   * di database (Realm)
   */
  if (hasCustomers) {
    /**
     * Jika hasil penyaringan data pelanggan lebih dari 0
     */
    if (totalFiltered > 0) {
      return (
        <FlatList
          data={paginatedCustomers}
          keyExtractor={(customer) => customer._id.toString()}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          scrollEnabled={false}
          renderItem={(items) => {
            const customerData = items.item;

            return (
              <MemoizedCustomerCard
                data={customerData}
                index={items.index}
                lastIndex={paginatedCustomers.length - 1}
                onPress={() => {
                  /**
                   * Arahkan pengguna ke "CustomerDataDetails" screen ketika
                   * pengguna menekan salah satu kartu data pelanggan yang telah
                   * ditampilkan
                   */
                  navigation.navigate('Details', {
                    selectedCustomerId: customerData._id,
                  });
                }}
              />
            );
          }}
        />
      );
    }

    return <Message text='Data tidak ditemukan' />;
  }

  return <Message text={'Tidak ada data\n yang dapat ditampilkan saat ini.'} />;
}

const initialFilterOptions: FilterOptions = {
  fromDate: 0,
  bySearchQuery: '',
  byBrand: '',
  byStatusData: '',
  orderBy: 'createdAt',
  isReverseOrder: true,
};

const initialPaginationOptions: PaginationOptions = {
  perPage: 5,
  totalPage: 1,
  currentPage: 1,
};

type SetFilterStatesParam = Partial<FilterOptions & PaginationOptions>;

/**
 * Component untuk menampilkan data para pelanggan di `Home Screen` dengan
 * `FlatList` dan `Pagination`
 */
function CustomerDataShowcase(): React.ReactElement {
  const customers = useRealmObjects<Customer>('customers');

  /**
   * A State for showing a loading Spinner before
   * load the new pagination data
   */
  const [isReloadPagination, setReloadPagination] = useState(true);

  const [filters, setFilters] = useState<FilterOptions & PaginationOptions>({
    ...initialFilterOptions,
    ...initialPaginationOptions,
  });

  const setState = (newState: SetFilterStatesParam) =>
    setFilters((prevState) => ({...prevState, ...newState}));

  const filteredCustomers = customers
    .filtered(`createdAt >= ${filters.fromDate}`)
    .filtered(`createdAt <= ${filters.untilDate || Date.now()}`)
    .filtered(`name CONTAINS[c] "${filters.bySearchQuery}"`)
    .filtered(`deviceBrand CONTAINS[c] "${filters.byBrand}"`)
    .filtered(`serviceStatus CONTAINS[c] "${filters.byStatusData}"`)
    .sorted(filters.orderBy, filters.isReverseOrder);

  const paginatedCustomers = filteredCustomers.slice(
    filters.perPage * (filters.currentPage - 1),
    filters.perPage * filters.currentPage,
  );

  /**
   * Hitung total halaman paginasi
   */
  const calcTotalPage = Math.ceil(filteredCustomers.length / filters.perPage);

  useEffect(() => {
    if (filteredCustomers.length) {
      setState({
        totalPage: calcTotalPage,

        /**
         * Kode ini berfungsi untuk mencegah pengguna berada di halaman
         * paginasi yang halamannya tidak memiliki data pelanggan yang
         * dapat ditampilkan
         */
        currentPage:
          filters.currentPage > calcTotalPage
            ? calcTotalPage
            : filters.currentPage,
      });
    }
  }, [calcTotalPage]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <>
      <FormFilterOptions
        defaultFilterOptions={initialFilterOptions}
        currentFilterOptions={_.pick(
          filters,
          Object.keys(initialFilterOptions),
        )}
        parentStyle={{marginBottom: 16}}
        onSubmit={(formData) => {
          setReloadPagination(true);
          setState(formData);
        }}
        onPressReset={() => {
          setReloadPagination(true);
          setState(initialFilterOptions);
        }}
      />

      <View style={{marginBottom: 16}}>
        {isReloadPagination ? (
          <LoadingIndicator onShow={() => setReloadPagination(false)} />
        ) : (
          <ListShowcase
            hasCustomers={!customers.isEmpty()}
            totalFiltered={filteredCustomers.length}
            paginatedCustomers={paginatedCustomers}
          />
        )}
      </View>

      {filteredCustomers.length > filters.perPage && (
        <MemoizedPagination
          totalPage={filters.totalPage}
          currentPage={filters.currentPage}
          parentStyle={{marginBottom: 48}}
          onPress={(page) => {
            setReloadPagination(true);
            setState({currentPage: page});
          }}
        />
      )}
    </>
  );
}

export default CustomerDataShowcase;
