import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get("/", async (req, res) => {
  const client = new PrismaClient();
  const artists = await client.artist.findMany();

  return res.json(artists);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
