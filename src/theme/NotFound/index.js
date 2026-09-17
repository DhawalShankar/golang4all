import React from 'react';
import Layout from '@theme/Layout';

export default function NotFound() {
  return (
    <Layout title="Page Not Found">
      <main
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1rem',
        }}
      >
        <img
          src="/img/logo.png"
          alt="GolangForAll"
          style={{
            width: '180px',
            maxWidth: '60%',
            marginBottom: '1.5rem',
          }}
        />

        <h1>404 — Page Not Found</h1>

        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
          Looks like this page wandered off somewhere.
        </p>

        <a
          href="/"
          style={{
            padding: '0.7rem 1.4rem',
            borderRadius: '6px',
            background: 'var(--ifm-color-primary)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          ← Return to Home
        </a>
      </main>
    </Layout>
  );
}