// Minimal Docusaurus config. Fill in title, tagline, URL, and theme details
// as the branded interface (PRD §3.1) is designed.

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'golangforall.in',
  url: 'https://golangforall.in',
  baseUrl: '/',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: { path: 'docs' },
        blog: false, // dynamic posts are served via /api, not Docusaurus blog plugin
      },
    ],
  ],
};

export default config;