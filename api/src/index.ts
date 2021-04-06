import express from "express";
import morgan from "morgan";
import cors from "cors";
import { pgp, queryCache } from "./database";

// Creating the database instance with extensions:
const db = pgp(process.env.DATABASE_URL);
const app = express();
app.use(morgan());
app.use(cors());

// Generic GET handler;
function get(url: string, handler: (req: any) => any) {
  app.get(url, async (req, res) => {
    try {
      const data = await handler(req);
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message || error,
      });
    }
  });
}

get(
  "/unit-details",
  async (req: any): Promise<any> => {
    const { x, y } = req.query;
    console.log(x, y);
    return await db.query(queryCache["unit-details"], { x, y });
  }
);

const port = process.env.API_PORT || 5000;

app.listen(port, () => {
  console.log(`API is ready for GET requests on port ${port}`);
});
