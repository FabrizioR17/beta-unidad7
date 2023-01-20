// import express from "express";
// import { type Application } from "express";
// import type { Request,Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt"
// import dotenv from 'dotenv';

// const prisma = new PrismaClient();

// const app: Application = express();

// app.post('/api/v1/users', async (req: Request, res: Response) => {
//   const { name, email, password, last_session, update_at, date_born } = req.body
//   const hashedPassword = await bcrypt.hash(password, 10)
//   const user = await prisma.user.create({
//       data: {
//           name,
//           email,
//           password: hashedPassword,
//           last_session,
//           update_at,
//           date_born
//       }
//   })
//   res.json(user)
// })

// app.post('/api/v1/songs', async (req: Request, res: Response) => {
//   const { name, artist, album, year, genre, duration, isPublic } = req.body
//   const song = await prisma.song.create({
//       data: {
//           name,
//           artist,
//           album,
//           year,
//           genre,
//           duration,
//       }
//   })
//   res.json(song)
// })

// export default app;