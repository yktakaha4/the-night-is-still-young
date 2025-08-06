import { getCountryForTimezone } from 'countries-and-timezones'
import dayjs from './dayjs'

export interface TimezoneData {
  id: string
  countryName: string | null
  utcOffset: string
  label: string
}

const staticTimezones: TimezoneData[] = [
  {
    id: 'UTC',
    countryName: null,
    utcOffset: '+00:00',
    label: 'UTC (+00:00)',
  },
  {
    id: 'JST',
    countryName: 'Japan',
    utcOffset: '+09:00',
    label: 'JST (Japan, +09:00)',
  },
  {
    id: 'CET',
    countryName: 'Central European Time',
    utcOffset: '+01:00',
    label: 'CET (Central European Time, +01:00)',
  },
  {
    id: 'PST',
    countryName: 'Pacific Standard Time',
    utcOffset: '-08:00',
    label: 'PST (Pacific Standard Time, -08:00)',
  },
  {
    id: 'PDT',
    countryName: 'Pacific Daylight Time',
    utcOffset: '-07:00',
    label: 'PDT (Pacific Daylight Time, -07:00)',
  },
]

const generateTimezoneData = (): TimezoneData[] => {
  const timezones = Intl.supportedValuesOf('timeZone')
  const dynamicTimezones = timezones.map((tz) => {
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
  return [...staticTimezones, ...dynamicTimezones]
}

export const timezoneData = generateTimezoneData()

export const timezoneMap = new Map(timezoneData.map((tz) => [tz.id, tz]))
