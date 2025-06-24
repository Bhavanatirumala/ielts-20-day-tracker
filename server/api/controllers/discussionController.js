const DiscussionPost = require('../models/discussionPostModel');
const DiscussionComment = require('../models/discussionCommentModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// List all posts (most recent first, with search/filter)
exports.listPosts = async (req, res) => {
  try {
    const { search = '', tag = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    if (tag) {
      query.tags = tag;
    }
    const posts = await DiscussionPost.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'displayName nickname leaderboardName profilePic')
      .lean();
    // For each post, count comments
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const commentCount = await DiscussionComment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    }));
    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new post (with tags)
exports.createPost = async (req, res) => {
  try {
    const { content, title, tags = [] } = req.body;
    const post = new DiscussionPost({
      author: req.user.id,
      content,
      title,
      tags,
    });
    await post.save();
    await post.populate('author', 'displayName nickname leaderboardName profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit a post (author only)
exports.editPost = async (req, res) => {
  try {
    const { content, title, tags } = req.body;
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    if (content !== undefined) post.content = content;
    if (title !== undefined) post.title = title;
    if (tags !== undefined) post.tags = tags;
    await post.save();
    await post.populate('author', 'displayName nickname leaderboardName profilePic');
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a post (author only)
exports.deletePost = async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    await DiscussionComment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like/unlike a post
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const userId = req.user.id;
    const liked = post.likedBy.some(id => id.toString() === userId);
    if (liked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }
    await post.save();
    res.json({ likes: post.likes, liked: !liked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like/unlike a comment
exports.toggleLikeComment = async (req, res) => {
  try {
    const comment = await DiscussionComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    const userId = req.user.id;
    const liked = comment.likedBy.some(id => id.toString() === userId);
    if (liked) {
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }
    await comment.save();
    res.json({ likes: comment.likes, liked: !liked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit a comment (author only)
exports.editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await DiscussionComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    if (content !== undefined) comment.content = content;
    await comment.save();
    await comment.populate('author', 'displayName nickname leaderboardName profilePic');
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a comment (author only)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await DiscussionComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    await comment.deleteOne();
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all tags (distinct)
exports.getTags = async (req, res) => {
  try {
    const tags = await DiscussionPost.distinct('tags');
    res.json(tags.filter(Boolean));
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a single post with comments
exports.getPost = async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id)
      .populate('author', 'displayName nickname leaderboardName profilePic')
      .lean();
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const comments = await DiscussionComment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .populate('author', 'displayName nickname leaderboardName profilePic')
      .lean();
    res.json({ ...post, comments });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new DiscussionComment({
      post: req.params.id,
      author: req.user.id,
      content,
    });
    await comment.save();
    await comment.populate('author', 'displayName nickname leaderboardName profilePic');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 