import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from './styles.module.css';

const SECTIONS = [
  {key: 'fundamentals', label: 'Fundamentals'},
  {key: 'backend-engineering', label: 'Backend Engineering'},
  {key: 'systems-concurrency', label: 'Systems & Concurrency'},
  {key: 'build-logs', label: 'Build Logs'},
  {key: 'now', label: 'Now'},
  {key: 'meetups', label: 'Meetups'},
  {key: 'announcements', label: 'Announcements'},
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function extractHeadings(markdown) {
  return markdown
    .split('\n')
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);

      if (!match) {
        return null;
      }

      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, '');
      const id = slugify(text);

      return {
        level,
        text,
        id,
      };
    })
    .filter(Boolean);
}

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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        return response.json();
      })
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Failed to load blog posts:', error);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activePost = useMemo(
    () => posts.find((post) => post.slug === activeSlug),
    [posts, activeSlug],
  );

  const filteredPosts = useMemo(() => {
    if (!activeSection) {
      return posts;
    }

    return posts.filter((post) => post.section === activeSection);
  }, [posts, activeSection]);

  const headings = useMemo(
    () => (activePost ? extractHeadings(activePost.content) : []),
    [activePost],
  );

  function navigate(url) {
    window.history.pushState({}, '', url);

    const params = new URLSearchParams(window.location.search);

    setActiveSlug(params.get('slug'));
    setActiveSection(params.get('section'));
  }

  function openPost(post) {
    navigate(`/blog?slug=${encodeURIComponent(post.slug)}`);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function selectSection(section) {
    if (section) {
      navigate(`/blog?section=${encodeURIComponent(section)}`);
    } else {
      navigate('/blog');
    }

    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function goBack() {
    if (activeSection) {
      selectSection(activeSection);
    } else {
      navigate('/blog');
    }

    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  if (loading) {
    return (
      <Layout title="Blog">
        <main className="container padding-top--lg padding-bottom--lg">
          <div className={styles.loading}>Loading...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title={activePost ? activePost.title : 'Blog'}>
      <div className={styles.blogPage}>
        {/* LEFT SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarTitle}>GolangForAll</div>

            <nav aria-label="Blog sections">
              <ul className={styles.sidebarList}>
                <li>
                  <button
                    className={clsx(
                      styles.sidebarItem,
                      !activeSection && !activePost && styles.active,
                    )}
                    onClick={() => selectSection(null)}>
                    Blog
                  </button>
                </li>

                {SECTIONS.map((section) => (
                  <li key={section.key}>
                    <button
                      className={clsx(
                        styles.sidebarItem,
                        activeSection === section.key && styles.active,
                      )}
                      onClick={() => selectSection(section.key)}>
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <div className={styles.contentWrapper}>
            {activePost ? (
              <article>
                <div className={styles.breadcrumbs}>
                  <button onClick={() => navigate('/blog')}>Blog</button>
                  <span>/</span>
                  <span>{activePost.section}</span>
                  <span>/</span>
                  <span>{activePost.title}</span>
                </div>

                <header className={styles.articleHeader}>
                  <h1>{activePost.title}</h1>

                  <div className={styles.meta}>
                    {activePost.section}
                    {' · '}
                    {new Date(activePost.createdAt).toLocaleDateString()}
                  </div>
                </header>

                <div className={styles.markdown}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: ({children}) => {
                        const text = String(children);
                        return <h2 id={slugify(text)}>{children}</h2>;
                      },

                      h3: ({children}) => {
                        const text = String(children);
                        return <h3 id={slugify(text)}>{children}</h3>;
                      },

                      img: ({src, alt}) => (
                        <img
                          src={src}
                          alt={alt || ''}
                          className={styles.postImage}
                        />
                      ),
                    }}>
                    {activePost.content}
                  </ReactMarkdown>
                </div>

                <button className={styles.backButton} onClick={goBack}>
                  ← Back to Blog
                </button>
              </article>
            ) : (
              <>
                <div className={styles.breadcrumbs}>
                  <button onClick={() => navigate('/blog')}>Blog</button>

                  {activeSection && (
                    <>
                      <span>/</span>
                      <span>
                        {SECTIONS.find(
                          (section) => section.key === activeSection,
                        )?.label || activeSection}
                      </span>
                    </>
                  )}
                </div>

                <header className={styles.listHeader}>
                  <h1>
                    {activeSection
                      ? SECTIONS.find(
                          (section) => section.key === activeSection,
                        )?.label || activeSection
                      : 'Blog'}
                  </h1>

                  <p>
                    Learn, build, share, and meet with the GolangForAll
                    community.
                  </p>
                </header>

                {filteredPosts.length === 0 ? (
                  <p>No posts yet.</p>
                ) : (
                  <div className={styles.postList}>
                    {filteredPosts.map((post) => (
                      <button
                        key={post.id}
                        className={styles.postCard}
                        onClick={() => openPost(post)}>
                        <div>
                          <div className={styles.postSection}>
                            {post.section}
                          </div>

                          <h2>{post.title}</h2>

                          <p>
                            {new Date(
                              post.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <span className={styles.arrow}>→</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* RIGHT TOC */}
        {activePost && headings.length > 0 && (
          <aside className={styles.toc}>
            <div className={styles.tocInner}>
              <div className={styles.tocTitle}>On this page</div>

              <nav>
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={clsx(
                      heading.level === 3 && styles.tocNested,
                    )}>
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </Layout>
  );
}