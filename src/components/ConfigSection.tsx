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
    <Paper component="section" sx={{ mb: 4, p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Config
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Mode:</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="Mode"
            size="small"
          >
            <ToggleButton value="now">Now</ToggleButton>
            <ToggleButton value="manual">Manual</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Date format string"
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
                Day.js format string is available.
              </Typography>
              <Typography variant="caption">{formatLegend}</Typography>
            </Box>
          </Popover>
        </Box>
      </Stack>
    </Paper>
  )
}