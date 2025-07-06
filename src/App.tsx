import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material'
import { Header } from './components/Header'
import { ConfigSection } from './components/ConfigSection'
import { TimezoneList } from './components/TimezoneList'
import { AddButton } from './components/AddButton'
import { TimezoneProvider } from './contexts/TimezoneContext'
import { useQuerySync } from './hooks/useQuerySync'
import { Footer } from './components/Footer'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
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
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
})

const SyncedApp = () => {
  useQuerySync()
  return (
    <Container>
      <Header />
      <ConfigSection />
      <TimezoneList />
      <AddButton />
    </Container>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100svh',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TimezoneProvider>
            <SyncedApp />
          </TimezoneProvider>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
