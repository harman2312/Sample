import React, { useEffect, useState } from 'react'
import { useUpdatePage } from '../hooks/useUpdatePage'
import shadeDetail from "../shadeDetail"
import { shadeFamilyAtom } from '../recoil/shadeFamilyAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedShadeAtom } from '../recoil/selectedShadesAtom'

function CustomShadePicker() {
    const { openPage } = useUpdatePage()
    const [selectedShade, setSelectedShade] = useRecoilState(selectedShadeAtom)
    const [selectedShade1, setSelectedShade1] = useState([])
    const [selectedShade2, setSelectedShade2] = useState([])
    const shadeFamily = useRecoilValue(shadeFamilyAtom)

    const handleFamilyShade1Select = (item) => {
        if (selectedShade1.some((e) => e.productId === item.id)) {
            setSelectedShade1(selectedShade1.filter((e) => e.productId !== item.id));
        } else if (selectedShade1.length < 5) {
            setSelectedShade1([...selectedShade1, { productId: item.id, color: item.Hexcolor }]);
        }
    };

    const handleFamilyShade2Select = (item) => {
        if (selectedShade2.some((e) => e.productId == item.id)) {
            setSelectedShade2(selectedShade2.filter((e) => e.productId !== item.id));
        } else if (selectedShade2.length < 5) {
            setSelectedShade2([...selectedShade2, { productId: item.id, color: item.Hexcolor }]);
        }
    };

    useEffect(() => {
        let count = 1;
        const newArr = []
        for (let i = 0; i < selectedShade1.length; i++) {
            const shade = {
                id: count,
                productId: selectedShade1[i].id,
                color: selectedShade1[i].color,
            };
            count++
            newArr.push(shade)
        }
        for (let i = 0; i < selectedShade2.length; i++) {
            const shade = {
                id: count,
                productId: selectedShade2[i].id,
                color: selectedShade2[i].color,
            };
            count++
            newArr.push(shade)
        }
        setSelectedShade(newArr)
    }, [selectedShade1, selectedShade2])


    const isItem1Selected = (item) => {
        return selectedShade1.some((e) => e.productId == item.id)
    };
    const isItem2Selected = (item) => {
        return selectedShade2.some((e) => e.productId == item.id)
    };
    return (
        <div>
            <div style={{ display: "flex" }}>
                <img src={"/Images/loreal-logo.png"} className='Loreal-logo' alt="Logo" />
            </div>
            <button className='btn back-btn' onClick={() => openPage("SelectedShades")}>BACK</button>
            <div className='text text-align-center shades-text'>SHADE PICKER TO PICK SPECIFIC COLORS FROM 2 FAMILIES</div>
            <div className='shadepicker-flex'>
                <div className='grid-container'>
                    {shadeDetail.map((detail, i) => {
                        if (shadeFamily.shade1.id === detail.id) {
                            return detail.shades.map((shade) => (
                                <div>
                                    <div key={shade.id} style={{ backgroundColor: shade.Hexcolor, border: isItem1Selected(shade) ? "3px solid white" : "3px solid transparent", margin: "10px" }} className='custom-shade red-top-custom text-number' onClick={() => handleFamilyShade1Select(shade)} >
                                        <div className="text-align-center">
                                            {isItem1Selected(shade) ? selectedShade1.findIndex((e) => e.productId == shade.id) + 1 : ""}
                                        </div>
                                    </div>
                                    <div style={{ color: "white", textAlign: "center" }}>{detail.name} {shade.shadeName}</div>
                                </div>
                            ))
                        }
                    })}
                </div>
                <div className='grid-container'>
                    {shadeDetail.map((detail, i) => {
                        if (shadeFamily.shade2.id === detail.id) {
                            return detail.shades.map((shade) => (
                                <div>
                                    <div key={shade.id} style={{ backgroundColor: shade.Hexcolor, border: isItem2Selected(shade) ? "3px solid white" : "3px solid transparent", margin: "10px" }} className='custom-shade red-top-custom text-number' onClick={() => handleFamilyShade2Select(shade)} >
                                        <div className="text-align-center">
                                            {isItem2Selected(shade) ? selectedShade2.findIndex((e) => e.productId == shade.id) + 1 : ""}
                                        </div>
                                    </div>
                                    <div style={{ color: "white", textAlign: "center" }}>{detail.name} {shade.shadeName}</div>
                                </div>
                            ))
                        }
                    })}
                </div>
            </div>
            <div className='btn-container'>
                <button className='btn custom-btn' onClick={() => openPage("VTO")}>READY FOR TRY ON</button>
            </div>
        </div >
    )
}

export default CustomShadePicker