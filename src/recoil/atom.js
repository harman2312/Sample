import { atom } from "recoil"

const activePageAtom = atom({
    key: "activePage",
    default: "ShadePicker"
})

export { activePageAtom }