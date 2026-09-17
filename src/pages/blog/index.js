import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BlogSidebar from '@site/src/components/BlogSidebar';

const sectionNames = {
  fundamentals: 'Fundamentals',
  backend: 'Backend Engineering',
  systems: 'Systems & Concurrency',
  projects: 'Build Logs',
  now: 'Now',
  meetups: 'Meetups',
  announcements: 'Announcements',
};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

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
        if (!res.ok) throw new Error('Failed to fetch posts');
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

    return posts.find((post) => post.slug === activeSlug);
  }, [posts, activeSlug]);

  const filteredPosts = useMemo(() => {
    if (!activeSection) return posts;

    return posts.filter(
      (post) => post.section === activeSection
    );
  }, [posts, activeSection]);

  const headings = useMemo(() => {
    if (!activePost) return [];

    return [...activePost.content.matchAll(/^(#{2,3})\s+(.+)$/gm)]
      .map((match) => ({
        level: match[1].length,
        text: match[2].trim(),
        id: slugify(match[2]),
      }));
  }, [activePost]);

  if (loading) {
    return (
      <Layout title="Blog">
        <div className="blog-loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title={activePost?.title || 'Blog'}>

      <div className="blog-layout">

        {/* LEFT BLOG SIDEBAR */}
        <aside className="blog-sidebar">
          <BlogSidebar
            activeSection={activeSection}
            onSelect={(section) => {
              navigate(
                section
                  ? { section }
                  : {}
              );
            }}
          />
        </aside>

        {/* MAIN CONTENT */}
        <main className="blog-main">

          <div className="blog-content">

            {/* BREADCRUMBS */}
            <nav className="breadcrumbs">
              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({});
                }}
              >
                Blog
              </a>

              {activePost && (
                <>
                  <span>›</span>

                  <span className="breadcrumb-active">
                    {activePost.title}
                  </span>
                </>
              )}
            </nav>

            {/* POST */}
            {activePost ? (
              <>
                <article className="theme-doc-markdown markdown">

                  <h1>{activePost.title}</h1>

                  <p className="blog-meta">
                    {sectionNames[activePost.section] ||
                      activePost.section}
                    {' · '}
                    {new Date(
                      activePost.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: ({ children, ...props }) => {
                        const text = String(children);

                        return (
                          <h2
                            id={slugify(text)}
                            {...props}
                          >
                            {children}
                          </h2>
                        );
                      },

                      h3: ({ children, ...props }) => {
                        const text = String(children);

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

                </article>
              </>
            ) : (
              <>
                <article className="theme-doc-markdown markdown">

                  <h1>
                    {activeSection
                      ? sectionNames[activeSection] ||
                        activeSection
                      : 'Blog'}
                  </h1>

                  {filteredPosts.length === 0 ? (
                    <p>No posts yet.</p>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="blog-post-preview"
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

                        <p className="blog-meta">
                          {sectionNames[post.section] ||
                            post.section}
                          {' · '}
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}

                </article>
              </>
            )}

          </div>

          {/* RIGHT TOC */}
          {activePost && headings.length > 0 && (
            <aside className="blog-toc">
              <div className="blog-toc-title">
                On this page
              </div>

              <ul>
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={
                      heading.level === 3
                        ? 'toc-nested'
                        : ''
                    }
                  >
                    <a href={`#${heading.id}`}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

        </main>

      </div>

    </Layout>
  );
}