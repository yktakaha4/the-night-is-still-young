import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

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
    const headerElement = screen.getByText(/The night is still young/i)
    expect(headerElement).toBeInTheDocument()
  })

  it('adds a new timezone when the add button is clicked', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const addButton = screen.getByRole('button', { name: /Add Timezone/i })
    await user.click(addButton)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByDisplayValue('Asia/Tokyo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('America/New_York')).toBeInTheDocument()
  })

  it('removes a timezone when the delete button is clicked', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.queryByDisplayValue('Asia/Tokyo')).not.toBeInTheDocument()
  })

  it('updates a timezone when a new one is selected', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo'])
    const timezoneAutocomplete = screen.getByLabelText('Timezone')
    await user.clear(timezoneAutocomplete)
    await user.type(timezoneAutocomplete, 'Europe/London')
    const option = await screen.findByText('Europe/London')
    await user.click(option)

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Asia/Tokyo')).not.toBeInTheDocument()
      expect(screen.getByDisplayValue('Europe/London')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })

  it('updates other timezones when one time is manually changed', async () => {
    const { user } = renderApp(['/?tz=Asia/Tokyo&tz=America/New_York'])
    const manualModeButton = screen.getByRole('button', { name: /Manual/i })
    await user.click(manualModeButton)

    const tokyoInput = screen.getByTestId('time-input-Asia/Tokyo')
    fireEvent.change(tokyoInput, { target: { value: '2025-07-05 19:00:00' } })

    await waitFor(() => {
      const newYorkInput = screen.getByTestId(
        'time-input-America/New_York'
      ) as HTMLInputElement
      expect(newYorkInput.value).toBe('2025-07-05 06:00:00')
    })
  })
})
