import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { expect, describe, test, vi } from 'vitest'
import BlogDetails from './BlogDetails'

describe('<BlogDetails />', () => {
  const blog = {
    id: '12345',
    title: 'Component testing',
    author: 'divyansh',
    url: 'https://goku.com',
    likes: 5,
    user: {
      username: 'broly',
      name: 'broly'
    }
  }

  test('blog information and likes are displayed to unauthenticated users, buttons are not displayed', () => {
    render(<BlogDetails blog={blog} addLike={vi.fn()} handleRemove={vi.fn()} user={null} />)

    expect(screen.getByText('Component testing')).toBeDefined()
    expect(screen.getByText('https://goku.com')).toBeDefined()
    expect(screen.getByText('likes 5', { exact: false })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('authenticated users who are not the creator are shown only the like button', () => {
    const otherUser = { username: 'goku', name: 'Goku' }
    render(<BlogDetails blog={blog} addLike={vi.fn()} handleRemove={vi.fn()} user={otherUser} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('the blog creator is also shown the delete button', () => {
    const creator = { username: 'broly', name: 'broly' }
    render(<BlogDetails blog={blog} addLike={vi.fn()} handleRemove={vi.fn()} user={creator} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
  })

  test('clicking like calls the event handler', async () => {
    const mockLike = vi.fn()
    const creator = { username: 'broly', name: 'broly' }
    render(<BlogDetails blog={blog} addLike={mockLike} handleRemove={vi.fn()} user={creator} />)

    const user = userEvent.setup()
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
  })
})