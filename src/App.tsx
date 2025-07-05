import {
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
    <Container sx={{ mt: 4 }}>
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
      <TimezoneProvider>
        <SyncedApp />
      </TimezoneProvider>
    </ThemeProvider>
  )
}

export default App