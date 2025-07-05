import { Box, Button } from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const AddButton = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const { timezones, setTimezones } = context

  const handleAdd = () => {
    const newTimezone = 'America/New_York'
    if (!timezones.includes(newTimezone)) {
      setTimezones([...timezones, newTimezone])
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Button variant="contained" onClick={handleAdd}>
        Add Timezone
      </Button>
    </Box>
  )
}