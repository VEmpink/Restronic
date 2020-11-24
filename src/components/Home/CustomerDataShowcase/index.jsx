import React, {useState, useEffect} from 'react';
import {View, FlatList, ActivityIndicator, LogBox} from 'react-native';
import {Layout} from '@ui-kitten/components';
import {Text} from '../../Helper';
import {useRealmObjects} from '../../../hooks';
import FormFilterOptions from '../FormFilterOptions';
import CustomerCard from './CustomerCard';
import Pagination from './Pagination';
import _ from 'lodash';

/**
 * Component untuk menampilkan pesan jika data tidak ditemukan
 * atau tidak ada data didalam database (Realm)
 */
const NoDataAttention = props => {
  return (
    <Layout
      level='3'
      style={{
        padding: 12,
        borderRadius: 4,
      }}
    >
      <Text size={14} hint align='center'>
        {props.message}
      </Text>
    </Layout>
  );
};

/**
 * Component ini seharusnya muncul sebelum data paginasi dimuat
 */
const LoadingIndicator = props => {
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
};

const ListShowcase = props => {
  /**
   * Jika pengguna tidak memiliki data pelanggan yang tersimpan
   * di database (Realm)
   */
  if (props.hasCustomers) {
    /**
     * Jika hasil penyaringan data pelanggan lebih dari 0
     */
    if (props.totalFiltered > 0) {
      return (
        <FlatList
          data={props.paginatedCustomers}
          keyExtractor={customer => customer._id.toString()}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          scrollEnabled={false}
          renderItem={items => {
            const customerData = items.item;

            return (
              <CustomerCard
                customerData={customerData}
                index={items.index}
                lastIndex={props.paginatedCustomers.length - 1}
                onPress={() => {
                  /**
                   * Arahkan pengguna ke "CustomerDataDetails" screen ketika
                   * pengguna menekan salah satu kartu data pelanggan yang telah
                   * ditampilkan
                   */
                  props.navigate('Details', {
                    selectedCustomerId: customerData._id,
                  });
                }}
              />
            );
          }}
        />
      );
    } else {
      return <NoDataAttention message='Data tidak ditemukan' />;
    }
  } else {
    return (
      <NoDataAttention
        message={'Tidak ada data\n yang dapat ditampilkan saat ini.'}
      />
    );
  }
};

/**
 * Pengaturan awal untuk menyaring data pelanggan
 */
const initialFilterOptions = {
  fromDate: 0,

  /**
   * Setiap "CustomerDataShowcase" di re-render saya membutuhkan
   * nilai baru dari "Date.now()" itu mengapa "untilDate" ini
   * dibiarkan "undefined" untuk nilai awalnya dan INGAT state itu terisolasi
   */
  untilDate: undefined,

  bySearchQuery: '',
  byBrand: '',
  byStatusData: '',

  orderBy: 'createdAt',
  isReverseOrder: true,
};

/**
 * Pengaturan awal paginasi
 */
const initialPaginationOptions = {
  perPage: 5,
  totalPage: 1,
  currentPage: 1,
};

/**
 * Component untuk menampilkan data para pelanggan di `Home Screen` dengan
 * `FlatList` dan `Pagination`
 */
const CustomerDataShowcase = props => {
  const customers = useRealmObjects('customers');

  /**
   * State untuk memunculkan loading spinner sebelum
   * memuat data paginasi yang baru
   */
  const [isReloadPagination, setReloadPagination] = useState(true);

  const [filters, setFilters] = useState({
    ...initialFilterOptions,
    ...initialPaginationOptions,
  });

  /**
   *
   * @param {FILTER} newState
   */
  const setState = newState =>
    setFilters(prevState => ({...prevState, ...newState}));

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
        onSubmit={formData => {
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
            navigate={props.navigate}
          />
        )}
      </View>

      {filteredCustomers.length > filters.perPage && (
        <Pagination
          totalPage={filters.totalPage}
          currentPage={filters.currentPage}
          parentStyle={{marginBottom: 48}}
          onPress={page => {
            setReloadPagination(true);
            setState({currentPage: page});
          }}
        />
      )}
    </>
  );
};

export default CustomerDataShowcase;
