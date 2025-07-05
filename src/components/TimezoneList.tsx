import { Box, Typography, List, Stack } from '@mui/material'
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
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Timezones
      </Typography>
      <Stack spacing={2}>
        {timezones.map((timezone) => (
          <TimezoneListItem key={timezone} timezone={timezone} />
        ))}
      </Stack>
    </Box>
  )
}