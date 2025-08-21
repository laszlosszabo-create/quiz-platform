import { marked } from 'marked'

// Configure marked for safe HTML rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true,    // Enable GitHub Flavored Markdown
})

/**
 * Convert markdown to HTML safely
 * @param markdown - The markdown string to convert
 * @returns HTML string
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  
  try {
    return marked(markdown) as string
  } catch (error) {
    console.error('Markdown parsing error:', error)
    // Fallback: return original text with basic line break conversion
    return markdown.replace(/\n/g, '<br>')
  }
}

/**
 * Strip markdown formatting and return plain text
 * @param markdown - The markdown string to strip
 * @returns Plain text string
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return ''
  
  try {
    // Parse to HTML then strip tags
    const html = marked(markdown) as string
    return html.replace(/<[^>]*>/g, '').trim()
  } catch (error) {
    console.error('Markdown stripping error:', error)
    return markdown
  }
}

/**
 * Check if text contains markdown formatting
 * @param text - The text to check
 * @returns boolean
 */
export function hasMarkdown(text: string): boolean {
  if (!text) return false
  
  // Check for common markdown patterns
  const markdownPatterns = [
    /#{1,6}\s/, // Headers
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /`.*`/, // Code
    /\[.*\]\(.*\)/, // Links
    /^-\s/, // Lists
    /^\d+\.\s/, // Numbered lists
    />\s/, // Blockquotes
  ]
  
  return markdownPatterns.some(pattern => pattern.test(text))
}
