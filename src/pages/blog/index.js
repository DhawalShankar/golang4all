import React, { useEffect, useMemo, useState } from 'react';
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

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getText(children) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      return '';
    })
    .join('');
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
      .map((match) => {
        const level = match[1].length;
        const text = match[2].trim();

        return {
          level,
          text,
          id: slugify(text),
        };
      });
  }, [activePost]);

  if (loading) {
    return (
      <Layout title="Blog">
        <div className="container margin-vert--lg">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={activePost?.title || 'Blog'}>
      <div className="theme-doc-layout">

        {/* LEFT SIDEBAR */}
        <aside className="theme-doc-sidebar-container">
          <div className="theme-doc-sidebar-menu">
            <nav
              className="menu thin-scrollbar"
              aria-label="Blog sections"
            >
              <ul className="theme-doc-sidebar-menu menu__list">
                <li>
                  <a
                    href="/blog"
                    className={
                      !activeSection && !activeSlug
                        ? 'menu__link menu__link--active'
                        : 'menu__link'
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({});
                    }}
                  >
                    GolangForAll
                  </a>
                </li>

                {sections.map(([value, label]) => (
                  <li key={value}>
                    <a
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
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* MAIN DOCUMENT AREA */}
        <main className="docMainContainer">

          <div className="container padding-top--md padding-bottom--lg">
            <div className="row">

              <div className="col docItemCol">
                <div className="docItemContainer">

                  {activePost ? (
                    <article>

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

                      {/* Title */}
                      <header>
                        <h1>{activePost.title}</h1>

                        <div className="theme-doc-version-badge">
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

                      {/* Markdown */}
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
                                getText(children);

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
                                getText(children);

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
                  ) : (
                    <article>

                      <nav
                        className="theme-doc-breadcrumbs breadcrumbs"
                        aria-label="Breadcrumbs"
                      >
                        <span className="breadcrumbs__item breadcrumbs__item--active">
                          <span className="breadcrumbs__link">
                            Blog
                          </span>
                        </span>
                      </nav>

                      <header>
                        <h1>
                          {activeSection
                            ? sections.find(
                                ([value]) =>
                                  value === activeSection
                              )?.[1] || 'Blog'
                            : 'Blog'}
                        </h1>
                      </header>

                      <div className="theme-doc-markdown markdown">
                        {filteredPosts.length === 0 ? (
                          <p>No posts yet.</p>
                        ) : (
                          filteredPosts.map((post) => (
                            <div key={post.id}>
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

                              <p>
                                <small>
                                  {sections.find(
                                    ([value]) =>
                                      value === post.section
                                  )?.[1] ||
                                    post.section}
                                  {' · '}
                                  {new Date(
                                    post.createdAt
                                  ).toLocaleDateString()}
                                </small>
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                    </article>
                  )}

                </div>
              </div>

              {/* RIGHT TOC */}
              {activePost && headings.length > 0 && (
                <div className="col col--3">
                  <div className="tableOfContents">
                    <nav
                      className="table-of-contents"
                      aria-label="On this page"
                    >
                      <h3>On this page</h3>

                      <ul>
                        {headings.map((heading) => (
                          <li key={heading.id}>
                            <a
                              href={`#${heading.id}`}
                              className={
                                heading.level === 3
                                  ? 'table-of-contents__link toc-nested'
                                  : 'table-of-contents__link'
                              }
                            >
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              )}

            </div>
          </div>

        </main>
      </div>
    </Layout>
  );
}