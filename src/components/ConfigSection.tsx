import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const ConfigSection = () => {
  const context = useContext(TimezoneContext)

  if (!context) {
    return null
  }

  const { format, setFormat } = context

  return (
    <Box component="section" sx={{ mb: 2 }}>
      <Typography variant="h2" gutterBottom>
        設定
      </Typography>
      <ToggleButtonGroup value="now" exclusive>
        <ToggleButton value="now">現在時刻</ToggleButton>
        <ToggleButton value="manual">手動入力</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="日付文字列フォーマット"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      />
    </Box>
  )
}