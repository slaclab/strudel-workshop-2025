import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

/**
 * MUI Theme object for setting app-wide and component-wide styles.
 * Specify colors, spacing, fonts, and more.
 * Learn more about theme options: https://mui.com/material-ui/customization/theming/
 */
export const theme = createTheme({
  // Color palette to use throughout the app
  palette: {
    mode: 'light',
    background: {
      default: '#F5F5F6',
      paper: '#fff',
    },
    primary: {
      main: '#8C1515', // Stanford Cardinal Red
      light: '#B83A4B',
      dark: '#5F0F0F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#928B81', // Stanford Stone (warm grey)
      light: '#B5AFA5',
      dark: '#706B63',
      contrastText: '#fff',
    },
    info: {
      main: '#006B81', // Complementary teal
      light: '#009FB8',
      dark: '#004A5A',
      contrastText: '#fff',
    },
    success: {
      main: '#175E54', // Deep teal-green
      light: '#2C8C7E',
      dark: '#0F3E37',
      contrastText: '#fff',
    },
    warning: {
      main: '#C69214', // Stanford gold
      light: '#E5AE3A',
      dark: '#8C6A0F',
      contrastText: '#fff',
    },
    error: {
      main: '#8C1515', // Use Cardinal Red for errors too
      light: '#B83A4B',
      dark: '#5F0F0F',
      contrastText: '#fff',
    },
    neutral: {
      main: '#DADADA',
      light: '#e0e0e0',
      dark: '#828282',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      50: '#ddd',
      500: '#999',
      900: '#444',
    },
  },
  // Control the default border radius
  shape: {
    borderRadius: 4,
  },
  // Control the font, size, and font weights
  typography: {
    htmlFontSize: 16,
    fontFamily: `"Helvetica", "Verdana", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  // Default options for MUI components used throughout the app
  components: {
    /**
     * Example component customization.
     * Learn more at https://mui.com/material-ui/customization/theme-components/
     * 
        MuiComponentName: {
          defaultProps: {
            // Put prop names and values here
          },
          styleOverrides: {
            root: {
              // Put styles here
            }
          },
          // Create new custom variants of certain components
          variants: [
            {
              props: { variant: '' },
              style: {
                // Put styles here
              },
            },
          ],
        },
     *
     */
    MuiButton: {
      variants: [
        {
          props: { color: 'neutral' },
          style: {
            backgroundColor: 'white',
            borderColor: '#bdbdbd',
            color: '#757575',
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: '4rem',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'grey.900',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        },
      },
    },
  },
});
