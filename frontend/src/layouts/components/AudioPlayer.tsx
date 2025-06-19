import { usePlayerStore } from "@/stores/useAudioPlayer";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext } = usePlayerStore()

    // handle the play pause logic 
    // useEffect(() => {
    //     if (isPlaying) return audioRef.current?.play()
    //     else return audioRef.current?.pause()
    // }, [isPlaying])
    useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
        audio.play().catch((err) =>
            console.error("Error while playing audio:", err)
        );
    } else {
        audio.pause();
    }
}, [isPlaying]);


    //handle the song ends 
    useEffect(() => {
        const audio = audioRef.current

        const handleEnded = () => {
            playNext()
        }
        audio?.addEventListener("ended", handleEnded)

        return () => audio?.removeEventListener("ended", handleEnded)
    }, [playNext])

    //handle the song change
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentSong) return

        const isSongChange = prevSongRef.current !== currentSong.audioUrl;

        if (isSongChange) {
            audio.src = currentSong.audioUrl;
            //reset the audio time to 0
            audio.currentTime = 0;
            prevSongRef.current = currentSong.audioUrl;

            if(isPlaying) {
                audio.play()
            }

        }
    }, [isPlaying,currentSong])
    return (
        <audio ref={audioRef} />
    )
}

export default AudioPlayer
