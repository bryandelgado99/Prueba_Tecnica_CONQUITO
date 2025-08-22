/**
 * Convierte un buffer de imagen a Base64 con prefijo data URI
 * @param {object} file - req.file de multer
 * @returns {string|null} - Imagen codificada en Base64
 */
export const encodeImageToBase64 = (file) => {
    if (!file || !file.buffer) return null;

    const ext = file.originalname.split('.').pop().toLowerCase();
    const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    return `data:${mimeType};base64,${file.buffer.toString('base64')}`;
};
