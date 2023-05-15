import React, { useEffect, useState } from 'react'
import Home from './components/Home'
import ShadePicker from './components/ShadePicker'
import SelectedShades from './components/SelectedShades'
import { useUpdatePage } from './hooks/useUpdatePage'
import CustomShadePicker from './components/CustomShadePicker'
import VTO from './components/VTO'
import Results from './components/Results'
import frames from "./components/data";
import socket from './socket'

function MainPage() {
    const [isLoading , setLoading] = useState(true)
    const [affectivaStarted , updateAffectivaStatus] = useState(false)
    const { activePage } = useUpdatePage()
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
            colorR: 100,
            colorG: 100,
            colorB: 100,
            intensity: 1,
            placement: 'default'
        }];

        let instanceId = 'LIVE_1';
        async function applyMakeupToCamera() {
            socket.emit("startCppApp")
            await window.MFE_VTO.init(config);
            await window.MFE_VTO.startPhotoMode({ imgUri: frames.f1 });
            await window.MFE_VTO.setPhotoLook({ lookId: instanceId, lookObject: myLookObject });
            setLoading(false)
        }
        applyMakeupToCamera();
        socket.on("framesStarted" , () => {updateAffectivaStatus(true)})
        return () => socket.off("framesStarted" , () => {updateAffectivaStatus(true)})
    }, [])

    if(isLoading || !affectivaStarted){
        return <div className='start-loading'>Please wait loading the App ...</div>
    }

    return (
        <div>
            {
                activePage === "Home" && <Home />
            }
            {
                activePage === "ShadePicker" && <ShadePicker />
            }
            {
                activePage === "SelectedShades" && <SelectedShades />
            }
            {
                activePage === "CustomShadePicker" && <CustomShadePicker />
            }
            {
                activePage === "VTO" && <VTO />
            }
            {
                activePage === "Results" && <Results />
            }
        </div>
    )
}

export default MainPage