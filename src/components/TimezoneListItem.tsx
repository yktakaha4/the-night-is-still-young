import {
  Typography,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  Stack,
  Box,
  createFilterOptions,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'
import { getCountryForTimezone } from 'countries-and-timezones'

interface TimezoneListItemProps {
  timezone: string
}

const timezones = Intl.supportedValuesOf('timeZone')

const getCountryName = (timezone: string) => {
  const country = getCountryForTimezone(timezone)
  return country ? country.name : null
}

const filterOptions = createFilterOptions({
  stringify: (option: string) => {
    const countryName = getCountryName(option)
    return `${option} ${countryName || ''}`
  },
})

const getOptionLabel = (option: string) => {
  return option
}

export const TimezoneListItem = ({ timezone }: TimezoneListItemProps) => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const {
    time,
    setTime,
    format,
    timezones: selectedTimezones,
    setTimezones,
    mode,
  } = context

  const handleDelete = () => {
    setTimezones(selectedTimezones.filter((tz) => tz !== timezone))
  }

  const handleTimezoneChange = (
    _event: unknown,
    newValue: string | null
  ) => {
    if (newValue) {
      if (selectedTimezones.includes(newValue)) {
        // If the new timezone already exists, just remove the current one.
        setTimezones(selectedTimezones.filter((tz) => tz !== timezone))
      } else {
        // Otherwise, replace the current timezone with the new one.
        setTimezones(
          selectedTimezones.map((tz) => (tz === timezone ? newValue : tz))
        )
      }
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newTime = dayjs.tz(event.target.value, format, timezone)
      if (newTime.isValid()) {
        setTime(newTime)
      }
    } catch (e) {
      // ignore invalid date format
    }
  }

  return (
    <Paper sx={{ p: 2 }} role="listitem">
      <Stack direction="row" spacing={2} alignItems="center">
        <Autocomplete
          options={timezones}
          value={timezone}
          onChange={handleTimezoneChange}
          filterOptions={filterOptions}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => <TextField {...params} label="Timezone" />}
          renderOption={(props, option) => {
            const countryName = getCountryName(option)
            return (
              <Box component="li" {...props}>
                {option}
                {countryName && (
                  <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
                    ({countryName})
                  </Typography>
                )}
              </Box>
            )
          }}
          sx={{ flex: 1 }}
        />
        <Typography>is</Typography>
        <TextField
          value={time.tz(timezone).format(format)}
          onChange={handleTimeChange}
          InputProps={{
            readOnly: mode === 'now',
          }}
          inputProps={{
            'data-testid': `time-input-${timezone}`,
          }}
          sx={{ flex: 1 }}
        />
        <IconButton aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
