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
import { useContext, useState, useEffect, useMemo } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { timezoneData, timezoneMap } from '../lib/timezones'

interface TimezoneListItemProps {
  timezone: string
}

const filterOptions = createFilterOptions({
  stringify: (option: (typeof timezoneData)[number]) => {
    return option.label
  },
})

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

  const selectedTimezoneData = useMemo(
    () => timezoneMap.get(timezone),
    [timezone],
  )

  useEffect(() => {
    if (context && !isFocused) {
      const { mode, time, format, baseTime, baseTimezone } = context
      if (mode === 'base') {
        const baseDateTime = dayjs.tz(baseTime.format(format), baseTimezone)
        setInputValue(baseDateTime.tz(timezone).format(format))
      } else {
        setInputValue(time.tz(timezone).format(format))
      }
    }
  }, [context, timezone, isFocused])

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
    newValue: (typeof timezoneData)[number] | null,
  ) => {
    if (newValue) {
      if (selectedTimezones.includes(newValue.id)) {
        setTimezones(selectedTimezones.filter((tz) => tz !== timezone))
      } else {
        setTimezones(
          selectedTimezones.map((tz) => (tz === timezone ? newValue.id : tz)),
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
            options={timezoneData}
            value={selectedTimezoneData}
            onChange={handleTimezoneChange}
            filterOptions={filterOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label="タイムゾーン" />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props as any
              return (
                <Box component="li" key={key} {...rest}>
                  {option.label}
                </Box>
              )
            }}
            sx={{ width: '100%', flex: 1 }}
          />
          <Typography>は</Typography>
        </Stack>
        <TextField
          value={inputValue}
          onChange={handleTimeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            readOnly: mode !== 'manual',
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
