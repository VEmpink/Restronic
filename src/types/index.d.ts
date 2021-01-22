export type ConvertAllToOptionalProperty<T> = {
  [K in keyof T]-?: Record<string, unknown> extends Pick<T, K> ? K : never;
}[keyof T];

export type ReverseOptionalProperty<T> = Required<
  Pick<T, ConvertAllToOptionalProperty<T>>
> &
  Partial<Omit<T, ConvertAllToOptionalProperty<T>>> extends infer O
  ? {[K in keyof O]: O[K]}
  : never;

export type RootStackParamList = {
  Initial: undefined;
  Setup: undefined;
  Login: undefined;
  Home: undefined;
  Notifications: undefined;
  Settings: undefined;
  Form: {selectedCustomerId: number} | undefined;
  Details: {selectedCustomerId: number};
  ErrorScreen: undefined;
};

export type ResponseScreens = {
  hasLoaded?: boolean;
  hasUserData?: boolean;
  hasLogin?: boolean;
};

export type Userdata = {
  _id: number;
  createdAt: number;
  updatedAt: number;
  name: string;
  companyName: string;
  photo?: string;
  lastLocalBackupAt: number;
  lastCloudBackupAt: number;
  autoBackupStartDate: number;
  autoBackupTime?: number;
};

export type CustomerServiceStatus =
  | 'onprocess'
  | 'saved'
  | 'canceled'
  | 'onwarranty'
  | 'complete';

export type Customer = {
  _id: number;
  createdAt: number;
  updatedAt: number;

  name: string;
  photo: string;

  deviceBrand: string;
  deviceName: string;
  deviceColor: string;
  deviceDamage: string;

  serviceStatus: CustomerServiceStatus;
  servicePrice: number;
  serviceDownPayment: number;
  serviceFinishDate: number;

  timeEstimate: number;
  timeWarranty: number;

  notes: string;
};

export type Notification = {
  _id: number;
  createdAt: number;
  hasOpened: boolean;
  name: 'reminder' | 'info' | 'backup';
  title: string;
  message: string;
};

export type FilterOptions = {
  fromDate: number;
  untilDate?: number;
  bySearchQuery: string;
  byBrand: string;
  byStatusData: string;
  orderBy: string;
  isReverseOrder: boolean;
};

export type PaginationOptions = {
  perPage: number;
  totalPage: number;
  currentPage: number;
};
