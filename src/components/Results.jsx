import React from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'
import { useRecoilState, useRecoilValue } from 'recoil'
import { capturedImageAtom } from '../recoil/CapturedImage'
import { shadeFamilyAtom } from '../recoil/shadeFamilyAtom'
import { selectedShadeAtom } from '../recoil/selectedShadesAtom'

function Results() {
    const { openPage } = useUpdatePage()
    const capturedImg = useRecoilValue(capturedImageAtom)
    const [pic, setPic] = useRecoilState(capturedImageAtom)
    const finalShade = useRecoilValue(selectedShadeAtom)
    const [selectedShade, setSelectedShade] = useRecoilState(shadeFamilyAtom)
    console.log(capturedImg)
    // const [FinalShadeImage, setFinalShadeImage] = useState()
    const handleClick = () => {
        openPage("ShadePicker")
        setSelectedShade({ shade1: {}, shade2: {} })
        setPic([])
    }
    // useEffect(() => {
    const FinalShadeImage = finalShade.map((item, index) => {
        return { ...item, img: capturedImg[index] };
    });
    console.log(FinalShadeImage)
    // }, [])

    return (
        <div>
            <div style={{ display: "flex" }}>
                <img src={"/Images/loreal-logo.png"} className='Loreal-logo' alt="Logo" />
            </div>
            <div className='center-align gap'>
                <div>
                    <div className='text text-align-center emotion-font'># of FROWNS</div>
                    <div className='text marginTop emotion-circle'>10</div>
                </div>
                <div>
                    <div className='text text-align-center emotion-font'># of SMILES</div>
                    <div className='text marginTop emotion-circle'>20</div>
                </div>
                <div>
                    <div className='text text-align-center emotion-font'># of EMOTION NAME</div>
                    <div className='text marginTop emotion-circle'>5</div>
                </div>
            </div>
            <div className='center-align shade-gap'>
                <div>
                    <div className='text-align-center'>
                        <div className='text'>BEST PICKS </div>
                    </div>
                    <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginTop: "5vh", marginBottom: "5vh" }} className='center-align'>
                        {FinalShadeImage.slice(1, 4).map((shade, i) => (
                            <div>
                                <div className='center-align'>
                                    <div className='result-shade-circle' style={{ backgroundColor: shade.color, marginLeft: "2vw" }}></div>
                                </div>
                                <img key={i} src={shade.img} alt="Captured Images" style={{ height: "180px", width: "120px", borderRadius: "4px", objectFit: "cover", marginTop: "10px" }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className='text-align-center'>
                        <div className='text'>WORST PICKS </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5vh", marginBottom: "5vh" }} className='center-align'>
                        {FinalShadeImage.slice(5, 8).map((shade, i) => (
                            <div>
                                <div className='center-align'>
                                    <div className='result-shade-circle' style={{ backgroundColor: shade.color, marginLeft: "2vw" }}></div>
                                </div>
                                <img key={i} src={shade.img} alt="Captured Images" style={{ height: "180px", width: "120px", borderRadius: "4px", objectFit: "cover", marginTop: "10px" }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "5vh", marginBottom: "10vh" }} className='center-align'>
                {capturedImg.slice(0, 6).map((image, i) => (
                    <img key={i} src={image} alt="Captured Images" style={{ height: "280px", width: "220px", borderRadius: "4px" }} />
                ))}
            </div> */}



            {/* <div className='center-align shade-gap'>
                <div className='text-align-center'>
                    <div className='text'>BEST PICKS </div>
                    <div className='center-align pick-container'>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#db2518" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#f5aa20" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#fa7019" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                    </div>
                </div>
                <div className='text-align-center'>
                    <div className='text'>WORST PICKS </div>
                    <div className='center-align'>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#db2518" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#db2518" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                        <div className=''>
                            <div className='circle-lipshade' style={{ backgroundColor: "#db2518" }}></div>
                            <div className='rectangle-frame'></div>
                        </div>
                    </div>
                </div>
            </div> */}
            <button className='btn back-btn' onClick={handleClick}>RESTART</button>
        </div >
    )
}

export default Results