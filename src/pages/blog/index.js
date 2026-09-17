// src/pages/blog/index.js
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState(null);

  useEffect(() => {
    // Client-side query param read (no server routing needed here)
    const params = new URLSearchParams(window.location.search);
    setActiveSlug(params.get('slug'));

    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Blog">
        <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
      </Layout>
    );
  }

  // Detail view: /blog?slug=your-slug
  if (activeSlug) {
    const post = posts.find((p) => p.slug === activeSlug);
    if (!post) {
      return (
        <Layout title="Not Found">
          <div style={{ padding: '3rem', textAlign: 'center' }}>Post not found.</div>
        </Layout>
      );
    }
    return (
      <Layout title={post.title}>
        <main style={{ padding: '3rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
          <a href="/blog">← Back to all posts</a>
          <h1 style={{ marginTop: '1rem' }}>{post.title}</h1>
          <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>
            {post.section} · {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div style={{ whiteSpace: 'pre-wrap', marginTop: '2rem' }}>{post.content}</div>
        </main>
      </Layout>
    );
  }

  // List view: /blog
  return (
    <Layout title="Blog">
      <main style={{ padding: '3rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
        <h1>Blog</h1>
        {posts.length === 0 && <p>No posts yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '1.5rem' }}>
              <a href={`/blog?slug=${post.slug}`} style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                {post.title}
              </a>
              <p style={{ opacity: 0.6, fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                {post.section} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}