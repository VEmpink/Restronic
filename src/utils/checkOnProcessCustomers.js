import PushNotification from 'react-native-push-notification';

/**
 * Periksa, apakah ada data pelanggan yang sudah melewati
 * waktu perkiraan selesai? Jika ada maka kirim notifikasinya
 * @param {Realm} Realm
 */
const checkOnProcessCustomers = Realm => {
  return new Promise((resolve, reject) => {
    const onProcessCustomers = Realm.objects('customers').filtered(
      'serviceStatus == "onprocess"',
    );
    const notifications = Realm.objects('notifications');

    let notificationIds = [];
    if (!notifications.isEmpty()) {
      notifications.forEach(notif => {
        notificationIds.push(notif._id);
      });
    }

    if (!onProcessCustomers.isEmpty()) {
      Realm.write(() => {
        let count = 0;

        onProcessCustomers.forEach((customer, i) => {
          const estimateDate =
            customer.createdAt + customer.timeEstimate * 864e5;

          /**
           * Jika tanggal sekarang melebihi tanggal perkiraan selesai, maka
           * kirim notifikasinya
           */
          if (Date.now() >= estimateDate) {
            count++;

            /**
             * Jika Id Notifikasi sudah ada di dalam database (Realm)
             * maka ubah notifikasi yang sudah ada, dan jika belum maka
             * tambahkan yang baru
             */
            if (notificationIds.includes(onProcessCustomers[i]._id)) {
              let notif = notifications.filtered(
                `_id = ${onProcessCustomers[i]._id}`,
              )[0];

              notif.createdAt = Date.now();
              notif.name = 'reminder';
              notif.title = 'Waktu perkiraan terlampaui!';
              notif.message =
                `Servisan milik "${onProcessCustomers[i].name}" telah ` +
                'melampaui waktu perkiraan selesai, mohon untuk ' +
                'segera diproses sekarang juga!';
              notif.hasOpened = false;
            } else {
              Realm.create('notifications', {
                /**
                 * Id Notifikasi adalah Id Pelanggan yang dinotifikasikan
                 */
                _id: onProcessCustomers[i]._id,
                createdAt: Date.now(),
                name: 'reminder',
                title: 'Waktu perkiraan terlampaui!',
                message:
                  `Servisan milik "${onProcessCustomers[i].name}" telah ` +
                  'melampaui waktu perkiraan selesai, mohon untuk ' +
                  'segera diproses sekarang juga!',
              });
            }
          }
        });

        if (count > 0) {
          PushNotification.localNotification({
            channelId: 'com.vempink.restronic.notification.reminder',
            title: 'Restronic: Pengingat!',
            message: `${count} servisan melampaui waktu perkiraan selesai!`,
            allowWhileIdle: false,
          });
        }
      });
    }

    resolve();
  });
};

export default checkOnProcessCustomers;
