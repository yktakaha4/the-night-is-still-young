import { Button } from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const AddButton = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const { timezones, setTimezones } = context

  const handleAdd = () => {
    const defaultTimezone = 'Asia/Tokyo'
    const alternativeTimezone = 'America/New_York'
    const newTimezone = timezones.includes(defaultTimezone)
      ? alternativeTimezone
      : defaultTimezone
    setTimezones([...timezones, newTimezone])
  }

  return (
    <Button variant="contained" onClick={handleAdd}>
      追加
    </Button>
  )
}