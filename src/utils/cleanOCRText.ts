export const cleanOCRTextData = (ocrText: string) => {
    const regex = /([A-Za-z0-9\-]+(?:\s[A-Za-z0-9\-]+)*)(?:\s*\(?(\d+)\s*(mg|ml|iu)\)?)?/gi;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(ocrText)) !== null) {
        const name = match[1].trim();
        const quantity = match[2];
        const unit = match[3];
        if (quantity && unit) {
            matches.push(`${name} ${quantity}${unit}`);
        } else {
            matches.push(name);
        }
    }

    // Remove duplicates and return as comma-separated
    const uniqueMatches = [...new Set(matches)];
    return uniqueMatches.length ? uniqueMatches.join(', ') : null;
};
