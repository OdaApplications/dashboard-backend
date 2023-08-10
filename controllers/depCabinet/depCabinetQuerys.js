const messagesOdaQuery = (limit, skip) => {
  return `SELECT 
  m.id,
  m.senderName,
  m.senderEmail,
  m.recieverName,
  m.title,
  m.text,
  m.isReaded,        
  m.isAnswered,
  m.isArchived,
  m.answeredAt,
  m.createdAt,
  (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'oda') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    WHERE m.recieverLevel = 'oda'
    LIMIT ${limit} OFFSET ${skip};`;
};

const messagesDistrictQuery = (limit, skip, district) => {
  return `SELECT 
  m.id,
  m.senderName,
  m.senderEmail,
  m.recieverName,
  m.title,
  m.text,
  m.isReaded,        
  m.isAnswered,
  m.isArchived,
  m.answeredAt,
  m.createdAt,
  (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'district' AND recieverDistrict = '${district}') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    AND m.recieverDistrict = u.district
    WHERE m.recieverLevel = 'district' AND m.recieverDistrict = '${district}'
    LIMIT ${limit} OFFSET ${skip};`;
};

const messagesHromadaQuery = (limit, skip, hromada) => {
  return `SELECT 
  m.id,
  m.senderName,
  m.senderEmail,
  m.recieverName,
  m.title,
  m.text,
  m.isReaded,        
  m.isAnswered,
  m.isArchived,
  m.answeredAt,
  m.createdAt,
   (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'hromada' AND recieverHromada = '${hromada}') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    AND m.recieverHromada = u.hromada
    WHERE m.recieverLevel = 'hromada' AND m.recieverHromada = '${hromada}'
    LIMIT ${limit} OFFSET ${skip};`;
};

module.exports = {
  messagesOdaQuery,
  messagesDistrictQuery,
  messagesHromadaQuery,
};
