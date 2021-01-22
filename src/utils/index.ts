import checkOnProcessCustomers from './checkOnProcessCustomers';
import checkOnWarrantyCustomers from './checkOnWarrantyCustomers';
import GoogleDrive from './googleDrive';
import backupDatabase from './backupDatabase';
import checkAutoBackupDate from './checkAutoBackupDate';
import showRestoreDataDialog from './showRestoreDataDialog';
import snackbar from './snackbar';

/**
 * A log for DEV MODE with background color is green
 * and text color is black in the terminal/cmd
 */
function log(message: string) {
  console.log('\x1b[42m', '\x1b[30m', `===== ${message} =====`, '\x1b[0m');
}

/**
 * Validate image base64
 */
function isValidImageBase64(base64: any) {
  const pattern = new RegExp(
    /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/,
  );
  return pattern.test(base64);
}

/**
 * Convert big number to `K`, `M`, `B`, `T` like `500K`, `1M`, `37.6B` etc
 */
function shortNumber(number: number) {
  switch (true) {
    case number >= 1e3 && number < 1e6:
      return `Rp ${number / 1e3}rb`;
    case number >= 1e6 && number < 1e9:
      return `Rp ${number / 1e6}jt`;
    case number >= 1e9 && number < 1e12:
      return `Rp ${number / 1e9}M`;
    case number >= 1e12:
      return `Rp ${number / 1e12}T`;
    default:
      return `Rp ${number}`;
  }
}

export default {
  log,
  isValidImageBase64,
  shortNumber,
  snackbar,

  checkOnProcessCustomers,
  checkOnWarrantyCustomers,
  GoogleDrive,
  backupDatabase,
  checkAutoBackupDate,
  showRestoreDataDialog,
};
