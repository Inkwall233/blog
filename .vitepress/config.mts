import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',

  title: "inkwall's blog",
  description: '不积跬步无以至千里',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/blog' },
      { text: 'Blog', link: '/blog/blog' },
    ],

    sidebar: [
      {
        text: '关于',
        items: [{ text: '关于本站', link: '/blog/introduce' }],
      },
      {
        text: '博客',
        items: [
          { text: '快速了解 TypeScript', link: '/blog/TypeScript-1' },
          { text: 'MCP', link: '/blog/20251207MCP' },
          { text: 'Monorepo', link: '/blog/monorepo' },
          { text: 'useEffect', link: '/blog/useEffect' },
          { text: 'useSyncExternalStore', link: '/blog/useSyncExternalStore' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  base: '/blog/',
})
