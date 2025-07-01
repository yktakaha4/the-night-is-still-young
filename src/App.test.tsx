import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

test('renders header', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  const headerElement = screen.getByText(/東京は夜の七時/i)
  expect(headerElement).toBeInTheDocument()
})
