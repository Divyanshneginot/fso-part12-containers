import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.describe.configure({ mode: 'serial' })

  const loginWith = async (page, username, password) => {
    await page.goto('http://localhost:5173/login')
    await page.getByRole('textbox').first().fill(username)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, title, author, url) => {
    await page.getByRole('link', { name: 'create new' }).click()
    await page.getByPlaceholder('title').fill(title)
    await page.getByPlaceholder('author').fill(author)
    await page.getByPlaceholder('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(title).first().waitFor()
  }

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'password123')
    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'wrong')
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password123')
    })

    test('a logged-in user can create a blog', async ({ page }) => {
      const title = `Playwright is awesome ${Date.now()}`
      await createBlog(page, title, 'Microsoft', 'https://playwright.dev')
      await expect(page.getByText(title).first()).toBeVisible()
    })

    test('a logged-in user can like a blog', async ({ page }) => {
      const title = `Likeable blog ${Date.now()}`
      await createBlog(page, title, 'Author', 'http://example.com')
      await page.getByRole('link', { name: title }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1', { exact: false })).toBeVisible()
    })

    test('a logged-in user can delete a blog', async ({ page }) => {
      const title = `Deletable blog ${Date.now()}`
      await createBlog(page, title, 'Author', 'http://example.com')
      await page.getByRole('link', { name: title }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText(title)).not.toBeVisible()
    })
  })
})