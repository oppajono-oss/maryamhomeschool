import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#58CC02', // Duolingo-like green
      light: '#79E61F',
      dark: '#2E8B00',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFD166', // Kuning hangat
      light: '#FFE29B',
      dark: '#E6B34A',
      contrastText: '#333333'
    },
    background: {
      default: '#F3FAEF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#555555'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#58CC02'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#58CC02',
      marginBottom: '1.25rem'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#58CC02',
      marginBottom: '0.75rem'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#58CC02'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12
          }
        }
      }
    }
  }
});

export default theme;