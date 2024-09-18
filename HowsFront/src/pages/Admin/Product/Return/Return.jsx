import styles from './Return.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import {
    returnList,
    updateOrder,
    doneReturn,
    deleteOrder,
} from '../../../../api/order'
import { useEffect, useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import { formatDate, addCommas, SwalComp } from '../../../../commons/commons'

export const Return = () => {
    // 주문 목록, 필터링된 주문 목록, 선택된 주문 상태 등 상태 관리
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [viewOrder, setViewOrder] = useState({
        order_date: '',
        order_name: '',
        order_price: 0,
        payment_price: 0,
        grade_title: '',
        order_title: '',
        name: '',
    })
    const [selectAll, setSelectAll] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [status, setStatus] = useState('return')

    useEffect(() => {
        returnList(status)
            .then(resp => {
                console.log(resp.data)
                const beforOrders = resp.data.map(order => ({
                    ...order,
                    checked: false, // 초기 체크 상태
                }))
                setOrders(beforOrders) // 데이터 설정
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 오류 처리
            })
    }, [])

    // 주문 목록 변경에 따라 필터링된 주문 목록 업데이트
    useEffect(() => {
        // searchQuery가 비어있지 않은 경우 검색어에 맞는 주문을 필터링
        let filtered = orders
        if (searchQuery !== '') {
            filtered = filtered.filter(order =>
                order.order_name.includes(searchQuery)
            )
        }
        // 상태별로 주문 목록 필터링
        filtered = filtered.filter(
            order => status === 'return' || order.order_code === status
        )
        // 최종 필터링된 목록 설정
        setFilteredOrders(filtered)
    }, [orders]) // orders가 변경될 때마다 실행

    useEffect(() => {
        // searchQuery가 비어있지 않은 경우 검색어에 맞는 주문을 필터링
        let filtered = orders
        if (searchQuery !== '') {
            filtered = filtered.filter(order =>
                order.order_name.includes(searchQuery)
            )
        }
        // 상태별로 주문 목록 필터링
        filtered = filtered.filter(
            order => status === 'delivery' || order.order_code === status
        )
        // 최종 필터링된 목록 설정 및 체크박스 상태 초기화
        setFilteredOrders(filtered.map(order => ({ ...order, checked: false })))
        setSelectAll(false)
    }, [searchQuery, status]) // searchQuery, status가 변경될 때마다 실행

    // 주문 목록의 상태 선택 핸들러
    const handleSelectStatus = e => {
        const choice = e.target.getAttribute('data-label')
        setStatus(choice) // 선택된 상태로 필터링
    }

    // 주문 상태 변경 핸들러
    const handleChangeStatus = (e, order_seq) => {
        const order_code = e.target.value
        updateOrder(order_seq, order_code)
            .then(resp => {
                // console.log(resp)
                const currentTimestamp = new Date().toISOString()

                // 상태 변경 후 orders 배열 업데이트
                const updatedOrders = orders.map(order =>
                    order.order_seq === order_seq
                        ? {
                              ...order,
                              order_code,
                              // order_code가 'O5'인 경우 done_delivery_date에 현재 시간을 추가
                              ...(order_code === 'O5' && {
                                  done_delivery_date: currentTimestamp,
                              }),
                          }
                        : order
                )
                // 주문 목록 업데이트
                setOrders(updatedOrders)
                SwalComp({
                    type: 'success',
                    text: '주문 상태를 성공적으로 변경했습니다.',
                })
            })
            .catch(error => {
                console.log(error)
                SwalComp({
                    type: 'error',
                    text: '주문 상태 변경에 실패했습니다.',
                })
            })
    }

    // 환불 완료 버튼 클릭 핸들러
    const handleDoneReturn = () => {
        // 선택된 항목
        const selectedOrders = filteredOrders.filter(order => order.checked)
        if (selectedOrders.length === 0) {
            SwalComp({
                type: 'warning',
                text: '환불 완료 처리할 주문을 선택해주세요.',
            })
            return
        }

        SwalComp({
            type: 'confirm',
            text: '환불 완료 처리를 진행하시겠습니까?',
        }).then(result => {
            if (result.isConfirmed) {
                // 환불 완료 요청
                doneReturn(selectedOrders.map(order => order.order_seq))
                    .then(resp => {
                        // console.log(resp)
                        // 구매 확정 후 주문 목록 업데이트
                        const updatedOrders = orders.map(order =>
                            selectedOrders.some(
                                selected =>
                                    selected.order_seq === order.order_seq
                            )
                                ? { ...order, order_code: 'O6' } // 구매 확정 상태로 변경
                                : order
                        )
                        setOrders(
                            updatedOrders.map(order => ({
                                ...order,
                                checked: false,
                            }))
                        )
                        SwalComp({
                            type: 'success',
                            text: '환불을 성공적으로 완료했습니다.',
                        })
                    })
                    .catch(error => {
                        console.error('삭제 실패 :', error)
                        SwalComp({
                            type: 'error',
                            text: '환불 완료 처리에 실패했습니다.',
                        })
                    })
                // 전체 선택 체크박스를 해제
                setSelectAll(false)
            }
        })
    }

    // 주문 삭제 핸들러
    const handleDeleteOrder = () => {
        const selectedOrders = filteredOrders.filter(order => order.checked)
        console.log(selectedOrders)
        if (selectedOrders.length === 0) {
            SwalComp({
                type: 'warning',
                text: '삭제할 주문을 선택해주세요.',
            })
            return
        }

        SwalComp({
            type: 'question',
            text: '정말로 삭제하시겠습니까?',
        }).then(result => {
            if (result.isConfirmed) {
                deleteOrder(selectedOrders.map(order => order.order_seq))
                    .then(resp => {
                        console.log(resp)
                        setOrders(orders.filter(order => !order.checked))
                        console.log('삭제 직후', orders)
                        SwalComp({
                            type: 'success',
                            text: '선택한 주문이 삭제되었습니다.',
                        })
                    })
                    .catch(error => {
                        console.log('삭제 실패 :', error)
                        SwalComp({
                            type: 'error',
                            text: '주문 삭제에 실패했습니다.',
                        })
                    })
                setSelectAll(false)
            }
        })
    }

    // 주문 목록 클릭 시 상세 정보 보기
    const handleViewInfo = order_seq => {
        const selectedOrder = orders.find(
            order => order.order_seq === order_seq
        ) // 해당 주문을 찾음
        setViewOrder(selectedOrder) // 선택된 주문 정보를 설정
        setIsModalOpen(true) // 모달 열기
    }

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false) // 모달 닫기
    }

    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)

        // orders 배열에서 filteredOrders에 해당하는 주문들만 체크 상태 변경
        const updatedOrders = orders.map(order => {
            const filteredOrder = filteredOrders.find(
                filtered => filtered.order_seq === order.order_seq
            )
            return filteredOrder
                ? { ...order, checked: newSelectAll } // 필터링된 항목만 업데이트
                : order
        })
        setOrders(updatedOrders)
    }

    // 개별 체크박스 변경 핸들러
    const handleCheckboxChange = order_seq => {
        const updatedOrders = orders.map(order =>
            order.order_seq === order_seq
                ? { ...order, checked: !order.checked } // 체크 상태 토글
                : order
        )
        setOrders(updatedOrders)

        // 전체 선택 상태를 업데이트
        const allChecked = updatedOrders.every(order => order.checked)
        setSelectAll(allChecked)
    }

    // 검색 핸들러
    const handleSearch = e => {
        setSearchQuery(e)
    }

    return (
        <>
            <div className={styles.btns}>
                <Search onSearch={handleSearch} />
                <Button
                    size={'s'}
                    onClick={handleDoneReturn}
                    title={'환불 완료'}
                />
                <Button size={'s'} onClick={handleDeleteOrder} title={'삭제'} />
            </div>
            <div className={styles.container}>
                <div className={styles.category}>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="return"
                        className={status === 'return' ? styles.active : ''}
                    >
                        전체
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R1"
                        className={status === 'R1' ? styles.active : ''}
                    >
                        결재 취소 요청
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R2"
                        className={status === 'R2' ? styles.active : ''}
                    >
                        반품 요청
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R3"
                        className={status === 'R3' ? styles.active : ''}
                    >
                        상품 검수
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R4"
                        className={status === 'R4' ? styles.active : ''}
                    >
                        반품 불가
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R5"
                        className={status === 'R5' ? styles.active : ''}
                    >
                        반품 확정
                    </span>
                    <span
                        onClick={handleSelectStatus}
                        data-lable="R6"
                        className={status === 'R6' ? styles.active : ''}
                    >
                        환불 완료
                    </span>
                </div>
                <div className={styles.table}>
                    <div className={styles.header}>
                        <div className={styles.cols}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </div>
                        <div className={styles.cols}>환불 요청일</div>
                        <div className={styles.cols}>상품명</div>
                        <div className={styles.cols}>주문자</div>
                        <div className={styles.cols}>주문 금액</div>
                        <div className={styles.cols}>반품 현황</div>
                    </div>
                    <div className={styles.listBox}>
                        {filteredOrders.length === 0 ? (
                            <div className={styles.empty}>
                                데이터가 없습니다
                            </div>
                        ) : (
                            filteredOrders.map((order, i) => (
                                <div key={i} className={styles.rows}>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleCheckboxChange(
                                                order.order_seq
                                            )
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={order.checked || false}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    order.orders_seq
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {formatDate(order.return_date)}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.order_name}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.name}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        \ {addCommas(order.order_price)}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.order_title}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
