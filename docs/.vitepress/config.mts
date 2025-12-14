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
        text: 'Blog',
        items: [
          { text: 'MCP', link: '/blog/20251207MCP' },
          { text: 'React Hooks useSyncExternalStore', link: '/blog/React' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/inkwall233/' }],
  },
  base: '/blog/',
})
