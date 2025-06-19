import { Song } from "../models/song.model.js";


export const getAllSongs = async(req,res,next) => {
    try{
        // -1 descending newest -> oldest
        // 1 ascending oldest -> newest
        const songs = await Song.find().sort({createdAt:-1})

        res.status(200).json(songs);
    }
    catch(error){
        next(error);
    }
}


export const getFeaturedSongs = async (req,res,next) => {
    try{
        //find 6 random songs using mongodb's aggregate method 
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 } // get 6 random songs
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    artist:1,
                    audioUrl:1,
                    imageUrl:1,

                }
            }
        ])

        res.status(200).json(songs);    
    }
    catch(error){
        next(error);
    }
}

export const getMadeForYou = async (req,res,next) => {
    try{
        //find 6 random songs using mongodb's aggregate method 
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 } // get 4 random songs
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    artist:1,
                    audioUrl:1,
                    imageUrl:1,

                }
            }
        ])

        res.status(200).json(songs);    
    }
    catch(error){
        next(error);
    }
}