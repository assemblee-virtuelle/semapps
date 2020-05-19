module.exports = {
  title: 'SemApps',
  tagline: 'Fostering interconnections between communities by creating synergies between their platforms',
  url: 'https://semapps.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'assemblee-virtuelle', // Usually your GitHub org/user name.
  projectName: 'semapps', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'SemApps',
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      links: [
        {to: 'docs/discover', label: 'About', position: 'left'},
        {to: 'docs/governance/team', label: 'Team', position: 'left'},
        {to: 'docs/guides/ldp-server', label: 'Documentation', position: 'left'},
        {
          href: 'https://github.com/assemblee-virtuelle/semapps',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Create your LDP server',
              to: 'guides/ldp-server',
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Riot',
              href: 'https://riot.im/app/#/room/#semapps:matrix.virtual-assembly.org',
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
