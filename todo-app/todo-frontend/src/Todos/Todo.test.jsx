import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Todo from './Todo'

describe('Todo component', () => {
  it('renders not done todo correctly', () => {
    const todo = {
      text: 'Learn Docker multi-stage builds',
      done: false
    }

    render(<Todo todo={todo} deleteTodo={vi.fn()} completeTodo={vi.fn()} />)

    expect(screen.getByText('Learn Docker multi-stage builds')).toBeDefined()
    expect(screen.getByText('This todo is not done')).toBeDefined()
    expect(screen.getByText('Set as done')).toBeDefined()
  })

  it('renders done todo correctly', () => {
    const todo = {
      text: 'Completed todo item',
      done: true
    }

    render(<Todo todo={todo} deleteTodo={vi.fn()} completeTodo={vi.fn()} />)

    expect(screen.getByText('Completed todo item')).toBeDefined()
    expect(screen.getByText('This todo is done')).toBeDefined()
    expect(screen.queryByText('Set as done')).toBeNull()
  })
})