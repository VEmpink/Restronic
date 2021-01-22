import Snackbar from 'react-native-snackbar';

/**
 * Show message with `react-native-snackbar`
 */
function show(
  type: 'error' | 'warning' | 'success' = 'error',
  message = 'Sample message!',
  isAutoClose = true,
): void {
  let bgColor = '#FF3D71';

  switch (type) {
    case 'success':
      bgColor = '#00E096';
      break;

    case 'warning':
      bgColor = '#FFAA00';
      break;

    default:
      break;
  }

  Snackbar.show({
    duration: isAutoClose ? Snackbar.LENGTH_LONG : Snackbar.LENGTH_INDEFINITE,
    text: message,
    backgroundColor: bgColor,
    action: {
      text: 'Close',
    },
  });
}

const snackbar = {
  show,
};

export default snackbar;
