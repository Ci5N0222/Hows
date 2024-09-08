import styles from './Main.module.css'
import { Route, Routes } from 'react-router-dom'
import { Community } from './Community/Community'
import { Detail } from './Detail/Detail'
export const Main = () => {
    return (
        <div className={styles.communityWrap}>
            <Routes>
                <Route path="/" element={<Community />}></Route>
                <Route path="/:board_seq" element={<Detail />}></Route>
            </Routes>
        </div>
    )
}
