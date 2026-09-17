/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'golangforall.in',
  url: 'https://golangforall.in',
  baseUrl: '/',
  onBrokenLinks: 'warn',      // don't fail the build on broken internal links
  onBrokenAnchors: 'warn',    // don't fail the build on broken #anchors
  onBrokenMarkdownLinks: 'warn', // don't fail on broken markdown links either
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: { path: 'docs' },
        about: { path: 'about' },
        blog: false, // dynamic posts are served via /api, not Docusaurus blog plugin
      },
    ],
  ],
};

export default config;