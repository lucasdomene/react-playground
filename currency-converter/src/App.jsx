import { useState, useEffect } from 'react';
import './App.css';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000000',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#000000',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Fetch available currencies
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      // Fetch conversion rate
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then((response) => response.json())
        .then((data) => {
          const rate = data.rates[toCurrency];
          setResult(amount * rate);
        });
    }
  }, [amount, fromCurrency, toCurrency]);

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <FontAwesomeIcon icon={faDollarSign} size="3x" />
      </div>
      <h1>Currency Converter</h1>
      <div>
        <TextField
          type="number"
          placeholder="Enter amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          fullWidth
          margin="normal"
          style={{ marginBottom: '16px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{fromCurrency}</InputAdornment>
            ),
          }}
        />
        <Select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          style={{ marginBottom: '16px' }}
        >
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          style={{ marginBottom: '16px' }}
        >
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={swapCurrencies}
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          ⇄ Swap Currencies
        </Button>
        <div
          style={{ marginTop: '16px', fontSize: '1.5em', fontWeight: 'bold' }}
        >
          {result !== null && (
            <p>Converted Amount: {formatCurrency(result, toCurrency)}</p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
