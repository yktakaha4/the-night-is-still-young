import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TimezoneContext } from '../contexts/TimezoneContext'

export const useQuerySync = () => {
  const context = useContext(TimezoneContext)
  const [, setSearchParams] = useSearchParams()

  if (!context) {
    throw new Error('useQuerySync must be used within a TimezoneProvider')
  }

  const { time, format, timezones, mode, baseTimezone, baseTimeInput } = context

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

    if (mode === 'base') {
      params.set('baseTimeValue', baseTimeInput)
      params.set('baseTimezone', baseTimezone)
    } else {
      params.delete('baseTimeValue')
      params.delete('baseTimezone')
    }

    setSearchParams(params, { replace: true })
  }, [
    time,
    format,
    timezones,
    mode,
    baseTimeInput,
    baseTimezone,
    setSearchParams,
  ])
}
