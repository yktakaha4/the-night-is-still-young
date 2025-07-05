import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Stack,
  Paper,
} from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const ConfigSection = () => {
  const context = useContext(TimezoneContext)

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
        <TextField
          label="Date format string"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          fullWidth
        />
      </Stack>
    </Paper>
  )
}