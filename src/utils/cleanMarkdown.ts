export const cleanMarkdownData = (markdown: string): string => {
    return markdown
        // Remove code blocks (```...```)
        .replace(/```[\s\S]*?```/g, '')
        // Remove inline code (`code`)
        .replace(/`[^`]*`/g, '')
        // Remove Markdown headers (#, ##, etc.)
        .replace(/^#+\s+/gm, '')
        // Remove bold/italic formatting (*text*, **text**, _text_)
        .replace(/[*_~]/g, '')
        // Remove bullet points
        .replace(/^\s*[-*+]\s+/gm, '')
        // Remove extra whitespace
        .replace(/\n{2,}/g, '\n')
        .trim();
}
