import { Button } from '@mui/material'

const BlogDetails = ({ blog, addLike, handleRemove, user }) => {
  if (!blog) {
    return <p>Blog not found</p>
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    addLike(blog.id, updatedBlog)
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>
        likes {blog.likes}{' '}
        {user && <Button variant="contained" color="primary" onClick={handleLike}>like</Button>}
      </p>
      <p>added by {blog.user ? blog.user.name : 'unknown'}</p>
      {user && blog.user && user.username === blog.user.username && (
        <Button variant="outlined" color="error" onClick={() => handleRemove(blog)}>remove</Button>
      )}
    </div>
  )
}

export default BlogDetails