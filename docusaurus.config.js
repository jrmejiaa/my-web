// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Oops I bug it again · J. Mejia',
  tagline: 'Embedded Software Engineer — Yocto · Linux · C/C++',
  favicon: '/img/blog_favicon.ico',

  url: 'https://oops-i-bug-it-again.dev/',
  baseUrl: '/',

  organizationName: 'jrmejiaa',
  projectName: 'my-web',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Oops I bug it again',
          blogDescription: 'Notes on Linux, Yocto, and embedded development — by Jairo R. Mejia Aponte',
          feedOptions: {
            type: 'rss',
            copyright: `© ${new Date().getFullYear()} Jairo R. Mejia Aponte`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // Local plugin: republishes blog/doc frontmatter as global data so pages can
  // render content cards from the source of truth. See plugins/content-index-plugin.js.
  plugins: ['./plugins/content-index-plugin.js'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Oops I bug it again · J. Mejia',
        hideOnScroll: true,
        logo: {
          alt: 'Jairo Mejia Logo',
          src: 'img/icon.svg',
        },
        items: [
          { to: '/', label: 'Home', position: 'left', activeBaseRegex: '^/$' },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'yoctoSidebar',
                label: 'Yocto',
              },
              {
                type: 'docSidebar',
                sidebarId: 'codingSidebar',
                label: 'Programming',
              },
              {
                type: 'docSidebar',
                sidebarId: 'linuxSidebar',
                label: 'Linux',
              },
            ],
          },
          { to: '/about', label: 'About', position: 'left' },
          {
            href: 'https://github.com/jrmejiaa',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub profile',
          },
        ],
      },
      // Footer is swizzled — see src/theme/Footer/index.js
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['cpp', 'c', 'bash', 'php', 'yaml', 'makefile'],
      },
    }),
};

export default config;
