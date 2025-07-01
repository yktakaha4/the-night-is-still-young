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
    // Add a default timezone for now. This will be improved later.
    setTimezones([...timezones, 'America/New_York'])
  }

  return (
    <Button variant="contained" onClick={handleAdd}>
      追加
    </Button>
  )
}