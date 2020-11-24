import Snackbar from 'react-native-snackbar';

/**
 * Show message with `react-native-snackbar`
 * @param {'error' | 'warning' | 'success'} type default `"error"`
 */
function show(type = 'error', message = 'Sample message!', isAutoClose = true) {
  let bgColor = '#FF3D71';

  switch (type) {
    case 'success':
      bgColor = '#00E096';
      break;

    case 'warning':
      bgColor = '#FFAA00';
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

export default {
  show,
};
