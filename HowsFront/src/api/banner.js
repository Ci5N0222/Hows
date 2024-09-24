import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/banner`

// 배너 목록 요청 함수
export const bannerList = () => {
    return axios.get(`${baseUrl}`)
}

// 배너 목록 요청 함수 (관리자)
export const bannerListByAdmin = () => {
    return axios.get(`${baseUrl}/getAllBanners`)
}

// 배너 추가 요청 함수
export const addBanner = formData => {
    return axios.post(`${baseUrl}`, formData)
}

// 배너 삭제 요청 함수
export const deleteBanners = bannerSeqs => {
    const seqs = bannerSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.delete(`${baseUrl}`, { params: { seqs } })
}

// 배너 정보 업데이트 함수
export const updateBanner = (banner_seq, event_seq) => {
    return axios.put(`${baseUrl}`, null, {
        params: { banner_seq, event_seq },
    })
}
