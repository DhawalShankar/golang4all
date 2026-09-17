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
          sidebarPath: './sidebars.js',
        },
        blog: false,
        pages: {},
      },
    ],
  ],

  themeConfig: {
    favicon: 'img/favicon.ico',

    navbar: {
      title: 'GolangForAll',
      logo: {
        alt: 'GolangForAll Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/about',
          label: 'About',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/docs/intro',
          label: 'Docs',
          position: 'left',
        },
      ],
    },
  },
};

export default config;