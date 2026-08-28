import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import BlogDetails from './components/BlogDetails'
import {
  Routes, Route, Link,
  useNavigate, useMatch
} from 'react-router-dom'
import {
  Container, AppBar, Toolbar, Button,
  Table, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const notify = (text) => {
    setMessage(text)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const match = useMatch('/blogs/:id')
  const blogMatch = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {blog.author}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  const handleBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(blogObject.title + ' by ' + blogObject.author)
      navigate('/')
    } catch {
      notify('wrong credentials')
    }
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      notify('wrong credentials')
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id))
          navigate('/')
        })
        .catch((error) => {
          console.error('Error removing blog:', error)
        })
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          {user
            ? <>
              <Button color="inherit" component={Link} to="/create">create new</Button>
              <div style={{ flexGrow: 1 }} />
              <em>{user.name} logged in</em>
              <Button color="inherit" onClick={() => {
                window.localStorage.removeItem('loggedBlogappUser')
                setUser(null)
                navigate('/')
              }}>logout</Button>
            </>
            : <>
              <div style={{ flexGrow: 1 }} />
              <Button color="inherit" component={Link} to="/login">login</Button>
            </>
          }
        </Toolbar>
      </AppBar>
      <Notification message={message} />
      <Routes>
        <Route path="/" element={user ? blogList() : loginForm()} />
        <Route path="/login" element={loginForm()} />
        <Route path="/blogs/:id" element={<BlogDetails blog={blogMatch} addLike={addLike} handleRemove={handleRemove} user={user} />} />
        <Route path="/create" element={<NewBlog handleBlog={handleBlog} />} />
      </Routes>
    </Container>
  )
}

export default App