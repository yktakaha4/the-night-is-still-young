import { useContext, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TimezoneContext } from '../contexts/TimezoneContext'
import dayjs from '../lib/dayjs'

export const useQuerySync = () => {
  const context = useContext(TimezoneContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const isInitialLoad = useRef(true)

  if (!context) {
    throw new Error('useQuerySync must be used within a TimezoneProvider')
  }

  const {
    time,
    setTime,
    format,
    setFormat,
    timezones,
    setTimezones,
    mode,
    setMode,
  } = context

  // On initial load, deserialize state from URL params
  useEffect(() => {
    if (isInitialLoad.current) {
      const timeParam = searchParams.get('time')
      const formatParam = searchParams.get('format')
      const timezonesParam = searchParams.get('timezones')
      const modeParam = searchParams.get('mode') as 'now' | 'manual' | null

      if (modeParam) {
        setMode(modeParam)
      }
      // Only set time from URL if in manual mode
      if (timeParam && (modeParam === 'manual' || mode === 'manual')) {
        setTime(dayjs(timeParam))
      }
      if (formatParam) {
        setFormat(formatParam)
      }
      if (timezonesParam) {
        setTimezones(timezonesParam.split(','))
      }
      isInitialLoad.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  // Serialize state to URL params
  useEffect(() => {
    // Do not run on initial load to avoid overwriting the initial state from URL
    if (!isInitialLoad.current) {
      const params = new URLSearchParams()
      if (mode === 'manual') {
        params.set('time', time.toISOString())
      }
      params.set('format', format)
      params.set('timezones', timezones.join(','))
      params.set('mode', mode)
      setSearchParams(params, { replace: true })
    }
  }, [time, format, timezones, mode, setSearchParams])

  // Update time every second if in 'now' mode
  useEffect(() => {
    if (mode === 'now') {
      const interval = setInterval(() => {
        setTime(dayjs())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, setTime])
}