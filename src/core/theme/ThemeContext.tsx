import { createContext, useContext, ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setThemeOptionRedux } from "../store/settingsSlice";

export type ThemeOption = 'light' | 'dark' | 'pitch-black' | 'system';

interface ThemeContextType {
  themeOption: ThemeOption,
  setThemeOption: (option: ThemeOption) => void;
  activeThemeClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const themeOption = useSelector((state: RootState) => state.settings.themeOption) || 'dark';
  const systemColorScheme = useColorScheme();

  const setThemeOption = (option: ThemeOption) => {
    dispatch(setThemeOptionRedux(option));
  };

  const activeThemeClass = (() => {
    const effectiveTheme = themeOption === 'system' ? (systemColorScheme || 'dark') : themeOption;
    if (effectiveTheme === 'dark') return 'theme-dark';
    if (effectiveTheme === 'pitch-black') return 'theme-pitch-black';
    return ''; // default light theme
  })();

  return (
    <ThemeContext.Provider value={{ themeOption, setThemeOption, activeThemeClass }}>
      <View className={`${activeThemeClass} bg-background flex-1`}>
        <StatusBar style={activeThemeClass === '' ? 'dark' : 'light'} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}