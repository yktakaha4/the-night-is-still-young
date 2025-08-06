import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Stack,
  Paper,
  Popover,
  IconButton,
  Autocomplete,
  createFilterOptions,
} from '@mui/material'
import { useContext, useState } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { timezoneData, timezoneMap } from '../lib/timezones'
import dayjs from '../lib/dayjs'

const formatLegend = `
  YYYY: 4-digit year
  MM: 2-digit month (01-12)
  DD: 2-digit day of month (01-31)
  HH: 2-digit hour (00-23)
  mm: 2-digit minute (00-59)
  ss: 2-digit second (00-59)
`

const filterOptions = createFilterOptions({
  stringify: (option: (typeof timezoneData)[number]) => {
    return option.label
  },
})

export const ConfigSection = () => {
  const context = useContext(TimezoneContext)
  const [formatAnchorEl, setFormatAnchorEl] =
    useState<HTMLButtonElement | null>(null)
  const [modeAnchorEl, setModeAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  )
  const [baseTimeInput, setBaseTimeInput] = useState<string>('')

  if (!context) {
    return null
  }

  const {
    format,
    setFormat,
    mode,
    setMode,
    baseTime,
    setBaseTime,
    baseTimezone,
    setBaseTimezone,
  } = context

  useState(() => {
    setBaseTimeInput(baseTime.format(format))
  })

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'now' | 'manual' | 'base' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleFormatPopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFormatAnchorEl(event.currentTarget)
  }

  const handleFormatPopoverClose = () => {
    setFormatAnchorEl(null)
  }

  const handleModePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setModeAnchorEl(event.currentTarget)
  }

  const handleModePopoverClose = () => {
    setModeAnchorEl(null)
  }

  const handleBaseTimezoneChange = (
    _event: unknown,
    newValue: (typeof timezoneData)[number] | null,
  ) => {
    if (newValue) {
      setBaseTimezone(newValue.id)
    }
  }

  const handleBaseTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseTimeInput(event.target.value)
    const newTime = dayjs.tz(event.target.value, format, baseTimezone)
    if (newTime.isValid()) {
      setBaseTime(newTime)
    }
  }

  const handleBaseTimeBlur = () => {
    const newTime = dayjs.tz(baseTimeInput, format, baseTimezone)
    if (!newTime.isValid()) {
      setBaseTimeInput(baseTime.format(format))
    }
  }

  const isFormatPopoverOpen = Boolean(formatAnchorEl)
  const formatPopoverId = isFormatPopoverOpen
    ? 'format-legend-popover'
    : undefined

  const isModePopoverOpen = Boolean(modeAnchorEl)
  const modePopoverId = isModePopoverOpen ? 'mode-info-popover' : undefined

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      <Paper
        component="section"
        sx={{
          mb: 4,
          p: 2,
          width: '100%',
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: '0.5rem' }}>時刻設定:</Typography>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                aria-label="Mode"
                size="small"
              >
                <ToggleButton value="now">現在時刻</ToggleButton>
                <ToggleButton value="manual">手動</ToggleButton>
                <ToggleButton value="base">基準時刻</ToggleButton>
              </ToggleButtonGroup>
              <IconButton
                aria-describedby={modePopoverId}
                onClick={handleModePopoverOpen}
              >
                <InfoOutlinedIcon />
              </IconButton>
              <Popover
                id={modePopoverId}
                open={isModePopoverOpen}
                anchorEl={modeAnchorEl}
                onClose={handleModePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Stack sx={{ p: 2 }} spacing={1}>
                  <Typography variant="body2">
                    <b>現在時刻:</b> 現在の時刻をリアルタイムで表示します。
                  </Typography>
                  <Typography variant="body2">
                    <b>手動:</b>{' '}
                    タイムゾーンリストの時刻を手動で入力し、他のタイムゾーンの時刻を変換します。
                  </Typography>
                  <Typography variant="body2">
                    <b>基準時刻:</b>
                    設定した基準の時刻が、各タイムゾーンで何時になるかを表示します。
                  </Typography>
                </Stack>
              </Popover>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <TextField
                label="日付フォーマット"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                fullWidth
              />
              <IconButton
                aria-describedby={formatPopoverId}
                onClick={handleFormatPopoverOpen}
              >
                <InfoOutlinedIcon />
              </IconButton>
              <Popover
                id={formatPopoverId}
                open={isFormatPopoverOpen}
                anchorEl={formatAnchorEl}
                onClose={handleFormatPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box sx={{ whiteSpace: 'pre-wrap', p: 2 }}>
                  <Typography variant="body2">
                    <a
                      href="https://day.js.org/docs/en/display/format"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Day.jsのフォーマット文字列
                    </a>
                    が使用できます。
                  </Typography>
                  <Typography variant="caption">{formatLegend}</Typography>
                </Box>
              </Popover>
            </Box>
          </Stack>
          {mode === 'base' && (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                label="基準時刻"
                value={baseTimeInput}
                onChange={handleBaseTimeChange}
                onBlur={handleBaseTimeBlur}
                sx={{ width: { xs: '100%', md: 'auto' } }}
              />
              <Autocomplete
                options={timezoneData}
                value={timezoneMap.get(baseTimezone) || null}
                onChange={handleBaseTimezoneChange}
                filterOptions={filterOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="基準タイムゾーン" />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props as any
                  return (
                    <Box component="li" key={key} {...rest}>
                      {option.label}
                    </Box>
                  )
                }}
                sx={{ width: { xs: '100%', md: 300 } }}
              />
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}
