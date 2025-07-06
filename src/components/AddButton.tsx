import { Box, Button } from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import { timezoneData } from '../lib/timezones'

export const AddButton = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const { timezones, setTimezones } = context

  const handleAdd = () => {
    const newTimezone = timezoneData.find((tz) => !timezones.includes(tz.id))
    if (newTimezone) {
      setTimezones([...timezones, newTimezone.id])
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Button variant="contained" onClick={handleAdd}>
        タイムゾーンを追加
      </Button>
    </Box>
  )
}
