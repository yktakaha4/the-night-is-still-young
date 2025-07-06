import { Box, Container, Link, Typography } from '@mui/material'

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mb: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link
            color="inherit"
            href="https://github.com/yktakaha4/the-night-is-still-young"
          >
            yktakaha4/the-night-is-still-young
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}
