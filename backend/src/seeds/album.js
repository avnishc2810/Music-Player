import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import path from "path";
import { parseFile } from "music-metadata";
import fs from "fs/promises";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const songsFolder = path.resolve("D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs"); // Folder with mp3 files
const imageUrl = "/song.png";

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing data
        await Album.deleteMany({});
        await Song.deleteMany({});

        // First, create all songs
        try {
            // await mongoose.connect(process.env.MONGODB_URI);

            const files = await fs.readdir(songsFolder);
            const mp3Files = files.filter((file) => file.toLowerCase().endsWith(".mp3"));

            const songs = [];

            for (const file of mp3Files) {
                const filePath = path.join(songsFolder, file);
                const baseName = path.basename(file, ".mp3");

                // Extract artist and title from filename
                const [artist, title] = baseName.split(" - ").map((s) => s.trim());

                if (!artist || !title) {
                    console.warn(`Skipping invalid file: ${file}`);
                    continue;
                }

                try {
                    const metadata = await parseFile(filePath);
                    const duration = Math.round(metadata.format.duration);

                    songs.push({
                        title,
                        artist,
                        imageUrl,
                        audioUrl: `/songs/${file}`,
                        duration,
                    });
                } catch (err) {
                    console.error(`Could not read metadata for ${file}:`, err.message);
                }
            }

            // 🔹 Print the songs[] array
            // console.log("Generated song array:\n", JSON.stringify(songs, null, 2));

            // 🔹 Now insert into database
            // await Song.deleteMany({});
            // await Song.insertMany(songs);
            console.log("✅ Songs inserted into the database!");
            console.log(songs);
            var createdSongs = await Song.insertMany(songs)

        } catch (error) {
            console.error("❌ Error:", error);
        } finally {
            // mongoose.connection.close();
        }



    

        // Create albums with references to song IDs
        const albums = [
            {
                title: "Urban Nights",
                artist: "Various Artists",
                imageUrl: "/playlist.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(0, 4).map((song) => song._id),
            },
            {
                title: "Coastal Dreaming",
                artist: "Various Artists",
                imageUrl: "/playlist.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(4, 8).map((song) => song._id),
            },
            {
                title: "Midnight Sessions",
                artist: "Various Artists",
                imageUrl: "/playlist.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(8, 11).map((song) => song._id),
            },
            {
                title: "Eastern Dreams",
                artist: "Various Artists",
                imageUrl: "/playlist.jpg",
                releaseYear: 2024,
                songs: createdSongs.slice(11, 14).map((song) => song._id),
            },
        ];

        // Insert all albums
        const createdAlbums = await Album.insertMany(albums);

        // Update songs with their album references
        for (let i = 0; i < createdAlbums.length; i++) {
            const album = createdAlbums[i];
            const albumSongs = albums[i].songs;

            await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
        }

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();