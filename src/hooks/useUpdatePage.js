import { useRecoilState } from 'recoil';
import { activePageAtom } from '../recoil/atom';

const useUpdatePage = () => {

    const [activePage, setActivePage] = useRecoilState(activePageAtom)
    const openPage = (name) => {
        setActivePage(name)
    }
    return { activePage, openPage }
}

export { useUpdatePage }