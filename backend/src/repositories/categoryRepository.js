const db = require('../db/connection');
const { cacheGet, cacheSet, cacheDelete, cacheDeletePattern } = require('../services/redis');

const CACHE_TTL = 300; // 5 minutes

const categoryRepository = {
  async getAll() {
    const cacheKey = 'categories:all';
    
    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const categories = await db('categories')
      .select('categories.*')
      .orderBy('id');

    // Get prayer count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const prayers = await db('prayers')
          .where('category_id', category.id)
          .count('* as count')
          .first();
        
        return {
          id: category.id,
          title: category.title,
          image: category.image,
          prayerCount: parseInt(prayers.count)
        };
      })
    );

    // Cache the result
    await cacheSet(cacheKey, categoriesWithCount, CACHE_TTL);

    return categoriesWithCount;
  },

  async getById(id) {
    const cacheKey = `category:${id}`;
    
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const category = await db('categories')
      .where('id', id)
      .first();

    if (category) {
      const prayers = await db('prayers')
        .where('category_id', id)
        .count('* as count')
        .first();
      
      category.prayerCount = parseInt(prayers.count);
      await cacheSet(cacheKey, category, CACHE_TTL);
    }

    return category;
  },

  async create(data) {
    const result = await db('categories').insert({
      title: data.title,
      image: data.image || 'default.jpg'
    }).returning(['id', 'title', 'image']);

    const inserted = Array.isArray(result) ? result[0] : result;
    const id = inserted.id;

    await cacheDeletePattern('categories:*');
    return this.getById(id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.image) updateData.image = data.image;
    updateData.updated_at = db.fn.now();

    await db('categories')
      .where('id', id)
      .update(updateData);

    await cacheDeletePattern('categories:*');
    await cacheDelete(`category:${id}`);
    
    return this.getById(id);
  },

  async delete(id) {
    await db('categories').where('id', id).del();
    await cacheDeletePattern('categories:*');
    await cacheDelete(`category:${id}`);
    return { message: 'Kategoria torolve' };
  }
};

module.exports = categoryRepository;
