import React from 'react';
import './App.css';
import { Form } from './components';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          height: '1.2em',
          padding: '12px 14px !important',
        },
      },
    },
  },
  palette: {
    background: {
      default: '#293557',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Form />
    </ThemeProvider>
    
  );
}

export default App;
