<script setup>
import { useData } from 'vitepress'

const { page } = useData()

const formatDate = (date) => {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('zh-CN', options)
}
</script>

<template>
  <div v-if="page.frontmatter" class="post-meta">
    <div v-if="page.frontmatter.date" class="meta-item">
      📅 发布时间: {{ formatDate(page.frontmatter.date) }}
    </div>
    
    <div v-if="page.frontmatter.categories && page.frontmatter.categories.length" class="meta-item">
      📂 分类: 
      <span 
        v-for="(category, index) in page.frontmatter.categories" 
        :key="category" 
        class="category-tag"
      >
        {{ category }}<span v-if="index < page.frontmatter.categories.length - 1">, </span>
      </span>
    </div>
    
    <div v-if="page.frontmatter.tags && page.frontmatter.tags.length" class="meta-item">
      🏷️ 标签: 
      <span 
        v-for="(tag, index) in page.frontmatter.tags" 
        :key="tag" 
        class="tag"
      >
        #{{ tag }}<span v-if="index < page.frontmatter.tags.length - 1"> </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.post-meta {
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
}

.meta-item {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.category-tag {
  display: inline-block;
  background-color: var(--vp-c-bg-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.3rem;
}

.tag {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>