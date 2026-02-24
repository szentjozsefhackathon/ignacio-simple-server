const db = require('../db/connection');
const { cacheGet, cacheSet, cacheDelete, cacheDeletePattern } = require('../services/redis');

const CACHE_TTL = 300;

const prayerRepository = {
  async getByCategory(categoryId) {
    const cacheKey = `prayers:category:${categoryId}`;
    
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const prayers = await db('prayers')
      .where('category_id', categoryId)
      .orderBy('id');

    const prayersWithSteps = await Promise.all(
      prayers.map(async (prayer) => {
        const steps = await db('steps')
          .where('prayer_id', prayer.id)
          .orderBy('step_order');
        
        return {
          id: prayer.id,
          category_id: prayer.category_id,
          title: prayer.title,
          description: prayer.description,
          image: prayer.image,
          minTimeInMinutes: prayer.min_time_in_minutes,
          voice_options: typeof prayer.voice_options === 'string' 
            ? JSON.parse(prayer.voice_options) 
            : prayer.voice_options,
          steps: steps.map(s => ({
            id: s.id,
            prayer_id: s.prayer_id,
            step_order: s.step_order,
            description: s.description,
            voices: typeof s.voices === 'string' ? JSON.parse(s.voices) : s.voices,
            timeInSeconds: s.time_in_seconds,
            type: s.step_type
          }))
        };
      })
    );

    await cacheSet(cacheKey, prayersWithSteps, CACHE_TTL);
    return prayersWithSteps;
  },

  async getById(id) {
    const cacheKey = `prayer:${id}`;
    
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const prayer = await db('prayers')
      .where('id', id)
      .first();

    if (prayer) {
      const steps = await db('steps')
        .where('prayer_id', id)
        .orderBy('step_order');
      
      const mappedPrayer = {
        id: prayer.id,
        category_id: prayer.category_id,
        title: prayer.title,
        description: prayer.description,
        image: prayer.image,
        minTimeInMinutes: prayer.min_time_in_minutes,
        voice_options: typeof prayer.voice_options === 'string' 
          ? JSON.parse(prayer.voice_options) 
          : prayer.voice_options
      };
      
      mappedPrayer.steps = steps.map(s => ({
        id: s.id,
        prayer_id: s.prayer_id,
        step_order: s.step_order,
        description: s.description,
        voices: typeof s.voices === 'string' ? JSON.parse(s.voices) : s.voices,
        timeInSeconds: s.time_in_seconds,
        type: s.step_type
      }));
      
      await cacheSet(cacheKey, mappedPrayer, CACHE_TTL);
    }

    return prayer;
  },

  async create(categoryId, data) {
    const result = await db('prayers').insert({
      category_id: categoryId,
      title: data.title,
      description: data.description || '',
      image: data.image || 'default.jpg',
      voice_options: JSON.stringify(data.voice_options || []),
      min_time_in_minutes: data.minTimeInMinutes || 30
    }).returning(['id', 'category_id', 'title', 'description', 'image', 'voice_options', 'min_time_in_minutes']);

    const inserted = Array.isArray(result) ? result[0] : result;
    const id = inserted.id;

    await cacheDeletePattern('prayers:*');
    return this.getById(id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.image) updateData.image = data.image;
    if (data.voice_options) updateData.voice_options = JSON.stringify(data.voice_options);
    if (data.minTimeInMinutes) updateData.min_time_in_minutes = data.minTimeInMinutes;
    updateData.updated_at = db.fn.now();

    await db('prayers')
      .where('id', id)
      .update(updateData);

    await cacheDeletePattern('prayers:*');
    await cacheDelete(`prayer:${id}`);
    
    return this.getById(id);
  },

  async delete(id) {
    await db('prayers').where('id', id).del();
    await cacheDeletePattern('prayers:*');
    await cacheDelete(`prayer:${id}`);
    return { message: 'Ima torolve' };
  }
};

module.exports = prayerRepository;
