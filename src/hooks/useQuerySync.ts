import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'

export const useQuerySync = () => {
  const context = useContext(TimezoneContext)
  const [searchParams, setSearchParams] = useSearchParams()

  if (!context) {
    throw new Error('useQuerySync must be used within a TimezoneProvider')
  }

  const { time, setTime, format, setFormat, timezones, setTimezones } = context

  useEffect(() => {
    const timeParam = searchParams.get('time')
    const formatParam = searchParams.get('format')
    const timezonesParam = searchParams.get('timezones')

    if (timeParam) {
      setTime(dayjs(timeParam))
    }
    if (formatParam) {
      setFormat(formatParam)
    }
    if (timezonesParam) {
      setTimezones(timezonesParam.split(','))
    }
  }, [searchParams, setTime, setFormat, setTimezones])

  useEffect(() => {
    setSearchParams({
      time: time.toISOString(),
      format,
      timezones: timezones.join(','),
    })
  }, [time, format, timezones, setSearchParams])
}
