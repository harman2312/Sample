import { atom } from "recoil"

const capturedImageAtom = atom({
    key: "capturedImage",
    default: []
})

export { capturedImageAtom }