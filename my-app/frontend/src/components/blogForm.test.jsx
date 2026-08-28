import { render, screen } from '@testing-library/react'
import BlogForm from './NewBlog'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
test('<BlogForm/>  updates parent state and calls onsubmit', async () => {
  const createBlog = vi.fn()
  const user=userEvent.setup()
  render(<BlogForm handleBlog={createBlog}/>)
  const titleInput=screen.getByPlaceholderText('title')
  const authorInput=screen.getByPlaceholderText('author')
  const urlInput=screen.getByPlaceholderText('url')
  const submitButton=screen.getByText('create')
  await user.type(titleInput,'testing a form...')
  await user.type(authorInput,'divyansh')
  await user.type(urlInput,'https://goku.com')
  await user.click(submitButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('divyansh')
  expect(createBlog.mock.calls[0][0].url).toBe('https://goku.com')
}
)