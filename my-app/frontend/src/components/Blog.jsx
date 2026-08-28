import BlogDetails from './BlogDetails'

const Blog = ({ blog, addLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
      </div>
      <BlogDetails blog={blog} addLike={addLike} handleRemove={handleRemove} user={user} />
    </div>
  )
}

export default Blog