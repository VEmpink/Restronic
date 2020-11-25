import {TextEncoder} from 'fastestsmallesttextencoderdecoder';
import Joi from 'joi';

const antiSyntaxPattern = new RegExp(/^.*[<>{}\\].*$/s);
const antiDoubleSpaces = new RegExp(/\s{2,}/g);
const numberSchemaOptional = Joi.number().default(0).min(0).failover(0);
const stringSchemaOptional = Joi.string()
  .trim()
  .replace(antiDoubleSpaces, ' ')
  .empty('', null)
  .default('-');
const stringSchemaRequired = (label = 'Label') =>
  Joi.string()
    .trim()
    .required()
    .min(2)
    .replace(antiDoubleSpaces, ' ')
    .messages({
      'any.required': `${label} wajib diisi!`,
      'string.empty': `${label} wajib diisi!`,
      'string.min': 'Minimal 2 huruf',
    });

const customerDataValidationSchema = Joi.object()
  .keys({
    _id: numberSchemaOptional,
    createdAt: numberSchemaOptional,
    updatedAt: numberSchemaOptional,

    name: stringSchemaRequired('Nama Pelanggan'),
    photo: stringSchemaOptional,

    deviceBrand: stringSchemaRequired('Merek Perangkat'),
    deviceName: stringSchemaOptional,
    deviceColor: stringSchemaRequired('Warna Perangkat'),
    deviceDamage: stringSchemaRequired('Kerusakkan'),

    serviceStatus: Joi.string()
      .required()
      .valid('onprocess', 'saved', 'complete', 'onwarranty', 'canceled'),
    servicePrice: numberSchemaOptional,
    serviceDownPayment: numberSchemaOptional,
    serviceFinishDate: numberSchemaOptional,

    timeEstimate: numberSchemaOptional,
    timeWarranty: numberSchemaOptional,

    notes: stringSchemaOptional,
  })
  .unknown(false);

const userDataValidationSchema = Joi.object()
  .keys({
    name: stringSchemaRequired('Nama Anda'),
    companyName: stringSchemaRequired('Nama Toko/Usaha'),
  })
  .unknown(false);

const validateCustomerData = obj =>
  customerDataValidationSchema.validateAsync(obj);

const validateUserBasicInfo = obj =>
  userDataValidationSchema.validateAsync(obj);

export {validateCustomerData, validateUserBasicInfo};
