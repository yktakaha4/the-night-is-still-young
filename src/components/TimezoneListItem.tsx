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

  const { time, format, timezones: selectedTimezones, setTimezones } = context

  const handleDelete = () => {
    setTimezones(selectedTimezones.filter((tz) => tz !== timezone))
  }

  const handleChange = (
    _event: unknown,
    newValue: string | null
  ) => {
    if (newValue) {
      setTimezones(
        selectedTimezones.map((tz) => (tz === timezone ? newValue : tz))
      )
    }
  }

  return (
    <ListItem>
      <Autocomplete
        options={timezones}
        value={timezone}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label="国名" />}
        sx={{ width: 300 }}
      />
      <Typography>は</Typography>
      <TextField value={time.tz(timezone).format(format)} />
      <IconButton aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
