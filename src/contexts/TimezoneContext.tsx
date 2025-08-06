import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import dayjs, { Dayjs } from '../lib/dayjs'
import { useSearchParams } from 'react-router-dom'

type Mode = 'now' | 'manual' | 'base'

interface TimezoneContextType {
  time: Dayjs
  setTime: (time: Dayjs) => void
  format: string
  setFormat: (format: string) => void
  timezones: string[]
  setTimezones: (timezones: string[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  baseTime: Dayjs
  setBaseTime: (time: Dayjs) => void
  baseTimezone: string
  setBaseTimezone: (timezone: string) => void
  baseTimeInput: string
  setBaseTimeInput: (time: string) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined,
)

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams()

  const getInitialFormat = () => {
    const formatParam = searchParams.get('format')
    return formatParam || 'YYYY/MM/DD HH:mm:ss'
  }
  const initialFormat = getInitialFormat()

  const getInitialMode = (): Mode => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'manual' || modeParam === 'now' || modeParam === 'base') {
      return modeParam
    }
    return 'now'
  }

  const getInitialTime = (mode: Mode) => {
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

  const getInitialBaseTimezone = () => {
    const tzParam = searchParams.get('baseTimezone')
    return tzParam || 'UTC'
  }
  const initialBaseTimezone = getInitialBaseTimezone()

  const getInitialBaseTimeInput = () => {
    return searchParams.get('baseTimeValue') || dayjs().format(initialFormat)
  }
  const initialBaseTimeInput = getInitialBaseTimeInput()

  const getInitialBaseTime = () => {
    const t = dayjs.tz(initialBaseTimeInput, initialFormat, initialBaseTimezone)
    if (t.isValid()) {
      return t
    }
    return dayjs()
  }

  const [mode, setMode] = useState<Mode>(getInitialMode)
  const [time, setTime] = useState<Dayjs>(() => getInitialTime(mode))
  const [format, setFormat] = useState(initialFormat)
  const [timezones, setTimezones] = useState<string[]>(
    searchParams.getAll('tz'),
  )
  const [baseTime, setBaseTime] = useState<Dayjs>(getInitialBaseTime)
  const [baseTimezone, setBaseTimezone] = useState<string>(initialBaseTimezone)
  const [baseTimeInput, setBaseTimeInput] =
    useState<string>(initialBaseTimeInput)

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
        baseTime,
        setBaseTime,
        baseTimezone,
        setBaseTimezone,
        baseTimeInput,
        setBaseTimeInput,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}
