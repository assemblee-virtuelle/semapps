module.exports = {
  title: 'SemApps',
  tagline: 'Fostering interconnections between communities by creating synergies between their platforms',
  url: 'https://semapps.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'assemblee-virtuelle', // Usually your GitHub org/user name.
  projectName: 'semapps', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      'en': {
        label: 'English',
        direction: 'ltr'
      },
      'fr': {
        label: 'Français',
        direction: 'ltr'
      }
    }
  },
  themeConfig: {
    navbar: {
      title: 'SemApps',
      logo: {
        alt: 'Logo Semapps',
        src: 'img/logo.png',
        srcDark: 'img/logo_dark.png',
        href: 'https://semapps.org/',
        target: '_self',
      },
      items: [
        {to: 'docs/about', label: 'About', position: 'left'},
        {to: 'docs/governance/team', label: 'Team', position: 'left'},
        {to: 'docs/governance/organisation-and-roles', label: 'Governance', position: 'left'},
        {to: 'docs/guides/ldp-server', label: 'Documentation', position: 'left'},
        {to: 'docs/contribute/code', label: 'How to contribute', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/assemblee-virtuelle/semapps',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {
              label: 'Create your first LDP server',
              to: 'docs/guides/ldp-server',
            },
            {
              label: 'Add a Data Management System',
              to: 'docs/guides/dms',
            },
            {
              label: 'Create an ActivityPub server',
              to: 'docs/guides/activitypub',
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discourse (French)',
              href: 'https://forums.assemblee-virtuelle.org/c/projets/semapps/11',
            },
            {
              label: 'Chat (French and English)',
              href: 'https://chat.lescommuns.org/channel/semapps_dev',
            },
            {
              label: 'Contact',
              href: 'https://www.virtual-assembly.org/contact/'
            }
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/assemblee-virtuelle/semapps',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Virtual Assembly`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/assemblee-virtuelle/semapps/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
