import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
  Container,
  Grid,
  TextField,
  Modal,
  IconButton,
  Stack,
  Divider,
  Tooltip as MuiTooltip,
  Menu,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Autocomplete from '@mui/material/Autocomplete';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const DiscussionBoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState(null); // post object
  const [openNew, setOpenNew] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [editPost, setEditPost] = useState(null); // post object
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editComment, setEditComment] = useState(null); // comment object
  const [editCommentText, setEditCommentText] = useState('');
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPostId, setMenuPostId] = useState(null);
  const theme = useTheme();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/discussion/posts', { params: { search, tag: tagFilter } });
      setPosts(res.data);
    } catch (err) {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // Get all tags
    axios.get('/api/discussion/tags').then(res => setAllTags(res.data)).catch(() => setAllTags([]));
    // Get user id
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/profile', { headers: { 'x-auth-token': token } }).then(res => setUserId(res.data._id || res.data.id)).catch(() => setUserId(null));
    }
  }, []);

  const handleOpenPost = async (post) => {
    try {
      const res = await axios.get(`/api/discussion/posts/${post._id}`);
      setOpenPost(res.data);
      setCommentText('');
    } catch (err) {
      setOpenPost(null);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post(`/api/discussion/posts/${openPost._id}/comments`, { content: commentText }, config);
      setOpenPost({ ...openPost, comments: [...openPost.comments, res.data] });
      setCommentText('');
    } catch (err) {}
    setCommentLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newContent.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/discussion/posts', { content: newContent, title: newTitle }, config);
      setNewContent('');
      setNewTitle('');
      setOpenNew(false);
      fetchPosts();
    } catch (err) {}
  };

  const handleLikePost = async (postId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };
    try {
      const res = await axios.post(`/api/discussion/posts/${postId}/like`, {}, config);
      setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: res.data.likes, likedBy: res.data.liked ? [...(p.likedBy || []), userId] : (p.likedBy || []).filter(id => id !== userId) } : p));
      if (openPost && openPost._id === postId) setOpenPost({ ...openPost, likes: res.data.likes, likedBy: res.data.liked ? [...(openPost.likedBy || []), userId] : (openPost.likedBy || []).filter(id => id !== userId) });
    } catch {}
  };

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };
    try {
      const res = await axios.post(`/api/discussion/comments/${commentId}/like`, {}, config);
      if (openPost) setOpenPost({ ...openPost, comments: openPost.comments.map(c => c._id === commentId ? { ...c, likes: res.data.likes, likedBy: res.data.liked ? [...(c.likedBy || []), userId] : (c.likedBy || []).filter(id => id !== userId) } : c) });
    } catch {}
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };
    try {
      await axios.delete(`/api/discussion/posts/${postId}`, config);
      fetchPosts();
      setOpenPost(null);
    } catch {}
  };

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };
    try {
      await axios.patch(`/api/discussion/posts/${editPost._id}`, { title: editTitle, content: editContent }, config);
      setEditPost(null);
      setEditTitle('');
      setEditContent('');
      fetchPosts();
    } catch (err) {}
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Discussion Board
          </Typography>
          <Button component={Link} to="/dashboard" color="inherit" startIcon={<ArrowBackIcon />}>Dashboard</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: theme.palette.background.paper }} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>IELTS Community</Typography>
            <Button variant="contained" color="secondary" startIcon={<AddCommentIcon />} onClick={() => setOpenNew(true)}>
              New Post
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Typography align="center" color="text.secondary">Loading...</Typography>
          ) : posts.length === 0 ? (
            <Typography align="center" color="text.secondary">No posts yet. Be the first to start a discussion!</Typography>
          ) : (
            <Grid container spacing={2}>
              {posts.map(post => (
                <Grid item xs={12} key={post._id}>
                  {/* DEBUG: Show userId and post author id */}
                  {/* <Box sx={{ mb: 1, color: 'red', fontSize: 12 }}>
                    userId: {String(userId)} | post.author._id: {String(post.author?._id)} | post.author.id: {String(post.author?.id)}
                  </Box> */}
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, background: theme.palette.background.paper, cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => handleOpenPost(post)}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={post.author?.profilePic} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                          {post.title || (post.content.length > 40 ? post.content.slice(0, 40) + '...' : post.content)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.author?.leaderboardName === 'nickname' && post.author?.nickname ? post.author.nickname : post.author?.displayName || 'User'} · {timeAgo(post.createdAt)}
                        </Typography>
                      </Box>
                      <MuiTooltip title={post.likedBy && userId && post.likedBy.includes(userId) ? 'Unlike' : 'Like'}>
                        <IconButton onClick={e => { e.stopPropagation(); handleLikePost(post._id); }} color={post.likedBy && userId && post.likedBy.includes(userId) ? 'primary' : 'default'}>
                          {post.likedBy && userId && post.likedBy.includes(userId) ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
                        </IconButton>
                      </MuiTooltip>
                      <Typography variant="body2" color="primary">{post.likes || 0}</Typography>
                      <MuiTooltip title="Comments">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ChatBubbleOutlineIcon color="primary" />
                          <Typography variant="body2" color="primary">{post.commentCount}</Typography>
                        </Box>
                      </MuiTooltip>
                      {(() => {
                        const postAuthorId = post.author?._id || post.author?.id;
                        return userId && postAuthorId && String(postAuthorId) === String(userId);
                      })() && (
                        <>
                          <IconButton onClick={e => { e.stopPropagation(); handleMenuOpen(e, post._id); }}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu anchorEl={anchorEl} open={menuPostId === post._id} onClose={handleMenuClose}>
                            <MenuItem onClick={() => { handleMenuClose(); handleEditPost(post); }}>Edit</MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); handleDeletePost(post._id); }}>Delete</MenuItem>
                          </Menu>
                        </>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
      {/* New Post Modal */}
      <Modal open={openNew} onClose={() => setOpenNew(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: theme.palette.background.paper, boxShadow: 24, p: 4, borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>New Discussion Post</Typography>
          <TextField label="Title (optional)" value={newTitle} onChange={e => setNewTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Content" value={newContent} onChange={e => setNewContent(e.target.value)} fullWidth multiline minRows={4} sx={{ mb: 2 }} />
          <Button variant="contained" color="secondary" onClick={handleCreatePost} fullWidth disabled={!newContent.trim()}>
            Post
          </Button>
        </Box>
      </Modal>
      {/* Post Details Modal */}
      <Modal open={!!openPost} onClose={() => setOpenPost(null)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, maxHeight: '90vh', overflowY: 'auto', bgcolor: theme.palette.background.paper, boxShadow: 24, p: 4, borderRadius: 3 }}>
          {openPost && (
            <>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={openPost.author?.profilePic} />
                <Box>
                  <Typography variant="h6" color="text.primary" fontWeight={700}>{openPost.title || (openPost.content.length > 40 ? openPost.content.slice(0, 40) + '...' : openPost.content)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {openPost.author?.leaderboardName === 'nickname' && openPost.author?.nickname ? openPost.author.nickname : openPost.author?.displayName || 'User'} · {timeAgo(openPost.createdAt)}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>{openPost.content}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Comments</Typography>
              {openPost.comments.length === 0 && <Typography color="text.secondary" sx={{ mb: 2 }}>No comments yet.</Typography>}
              <Stack spacing={2} sx={{ mb: 2 }}>
                {openPost.comments.map(comment => (
                  <Paper key={comment._id} sx={{ p: 2, borderRadius: 2, background: theme.palette.background.default }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={comment.author?.profilePic} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {comment.author?.leaderboardName === 'nickname' && comment.author?.nickname ? comment.author.nickname : comment.author?.displayName || 'User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{timeAgo(comment.createdAt)}</Typography>
                        <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>{comment.content}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
              <TextField label="Add a comment" value={commentText} onChange={e => setCommentText(e.target.value)} fullWidth multiline minRows={2} sx={{ mb: 2 }} />
              <Button variant="contained" color="secondary" onClick={handleAddComment} disabled={!commentText.trim() || commentLoading} fullWidth>
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </Button>
            </>
          )}
        </Box>
      </Modal>
      {/* Edit Post Modal */}
      <Modal open={!!editPost} onClose={() => setEditPost(null)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: theme.palette.background.paper, boxShadow: 24, p: 4, borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Edit Post</Typography>
          <TextField label="Title (optional)" value={editTitle} onChange={e => setEditTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Content" value={editContent} onChange={e => setEditContent(e.target.value)} fullWidth multiline minRows={4} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSaveEdit} fullWidth disabled={!editContent.trim()}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DiscussionBoardPage; 