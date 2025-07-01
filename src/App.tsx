import { Container } from '@mui/material'
import { Header } from './components/Header'
import { ConfigSection } from './components/ConfigSection'
import { TimezoneList } from './components/TimezoneList'
import { AddButton } from './components/AddButton'
import { TimezoneProvider } from './contexts/TimezoneContext'
import { useQuerySync } from './hooks/useQuerySync'

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
    <TimezoneProvider>
      <SyncedApp />
    </TimezoneProvider>
  )
}

export default App