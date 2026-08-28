const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}
const totalLikes =(blogs)=>{
    const reducer=(sum,item)=>{
        return sum+item.likes
    }
    return blogs.reduce(reducer,0)
}
const favoriteBlog = (blogs) => {
    max=blogs[0]
    for(i=0;i<blogs.length;i++){
        if(max.likes<blogs[i].likes){
            max=blogs[i]
        }
    }
    return max
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = _.countBy(blogs, 'author')
  
  const authorsArray = Object.entries(authorCounts).map(([author, count]) => {
    return {
      author: author,
      blogs: count
    }
  })

  return _.maxBy(authorsArray, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorsWithLikes = Object.entries(groupedByAuthor).map(([author, authorBlogs]) => {
    return {
      author: author,
      likes: _.sumBy(authorBlogs, 'likes') 
    }
  })

  return _.maxBy(authorsWithLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
  mostBlogs,
  mostLikes}