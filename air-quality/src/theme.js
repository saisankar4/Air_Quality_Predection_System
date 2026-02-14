import { createTheme } from '@mui/material/styles';

// AQI Color Palette
export const AQI_COLORS = {
  good: '#4CAF50',           // Green (0-50)
  satisfactory: '#8BC34A',   // Light Green (51-100)
  moderate: '#FFC107',       // Amber (101-200)
  poor: '#FF9800',           // Orange (201-300)
  veryPoor: '#F44336',       // Red (301-400)
  severe: '#8B0000',         // Dark Red (401+)
};

// Air Quality Labels
export const AQI_LEVELS = {
  good: { label: 'Good', min: 0, max: 50, color: AQI_COLORS.good },
  satisfactory: { label: 'Satisfactory', min: 51, max: 100, color: AQI_COLORS.satisfactory },
  moderate: { label: 'Moderate', min: 101, max: 200, color: AQI_COLORS.moderate },
  poor: { label: 'Poor', min: 201, max: 300, color: AQI_COLORS.poor },
  veryPoor: { label: 'Very Poor', min: 301, max: 400, color: AQI_COLORS.veryPoor },
  severe: { label: 'Severe', min: 401, max: 500, color: AQI_COLORS.severe },
};

// Get AQI level based on value
export const getAQILevel = (aqi) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'satisfactory';
  if (aqi <= 200) return 'moderate';
  if (aqi <= 300) return 'poor';
  if (aqi <= 400) return 'veryPoor';
  return 'severe';
};

// Get color for AQI value
export const getAQIColor = (aqi) => {
  const level = getAQILevel(aqi);
  return AQI_LEVELS[level].color;
};

// Create MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: AQI_COLORS.good,
    },
    warning: {
      main: AQI_COLORS.moderate,
    },
    error: {
      main: AQI_COLORS.severe,
    },
    aqi: {
      good: AQI_COLORS.good,
      satisfactory: AQI_COLORS.satisfactory,
      moderate: AQI_COLORS.moderate,
      poor: AQI_COLORS.poor,
      veryPoor: AQI_COLORS.veryPoor,
      severe: AQI_COLORS.severe,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
