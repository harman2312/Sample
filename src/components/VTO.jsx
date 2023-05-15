import React, { useEffect, useRef, useState } from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'
import frames from "./data";
import { useRecoilState, useRecoilValue } from 'recoil';
import { capturedImageAtom } from '../recoil/CapturedImage';
import { selectedShadeAtom } from '../recoil/selectedShadesAtom';
import hexToRgba from 'hex-to-rgba';
import socket from '../socket';
import { shadeFamilyAtom } from '../recoil/shadeFamilyAtom'
import axios from 'axios'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function VTO() {
    const { openPage } = useUpdatePage()
    const [pic, setPic] = useRecoilState(capturedImageAtom)
    const [frame, updateFrame] = useState("")
    const finalShade = useRecoilValue(selectedShadeAtom)
    const [selectedFamilyShade, setSelectedFamilyShade] = useRecoilState(shadeFamilyAtom)
    const [framesLoaded, setFramesLoaded] = useState(false);
    const [colorA, setColorA] = useState()
    const [colorR, setColorR] = useState()
    const [colorG, setColorG] = useState()
    const [colorB, setColorB] = useState()

    console.log({ colorA, colorB, colorG, colorR })

    const getImgUri = () => {
        return { imgUri: frame };
    };

    const getResults = async () => {
        const data = await axios.post("/api/csv", intervals)
        return data
    }

    const [selectedShade, setSelectedShade] = useState(1)

    function rgbaToColorObject(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
        if (!match) {
            throw new Error('Invalid RGBA color string: ' + rgba);
        }

        setColorR(parseInt(match[1], 10));
        setColorG(parseInt(match[2], 10));
        setColorB(parseInt(match[3], 10));
        setColorA(match[4] ? parseFloat(match[4]) : 1);

        return {
            colorR,
            colorG,
            colorB,
            colorA
        };
    }

    const next = async () => {
        if (finalShade[finalShade.length - 1].id == selectedShade) {
            socket.emit("stopCppApp")
            await getResults()
            openPage("Results")
            return
        }
        else {
            setSelectedShade((i) => i + 1)
        }
    }
    const [intervals, setIntervals] = useState([]);
    const [currShadeColor, setcurrShadeColor] = useState(null);
    const [currProductId, setCurrProductId] = useState(null);
    useEffect(() => {
        if (framesLoaded) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const start = new Date(now - 10000).getTime();
                const end = now;
                setIntervals((intervals) => [...intervals, { start, end, currShadeColor, currProductId }]);
                next();
            }, 10000);
            const currShade = finalShade.find((e) => e.id === selectedShade)
            setcurrShadeColor(currShade.color);
            setCurrProductId(currShade.productId)
            const shadeColor = hexToRgba(currShade.color)
            rgbaToColorObject(shadeColor)
            return () => clearInterval(interval);
        }
    }, [selectedShade, framesLoaded]);

    useEffect(() => {
        const gotFrameData = (data) => {
            updateFrame(data)
            setFramesLoaded(true)
        }
        socket.emit("startCppApp")
        socket.emit("startStream")
        socket.on('frame-data', gotFrameData);
        return () => {
            socket.off('frame-data', gotFrameData);
        }
    }, [])

    useEffect(() => {
        if (framesLoaded) {
            const timeout = setTimeout(() => {
                const container = document.getElementById("container");
                const canvas = container.querySelector("canvas");
                let image = canvas?.toDataURL('image/jpeg');
                setPic([...pic, image])
            }, 5000)
            return () => clearTimeout(timeout)
        }
    }, [framesLoaded])
    useEffect(() => {
        if (framesLoaded) {
            const interval = setInterval(() => {
                const container = document.getElementById("container");
                const canvas = container.querySelector("canvas");
                let image = canvas?.toDataURL('image/jpeg');
                setPic([...pic, image])
            }, 10000)
            return () => clearInterval(interval)
        }
    }, [pic, framesLoaded])


    useEffect(() => {
        async function test() {
            let myLookObject = [{
                category: 'lipcolor',
                colorA: 200,
                colorR: colorR,
                colorG: colorG,
                colorB: colorB,
                intensity: colorA === undefined && colorB === undefined && colorR === undefined && colorG === undefined ? 0 : 1,
                placement: 'default'
            }];
            let instanceId = 'LIVE_1';

            try {
                await window.MFE_VTO.startPhotoMode(getImgUri());
                const canvas = await window.MFE_VTO.setPhotoLook({ lookId: instanceId, lookObject: myLookObject });
                document.getElementById("loadingText").style.display = 'none';
                document.getElementById("container").appendChild(canvas.renderedCanvas);
                canvas.renderedCanvas.style.height = "100%";
            } catch (error) {
                console.log("errr", error)
            }
        }
        test()
    }, [frame])

    useEffect(() => {
        const currentMode = 'PHOTO_MODE';
        const domain = window.location.hostname;
        const portNumber = window.location.port;
        const { pathname, protocol } = window.location;
        let config = {
            config: {
                libraryInfo: {
                    domain: domain + (portNumber ? `:${portNumber}` : ''),
                    path: protocol === "file:" ? pathname + "../.." : "/",
                    version: '',
                    maskPrefix: '/mask_images/',
                    assetPrefix: '/dist/assets/',
                    width: 480,
                    height: 640,
                },
                moduleMode: 'Makeup',
                debugMode: true
            },
        };

        let myLookObject = [{
            category: 'lipcolor',
            colorA: 200,
            colorR: colorR,
            colorG: colorG,
            colorB: colorB,
            intensity: colorA === undefined && colorB === undefined && colorR === undefined && colorG === undefined ? 0 : 1,
            placement: 'default'
        }];

        let instanceId = 'LIVE_1';
        async function applyMakeupToCamera() {
            await window.MFE_VTO.init(config);
            await window.MFE_VTO.startPhotoMode(getImgUri());
            const canvas = await window.MFE_VTO.setPhotoLook({ lookId: instanceId, lookObject: myLookObject });

            document.getElementById("loadingText").style.display = 'none';
            document.getElementById("container").appendChild(canvas.renderedCanvas);
            canvas.renderedCanvas.style.height = "100%";
        }
        applyMakeupToCamera();
        return () => socket.emit("stopCppApp")
    }, [])
    const handleClick = () => {
        openPage("ShadePicker")
        setSelectedFamilyShade({ shade1: {}, shade2: {} })
    }
    // const [progress, setProgress] = useState({});
    // const intervalRef = useRef(null);

    // useEffect(() => {
    //     if (selectedShade) {
    //         const intervalId = setInterval(() => {
    //             setProgress((prevProgress) => ({
    //                 ...prevProgress,
    //                 [selectedShade]: prevProgress[selectedShade] + 10,
    //             }));
    //         }, 1000);

    //         setTimeout(() => {
    //             clearInterval(intervalId);
    //             setProgress((prevProgress) => ({
    //                 ...prevProgress,
    //                 [selectedShade]: 0,
    //             }));
    //         }, 10000);

    //         intervalRef.current = intervalId;
    //     }

    //     return () => {
    //         clearInterval(intervalRef.current);
    //     };
    // }, [selectedShade]);

    return (
        <div>
            <div style={{ color: "white", display: frame == frames.f1 || frame.length == 0 ? "flex" : "none", textAlign: "center", marginLeft: "48vw", marginTop: "45vh" }}>Loading...</div>
            <div style={{ display: frame == frames.f1 || frame.length == 0 ? "none" : "block" }}>
                <div className='VTO-flex' >
                    {finalShade.map((shadeDetail) =>
                        <div key={shadeDetail.id} style={{ backgroundColor: shadeDetail.color, border: selectedShade >= shadeDetail.id ? "3px solid white" : "3px solid transparent" }} className='circle-lipshade-red red-top-custom text-number'>
                            <div className="text-align-center">
                                {selectedShade == shadeDetail.id && <img src={"/Images/selected.svg"} />}
                            </div>
                        </div>
                    )}
                </div>

                {/* <div className="VTO-flex">
                    {finalShade.map((shadeDetail) => (
                        <div
                            key={shadeDetail.id}
                            style={{ position: 'relative', width: '77px', height: '77px' }}
                            className={selectedShade === shadeDetail.id ? 'current-shade' : 'previous-shade'}
                        >
                            <div
                                style={{
                                    backgroundColor: shadeDetail.color,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                                className="circle-lipshade-red red-top-custom text-number"
                                onClick={() => setSelectedShade(shadeDetail.id)}
                            >
                                {selectedShade === shadeDetail.id && (
                                    <CircularProgressbar
                                        value={progress[selectedShade]}
                                        text={`${progress[selectedShade]}%`}
                                        strokeWidth={3}
                                        styles={{
                                            path: {
                                                stroke: 'white',
                                            },
                                            trail: {
                                                stroke: 'none',
                                            },
                                            root: { position: 'absolute', top: 0, left: 0 },
                                        }}
                                        textStyle={{
                                            fill: 'white',
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div> */}
                <div>
                    {/* <div className='text-number VTO-top'>LIVE CAMERA FEED WITH MODIFACE VTO EACH SHADE STAYS ON FOR 10 SECONDS</div> */}
                    <span id="loadingText">Please wait a few seconds for the live stream to appear</span>
                    <div style={{ display: "flex", gap: "100px", marginTop: "50px", borderRadius: "4px" }} className='center-align'>
                        <div id="container" style={{ height: "450px" }}></div>
                    </div>
                </div>

                <button className='btn hidden-Restart-btn' onClick={handleClick}>HIDDEN - RESTART</button>
            </div>
        </div >
    )
}

export default VTO