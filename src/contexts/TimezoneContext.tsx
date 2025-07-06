import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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
  const [time, setTime] = useState(dayjs())
  const [format, setFormat] = useState('YYYY/MM/DD HH:mm:ss')
  const [timezones, setTimezones] = useState<string[]>(
    searchParams.getAll('tz')
  )
  const [mode, setMode] = useState<'now' | 'manual'>('now')

  

  const handleSetTimezones = useCallback((newTimezones: string[]) => {
    // remove duplicates
    const uniqueTimezones = [...new Set(newTimezones)]
    setTimezones(uniqueTimezones)
  }, [])

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
