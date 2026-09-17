// src/pages/about.js
import React from 'react';
import Layout from '@theme/Layout';

export default function About() {
  return (
    <Layout title="About" description="About GolangForAll and how it started">
      <main style={{ padding: '4rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
        <h1>About GolangForAll</h1>

        <p>
          GolangForAll is a community initiative for people who learn, build,
          teach, and contribute with Go — through meetups, talks, projects,
          and a blog written by people actually working with the language.
          It isn't affiliated with go.dev; we're not here to replace the
          official docs, just to bring the people around them together.
        </p>

        <h2>How it started</h2>

        <p>
          I'm Dhawal Shukla, a backend engineer working primarily with Go,
          Node.js, and Python. I've shipped production platforms spanning
          real-time messaging, payment processing, polyglot databases, and
          AI-driven data pipelines — and along the way, Go became the
          language I trust most when correctness and concurrency actually
          matter.
        </p>

        <p>
          Most Go content online either stops at syntax or assumes you
          already know why the language is built the way it is. GolangForAll
          started as an attempt to close that gap — and quickly became less
          about one person's writing and more about getting developers in
          the same room, in person and on WhatsApp, to actually talk about
          this stuff.
        </p>

        <h2>Where it's headed</h2>

        <p>
          Right now that means meetups around NCR and Kanpur/Lucknow, a
          community WhatsApp group, and a blog open to anyone who wants to
          write about what they've actually built. See{' '}
          <a href="/docs/contribute">Contribute</a> if you want to speak,
          write, or host a meetup in your own city.
        </p>

        <p>
          You can find my own work and background on{' '}
          <a href="https://github.com/DhawalShankar" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          and{' '}
          <a href="https://www.linkedin.com/in/dhawalshukl/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>. For anything about the community itself, reach out at{' '}
          <a href="mailto:work.dshukla@gmail.com">work.dshukla@gmail.com</a>.
        </p>

        <hr style={{ margin: '2rem 0' }} />

        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          <strong>Disclaimer:</strong> GolangForAll (golangforall.in) is an
          independent, community-run initiative. It is not affiliated with,
          endorsed by, or connected to golangforall.com or any other
          similarly-named platform, organization, or entity.
        </p>
      </main>
    </Layout>
  );
}