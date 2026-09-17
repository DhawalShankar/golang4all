import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './blog.css';

const sections = [
  ['fundamentals', 'Fundamentals'],
  ['backend', 'Backend Engineering'],
  ['systems', 'Systems & Concurrency'],
  ['projects', 'Build Logs'],
  ['now', 'Now'],
  ['meetups', 'Meetups'],
  ['announcements', 'Announcements'],
];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getHeadingText(children) {
  if (Array.isArray(children)) {
    return children
      .map((child) =>
        typeof child === 'string' ? child : ''
      )
      .join('');
  }

  return typeof children === 'string' ? children : '';
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const readUrl = () => {
      const params = new URLSearchParams(window.location.search);

      setActiveSlug(params.get('slug'));
      setActiveSection(params.get('section'));
    };

    readUrl();

    window.addEventListener('popstate', readUrl);

    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }

        return res.json();
      })
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      window.removeEventListener('popstate', readUrl);
    };
  }, []);

  const navigate = (params = {}) => {
    const query = new URLSearchParams(params).toString();

    const url = query ? `/blog?${query}` : '/blog';

    window.history.pushState({}, '', url);

    setActiveSlug(params.slug || null);
    setActiveSection(params.section || null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const activePost = useMemo(() => {
    if (!activeSlug) return null;

    return posts.find(
      (post) => post.slug === activeSlug
    );
  }, [posts, activeSlug]);

  const filteredPosts = useMemo(() => {
    if (!activeSection) return posts;

    return posts.filter(
      (post) => post.section === activeSection
    );
  }, [posts, activeSection]);

  const headings = useMemo(() => {
    if (!activePost) return [];

    return [
      ...activePost.content.matchAll(
        /^(#{2,3})\s+(.+)$/gm
      ),
    ].map((match) => {
      const hashes = match[1];
      const text = match[2].trim();

      return {
        level: hashes.length,
        text,
        id: slugify(text),
      };
    });
  }, [activePost]);

  if (loading) {
    return (
      <Layout title="Blog">
        <main className="blog-page">
          <div className="container">
            <div className="blog-loading">
              Loading...
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title={activePost?.title || 'Blog'}>
      <main className="blog-page">
        <div className="container">
          <div className="row">

            {/* LEFT SIDEBAR */}
            <aside className="col col--3 blog-sidebar">
              <div className="blog-sidebar-inner">
                <h2 className="blog-sidebar-title">
                  Blog
                </h2>

                <nav aria-label="Blog sections">
                  {sections.map(([value, label]) => (
                    <a
                      key={value}
                      href={`/blog?section=${value}`}
                      className={
                        activeSection === value
                          ? 'menu__link menu__link--active'
                          : 'menu__link'
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        navigate({ section: value });
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="col col--7 blog-content">

              {activePost ? (
                <>
                  {/* Breadcrumbs */}
                  <nav
                    className="theme-doc-breadcrumbs breadcrumbs"
                    aria-label="Breadcrumbs"
                  >
                    <a
                      href="/blog"
                      className="breadcrumbs__link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate({});
                      }}
                    >
                      Blog
                    </a>

                    <span className="breadcrumbs__item breadcrumbs__item--active">
                      <span className="breadcrumbs__link">
                        {activePost.title}
                      </span>
                    </span>
                  </nav>

                  {/* Article */}
                  <article>
                    <header className="blog-post-header">
                      <h1>{activePost.title}</h1>

                      <div className="blog-post-meta">
                        {sections.find(
                          ([value]) =>
                            value === activePost.section
                        )?.[1] || activePost.section}

                        {' · '}

                        {new Date(
                          activePost.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </header>

                    <div className="theme-doc-markdown markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          h2: ({
                            children,
                            ...props
                          }) => {
                            const text =
                              getHeadingText(children);

                            return (
                              <h2
                                id={slugify(text)}
                                {...props}
                              >
                                {children}
                              </h2>
                            );
                          },

                          h3: ({
                            children,
                            ...props
                          }) => {
                            const text =
                              getHeadingText(children);

                            return (
                              <h3
                                id={slugify(text)}
                                {...props}
                              >
                                {children}
                              </h3>
                            );
                          },
                        }}
                      >
                        {activePost.content}
                      </ReactMarkdown>
                    </div>
                  </article>
                </>
              ) : (
                <>
                  <nav className="theme-doc-breadcrumbs breadcrumbs">
                    <span className="breadcrumbs__item breadcrumbs__item--active">
                      <span className="breadcrumbs__link">
                        Blog
                      </span>
                    </span>
                  </nav>

                  <header className="blog-list-header">
                    <h1>
                      {activeSection
                        ? sections.find(
                            ([value]) =>
                              value === activeSection
                          )?.[1] || 'Blog'
                        : 'Blog'}
                    </h1>
                  </header>

                  {filteredPosts.length === 0 ? (
                    <p>No posts yet.</p>
                  ) : (
                    <div className="blog-post-list">
                      {filteredPosts.map((post) => (
                        <article
                          key={post.id}
                          className="blog-post-card"
                        >
                          <h2>
                            <a
                              href={`/blog?slug=${post.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate({
                                  slug: post.slug,
                                });
                              }}
                            >
                              {post.title}
                            </a>
                          </h2>

                          <div className="blog-post-meta">
                            {sections.find(
                              ([value]) =>
                                value === post.section
                            )?.[1] || post.section}

                            {' · '}

                            {new Date(
                              post.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </main>

            {/* RIGHT TOC */}
            <aside className="col col--2 blog-toc">
              {activePost && headings.length > 0 && (
                <div className="blog-toc-inner">
                  <h3>On this page</h3>

                  <ul className="table-of-contents">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={
                            heading.level === 3
                              ? 'blog-toc-nested'
                              : ''
                          }
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

          </div>
        </div>
      </main>
    </Layout>
  );
}