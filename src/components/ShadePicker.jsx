import React from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'
import shadeDetail from "../shadeDetail"
import { useRecoilState } from 'recoil'
import { shadeFamilyAtom } from '../recoil/shadeFamilyAtom'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ShadePicker() {
    const { openPage } = useUpdatePage()
    const [selectedShade, setSelectedShade] = useRecoilState(shadeFamilyAtom)
    const handleClick = () => {
        openPage("SelectedShades")
    }

    const handleItemSelect = (item) => {
        if (selectedShade.shade1?.id === undefined) {
            setSelectedShade({ shade1: { id: item.id, name: item.name } })
        }
        else if (selectedShade.shade1?.id && selectedShade.shade2?.id === undefined) {
            setSelectedShade({
                shade1: selectedShade.shade1,
                shade2: {
                    id: item.id, name: item.name
                }
            })
        }
        else if (selectedShade.shade1?.id && selectedShade.shade2?.id) {
            setSelectedShade({
                shade1: selectedShade.shade2,
                shade2: {
                    id: item.id, name: item.name
                }
            })
        }
    };
    const isItemSelected = (item) => {
        return selectedShade.shade1?.id == item.id || selectedShade.shade2?.id == item.id
    };
    // const [progress, setProgress] = useState(0);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setProgress(prevProgress => prevProgress + 10);
    //     }, 1000);

    //     setTimeout(() => {
    //         clearInterval(intervalId);
    //         setProgress(100);
    //     }, 10000);

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh" }}>
            {/* <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'red', borderRadius: '50%' }} />
                <CircularProgressbar
                    value={progress}
                    text={`${progress}%`}
                    styles={{
                        root: { position: 'absolute', top: 0, left: 0 },
                    }}
                />
            </div> */}
            <div style={{ display: "flex" }}>
                <img src={"/Images/loreal-logo.png"} className='Loreal-logo' alt="Logo" />;
            </div>
            <div>
                <div className='text text-align-center'>SUGGESTED SHADES TO TRY ON, 5 FROM EACH FAMILY</div>
                <div className='ShadePicker-container' style={{marginTop:"2vh"}}>
                    <div className='center-align selected-shade-flex'>
                        {shadeDetail.map((detail, i) =>
                            <div className='btn-container'>
                                <div key={detail.id} style={{ backgroundColor: detail.color, border: isItemSelected(detail) ? "3px solid white" : "3px solid transparent", margin: "10px" }} className='circle-lipshade-red red-top-selected text-number center-align text-align-center' onClick={() => handleItemSelect(detail)} >
                                    {isItemSelected(detail) ? <img src={"/Images/selected.svg"} /> : ""}
                                </div>
                                <div style={{ color: "white", textAlign: "center" }}>{detail.name}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='btn-container'>
                <button className='btn next-btn' disabled={!(selectedShade.shade1 && selectedShade.shade2)} onClick={handleClick}>NEXT</button>
            </div>
        </div>
    )
}

export default ShadePicker