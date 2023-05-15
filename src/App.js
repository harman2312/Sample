import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
  RecoilRoot,
} from 'recoil';
import MainPage from './MainPage';
import AffectivaOutput from './components/AffectivaOutput';

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route exact path="/" element={<MainPage/>} />
        <Route exact path="/ViewerMode" element={<AffectivaOutput/>} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
