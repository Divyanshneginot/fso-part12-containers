import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlog = ({ handleBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="title" placeholder="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          <TextField label="author" placeholder="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          <TextField label="url" placeholder="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">create</Button>
        </div>
      </form>
    </div>
  )
}

export default NewBlog