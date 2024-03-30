import { ConfigProvider } from 'antd';
import { ThemeAppearance, ThemeProvider } from 'antd-style';
import { ReactNode, memo } from 'react';
import {
  APICODE_THEME_APPEARANCE,
} from '@/const/theme';
import { useGlobalStore } from '@/store/global';
import { settingsSelectors } from '@/store/global/selectors';
import { GlobalStyle } from '@/styles';
import { setCookie } from '@/utils/cookie';

export interface AppThemeProps {
  children?: ReactNode;
  defaultAppearance?: ThemeAppearance;
}

const AppTheme = memo<AppThemeProps>(
  ({ children, defaultAppearance }) => {
    const themeMode = useGlobalStore((s) => {
      return settingsSelectors.currentSettings(s).themeMode
    });
    return (
      <ThemeProvider
        defaultAppearance={defaultAppearance}
        onAppearanceChange={(appearance) => {
          setCookie(APICODE_THEME_APPEARANCE, appearance);
        }}
        themeMode={themeMode}
      >
        <GlobalStyle />
        <ConfigProvider>{children}</ConfigProvider>
      </ThemeProvider>
    );
  },
);

export default AppTheme;
