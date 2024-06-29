const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author1",
    url: "http://example.com/1",
    likes: 1
  },
  {
    title: "Second Blog",
    author: "Author2",
    url: "http://example.com/2",
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Author3',
    url: 'http://example.com/3',
    likes: 3
  }

  const initialResponse = await api.get('/api/blogs')
  const initialLength = initialResponse.body.length

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalResponse = await api.get('/api/blogs')
  const finalLength = finalResponse.body.length

  expect(finalLength).toBe(initialLength + 1)

  const titles = finalResponse.body.map(r => r.title)
  expect(titles).toContain('New Blog Post')
})

afterAll(async () => {
  await mongoose.connection.close()
})
