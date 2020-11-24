import {TextEncoder} from 'fastestsmallesttextencoderdecoder';
import Joi from 'joi';

const antiSyntaxPattern = new RegExp(/^.*[<>{}\\].*$/s);
const numberSchema = Joi.number().default(0).min(0).failover(0);

const customerDataValidationSchema = Joi.object()
  .keys({
    _id: numberSchema,
    createdAt: numberSchema,
    updatedAt: numberSchema,

    name: Joi.string().trim().required().min(2).messages({
      'any.required': '"Nama Pelanggan" wajib diisi!',
      'string.empty': '"Nama Pelanggan" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah "Nama"',
    }),

    photo: Joi.string().allow('').default(''),

    deviceBrand: Joi.string().trim().required().min(2).messages({
      'any.required': '"Merek Perangkat" wajib diisi!',
      'string.empty': '"Merek Perangkat" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah nama "Merek"',
    }),
    deviceName: Joi.string().trim().empty('', null).default('-'),
    deviceColor: Joi.string().trim().required().min(2).messages({
      'any.required': '"Warna Perangkat" wajib diisi!',
      'string.empty': '"Warna Perangkat" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah "Warna"',
    }),
    deviceDamage: Joi.string().trim().required().min(2).messages({
      'any.required': '"Kerusakkan" wajib diisi!',
      'string.empty': '"Kerusakkan" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah "Kerusakkan"',
    }),

    serviceStatus: Joi.string()
      .required()
      .valid('onprocess', 'saved', 'complete', 'onwarranty', 'canceled'),
    servicePrice: numberSchema,
    serviceDownPayment: numberSchema,
    serviceFinishDate: numberSchema,

    timeEstimate: numberSchema,
    timeWarranty: numberSchema,

    notes: Joi.string().trim().empty('', null).default('-'),
  })
  .unknown(false);

const userDataValidationSchema = Joi.object()
  .keys({
    nameOfUser: Joi.string().trim().required().min(2).messages({
      'any.required': '"Nama Anda" wajib diisi!',
      'string.empty': '"Nama Anda" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah "Nama"',
    }),
    companyName: Joi.string().trim().required().min(2).messages({
      'any.required': '"Nama Toko/Usaha" wajib diisi!',
      'string.empty': '"Nama Toko/Usaha" wajib diisi!',
      'string.min': 'Minimal 2 huruf untuk sebuah "Nama"',
    }),
  })
  .unknown(false);

const validateCustomerData = obj =>
  customerDataValidationSchema.validateAsync(obj);

const validateUserBasicInfo = obj =>
  userDataValidationSchema.validateAsync(obj);

export {validateCustomerData, validateUserBasicInfo};
