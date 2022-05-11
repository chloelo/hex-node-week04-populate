const { successHandle, errorHandle } = require('../service')
const Post = require('../models/postsModel')
const User = require('../models/usersModel')
const posts = {
  async getPosts (req, res) {
    // asc 遞增 (由小到大，由舊到新) createdAt ; desc 遞減 (由大到小、由新到舊) "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"
    const q = req.query?.search ? { "content": new RegExp(req.query.search) } : {};
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo '
    }).sort(timeSort);

    successHandle(res, allPosts)
  },
  async createPost (req, res) {
    try {
      const { body } = req
      const userId = body.user ? body.user : '627be30ed9739c485b345f14' // 先預設一個 id
      if (body.content) {
        const newPost = await Post.create({
          user: userId,
          image: body.image,
          content: body.content,
          likes: body.likes
        })
        successHandle(res, newPost)
      } else {
        errorHandle(res)
      }
    } catch (err) {
      errorHandle(res, err)
    }
  },
  async deletePosts (req, res) {
    const posts = await Post.deleteMany({})
    successHandle(res, posts)
  },
  async deletePost (req, res) {
    try {
      const { id } = req.params
      const result = await Post.findByIdAndDelete(id, { new: true })
      result ? successHandle(res, result) : errorHandle(res)
    } catch (err) {
      errorHandle(res, err)
    }
  },
  async patchPost (req, res) {
    try {
      const { id } = req.params
      const { body } = req
      const requiredFields = ['user', 'content']
      const updateFields = Object.keys(body)
      let hasValueAmount = 0
      let hasFieldAmount = 0
      updateFields.forEach(updateField => {
        requiredFields.forEach(requiredField => {
          if (updateField === requiredField) {
            hasFieldAmount++
            if (body[requiredField]) {
              hasValueAmount++
            }
          }
        })
      })
      if (hasFieldAmount === hasValueAmount) {
        const result = await Post.findByIdAndUpdate(id, body, { new: true })
        result ? successHandle(res, result) : errorHandle(res)
      } else {
        errorHandle(res)
      }
    } catch (err) {
      errorHandle(res, err)
    }
  }
}

module.exports = posts
