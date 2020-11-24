import React, {useContext, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import FirstColumnInputs from './Inputs/FirstColumnInputs';
import SecondColumnInputs from './Inputs/SecondColumnInputs';
import ThirdColumnInputs from './Inputs/ThirdColumnInputs';
import {validateCustomerData} from '../../schemas/joi.schema';
import {RealmContext} from '../../contexts';
import _ from 'lodash';
import util from '../../utils';

const BodyMainForm = props => {
  const {isEditMode, selectedCustomerId} = props;
  const {Realm} = useContext(RealmContext);

  const FirstColumnInputs_Ref = useRef();
  const SecondColumnInputs_Ref = useRef();
  const ThirdColumnInputs_Ref = useRef();

  useEffect(() => {
    if (isEditMode) {
      const customer = Realm.objects('customers')
        .filtered(`_id = ${selectedCustomerId}`)
        .toJSON()[0];

      FirstColumnInputs_Ref.current.setInputData(
        _.pick(customer, ['createdAt', 'name', 'photo', 'deviceBrand']),
      );
      SecondColumnInputs_Ref.current.setInputData(
        _.pick(customer, [
          'deviceName',
          'deviceColor',
          'deviceDamage',
          'timeEstimate',
        ]),
      );
      ThirdColumnInputs_Ref.current.setInputData(
        _.pick(customer, ['servicePrice', 'serviceDownPayment', 'notes']),
      );
    }
  }, []);

  return (
    <>
      <FirstColumnInputs
        onSubmitAtLastField={() => SecondColumnInputs_Ref.current.focus()}
        ref={FirstColumnInputs_Ref}
      />

      <SecondColumnInputs
        onSubmitAtLastField={() => ThirdColumnInputs_Ref.current.focus()}
        ref={SecondColumnInputs_Ref}
      />

      <ThirdColumnInputs ref={ThirdColumnInputs_Ref} />

      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <Button
          status={isEditMode ? 'warning' : 'primary'}
          accessoryLeft={propsAcc => (
            <Icon
              {...propsAcc}
              name={isEditMode ? 'edit-outline' : 'person-add-outline'}
            />
          )}
          onPress={async () => {
            try {
              const formData = {
                /**
                 * Added by User
                 */
                ...FirstColumnInputs_Ref.current.getInputData(),
                ...SecondColumnInputs_Ref.current.getInputData(),
                ...ThirdColumnInputs_Ref.current.getInputData(),

                /**
                 * Added by Server
                 */
                _id: Date.now(),
                updatedAt: Date.now(),
                serviceStatus: 'onprocess',
                serviceFinishDate: Date.now(),
                timeWarranty: 0,
              };

              const validFormData = await validateCustomerData(formData);

              Realm.write(() => {
                if (!isEditMode) {
                  Realm.create('customers', validFormData);

                  FirstColumnInputs_Ref.current.resetValues();
                  SecondColumnInputs_Ref.current.resetValues();
                  ThirdColumnInputs_Ref.current.resetValues();

                  util.snackbar.show('success', 'Data berhasil ditambahkan!');
                } else {
                  const customer = Realm.objects('customers').filtered(
                    `_id = ${selectedCustomerId}`,
                  );

                  /**
                   * Update all customer property except the "_id"
                   */
                  Object.keys(validFormData).forEach(key => {
                    if (key !== '_id') {
                      customer.update(
                        key,
                        key === 'updatedAt' ? Date.now() : validFormData[key],
                      );
                    }
                  });

                  util.snackbar.show('success', 'Data berhasil diubah!');
                  props.navigation.goBack();
                }
              });
            } catch (error) {
              if (error.name === 'ValidationError') {
                const errorObjPropName = error.details[0].context.label;
                FirstColumnInputs_Ref.current.setFieldError(errorObjPropName);
                SecondColumnInputs_Ref.current.setFieldError(errorObjPropName);

                util.snackbar.show('error', error.details[0].message);
              } else {
                util.snackbar.show(
                  'error',
                  isEditMode
                    ? 'Gagal mengubah data pelanggan!'
                    : 'Gagal menambahkan data pelanggan!',
                  false,
                );
              }
            }
          }}
        >
          {isEditMode ? 'Ubah data' : 'Tambahkan'}
        </Button>
      </View>
    </>
  );
};

export default BodyMainForm;
