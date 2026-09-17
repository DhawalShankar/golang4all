/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'golangforall.in',
  url: 'https://golangforall.in',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
        },

        blog: false,

        pages: {},
      },
    ],
  ],
};

export default config;