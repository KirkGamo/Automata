import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'
import Visualizer from './Visualizer'

test('Visualizer shows local membership result for valid a^n b^n string', async () => {
  render(<Visualizer />)

  // default input value is 'aaaaabbbbb'
  const input = screen.getByDisplayValue('aaaaabbbbb')
  expect(input).not.toBeNull()

  const btn = screen.getByText('Check')
  fireEvent.click(btn)

  // local check sets result synchronously; wait for it
  const results = await screen.findAllByText(/IN/i)
  // at least one matching element should exist
  expect(results.length).toBeGreaterThan(0)
})
