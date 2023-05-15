import { atom } from "recoil"

const selectedShadeAtom = atom({
    key: "selectedShade",
    default: []
})

export { selectedShadeAtom }