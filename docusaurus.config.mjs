/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GolangForAll',
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

  themeConfig: {
    favicon: 'img/logo.png',

    navbar: {
      title: 'GolangForAll',
      logo: {
        alt: 'GolangForAll Logo',
        src: 'img/logo.png',
      },
    },
  },
};

export default config;