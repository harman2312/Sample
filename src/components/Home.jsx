import React from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'

function Home() {
    const { openPage } = useUpdatePage()
    const handleClick = () => {
        openPage("ShadePicker")

    }
    return (
        <div>
            <div style={{ display: "flex" }}>
                <img src={"/Images/loreal-logo.png"} className='Loreal-logo' alt="Logo" />;
            </div>
            <div className='btn-container home-btn-container'>
                <button className='btn home-btn' onClick={handleClick}>Primary Mode</button>
                <button className='btn home-btn viewer-btn' onClick={() => openPage("Results")}>Viewer Mode</button>
            </div>
        </div>
    )
}

export default Home