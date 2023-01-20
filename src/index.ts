// import app from "./app";

// app.get("/", (req,res) => {
//   res.send('HI');
// });

// const port = 9001;




// app.listen(PORT , () => console.log(`Server init at http://localhost:${PORT}`));

import { type Application } from "express";
import bcrypt from "bcrypt"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';


// Importando Prisma Client
import { PrismaClient } from '@prisma/client'

dotenv.config();

// Iniciando el cliente
const prisma = new PrismaClient()
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/api/v1/users', async (req: Request, res: Response) => {
  const { name, email, password, last_session, update_at, date_born } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
      data: {
          name,
          email,
          password: hashedPassword,
          last_session,
          update_at,
          date_born
      }
  })
  res.json(user)
})

app.post('/api/v1/songs', async (req: Request, res: Response) => {
  const { name, artist, album, year, genre, duration, privacy } = req.body
  const song = await prisma.song.create({
      data: {
          name,
          artist,
          album,
          year,
          genre,
          duration,
          privacy,

      }
  })
  res.json(song)
})


app.post("/api/v1/playlists", async (req, res) => {
  try {
    const newPlaylist = await prisma.playlist.create({
      data: {
        name: req.body.name,
        user_id: req.body.user_id,
        songs: {
          connect: req.body.songs.map((song: any) => ({ id: song.id }))
        }
      }
    });
    res.json(newPlaylist);
  } catch (error) {
    res.status(500).json({
        success: false,
        message: 'Error al obtener las playlist',
        
    });
  }
});

app.post("/api/v1/playlists/addsong", async (req, res) => {
  const { id_song, id_playlist } = req.body;
  try {
      const songs = await prisma.song.findMany({ where: { id: id_song } });
      const song = songs[0];
      const playlists = await prisma.playlist.findMany({ where: { id: id_playlist } });
      const playlist = playlists[0];
      if (!song) {
          return res.status(404).json({ error: 'song not found' });
      }
      if (!playlist) {
          return res.status(404).json({ error: 'playlist not found' });
      }
      await prisma.playlist.update({
          where: { id: id_playlist },
          data: {
              songs: {
                  connect: { id: id_song }
              }
          }
      });
      res.json({ message: "song added successfully to the playlist" });
  } catch (error) {
    res.status(500).json({
        success: false,
        message: 'Error al añadir la cancion',
        
    });
  }
});

app.get('/api/v1/getusers', async (req: Request, res: Response) => {
  try {
      const users = await prisma.user.findMany();
      res.status(200).json({
          success: true,
          message: 'Usuarios obtenidos exitosamente',
          data: users
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error al obtener los usuarios',
          
      });
  }
});


app.get("/api/v1/getsongs", async (req, res) => {
  try {

  const songs = await prisma.song.findMany();
  res.status(200).json({
      success: true,
      message: 'Canciones obtenidos exitosamente',
      data: songs
  });
} catch (error) {
  res.status(500).json({
      success: false,
      message: 'Error al obtener las canciones',
      
  });
}
});


app.get("/api/v1/getplaylists", async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: { songs: true }
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({
        success: false,
        message: 'Error al obtener las playlists',
        
    });
  }
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
});