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
} from '@mui/material'
import { useContext, useState } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const formatLegend = `
  YYYY: 4-digit year
  MM: 2-digit month (01-12)
  DD: 2-digit day of month (01-31)
  HH: 2-digit hour (00-23)
  mm: 2-digit minute (00-59)
  ss: 2-digit second (00-59)
`

export const ConfigSection = () => {
  const context = useContext(TimezoneContext)
  const [formatAnchorEl, setFormatAnchorEl] =
    useState<HTMLButtonElement | null>(null)
  const [modeAnchorEl, setModeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  )

  if (!context) {
    return null
  }

  const { format, setFormat, mode, setMode } = context

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'now' | 'manual' | null
  ) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleFormatPopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setFormatAnchorEl(event.currentTarget)
  }

  const handleFormatPopoverClose = () => {
    setFormatAnchorEl(null)
  }

  const handleModePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setModeAnchorEl(event.currentTarget)
  }

  const handleModePopoverClose = () => {
    setModeAnchorEl(null)
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
          maxWidth: {
            xs: '100%',
            md: '50%',
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            設定
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>モード:</Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="Mode"
              size="small"
            >
              <ToggleButton value="now">現在時刻</ToggleButton>
              <ToggleButton value="manual">手動</ToggleButton>
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
                  <b>手動:</b> 時刻を手動で入力できます。
                </Typography>
              </Stack>
            </Popover>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="日付フォーマット文字列"
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
      </Paper>
    </Box>
  )
}
