<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import PostMeta from './PostMeta.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <PostMeta />
    </template>
  </Layout>
</template>

<style scoped>
.post-date {
  text-align: right;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}
</style>
