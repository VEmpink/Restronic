import PushNotification from 'react-native-push-notification';

import {Customer, Notification} from '../types';

/**
 * Periksa, apakah ada data pelanggan yang sudah habis
 * garansinya? Jika ada maka kirim notifikasinya
 */
function checkOnWarrantyCustomers(Realm: Realm): Promise<void> {
  return new Promise((resolve) => {
    const onWarrantyCustomers = Realm.objects<Customer>('customers').filtered(
      'serviceStatus == "onwarranty"',
    );
    const notifications = Realm.objects<Notification>('notifications');

    const notificationIds: number[] = [];
    if (!notifications.isEmpty()) {
      notifications.forEach((notif) => {
        notificationIds.push(notif._id);
      });
    }

    if (!onWarrantyCustomers.isEmpty()) {
      Realm.write(() => {
        let count = 0;
        const copyOnWarrantyCustomers = onWarrantyCustomers.toJSON();

        copyOnWarrantyCustomers.forEach((customer, i) => {
          const warrantyDate =
            customer.serviceFinishDate + customer.timeWarranty * 864e5;

          /**
           * Jika tanggal sekarang melebihi tanggal garansi yang ditentukan,
           * maka kirim notifikasinya
           */
          if (Date.now() >= warrantyDate) {
            count += 1;

            /**
             * Jika Id Notifikasi sudah ada di dalam database (Realm)
             * maka ubah notifikasi yang sudah ada, dan jika belum maka
             * tambahkan yang baru
             */
            if (notificationIds.includes(onWarrantyCustomers[i]._id)) {
              const notif = notifications.filtered(
                `_id = ${onWarrantyCustomers[i]._id}`,
              )[0];

              notif.createdAt = Date.now();
              notif.name = 'info';
              notif.title = 'Garansi telah habis!';
              notif.message =
                `Servisan milik "${onWarrantyCustomers[i].name}" telah ` +
                'habis garansinya';
              notif.hasOpened = false;
            } else {
              Realm.create('notifications', {
                /**
                 * Id Notifikasi adalah Id Pelanggan yang dinotifikasikan
                 */
                _id: onWarrantyCustomers[i]._id,
                createdAt: Date.now(),
                name: 'info',
                title: 'Garansi telah habis!',
                message:
                  `Servisan milik "${onWarrantyCustomers[i].name}" telah ` +
                  'habis garansinya',
              });
            }

            /**
             * Ubah status data pelanggan yang telah habis garansinya
             * menjadi "complete" atau "Telah selesai"
             */
            onWarrantyCustomers[i].serviceStatus = 'complete';
          }
        });

        if (count > 0) {
          PushNotification.localNotification({
            channelId: 'com.vempink.restronic.notification.info',
            title: 'Restronic: Info!',
            message: `${count} servisan telah habis garansinya!`,
            allowWhileIdle: false,
          });
        }
      });
    }

    resolve();
  });
}

export default checkOnWarrantyCustomers;
