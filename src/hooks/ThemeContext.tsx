import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { accentColors, DarkTheme, LightTheme } from "../styles/Theme";
import generateShades from "../styles/generateAccentShades";

interface ThemeType {
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  text: string
  textSecondary: string
  primary: string
  secondary: string
  tertiary: string
  navbar: string
  card: string
  border: string
  borderSecondary: string
  // borderTertiary: string
  inputBackground: string
  inputBorder: string
  placeholder: string
  disabledButton: string
  success: string
  successBackground: string
  warning: string
  warningBackground: string
  error: string
  errorBackground: string
  shadow: string
  ripple: string
  toast: string
};
// Define the shape of the context value
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: (selectedTheme: ThemeMode) => Promise<void>;
  themeSelected: ThemeMode;
  accentColor: string;
  toggleAccentColor: (color: string) => Promise<void>;
  font: string;
  changeFont: (font: string) => Promise<void>;
  selectedFontSize: number;
  changeFontSize: (size: number) => Promise<void>;
  fontScale: number;
  themeStyles: ThemeType;
  isDark: boolean;
  accentShades: ShadesType;
}

type ShadesType = {
  shade1: string;
  shade2: string;
  shade3: string;
  shade4: string;
  shade5: string;
  shade6: string;
};

type ThemeMode = "light" | "dark" | "system";

// Define the provider prop types
interface ThemeProviderProps {
  children: ReactNode;
}

// Create context with a default `undefined` value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [accentColor, setAccentColor] = useState<string>(accentColors[0]?.hex || "#4F47E5");
  const [themeSelected, setThemeSelected] = useState<ThemeMode>("system");
  const [font, setFont] = useState<string>("Default");
  const [selectedFontSize, setSelectedFontSize] = useState<number>(1);
  const [fontScale, setFontScale] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const initializePreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("themeMode");
        const systemTheme: ColorSchemeName = Appearance.getColorScheme() || "light";

        if (storedTheme) {
          setThemeSelected(storedTheme as ThemeMode);
          setTheme(storedTheme === "system" ? (systemTheme as ThemeMode) : (storedTheme as ThemeMode));
        } else {
          setThemeSelected("system");
          await AsyncStorage.setItem("themeMode", "system");
          setTheme(systemTheme as ThemeMode);
        }

        const storedAccentColor = await AsyncStorage.getItem("accentColor") || accentColors[0]?.hex || "#4F47E5";
        const storedFont = await AsyncStorage.getItem("font") || "Default";
        const storedFontSize = await AsyncStorage.getItem("fontSize") || 1;
        const deviceFontScale = await DeviceInfo.getFontScale();

        setAccentColor(storedAccentColor);
        setFont(storedFont);
        setSelectedFontSize(Number(storedFontSize));
        setFontScale(deviceFontScale);

        setIsReady(true);
      } catch (error) {
        console.error("Error loading preferences", error);
      }
    };

    initializePreferences();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem("themeMode").then((storedTheme) => {
        if (storedTheme === "system") {
          setTheme((colorScheme || "light") as ThemeMode);
          setThemeSelected((colorScheme || "light") as ThemeMode);
        }
      });
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = async (selectedTheme: ThemeMode): Promise<void> => {
    setThemeSelected(selectedTheme);
    try {
      if (selectedTheme === "system") {
        const systemTheme: ColorSchemeName = Appearance.getColorScheme() || "light";
        setTheme(systemTheme as ThemeMode);
        await AsyncStorage.setItem("themeMode", "system");
      } else {
        setTheme(selectedTheme);
        await AsyncStorage.setItem("themeMode", selectedTheme);
      }
    } catch (error) {
      console.error("Error saving theme to AsyncStorage:", error);
    }
  };

  const toggleAccentColor = async (selectedAccentColor: string): Promise<void> => {
    setAccentColor(selectedAccentColor);
    try {
      await AsyncStorage.setItem("accentColor", selectedAccentColor);
    } catch (error) {
      console.error("Error saving accent color to AsyncStorage:", error);
    }
  };

  const changeFont = async (selectedFont: string): Promise<void> => {
    setFont(selectedFont);
    try {
      await AsyncStorage.setItem("font", selectedFont);
    } catch (error) {
      console.error("Error saving font to AsyncStorage:", error);
    }
  };

  const changeFontSize = async (selectedFontSizeText: number): Promise<void> => {
    setSelectedFontSize(Number(selectedFontSizeText));
    try {
      await AsyncStorage.setItem("fontSize", selectedFontSizeText.toString());
    } catch (error) {
      console.error("Error saving font size to AsyncStorage:", error);
    }
  };

  if (!isReady) return null;

  const isDark = theme === "dark";
  const themeStyles = isDark ? DarkTheme : LightTheme
  const accentShades = isDark ?
    {
      shade1: generateShades(accentColor).dark1,
      shade2: generateShades(accentColor).dark2,
      shade3: generateShades(accentColor).dark3,
      shade4: generateShades(accentColor).dark4,
      shade5: generateShades(accentColor).dark5,
      shade6: generateShades(accentColor).dark6,
    }
    :
    {
      shade1: generateShades(accentColor).light1,
      shade2: generateShades(accentColor).light2,
      shade3: generateShades(accentColor).light3,
      shade4: generateShades(accentColor).light4,
      shade5: generateShades(accentColor).light5,
      shade6: generateShades(accentColor).light6,
    }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        themeSelected,
        accentColor,
        toggleAccentColor,
        font,
        changeFont,
        selectedFontSize,
        changeFontSize,
        fontScale,
        themeStyles,
        isDark,
        accentShades
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
