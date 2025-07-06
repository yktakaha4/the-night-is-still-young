import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const useQuerySync = () => {
  const context = useContext(TimezoneContext)
  const [, setSearchParams] = useSearchParams()

  if (!context) {
    throw new Error('useQuerySync must be used within a TimezoneProvider')
  }

  const { time, format, timezones, mode } = context

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('mode', mode)
    params.set('format', format)

    // remove empty timezones
    const filteredTimezones = timezones.filter((tz) => tz)

    filteredTimezones.forEach((tz) => {
      params.append('tz', tz)
    })

    if (mode === 'manual') {
      params.set('time', time.utc().toISOString())
    } else {
      params.delete('time')
    }

    setSearchParams(params, { replace: true })
  }, [time, format, timezones, mode, setSearchParams])
}
