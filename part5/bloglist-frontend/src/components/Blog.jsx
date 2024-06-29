import blogService from '../services/blogs';
import { useState } from 'react';

const Blog = ({ blog }) => {
  const [visibleBlog, setVisibleBlog] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const hideWhenVisible = { display: visibleBlog ? 'none' : '' };
  const showWhenVisible = { display: visibleBlog ? '' : 'none' };

  const handleView = () => {
    setVisibleBlog(true);
  };

  const handleHide = () => {
    setVisibleBlog(false);
  };

  const handleLikes = async () => {
    const newLikes = likes + 1;
    setLikes(newLikes);

    try {
      const updatedBlog = { ...blog, likes: newLikes };
      await blogService.update(blog.id, updatedBlog);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="blog-summary">
        <span className="blog-title">{blog.title}</span> <span className="blog-author">{blog.author}</span>
        <button onClick={handleView}>view</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        <span className="blog-title">{blog.title}</span>
        <button onClick={handleHide}>hide</button>
        <div className="blog-author">{blog.author}</div>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">Likes {likes}
          <button onClick={handleLikes}>like</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
