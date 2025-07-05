import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { TimezoneProvider } from './contexts/TimezoneContext'

const renderApp = () => {
  return render(
    <BrowserRouter>
      <TimezoneProvider>
        <App />
      </TimezoneProvider>
    </BrowserRouter>
  )
}

describe('App', () => {
  it('renders header', () => {
    renderApp()
    const headerElement = screen.getByText(/東京は夜の七時/i)
    expect(headerElement).toBeInTheDocument()
  })

  it('adds a new timezone when the add button is clicked', () => {
    renderApp()
    const addButton = screen.getByRole('button', { name: /追加/i })
    fireEvent.click(addButton)
    // Initially 'Asia/Tokyo', adds 'America/New_York'
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByDisplayValue('Asia/Tokyo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('America/New_York')).toBeInTheDocument()
  })

  it('removes a timezone when the delete button is clicked', () => {
    renderApp()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])
    expect(screen.queryByDisplayValue('Asia/Tokyo')).not.toBeInTheDocument()
  })

  it('updates other timezones when one time is manually changed', async () => {
    renderApp()
    const manualModeButton = screen.getByRole('button', { name: /手動入力/i })
    fireEvent.click(manualModeButton)

    const addButton = screen.getByRole('button', { name: /追加/i })
    fireEvent.click(addButton)

    const tokyoInput = screen.getByTestId('time-input-Asia/Tokyo')
    fireEvent.change(tokyoInput, { target: { value: '2025-07-05 19:00' } })

    await waitFor(() => {
      const newYorkInput = screen.getByTestId(
        'time-input-America/New_York'
      ) as HTMLInputElement
      // Tokyo is UTC+9, New York is UTC-4 (during DST). Difference is 13 hours.
      // 19:00 in Tokyo should be 06:00 in New York on the same day.
      expect(newYorkInput.value).toBe('2025-07-05 06:00')
    })
  })
})
