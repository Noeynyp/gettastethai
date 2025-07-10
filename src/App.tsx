import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import WelcomePage from './pages/WelcomePage';
import AssessmentPage from './pages/AssessmentPage';
import ResultPage from './pages/ResultPage';
import GuidelinePage from './pages/GuidelinePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const theme = createTheme({
  palette: {
    primary: { main: '#910811' },
       // GET TASTE THAI Red
    secondary: { main: '#059669' },
    warning: { main: '#F59E0B' },
    info: { main: '#D97706' },
    background: { default: '#fff' },
  },
  typography: {
    fontFamily: ['Inter', 'Noto Sans Thai', 'sans-serif'].join(','),
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          maxWidth: '100vw',
          overflowX: 'hidden',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ width: '100%', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/guidelines" element={<GuidelinePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
