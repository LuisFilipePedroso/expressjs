import { PrismaClient } from "@prisma/client";
import express from "express";
import redis from "./lib/cache";

const app = express();
const port = process.env.PORT || 3333;

const client = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => res.send("Hello Dev!"));

app.get("/artists", async (req, res) => {
  try {
    const cacheKey = "artists:all";

    const cachedArtists = await redis.get(cacheKey);

    if (cachedArtists) {
      return res.json(JSON.parse(cachedArtists));
    }

    const artists = await client.artist.findMany();
    await redis.set(cacheKey, JSON.stringify(artists));

    return res.json(artists);
  } catch (e) {
    return res.json({ error: e });
  }
});

app.post("/artist", async (req, res) => {
  const { name } = req.body;

  const cacheKey = "artists:all";

  try {
    const artist = await client.artist.create({
      data: {
        name,
      },
    });

    redis.del(cacheKey);

    return res.json(artist);
  } catch (e) {
    return res.json({ error: e });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
