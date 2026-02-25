const db = require('../db/connection');
const { uploadFile, deleteFile, listFiles, getFileUrl, getFile } = require('../services/s3');
const { cacheGet, cacheSet, cacheDelete } = require('../services/redis');

const CACHE_TTL = 300;

const mediaRepository = {
  async getAll() {
    const cacheKey = 'media:all';
    
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const media = await db('media')
      .select('*')
      .orderBy('created_at', 'desc');

    const mediaWithUrls = await Promise.all(media.map(async (m) => ({
      ...m,
      url: await getFileUrl(m.s3_key)
    })));

    await cacheSet(cacheKey, mediaWithUrls, CACHE_TTL);
    return mediaWithUrls;
  },

  async getByType(mediaType) {
    const media = await db('media')
      .where('media_type', mediaType)
      .orderBy('created_at', 'desc');

    return await Promise.all(media.map(async (m) => ({
      ...m,
      url: await getFileUrl(m.s3_key)
    })));
  },

  async getByFilename(filename, mediaType) {
    let query = db('media').where('filename', filename);
    
    if (mediaType) {
      query = query.where('media_type', mediaType);
    }
    
    return await query.first();
  },

  async getFileStream(filename, mediaType) {
    const media = await this.getByFilename(filename, mediaType);
    if (!media) return null;
    
    const stream = await getFile(media.s3_key);
    return { stream, mimeType: media.mime_type };
  },

  async upload(buffer, filename, contentType) {
    // Upload to S3
    const { key, url } = await uploadFile(buffer, filename, contentType);
    
    const mediaType = contentType.startsWith('image/') ? 'image' : 'voice';
    
    // Save to database
    const result = await db('media').insert({
        filename,
        s3_key: key,
        media_type: mediaType,
        mime_type: contentType,
        size_bytes: buffer.length
      }).returning(['id', 'filename', 's3_key', 'media_type', 'mime_type', 'size_bytes']);

      const inserted = Array.isArray(result) ? result[0] : result;

      await cacheDelete('media:all');
      
      return {
        id: inserted.id,
        filename: inserted.filename,
        url,
        media_type: inserted.media_type,
        mime_type: inserted.mime_type,
        size_bytes: inserted.size_bytes
      };
  },

  async delete(id) {
    const media = await db('media').where('id', id).first();
    if (!media) return { message: 'Media not found' };

    // Delete from S3
    if (media.s3_key) {
      await deleteFile(media.s3_key);
    }

    // Delete from database
    await db('media').where('id', id).del();
    await cacheDelete('media:all');

    return { message: 'Media torolve' };
  },

  async listS3Files() {
    return listFiles('uploads/');
  }
};

module.exports = mediaRepository;
