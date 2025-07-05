import {
  ListItem,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'

interface TimezoneListItemProps {
  timezone: string
}

const timezones = Intl.supportedValuesOf('timeZone')

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
      setTimezones(
        selectedTimezones.map((tz) => (tz === timezone ? newValue : tz))
      )
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = dayjs.tz(event.target.value, format, timezone)
    if (newTime.isValid()) {
      setTime(newTime)
    }
  }

  return (
    <ListItem>
      <Autocomplete
        options={timezones}
        value={timezone}
        onChange={handleTimezoneChange}
        renderInput={(params) => <TextField {...params} label="国名" />}
        sx={{ width: 300 }}
      />
      <Typography>は</Typography>
      <TextField
        value={time.tz(timezone).format(format)}
        onChange={handleTimeChange}
        InputProps={{
          readOnly: mode === 'now',
        }}
        inputProps={{
          'data-testid': `time-input-${timezone}`,
        }}
      />
      <IconButton aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
