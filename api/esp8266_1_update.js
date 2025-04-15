import pg from "pg";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    const { temperature, humidity, light, ssid, time, date, name } = req.body;
    const db = new pg.Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });
    await db.connect();
    await db.query(
      'INSERT INTO "ESP8266_1" (temperature, humidity, light, ssid, time, date, name) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [temperature, humidity, light, ssid, time, date, name]
    );
    res.json({ message: "Data saved to database" });
  } catch (error) {
    console.error("Error saving data to database:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await db.end();
  }
};
