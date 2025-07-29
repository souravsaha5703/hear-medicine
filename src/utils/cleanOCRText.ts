export const cleanOCRTextData = (ocrText: string) => {
    const regex = /([A-Za-z0-9\-]+(?:\s[A-Za-z0-9\-]+)*)\s*\(?(\d+)\s*(mg|ml|iu)\)?/gi;
    const matches = [];
    let match;

    while ((match = regex.exec(ocrText)) !== null) {
        matches.push(`${match[1].trim()} ${match[2]}${match[3]}`);
    }

    return matches.length ? matches.join() : null;
}