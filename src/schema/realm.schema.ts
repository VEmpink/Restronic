import {ObjectSchema} from 'realm';

const D = Date.now();

const user: ObjectSchema = {
  name: 'user',
  primaryKey: '_id',
  properties: {
    _id: {type: 'int', default: D},
    createdAt: {type: 'int', default: D},
    updatedAt: {type: 'int', default: D},
    name: 'string',
    companyName: 'string',
    photo: 'string?',
    lastLocalBackupAt: {type: 'int', default: D},
    lastCloudBackupAt: {type: 'int', default: D},
    autoBackupStartDate: {type: 'int', default: D},
    autoBackupTime: 'int?',
  },
};

const customers: ObjectSchema = {
  name: 'customers',
  primaryKey: '_id',
  properties: {
    _id: 'int',
    createdAt: 'int',
    updatedAt: 'int',

    name: 'string',
    photo: 'string',

    deviceBrand: 'string',
    deviceName: 'string',
    deviceColor: 'string',
    deviceDamage: 'string',

    serviceStatus: 'string',
    servicePrice: 'int',
    serviceDownPayment: 'int',
    serviceFinishDate: 'int',

    timeEstimate: 'int',
    timeWarranty: 'int',

    notes: 'string',
  },
};

const notifications: ObjectSchema = {
  name: 'notifications',
  primaryKey: '_id',
  properties: {
    _id: 'int',
    createdAt: 'int',
    hasOpened: {type: 'bool', default: false},
    name: 'string',
    title: 'string',
    message: 'string',
  },
};

export default [user, customers, notifications];
