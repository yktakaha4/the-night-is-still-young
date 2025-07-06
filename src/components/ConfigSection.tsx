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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'format-legend-popover' : undefined

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
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="日付フォーマット"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              fullWidth
            />
            <IconButton aria-describedby={id} onClick={handleClick}>
              <InfoOutlinedIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
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
