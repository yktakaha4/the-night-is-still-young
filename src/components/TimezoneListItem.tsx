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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useContext, useState, useEffect } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'
import { getCountryForTimezone } from 'countries-and-timezones'
import utc from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

dayjs.extend(utc)
dayjs.extend(timezonePlugin)

interface TimezoneListItemProps {
  timezone: string
}

const timezones = Intl.supportedValuesOf('timeZone')

const getCountryName = (timezone: string) => {
  const country = getCountryForTimezone(timezone)
  return country ? country.name : null
}

const getUTCOffset = (timezone: string) => {
  return dayjs().tz(timezone).format('Z')
}

const filterOptions = createFilterOptions({
  stringify: (option: string) => {
    const countryName = getCountryName(option)
    const utcOffset = getUTCOffset(option)
    return `${option} ${countryName || ''} ${utcOffset}`
  },
})

const getOptionLabel = (option: string) => {
  const countryName = getCountryName(option)
  const utcOffset = getUTCOffset(option)
  const details = [countryName, utcOffset].filter(Boolean).join(', ')
  return `${option} (${details})`
}

export const TimezoneListItem = ({ timezone }: TimezoneListItemProps) => {
  const context = useContext(TimezoneContext)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timezone })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  }

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

  useEffect(() => {
    if (!isFocused) {
      setInputValue(time.tz(timezone).format(format))
    }
  }, [time, timezone, format, isFocused])

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
    const newValue = event.target.value
    setInputValue(newValue)

    try {
      const newTime = dayjs.tz(newValue, format, timezone)
      if (newTime.isValid()) {
        setTime(newTime)
      }
    } catch (e) {
      // ignore invalid date format
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    const newTime = dayjs.tz(inputValue, format, timezone)
    if (!newTime.isValid()) {
      setInputValue(time.tz(timezone).format(format))
    }
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{ p: 2, display: 'flex', alignItems: 'center' }}
      role="listitem"
    >
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', mr: 1 }}>
        <DragIndicatorIcon />
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ flex: 1 }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: '100%', flex: 1 }}
        >
          <Autocomplete
            options={timezones}
            value={timezone}
            onChange={handleTimezoneChange}
            filterOptions={filterOptions}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} label="Timezone" />}
            renderOption={(props, option) => {
              const { key, ...rest } = props as any
              const countryName = getCountryName(option)
              const utcOffset = getUTCOffset(option)
              const details = [countryName, utcOffset]
                .filter(Boolean)
                .join(', ')
              return (
                <Box component="li" key={key} {...rest}>
                  {option}
                  {details && (
                    <Typography
                      variant="caption"
                      sx={{ ml: 1, color: 'gray' }}
                    >
                      ({details})
                    </Typography>
                  )}
                </Box>
              )
            }}
            sx={{ width: '100%', flex: 1 }}
          />
          <Typography>is</Typography>
        </Stack>
        <TextField
          value={inputValue}
          onChange={handleTimeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            readOnly: mode === 'now',
          }}
          inputProps={{
            'data-testid': `time-input-${timezone}`,
          }}
          sx={{ width: '100%', flex: 1 }}
        />
        <IconButton aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
