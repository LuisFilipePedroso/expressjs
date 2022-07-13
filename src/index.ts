import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = process.env.PORT || 3333;

const client = new PrismaClient();

app.use(express.json());

app.get("/", async (req, res) => {
  const artists = await client.artist.findMany();

  return res.json(artists);
});

app.post("/artist", async (req, res) => {
  const { name } = req.body;

  try {
    const artist = await client.artist.create({
      data: {
        name,
      },
    });

    return res.json(artist);
  } catch (e) {
    return res.json({ error: e });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
