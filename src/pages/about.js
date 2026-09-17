// src/pages/about.js
import React from 'react';
import Layout from '@theme/Layout';

export default function About() {
  return (
    <Layout title="About" description="About golangforall.in and its author">
      <main style={{ padding: '4rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
        <h1>About golangforall.in</h1>

        <p>
          I'm Dhawal Shukla, a backend engineer working primarily with Go,
          Node.js, and Python. I've shipped production platforms spanning
          real-time messaging, payment processing, polyglot databases, and
          AI-driven data pipelines — and along the way, Go became the
          language I trust most when correctness and concurrency actually
          matter.
        </p>

        <p>
          golangforall.in exists because most Go content online either stops
          at syntax or assumes you already know why the language is built
          the way it is. I wanted a place that closes that gap — explaining
          not just how Go works, but why it's designed that way, and when
          to actually reach for it.
        </p>

        <p>
          Everything here is written from the same place I build from:
          real projects, real production decisions, and the mistakes that
          came with them. You can find my other work and background on{' '}
          <a href="https://github.com/DhawalShankar" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          and{' '}
          <a href="https://www.linkedin.com/in/dhawalshukl/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>.
        </p>

        <hr style={{ margin: '2rem 0' }} />

        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          <strong>Disclaimer:</strong> golangforall.in is an independent,
          individually-run educational resource. It is not affiliated with,
          endorsed by, or connected to golangforall.com or any other
          similarly-named platform, organization, or entity.
        </p>
      </main>
    </Layout>
  );
}