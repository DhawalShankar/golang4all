import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const sections = [
  ['fundamentals', 'Fundamentals'],
  ['backend', 'Backend Engineering'],
  ['systems', 'Systems & Concurrency'],
  ['projects', 'Build Logs'],
  ['now', 'Now'],
  ['meetups', 'Meetups'],
  ['announcements', 'Announcements'],
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);
  const [section, setSection] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setSlug(params.get('slug'));
    setSection(params.get('section'));

    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const navigate = (params) => {
    const query = new URLSearchParams(params).toString();
    window.history.pushState(
      {},
      '',
      query ? `/blog?${query}` : '/blog'
    );

    setSlug(params.slug || null);
    setSection(params.section || null);
  };

  if (loading) {
    return (
      <Layout title="Blog">
        <div className="container margin-vert--lg">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const activePost = slug
    ? posts.find((post) => post.slug === slug)
    : null;

  const filteredPosts = section
    ? posts.filter((post) => post.section === section)
    : posts;

  return (
    <Layout title={activePost?.title || 'Blog'}>
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <aside className="col col--3">
            <div
              style={{
                position: 'sticky',
                top: 'calc(var(--ifm-navbar-height) + 1rem)',
              }}
            >
              <h3>Blog</h3>

              <nav>
                {sections.map(([value, label]) => (
                  <a
                    key={value}
                    href={`/blog?section=${value}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ section: value });
                    }}
                    className={
                      section === value
                        ? 'menu__link menu__link--active'
                        : 'menu__link'
                    }
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="col col--7">
            {activePost ? (
              <>
                <nav className="theme-doc-breadcrumbs breadcrumbs">
                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({});
                    }}
                    className="breadcrumbs__link"
                  >
                    Blog
                  </a>

                  <span className="breadcrumbs__item breadcrumbs__item--active">
                    <span className="breadcrumbs__link">
                      {activePost.title}
                    </span>
                  </span>
                </nav>

                <article>
                  <header>
                    <h1>{activePost.title}</h1>

                    <p style={{ opacity: 0.65 }}>
                      {sections.find(
                        ([value]) => value === activePost.section
                      )?.[1] || activePost.section}
                      {' · '}
                      {new Date(
                        activePost.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </header>

                  <div className="theme-doc-markdown markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {activePost.content}
                    </ReactMarkdown>
                  </div>
                </article>
              </>
            ) : (
              <>
                <h1>
                  {section
                    ? sections.find(
                        ([value]) => value === section
                      )?.[1]
                    : 'Blog'}
                </h1>

                {filteredPosts.length === 0 ? (
                  <p>No posts yet.</p>
                ) : (
                  <div>
                    {filteredPosts.map((post) => (
                      <article
                        key={post.id}
                        className="margin-bottom--lg"
                      >
                        <h2>
                          <a
                            href={`/blog?slug=${post.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate({ slug: post.slug });
                            }}
                          >
                            {post.title}
                          </a>
                        </h2>

                        <p style={{ opacity: 0.65 }}>
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Right spacing / future TOC */}
          <div className="col col--2" />
        </div>
      </div>
    </Layout>
  );
}