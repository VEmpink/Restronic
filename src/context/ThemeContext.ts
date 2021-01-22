import {createContext, Dispatch, SetStateAction} from 'react';

type ThemeContextTypes = {
  themeUI: string;
  setThemeUI: Dispatch<SetStateAction<string>>;
  themeMode: 'light' | 'dark';
  setThemeMode: Dispatch<SetStateAction<'light' | 'dark'>>;
};

/**
 * Theme context
 *
 * For now valid `themeUI` value is `"eva"` and `"material"`. Default is `"eva"`
 *
 * Valid `themeMode` value is only `"light"` and `"dark"`. Default is `"light"`
 */
const ThemeContext = createContext<ThemeContextTypes>({
  themeUI: 'eva',
  setThemeUI: () => {},
  themeMode: 'light',
  setThemeMode: () => {},
});

export default ThemeContext;
