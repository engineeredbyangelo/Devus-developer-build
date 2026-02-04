

# Fix AI Tool Discovery to Find Actual Tools, Not Articles

## Problem
The current AI-powered search returns **articles and listicles** about developer tools:
- "7 Open-Source Tools Backend Developers Should Master" (medium.com)
- "25 Essential Backend Development Tools for 2026" (roadmap.sh)
- "Top 10 Developer Tooling for 2025" (aviator.co/blog)

Instead of **actual tools**:
- "Cursor" → cursor.com
- "Docker" → docker.com
- "Vercel" → vercel.com
- "OpenAI Codex" → openai.com/codex

## Root Causes

1. **Search query structure** attracts listicle articles
2. **No filtering** of blog/article domains (medium.com, dev.to, blog sites)
3. **No GitHub prioritization** - Many dev tools live on GitHub
4. **Different card format** - Discovered tools don't match ToolCard styling

---

## Solution

### 1. Improve Search Query Strategy

Change the edge function to:
- Target specific tool homepages and GitHub repos
- Add site filters to prioritize tool sources
- Exclude common article/blog domains

| Current Query | Improved Query |
|---------------|----------------|
| `best backend freemium developer tools 2025` | `site:github.com OR site:producthunt.com backend developer tool` |

### 2. Filter Out Article Domains

Expand the skip patterns in the edge function to exclude:

```typescript
const skipPatterns = [
  // Social
  'linkedin.com', 'twitter.com', 'facebook.com', 'youtube.com',
  // Article/Blog sites
  'medium.com', 'dev.to', 'hashnode.com', 'substack.com',
  'blog.', '/blog/', 'news.', 'reddit.com',
  // Listicle aggregators  
  'roadmap.sh', 'awesome-', 'best-of-',
  // Generic comparison sites
  'g2.com', 'capterra.com', 'alternativeto.com',
];
```

### 3. Prioritize Quality Tool Sources

Add site filters to target actual tool homepages:

```typescript
// Build query with site preferences
const siteFilters = 'site:github.com OR site:producthunt.com';
const finalQuery = `${siteFilters} ${category} ${tags.join(' ')} developer tool`;
```

### 4. Better Tool Name Extraction

Parse tool names more intelligently:

```typescript
// Extract clean tool name from GitHub: "user/repo-name" → "Repo Name"
// Extract from Product Hunt: "ToolName - Tagline" → "ToolName"
function extractToolName(url: string, title: string): string {
  if (url.includes('github.com')) {
    const repoMatch = url.match(/github\.com\/[\w-]+\/([\w-]+)/);
    if (repoMatch) {
      return repoMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return title.split(' - ')[0].split(' | ')[0].split(':')[0].trim();
}
```

### 5. Use Same ToolCard Component for AI Results

Update `AIDiscoveredTools.tsx` to reuse the `ToolCard` component with a converted data structure:

```typescript
// Convert DiscoveredTool to Tool format for consistent display
const toolForCard: Tool = {
  id: discoveredTool.id,
  name: discoveredTool.name,
  description: discoveredTool.description,
  category: discoveredTool.category as Category,
  tags: discoveredTool.tags as Tag[],
  url: discoveredTool.url,
  githubUrl: discoveredTool.githubUrl,
  upvotes: 0,
  createdAt: new Date().toISOString(),
  isNew: true, // Mark as new since it's AI-discovered
};
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/search-tools/index.ts` | Modify | Add site filters, expand skip patterns, improve name extraction |
| `src/components/AIDiscoveredTools.tsx` | Modify | Use ToolCard component instead of custom simplified cards |

---

## Edge Function Changes (Detailed)

```typescript
// Domains to skip - articles, blogs, listicles
const skipDomains = [
  // Social media
  'linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'youtube.com',
  // Blog/article platforms
  'medium.com', 'dev.to', 'hashnode.dev', 'substack.com', 'wordpress.com',
  // News/content sites
  'reddit.com', 'news.ycombinator.com', 'techcrunch.com', 'wired.com',
  // Aggregator/comparison sites  
  'g2.com', 'capterra.com', 'alternativeto.com', 'slant.co',
  'trustradius.com', 'getapp.com',
  // Listicle/blog patterns in URL
  '/blog/', '/articles/', '/news/', '/best-', '/top-',
];

// Quality tool sources to prioritize
const prioritySites = [
  'github.com',
  'producthunt.com', 
  'npmjs.com',
  'pypi.org',
];

// Build query targeting actual tools, not articles about tools
const siteQuery = prioritySites.map(s => `site:${s}`).join(' OR ');
const filterParts = [category, ...tags].filter(Boolean).join(' ');
const finalQuery = `(${siteQuery}) ${filterParts} tool`;
```

---

## Expected Results

**Before**: Returns articles like "10 Best DevOps Tools for 2025"

**After**: Returns actual tools like:
- "Terraform" → github.com/hashicorp/terraform
- "Docker" → github.com/docker/docker
- "K3s" → github.com/k3s-io/k3s
- "Coolify" → producthunt.com/posts/coolify

---

## Summary

1. **Refine search query** - Target GitHub and ProductHunt instead of generic web search
2. **Filter aggressively** - Block all blog, article, and comparison sites
3. **Extract clean names** - Parse repo names from GitHub URLs properly
4. **Consistent display** - Use the same ToolCard component for AI results

