// Protected admin panel — /admin (PRD §3.2). Token-gated CRUD + media upload.
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [section, setSection] = useState('tutorials');
  const [imageUrl, setImageUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authToken) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(Array.isArray(data) ? data : []))
        .catch(() => setError('Failed to load posts'));
    }
  }, [authToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'X-Admin-Auth': authToken },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setImageUrl(data.url);
    } else {
      setError(data.error || 'Upload failed');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Auth': authToken,
      },
      body: JSON.stringify({ title, slug, content, section, imageUrl }),
    });
    const data = await res.json();
    if (res.ok) {
      setPosts([data, ...posts]);
      setTitle('');
      setSlug('');
      setContent('');
      setImageUrl('');
    } else {
      setError(data.error || 'Create failed');
    }
  };

  const handleDeletePost = async (id) => {
    const res = await fetch(`/api/posts?id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': authToken },
    });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || 'Delete failed');
    }
  };

  if (!authToken) {
    return (
      <Layout title="Admin Login">
        <div style={{ padding: '4rem', maxWidth: '400px', margin: '0 auto' }}>
          <h2>Admin Access</h2>
          <input
            type="password"
            placeholder="Enter admin token"
            onKeyDown={(e) => e.key === 'Enter' && setAuthToken(e.target.value)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin">
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1>Content Console</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Slug (unique, url-safe)" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="tutorials">Core Tutorials</option>
            <option value="india-tech">India Tech Stack</option>
            <option value="jobs">Job Listings</option>
            <option value="news">News</option>
            <option value="meetups">Local Meetups</option>
          </select>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && <p>Image: <code>{imageUrl}</code></p>}
          <textarea placeholder="Content" rows="10" value={content} onChange={(e) => setContent(e.target.value)} required />
          <button type="submit">Publish</button>
        </form>

        <h3>Posts</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
              <span>[{post.section}] {post.title}</span>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
