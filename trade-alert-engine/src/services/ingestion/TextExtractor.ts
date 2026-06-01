import { parse } from 'node-html-parser'

export class TextExtractor {
  extractFromHtml(html: string): string {
    const root = parse(html)
    root.querySelectorAll('script, style, nav, header, footer').forEach((el) => el.remove())
    const text = root.text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    return text
  }

  extractFromText(text: string): string {
    return text.trim()
  }

  isHtml(content: string): boolean {
    return /<[a-z][\s\S]*>/i.test(content)
  }

  extract(content: string): string {
    if (this.isHtml(content)) {
      return this.extractFromHtml(content)
    }
    return this.extractFromText(content)
  }
}
