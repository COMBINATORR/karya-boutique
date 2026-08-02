import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import '../i18n'

describe('App Component', () => {
  it('renders brand mark in pill navbar', () => {
    render(<App />)
    // Pill shows KAR + YA split
    expect(screen.getAllByText('KAR').length).toBeGreaterThan(0)
    expect(screen.getAllByText('YA').length).toBeGreaterThan(0)
  })

  it('allows switching language between RU and KK', () => {
    render(<App />)
    const kkButtons = screen.getAllByText('KK')
    if (kkButtons.length > 0) {
      fireEvent.click(kkButtons[0])
      expect(document.documentElement.lang).toBe('kk')
    }
  })
})
