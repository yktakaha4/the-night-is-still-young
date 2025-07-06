import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { getCountryForTimezone } from 'countries-and-timezones'
import dayjs from './lib/dayjs'

const getOptionLabel = (option: string) => {
  const country = getCountryForTimezone(option)
  const countryName = country ? country.name : null
  const utcOffset = dayjs().tz(option).format('Z')
  const details = [countryName, utcOffset].filter(Boolean).join(', ')
  return `${option} (${details})`
}

const renderApp = (initialEntries: string[] = ['/']) => {
  const user = userEvent.setup()
  const view = render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )
  return { user, ...view }
}

describe('App', () => {
  it('renders header', () => {
    renderApp()
    const headerElement = screen.getByText(/東京は夜の七時/i)
    expect(headerElement).toBeInTheDocument()
  })

  it('adds a new timezone when the add button is clicked', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const addButton = screen.getByRole('button', { name: /タイムゾーンを追加/i })
    await user.click(addButton)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      screen.getByDisplayValue(getOptionLabel('Asia/Tokyo'))
    ).toBeInTheDocument()
    const allTimezones = Intl.supportedValuesOf('timeZone')
    const expectedTimezone = allTimezones.find((tz) => tz !== 'Asia/Tokyo')
    expect(
      screen.getByDisplayValue(getOptionLabel(expectedTimezone!))
    ).toBeInTheDocument()
  })

  it('removes a timezone when the delete button is clicked', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(
      screen.queryByDisplayValue(getOptionLabel('Asia/Tokyo'))
    ).not.toBeInTheDocument()
  })

  it('updates a timezone when a new one is selected', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const timezoneAutocomplete = screen.getByLabelText('タイムゾーン')
    await user.clear(timezoneAutocomplete)
    await user.type(timezoneAutocomplete, 'Europe/London')
    const option = await waitFor(() => screen.findByText(/Europe\/London/))
    await user.click(option)

    await waitFor(() => {
      expect(
        screen.queryByDisplayValue(getOptionLabel('Asia/Tokyo'))
      ).not.toBeInTheDocument()
      expect(
        screen.getByDisplayValue(getOptionLabel('Europe/London'))
      ).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })

  it('updates other timezones when one time is manually changed', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo&tz=America/New_York'])
    const manualModeButton = screen.getByRole('button', { name: /手動/i })
    await user.click(manualModeButton)

    const tokyoInput = screen.getByTestId('time-input-Asia/Tokyo')
    fireEvent.change(tokyoInput, { target: { value: '2025/07/05 19:00:00' } })

    await waitFor(() => {
      const newYorkInput = screen.getByTestId(
        'time-input-America/New_York'
      ) as HTMLInputElement
      expect(newYorkInput.value).toBe('2025/07/05 06:00:00')
    })
  })
})
