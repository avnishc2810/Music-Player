export interface Song {
    _id:string,
    title:string,
    artist:string,
    imageUrl:string,
    audioUrl:string,
    duration:number,
    albumId:string|null;
    createdAt:string,
    updatedAt:string,
}

export interface Album {
    _id:string,
    title:string,
    artist:string,
    imageUrl:string,
    releaseYear:number,
    songs:Song[],
}

export interface User{
    _id:string,
    fullName:string,
    imageUrl:string,
}

export interface Stats{
    totalSongs:number,
    totalArtists:number,
    totalAlbums:number,
    totalUsers:number,
}

export interface Message{
    _id:string
    senderId:string,
    receiverId:string,
    content:string,
    createdAt:string,
    updatedAt:string,
}

export interface User{
    _id:string,
    fullName:string,
    clerkId:string,
    imageUrl:string,
}