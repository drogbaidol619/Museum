import pg from "pg";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const {
    deviceSelect,
    startDate,
    endDate,
    temperature_alarm,
    humidity_alarm,
    light_alarm,
  } = req.body;
  const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  try {
    await db.connect();
    const tableName = deviceSelect;
    let query = `SELECT * FROM "${tableName}"`;
    const queryParams = [];
    let whereClauses = [];
    if (startDate && endDate) {
      query += ` WHERE date >= $1 AND date <= $2`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      query += ` WHERE date >= $1`;
      queryParams.push(startDate);
    } else if (endDate) {
      query += ` WHERE date <= $1`;
      queryParams.push(endDate);
    }
    if (temperature_alarm) {
      whereClauses.push(`(temperature >= 40 OR temperature <= 10)`);
    }
    if (humidity_alarm) {
      whereClauses.push(`(humidity >= 60 OR humidity <= 45)`);
    }
    if (light_alarm) {
      whereClauses.push(`light >= 100`);
    }
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }
    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trích xuất dữ liệu." });
  } finally {
    await db.end();
  }
};
