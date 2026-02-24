const db = require('../db/connection');
const { cacheDelete, cacheDeletePattern } = require('../services/redis');

const stepRepository = {
  async getByPrayer(prayerId) {
    const steps = await db('steps')
      .where('prayer_id', prayerId)
      .orderBy('step_order');

    return steps.map(s => ({
      id: s.id,
      prayer_id: s.prayer_id,
      step_order: s.step_order,
      description: s.description,
      voices: typeof s.voices === 'string' ? JSON.parse(s.voices) : s.voices,
      timeInSeconds: s.time_in_seconds,
      type: s.step_type,
      created_at: s.created_at,
      updated_at: s.updated_at
    }));
  },

  async getById(id) {
    const step = await db('steps')
      .where('id', id)
      .first();

    if (step) {
      return {
        ...step,
        voices: typeof step.voices === 'string' ? JSON.parse(step.voices) : step.voices,
        timeInSeconds: step.time_in_seconds,
        type: step.step_type
      };
    }

    return step;
  },

  async create(prayerId, data) {
    // Get the next step order
    const lastStep = await db('steps')
      .where('prayer_id', prayerId)
      .orderBy('step_order', 'desc')
      .first();

    const nextOrder = lastStep ? lastStep.step_order + 1 : 1;

    const result = await db('steps').insert({
      prayer_id: prayerId,
      step_order: nextOrder,
      description: data.description || '',
      voices: JSON.stringify(data.voices || []),
      time_in_seconds: data.timeInSeconds || 60,
      step_type: data.type || 'FIX'
    }).returning(['id', 'prayer_id', 'step_order', 'description', 'voices', 'time_in_seconds', 'step_type']);

    const inserted = Array.isArray(result) ? result[0] : result;
    const id = inserted.id;

    await cacheDeletePattern('prayers:*');
    return this.getById(id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.description) updateData.description = data.description;
    if (data.voices) updateData.voices = JSON.stringify(data.voices);
    if (data.timeInSeconds) updateData.time_in_seconds = data.timeInSeconds;
    if (data.type) updateData.step_type = data.type;
    if (data.stepOrder) updateData.step_order = data.stepOrder;
    updateData.updated_at = db.fn.now();

    await db('steps')
      .where('id', id)
      .update(updateData);

    await cacheDeletePattern('prayers:*');
    
    return this.getById(id);
  },

  async delete(id) {
    const step = await this.getById(id);
    if (!step) return { message: 'Lepes nem talalt' };

    await db('steps').where('id', id).del();
    await cacheDeletePattern('prayers:*');
    
    return { message: 'Lepes torolve' };
  }
};

module.exports = stepRepository;
