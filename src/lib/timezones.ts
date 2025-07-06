import { getCountryForTimezone } from 'countries-and-timezones'
import dayjs from './dayjs'

export interface TimezoneData {
  id: string
  countryName: string | null
  utcOffset: string
  label: string
}

const generateTimezoneData = (): TimezoneData[] => {
  const timezones = Intl.supportedValuesOf('timeZone')
  return timezones.map((tz) => {
    const country = getCountryForTimezone(tz)
    const countryName = country ? country.name : null
    const utcOffset = dayjs().tz(tz).format('Z')
    const details = [countryName, utcOffset].filter(Boolean).join(', ')
    return {
      id: tz,
      countryName,
      utcOffset,
      label: `${tz} (${details})`,
    }
  })
}

export const timezoneData = generateTimezoneData()

export const timezoneMap = new Map(timezoneData.map((tz) => [tz.id, tz]))
