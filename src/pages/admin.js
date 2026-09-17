// admin.js
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [section, setSection] = useState('tutorials');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (authToken) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(Array.isArray(data) ? data : []))
        .catch(() => setError('Failed to load posts'));
    }
  }, [authToken]);

  // Inserts text at the current cursor position inside the textarea,
  // then moves the cursor to just after the inserted text.
  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const updated = before + textToInsert + after;
    setContent(updated);

    // restore focus + cursor position after React re-renders
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + textToInsert.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'X-Admin-Auth': authToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        insertAtCursor(`\n\n![${altText}](${data.url})\n\n`);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file again
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
      body: JSON.stringify({ title, slug, content, section }),
    });
    const data = await res.json();
    if (res.ok) {
      setPosts([data, ...posts]);
      setTitle('');
      setSlug('');
      setContent('');
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

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.8 }}>
              Insert image at cursor position in Content below
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <span style={{ marginLeft: '0.5rem' }}>Uploading...</span>}
          </div>

          <textarea
            ref={textareaRef}
            placeholder="Content (markdown) — click anywhere here, then upload an image to insert it at that exact spot"
            rows="16"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            required
          />

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