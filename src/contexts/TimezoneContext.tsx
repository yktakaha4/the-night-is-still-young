import { createContext, useState, ReactNode } from 'react'
import dayjs from '../lib/dayjs'

interface TimezoneContextType {
  time: dayjs.Dayjs
  setTime: (time: dayjs.Dayjs) => void
  format: string
  setFormat: (format: string) => void
  timezones: string[]
  setTimezones: (timezones: string[]) => void
}

export const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined
)

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [time, setTime] = useState(dayjs())
  const [format, setFormat] = useState('YYYY-MM-DD HH:mm')
  const [timezones, setTimezones] = useState(['Asia/Tokyo'])

  return (
    <TimezoneContext.Provider
      value={{ time, setTime, format, setFormat, timezones, setTimezones }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}
