export function validateImageUrl(img) {
    if (!img || img.trim() === '') {
        return true; // Empty string is allowed
    }
    const trimmed = img.trim();
    // (b) path starting with /lib/
    if (trimmed.startsWith('/lib/')) {
        return true;
    }
    // (c) https URL
    if (trimmed.startsWith('https://')) {
        try {
            new URL(trimmed);
            return true;
        }
        catch {
            return false;
        }
    }
    // (a) data URL matching ^data:image/(png|jpeg|webp);base64, with max decoded size ~400KB
    const dataUrlPrefix = /^data:image\/(png|jpeg|webp);base64,/i;
    if (!dataUrlPrefix.test(trimmed)) {
        return false;
    }
    const base64Data = trimmed.replace(dataUrlPrefix, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
        return false;
    }
    // Calculate decoded byte length from base64
    let padding = 0;
    if (base64Data.endsWith('==')) {
        padding = 2;
    }
    else if (base64Data.endsWith('=')) {
        padding = 1;
    }
    const decodedBytes = Math.floor((base64Data.length * 3) / 4) - padding;
    const MAX_DECODED_BYTES = 400 * 1024; // ~400KB
    return decodedBytes <= MAX_DECODED_BYTES;
}
