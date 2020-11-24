import {createContext} from 'react';

/**
 * Theme context
 *
 * For now valid `themeUI` value is `"eva"` and `"material"`. Default is `"eva"`
 *
 * Valid `themeMode` value is only `"light"` and `"dark"`. Default is `"light"`
 */
const ThemeContext = createContext({
  themeUI: 'eva',
  setThemeUI: () => {},
  themeMode: 'light',
  setThemeMode: () => {},
});

export default ThemeContext;
