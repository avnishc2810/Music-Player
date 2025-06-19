import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs/promises";
import path from "path";
import { parseFile } from "music-metadata";
import { config } from "dotenv";


const songsFolder = path.resolve("D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs"); // Folder with mp3 files


const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader(file.tempFilePath, {
            resource_type: "auto",

        }
        )
        return result.secure_url;
    }
    catch (error) {
        console.log("Error in uploading to cloudinary", error);
        throw new Error("Error in uploading to cloudinary");
    }
}

export const createSong = async (req, res, next) => {
    try {
        const { title, artist } = req.params;

        const fileName = `${artist.trim()} - ${title.trim()}`.replace(/\//g, "_") + ".mp3";
        const filePath = path.join(songsFolder, fileName);

        
        

        console.log("Looking for file at:", filePath);
        const metadata = await parseFile(filePath);
        const duration = Math.round(metadata.format.duration);

        const song = new Song({
            title,
            artist,
            imageUrl: "/song.png",
            audioUrl: `/songs/${fileName}`,
            duration,
            albumId: null
        });

        await song.save();
        console.log("Saved!")
        res.status(201).json(song);
    } catch (error) {
        console.log("❌ Error in createSong:", error);
        res.status(500).json({ message: error.message });
    }
};



export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            })
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    }
    catch (error) {
        console.log("Error in deleting the song", error);
        next(error);
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const imageFile = req.files.imageFile;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl
        })

        await album.save();

        res.status(200).json({ message: "Album has been created successfully!" });
    }
    catch (error) {
        console.log("Error in creating album", error);
        next(error);
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Song.deleteMany({ albumId: id });

        await Album.findByIdAndDelete(id);

        res.status(200).json({ message: "Album deleted successfully!" });
    }
    catch (error) {
        console.log("Album could not be deleted!", error)
        next(error);
    }
}

export const checkAdmin = (req, res, next) => {
    res.status(200).json({ admin: true })
} 