import { atom } from "recoil"

const shadeFamilyAtom = atom({
    key: "shadeFamily",
    default: {
        shade1: {},
        shade2: {}
    }
})

export { shadeFamilyAtom }