import React from 'react'
import Togglable from './Togglable'

export const Blog = ({ blog, addLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <li className='blog'>
    <div style={blogStyle}>
      <div>
        <p id='title'>title: {blog.title}</p> 
        <p id='author'>author: {blog.author}</p>
        <Togglable buttonLabel="view" >
          <p id='url'> url: {blog.url}</p>
          <br></br>
      <p id='likes'> likes: {blog.likes} <button onClick={addLike}> like</button> </p>      
          <br></br>
          <button onClick={removeBlog}>remove</button>
        </Togglable>
      </div>
    </div>
    </li>
  )}

export default Blog
