import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogService'
import loginService from './services/loginService'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Error from './components/Error.js'
import './App.css'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const blogFormRef= useRef()

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 44
    }

    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)


      .then(res => {
        setBlogs(blogs.concat(res))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setMessage(`a new blog '${blogObject.title}' added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })

  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)      )


      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`Welcome ${user.username}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setError('invalid username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addLike = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService.update(changedBlog.id, changedBlog)
      .then(response => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : response))
      })
      .catch(error => {
        setError('adding like failed')
      })
    setTimeout(() => {
      setMessage(null)
    }, 5000)


  }


  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <Error error={error} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              id='username'
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  const SortedBlogs = () => {
    const sorts = blogs.sort((a,b) => b.likes - a.likes).map(blog =>
      <Blog key={blog.id} blog={blog} addLike={() => addLike(blog.id)}
        removeBlog={() => removeBlog(blog)} />
    )

    return (
      sorts
    )
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`))
      try {
        blogService.setToken(user.token)
        setUser(user)
        await blogService.remove(blog.id)
        setMessage(`${blog.title} deleted`)
        setBlogs(blogs.filter(a => a.id !== blog.id))
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (error) {
        setError('Delete failed')
        setTimeout(() => {
          setMessage(null)
        }, 5000)

      }

  }


  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {user.name} logged in
      <button onClick={() => handleLogout()}>logout</button>
      <br></br>
      <h2>create new</h2>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} newTitle={newTitle}
          newAuthor={newAuthor} newUrl={newUrl} handleTitleChange={handleTitleChange}
          handleAuthorChange={handleAuthorChange} handleUrlChange={handleUrlChange} />
      </Togglable>
      <SortedBlogs/>
    </div>

  )
}

export default App