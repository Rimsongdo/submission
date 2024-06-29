import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [newVisible, setNewVisible] = useState(false);
  const [sortedBlogs, setSortedBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs);
      // Sort blogs initially when fetched
      sortBlogsByLikes(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // Set the token for authorization
    }
  }, []);

  const sortBlogsByLikes = (blogs) => {
    const sorted = [...blogs].sort((a, b) => b.likes - a.likes);
    setSortedBlogs(sorted);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    setUsername('');
    setPassword('');
  };

  const handleCreate = async event => {
    event.preventDefault();

    try {
      const newBlogObject = {
        title: title,
        author: author,
        url: url,
      };

      const createdBlog = await blogService.create(newBlogObject);
      setBlogs(blogs.concat(createdBlog));
      setTitle('');
      setAuthor('');
      setUrl('');
      sortBlogsByLikes(blogs.concat(createdBlog)); // Sort after adding new blog
    } catch (exception) {
      console.log('Error creating blog:', exception);
      setErrorMessage('Failed to create blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('Oh oh', exception);
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log into application</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          name="username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          name="password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );

  const handleNew = () => {
    return <>{newBlogForm}</>;
  };

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const newBlogForm = () => {
    const hideWhenVisible = { display: newVisible ? 'none' : '' };
    const showWhenVisible = { display: newVisible ? '' : 'none' };
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewVisible(true)}>New Note</button>
        </div>
        <div style={showWhenVisible}>
          <h2>Create a new blog</h2>
          <form onSubmit={handleCreate}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              value={title}
              id="title"
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
            <label htmlFor="author">Author</label>
            <input
              type="text"
              value={author}
              id="author"
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
            <label htmlFor="url">URL</label>
            <input
              type="text"
              value={url}
              id="url"
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
            <button type="submit">Create</button>
          </form>
          <button onClick={() => setNewVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {newBlogForm()}
          {blogList()}
        </div>
      )}
    </div>
  );
};

export default App;
