import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "inkwall's blog",
  description: '不积跬步，无以至千里；不积小流，无以成江海。',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/introduce/' },
    ],

    sidebar: [
      {
        text: 'About',
        link: '/blog/introduce',
      },
      {
        text: 'Blog',
        items: [
          { text: 'MCP', link: '/blog/20251207MCP' },
          { text: 'useSyncExternalStore', link: '/blog/useSyncExternalStore' },
          { text: 'useEffect', link: '/blog/useEffect' },
          { text: '快速了解TypeScript', link: '/blog/TypeScript-1' },
        ],
      },
      {
        text: 'JAVA',
        items: [{ text: 'Spring Boot', link: '/blog/java/20260913springboot' }],
      },
      {
        text: 'Docker',
        items: [
          {
            text: 'Docker 入门到实践一',
            link: '/blog/docker/20260918InstallDocker',
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/inkwall233/' }],
  },
  base: '/blog/',
})
