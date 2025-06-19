// import mongoose from "mongoose";
// import fs from "fs/promises";
// import path from "path";
// import { parseFile } from "music-metadata";
// import { Song } from "../models/song.model.js"; // adjust path if needed
// import { config } from "dotenv";

// config();

// const songsFolder = path.resolve("D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs"); // Folder with mp3 files
// const imageUrl = "/song.png"; // Static image URL

// const seedSongs = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);

//     const files = await fs.readdir(songsFolder);
//     const mp3Files = files.filter((file) => file.toLowerCase().endsWith(".mp3"));

//     const songs = [];

//     for (const file of mp3Files) {
//       const filePath = path.join(songsFolder, file);
//       const baseName = path.basename(file, ".mp3");

//       // Extract artist and title from filename
//       const [artist, title] = baseName.split(" - ").map((s) => s.trim());

//       if (!artist || !title) {
//         console.warn(`Skipping invalid file: ${file}`);
//         continue;
//       }

//       try {
//         const metadata = await parseFile(filePath);
//         const duration = Math.round(metadata.format.duration);

//         songs.push({
//           title,
//           artist,
//           imageUrl,
//           audioUrl: `/songs/${file}`,
//           duration,
//         });
//       } catch (err) {
//         console.error(`Could not read metadata for ${file}:`, err.message);
//       }
//     }

//     // 🔹 Print the songs[] array
//     // console.log("Generated song array:\n", JSON.stringify(songs, null, 2));

//     // 🔹 Now insert into database
//     await Song.deleteMany({});
//     await Song.insertMany(songs);
//     console.log("✅ Songs inserted into the database!");
// 	console.log(songs);
	
//   } catch (error) {
//     console.error("❌ Error:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// seedSongs();

import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { parseFile } from "music-metadata";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songsFolder = path.resolve("D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs");
const fileName = "Justin Bieber and Sean Kingston - Eenie Meenie.mp3";
const imageUrl = "/song.png";

const seedOneSong = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const filePath = path.join(songsFolder, fileName);

    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!exists) {
      console.error("❌ File does not exist:", filePath);
      return;
    }

    const baseName = path.basename(fileName, ".mp3");
    const [artist, title] = baseName.split(" - ").map((s) => s.trim());

    if (!artist || !title) {
      console.error("❌ Invalid filename format. Expected 'Artist - Title.mp3'");
      return;
    }

    const metadata = await parseFile(filePath);
    const duration = Math.round(metadata.format.duration);

    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl: `/songs/${fileName}`,
      duration,
    });

    await song.save();
    console.log("✅ Song inserted:", song);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedOneSong();
