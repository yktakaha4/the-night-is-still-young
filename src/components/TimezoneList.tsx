import { Box, Typography, List } from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import { TimezoneListItem } from './TimezoneListItem'

export const TimezoneList = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const { timezones } = context

  return (
    <Box component="section" sx={{ mb: 2 }}>
      <Typography variant="h2" gutterBottom>
        一覧
      </Typography>
      <List>
        {timezones.map((timezone) => (
          <TimezoneListItem key={timezone} timezone={timezone} />
        ))}
      </List>
    </Box>
  )
}