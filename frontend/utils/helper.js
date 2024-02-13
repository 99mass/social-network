export function truncateText(text) {
    const limit = 200;
    return text && text.length > limit ? `${text.substring(0, limit)}...See more` : text;
}