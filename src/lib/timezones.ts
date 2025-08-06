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
    id: 'America/Los_Angeles',
    countryName: 'Pacific Time',
    utcOffset: '-07:00', // This will be dynamically updated
    label: 'America/Los_Angeles (Pacific Time)',
  },
]

const generateTimezoneData = (): TimezoneData[] => {
  const timezones = Intl.supportedValuesOf('timeZone')
  const staticIds = new Set(staticTimezones.map((tz) => tz.id))

  const dynamicTimezones = timezones
    .filter((tz) => !staticIds.has(tz)) // Exclude static abbreviations themselves
    .map((tz) => {
      try {
        return {
          id: tz,
          offset: dayjs().tz(tz).format('Z'),
        }
      } catch (e) {
        console.error(`Invalid timezone: ${tz}`, e)
        return null
      }
    })
    .filter((tz): tz is { id: string; offset: string } => tz !== null)
    .filter(({ id, offset }) => {
      // Exclude UTC aliases like Etc/UTC, Etc/GMT from the dynamic list
      // because we have a static 'UTC' entry.
      if (offset === '+00:00' || offset === '-00:00') {
        const lowerId = id.toLowerCase()
        if (lowerId.includes('utc') || lowerId.includes('gmt')) {
          return false
        }
      }
      return true
    })
    .map(({ id, offset }) => {
      const country = getCountryForTimezone(id)
      const countryName = country ? country.name : null
      const details = [countryName, offset].filter(Boolean).join(', ')
      return {
        id: id,
        countryName,
        utcOffset: offset,
        label: `${id} (${details})`,
      }
    })

  const allTimezones = [...staticTimezones, ...dynamicTimezones].map((tz) => {
    try {
      const offset = dayjs().tz(tz.id).format('Z')
      const country = getCountryForTimezone(tz.id)
      const countryName = country ? country.name : tz.countryName
      const details = [countryName, offset].filter(Boolean).join(', ')
      return {
        ...tz,
        utcOffset: offset,
        label: `${tz.id} (${details})`,
      }
    } catch (e) {
      console.error(`Failed to process timezone: ${tz.id}`, e)
      return null
    }
  })

  return allTimezones.filter((tz): tz is TimezoneData => tz !== null)
}

export const timezoneData = generateTimezoneData()

export const timezoneMap = new Map(timezoneData.map((tz) => [tz.id, tz]))
