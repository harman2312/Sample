import React from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'
import { shadeFamilyAtom } from '../recoil/shadeFamilyAtom'
import shadeDetail from "../shadeDetail"
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedShadeAtom } from '../recoil/selectedShadesAtom'

function SelectedShades() {
    const { openPage } = useUpdatePage()
    const [selectedShade, setSelectedShade] = useRecoilState(selectedShadeAtom)
    const handleClick = () => {
        openPage("CustomShadePicker")
    }
    const shadeFamily = useRecoilValue(shadeFamilyAtom)
    const handleVTO = () => {
        let count = 1;
        const newArr = []
        const shade1Family = shadeDetail.find((detail) => detail.id === shadeFamily.shade1.id).shades
        const shade2Family = shadeDetail.find((detail) => detail.id === shadeFamily.shade2.id).shades
        shade1Family.slice(0, 5).map((shade) => {
            const shades = {
                id: count,
                productId: shade.id,
                color: shade.Hexcolor,
            };
            count++
            newArr.push(shades)
        })

        shade2Family.slice(0, 5).map((shade) => {
            const shades = {
                id: count,
                productId: shade.id,
                color: shade.Hexcolor,
            };
            count++
            newArr.push(shades)
        })
        setSelectedShade(newArr)
        openPage("VTO")
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh" }}>
            <div style={{ display: "flex" }}>
                <img src={"/Images/loreal-logo.png"} className='Loreal-logo' alt="Logo" />
            </div>
            <button className='btn hidden-btn' onClick={handleClick}>HIDDEN BUTTON <br /> TO LAUNCH <br /> SHADE PICKER</button>
            <div>
                <div className='text text-align-center'>SUGGESTED SHADES TO TRY ON, 5 FROM EACH FAMILY</div>
                <div className='center-align' style={{ marginTop: "3vh" }}>
                    {shadeDetail.map((detail) => {
                        if (shadeFamily.shade1.id === detail.id) {
                            return detail.shades.slice(0, 5).map((shade) => (
                                <div>
                                    <div key={shade.id} className='circle-lipshade-red selected-shade1' style={{ backgroundColor: shade.Hexcolor, margin: "10px" }} />
                                    <div style={{ color: "white", textAlign: "center" }}>{detail.name} {shade.shadeName}</div>
                                </div>
                            ));
                        }
                    })}
                </div>
                <div className='center-align  selected-shade2'>
                    {shadeDetail.map((detail) => {
                        if (shadeFamily.shade2.id === detail.id) {
                            return detail.shades.slice(0, 5).map((shade) => (
                                <div>
                                    <div key={shade.id} className='circle-lipshade-red selected-shade2' style={{ backgroundColor: shade.Hexcolor, margin: "10px" }} />
                                    <div style={{ color: "white", textAlign: "center" }}>{detail.name} {shade.shadeName}</div>
                                </div>
                            ));
                        }
                    })}
                </div>
            </div>

            <div className='btn-container '>
                <button className='btn ' onClick={handleVTO}>READY FOR TRY ON</button>
            </div>
        </div>
    )
}

export default SelectedShades