import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import dayjs, { Dayjs } from '../lib/dayjs'
import { useSearchParams } from 'react-router-dom'

interface TimezoneContextType {
  time: Dayjs
  setTime: (time: Dayjs) => void
  format: string
  setFormat: (format: string) => void
  timezones: string[]
  setTimezones: (timezones: string[]) => void
  mode: 'now' | 'manual'
  setMode: (mode: 'now' | 'manual') => void
}

export const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined
)

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams()

  const getInitialMode = () => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'manual' || modeParam === 'now') {
      return modeParam
    }
    return 'now'
  }

  const getInitialTime = (mode: 'now' | 'manual') => {
    if (mode === 'manual') {
      const timeParam = searchParams.get('time')
      if (timeParam) {
        const t = dayjs.utc(timeParam)
        if (t.isValid()) {
          return t
        }
      }
    }
    return dayjs()
  }

  const getInitialFormat = () => {
    const formatParam = searchParams.get('format')
    return formatParam || 'YYYY/MM/DD HH:mm:ss'
  }

  const [mode, setMode] = useState<'now' | 'manual'>(getInitialMode)
  const [time, setTime] = useState<Dayjs>(() => getInitialTime(mode))
  const [format, setFormat] = useState(getInitialFormat)
  const [timezones, setTimezones] = useState<string[]>(
    searchParams.getAll('tz')
  )

  const handleSetTimezones = useCallback((newTimezones: string[]) => {
    // remove duplicates
    const uniqueTimezones = [...new Set(newTimezones)]
    setTimezones(uniqueTimezones)
  }, [])

  // Update time every second if in 'now' mode
  useEffect(() => {
    if (mode === 'now') {
      const interval = setInterval(() => {
        setTime(dayjs())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, setTime])

  return (
    <TimezoneContext.Provider
      value={{
        time,
        setTime,
        format,
        setFormat,
        timezones,
        setTimezones: handleSetTimezones,
        mode,
        setMode,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}
