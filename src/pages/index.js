import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout
      title="golangforall.in"
      description="Learn Go — tutorials, articles, and resources for Gophers.">
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Welcome to golangforall.in</h1>
        <p>Your resource for learning Go, from basics to advanced patterns.</p>
        <a href="/docs/intro" style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#00ADD8',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
        }}>
          Get Started →
        </a>
      </main>
    </Layout>
  );
}