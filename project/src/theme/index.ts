import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#E6F1FA',
    100: '#C0DEF5',
    200: '#9ACAEF',
    300: '#74B6E9',
    400: '#4EA2E4',
    500: '#3182CE', // Primary color
    600: '#2768A5',
    700: '#1C4D7C',
    800: '#123353',
    900: '#091A29',
  },
  success: {
    500: '#38A169',
  },
  warning: {
    500: '#DD6B20',
  },
  error: {
    500: '#E53E3E',
  },
};

const fonts = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
      color: mode('gray.800', 'white')(props),
      transition: 'background-color 0.2s ease-in-out',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: 'medium',
      _hover: {
        transform: 'translateY(-1px)',
        boxShadow: 'sm',
      },
      _active: {
        transform: 'translateY(0)',
      },
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.600',
        },
      }),
      outline: (props: any) => ({
        borderColor: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
      }),
    },
  },
  Card: {
    baseStyle: (props: any) => ({
      container: {
        bg: mode('white', 'gray.800')(props),
        boxShadow: 'md',
        borderRadius: 'lg',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        _hover: {
          boxShadow: 'lg',
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
  space: {
    '1': '0.25rem', // 4px
    '2': '0.5rem',  // 8px
    '3': '0.75rem', // 12px
    '4': '1rem',    // 16px
    '5': '1.25rem', // 20px
    '6': '1.5rem',  // 24px
    '8': '2rem',    // 32px
    '10': '2.5rem', // 40px
    '12': '3rem',   // 48px
    '16': '4rem',   // 64px
  },
});

export default theme;