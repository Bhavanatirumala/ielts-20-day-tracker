import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2' },
          secondary: { main: '#ff4081' },
          background: { default: '#f5f7fa', paper: '#fff' },
          success: { main: '#4caf50' },
          error: { main: '#f44336' },
          warning: { main: '#ff9800' },
          info: { main: '#2196f3' },
        }
      : {
          primary: { main: '#90caf9' },
          secondary: { main: '#f48fb1' },
          background: { default: '#181c24', paper: '#23293a' },
          success: { main: '#66bb6a' },
          error: { main: '#ef5350' },
          warning: { main: '#ffa726' },
          info: { main: '#29b6f6' },
          text: {
            primary: '#fff',
            secondary: '#b0b8c1',
            disabled: '#6c757d',
          },
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

export default getTheme; 