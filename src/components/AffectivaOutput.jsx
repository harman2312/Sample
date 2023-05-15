import React, { useEffect, useState } from 'react'
import socketConnection from '../socket'

export default function AffectivaOutput() {
    const [image, updateImage] = useState(null)
    const [waiting , setWaiting] = useState(true)

    useEffect(() => {
        const gotFrameData = (data) => {
            updateImage(data)
        }
        const clearImage = () => {
            updateImage(null)
            setWaiting(true)
        }
        socketConnection.on('affec-frame-data', gotFrameData);
        socketConnection.on('stoppedStream', clearImage);
        socketConnection.on('startStream', () => setWaiting(false));
        return () => {
            socketConnection.off('affec-frame-data', gotFrameData);
            socketConnection.off('stoppedStream', clearImage);
            socketConnection.off('startStream', () => setWaiting(false));
        }
    }, [])

    if (!image || waiting) {
        return <div style={{display:"flex",justifyContent : "center", alignContent : "center"}}><h1 style={{ color: "white" }}>Waiting for the live feed</h1></div>
    }
    return (
        <div style={{display:"flex",justifyContent : "center", alignContent : "center"}}>
            <img src={image} alt="Please reload" />
        </div>
    )
}
