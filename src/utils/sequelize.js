import Sequelize from 'sequelize';

export const bulkUpsert = (model, records) => {
  const keys = (records.length ? Object.keys(records[0]) : []).concat('updatedAt');
  const values = records.map(r => Object.values(r).concat(new Date(), new Date()));
  const query = `INSERT INTO "${model.tableName}" (${keys.concat('createdAt').map(k => `"${k}"`)}) VALUES ${values.map(() => '(?)')} ON CONFLICT (id) DO UPDATE SET ${keys.map(k => `"${k}"=excluded."${k}"`)}`;

  return model.sequelize.query({ query, values }, { type: Sequelize.QueryTypes.INSERT });
};
