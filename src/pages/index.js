import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="GolangForAll"
      description="A community for people who learn, build, teach, and contribute with Go."
    >
      <main
        style={{
          padding: '5rem 2rem',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <img
          src="/img/logo.png"
          alt="GolangForAll Logo"
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            marginBottom: '1.5rem',
          }}
        />

        <h1>GolangForAll</h1>

        <p
          style={{
            fontSize: '1.4rem',
            marginTop: '1rem',
          }}
        >
          Bringing Go developers together.
        </p>

        <p style={{ marginTop: '1.5rem' }}>
          Learn. Build. Share. Meet.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/docs/intro"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#00ADD8',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Explore GolangForAll →
          </a>

          <a
            href="https://chat.whatsapp.com/G642UWUIanCJjF8jzavUPA"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #00ADD8',
              color: '#00ADD8',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Join the Community
          </a>
        </div>
      </main>
    </Layout>
  );
}