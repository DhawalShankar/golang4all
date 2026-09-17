import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BlogSidebar from '@site/src/components/BlogSidebar';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setActiveSlug(params.get('slug'));
    setActiveSection(params.get('section'));

    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const selectSection = (section) => {
    setActiveSlug(null);
    setActiveSection(section);

    const url = section
      ? `/blog?section=${section}`
      : '/blog';

    window.history.pushState({}, '', url);
  };

  if (loading) {
    return (
      <Layout title="Blog">
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          Loading...
        </div>
      </Layout>
    );
  }

  const filteredPosts = activeSection
    ? posts.filter((post) => post.section === activeSection)
    : posts;

  const activePost = activeSlug
    ? posts.find((post) => post.slug === activeSlug)
    : null;

  return (
    <Layout title={activePost ? activePost.title : 'Blog'}>
      <div
        style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '70vh',
        }}
      >
        <BlogSidebar
          activeSection={activeSection}
          onSelect={selectSection}
        />

        <main
          style={{
            flex: 1,
            padding: '3rem',
            minWidth: 0,
          }}
        >
          {activePost ? (
            <>
              <button
                onClick={() => {
                  setActiveSlug(null);
                  window.history.pushState({}, '', '/blog');
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--ifm-color-primary)',
                }}
              >
                ← Back to Blog
              </button>

              <h1 style={{ marginTop: '1.5rem' }}>
                {activePost.title}
              </h1>

              <p style={{ opacity: 0.6 }}>
                {activePost.section} ·{' '}
                {new Date(activePost.createdAt).toLocaleDateString()}
              </p>

              <article
                className="markdown"
                style={{ marginTop: '2rem' }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {activePost.content}
                </ReactMarkdown>
              </article>
            </>
          ) : (
            <>
              <h1>
                {activeSection
                  ? filteredPosts[0]?.section || 'Blog'
                  : 'Blog'}
              </h1>

              {filteredPosts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    style={{
                      marginBottom: '2rem',
                      paddingBottom: '1.5rem',
                      borderBottom:
                        '1px solid var(--ifm-color-emphasis-200)',
                    }}
                  >
                    <h2 style={{ marginBottom: '0.4rem' }}>
                      <a
                        href={`/blog?slug=${post.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {post.title}
                      </a>
                    </h2>

                    <p
                      style={{
                        opacity: 0.6,
                        fontSize: '0.9rem',
                      }}
                    >
                      {new Date(
                        post.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </article>
                ))
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}