import { Typography } from '@mui/material'

export const Header = () => {
  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ mt: 4, fontWeight: 300 }}
      >
        東京は夜の七時
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 4, fontWeight: 300 }}
      >
        The night is still young
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        タイムゾーンをまたいだ時間の確認が簡単にできるWebサイトです。
      </Typography>
    </>
  )
}
