import { Button, Modal, Spinner } from "react-bootstrap";
import { BsChevronLeft,
    BsChevronRight,
    BsBellFill,
    BsHeartFill,
    BsChatDotsFill,
    BsCheckCircleFill,
    BsHandThumbsUpFill,
    BsMegaphoneFill,
    BsPersonPlusFill,
    BsPersonCheck,
    BsClipboardCheck,
    BsImage,
    BsBuilding,
    BsEnvelope,
    BsPeopleFill, 
    BsGear} from "react-icons/bs";
import "./NtcnDetail.css";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import { formatTime } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import NtcnSetupDetail from "./NtcnSetupDetail";

const iconMap = {
    BsBell: BsBellFill,
    BsHeart: BsHeartFill,
    BsChatDots: BsChatDotsFill,
    BsCheckCircle: BsCheckCircleFill,
    BsHandThumbsUp: BsHandThumbsUpFill,
    BsMegaphone: BsMegaphoneFill,
    BsPersonPlus: BsPersonPlusFill,
    BsPersonCheck: BsPersonCheck,
    BsClipboardCheck: BsClipboardCheck,
    BsImage: BsImage,
    BsBuilding: BsBuilding,
    BsEnvelope: BsEnvelope,
    BsPeople: BsPeopleFill
};


export default function NtcnDetail({show, onHide}) {
    /********************************************************
     * 변수 선언
     ********************************************************/
    /**
     * 공통코드 및 공통코드 데이터 셋
     */
    const ntcnCtgry = useRef("NTCN_CTGRY"); //알림설정
    const [ntcnCtgryList, setNtcnCtgryList] = useState([]);

    /**
     * 검색 조건에 사용
     */
    const [ntcnCtgrySel, setNtcnCtgrySel] = useState("ALL");

    /**
     * 알림카테고리 건수 및 회원알림 정보 데이터 셋
     */
    const [counts, setCounts] = useState({"ALL": 0});
    const [mberNtcnList, setMberNtcnList] = useState([]);

    /**
     * 무한 스크롤(Infinite Scroll)
     */
    const PAGE_SIZE = 10; //페이지 사이즈
    const [page, setPage] = useState(1); //페이징 관련
    const [hasMore, setHasMore] = useState(true); //다음 데이터 존재 여부
    const [loading, setLoading] = useState(false); //최초/조회 변경 조회
    const [moreLoading, setMoreLoading] = useState(false); //다음 페이지 추가 조회
    const observerTarget = useRef(null); //IntersectionObserver가 감시할 영역

    /**
     * 시간
     */
    const [now, setNow] = useState(new Date());

    /**
     * 화면 이동
     */
    const navigate = useNavigate();

    /**
     * 알림 설정 모달
     */
    const [ntcnSettingModal, setNtcnSettingModal] = useState(false);

    /********************************************************
     * 스크롤 및 API 호출
     ********************************************************/
    /**
     * 스크롤 감시
     */
    useEffect(() => {
        if(!observerTarget.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];

                if(target.isIntersecting &&
                hasMore &&
                !loading &&
                !moreLoading
                ) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: "150px",
                threshold: 0.1,
            }
        );

        observer.observe(observerTarget.current);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, moreLoading, page, ntcnCtgrySel]);

    /**
     * 다음 페이지 조회
     */
    const loadMore = () => {
        if(moreLoading || loading || !hasMore) {
            return;
        }

        const nextPage = page + 1;
        setPage(nextPage);
        retrieveNtcnDetail(nextPage, false, ntcnCtgrySel);
    };

    /********************************************************
     * API 호출
     ********************************************************/
    /**
     * 알림카테고리 조회
     * 1. 마운트시에 호출
     */
    useEffect(() => {
        const retrieveNtcnCtgry = async () => {
            try {
                const responseNtcnCtgry = await api.get("/codes/" + ntcnCtgry.current);

                setNtcnCtgryList(responseNtcnCtgry.data?.data ?? []);
            } catch (error) {
                console.log(error.response?.data?.message ?? "알림카테고리 조회 실패");

                setNtcnCtgryList([]);
            }
        };

        retrieveNtcnCtgry();
    }, []);

    /**
     * 회원알림 목록 조회 및 알림카테고리별 전체 건수 조회
     */
    const retrieveNtcnDetail = async (currentPage, reset=false, ntcnCtgrySel) => {
        try {
            if(reset) {
                setLoading(true);
            } else {
                setMoreLoading(true);
            }

            const response = await api.get("/ntcn/detail", {
                params: {
                    page: currentPage,
                    size: PAGE_SIZE,
                    ntcnCtgryCode: ntcnCtgrySel === "ALL" ? "" : ntcnCtgrySel,
                },
            });

            const data = response.data?.data;
            const newList = data?.mberNtcnList ?? [];

            /**
             * 첫 조회
             */
            if(reset) {
                setMberNtcnList(newList);
            } else { //다음 조회 시
                setMberNtcnList((prev) => [
                    ...prev,
                    ...newList
                ]);
            }

            /**
             * 알림카테고리별 전체 건수 조회
             */
            setCounts(data?.mberNtcnCntDto ?? {"ALL": 0,});

            /**
             * 조회된 건수가 PAGE_SIZE보다 작으면 마지막 페이지
             */
            setHasMore(
                newList.length === PAGE_SIZE
            );
        } catch (error) {
            console.error(error.response?.data?.message, "회원알림 목록 조회 오류");

            if(reset) {
                setMberNtcnList([]);
            }

            setCounts({});
            setHasMore(false);
        } finally {
            if(reset) {
                setLoading(false);
            } else {
                setMoreLoading(false);
            }
        }
    };

    /**
     * 회원알림 읽음 처리
     */
    const mberNtcnRedngTrt = async (mberNtcnNo) => {
        try {
            const response = await api.get("/ntcn/chgredng/" + mberNtcnNo);
            console.info(response.data?.message ?? "회원알림 읽음 처리 완료")
        } catch (error) {
            console.error(error.response?.data?.message ?? "회원알림 읽음 처리 실패");
        }
    };

    /**
     * 회원알림 목록 조회 및 알림카테고리 건수 조회
     */
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setMberNtcnList([]);

        retrieveNtcnDetail(1, true, ntcnCtgrySel);
    }, [ntcnCtgrySel]);

    /********************************************************
     * 초기화 및 API 호출
     ********************************************************/
    const handleBtnChange = (status) => {
        if(!status) {
            return;
        }

        setNtcnCtgrySel(status);
        retrieveNtcnDetail(1, true, status);
    };

    /**
     * 1분마다 현재 시간 세팅하여 무한 스크롤 시 이전에 조회된 날짜를 현행화하고자 선언함
     */
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => {
            clearInterval(timer);
        }
    }, []);

    /**
     * 아이콘 배경색
     * 
     * 아이콘 자체는 DB에서 결정
     * 색상은 카테고리 기준
     */
    const getIconClass = (ntcnCtgryCode) => {
        switch(ntcnCtgryCode) {
            case "ARTWORK":
                return "green";
            case "EXHIBITION":
                return "purple";
            case "INQUIRY":
                return "blue";
            case "ETC":
                return "yellow";
            default:
                return "sky";
        }
    };

    /**
     * 아이콘 조회
     */
    const getNotificationIcon = (iconCode) => {
        const IconComponent = iconMap[iconCode] ?? BsBellFill;

        return (
            <IconComponent/>
        );
    };

    /**
     * 현재는 작가심사상세 화면만 호출하게 되어 있음
     * 화면이 추가될때 마다 수정해야 함. SJH
     */
    const handleNtcnClick = (mberNtcn) => {
        if(mberNtcn.redngAt === "N") {
            //읽음 처리
            mberNtcnRedngTrt(mberNtcn.mberNtcnNo);
        }

        /**
         * 모달 Close
         */
        onHide();

        navigate(mberNtcn.menuUrl + `${mberNtcn.trgetNo}/${mberNtcn.email}`);
    };

    /**
     * 알림설정 시 값 세팅
     */
    const handleNtcnSetting = () => {
        setNtcnSettingModal(true);
    };

    /**
     * 알림설정 닫을 시 값 초기화
     */
    const handleCloseNtcnSetting = () => {
        setNtcnSettingModal(false);
    };

    /**
     * 알림 모달 자체 닫기
     */
    const handleCloseNtcnDetail = () => {
        setNtcnSettingModal(false);
        onHide();
    };

    return (
        <>
            <Modal show={show} onHide={handleCloseNtcnDetail} fullscreen centered size="lg" dialogClassName="notification-modal" contentClassName="notification-modal-content" scrollable>
                <Modal.Header className="notification-header">
                    <div className="notification-header-left">
                        <Button variant="link" onClick={handleCloseNtcnDetail} aria-label="뒤로가기" className="notification-back">
                            <BsChevronLeft />
                        </Button>
                        <Modal.Title className="notification-title">알림</Modal.Title>
                    </div>
                    <Button variant="link" onClick={handleNtcnSetting} className="notification-setting-button">
                        <BsGear/>
                        <span>알림설정</span>
                    </Button>
                </Modal.Header>
                <Modal.Body className="notification-body">
                    <div className="notification-category-area">
                        <button type="button" className={ntcnCtgrySel === "ALL" ? "notification-category active" : "notification-category"} onClick={() => handleBtnChange("ALL")}><span>전체 ({counts["ALL"] ?? 0})</span></button>
                        {ntcnCtgryList.map((ntcnCtgry) => {
                            return (
                                <button key={ntcnCtgry.code} className={ntcnCtgrySel === ntcnCtgry.code ? "notification-category active" : "notification-category"} onClick={() => handleBtnChange(ntcnCtgry.code)}>
                                    <span>{ntcnCtgry.codeNm} ({counts[ntcnCtgry.code] ?? 0})</span>
                                </button>
                            )
                        })}
                    </div>
                    <div className="notification-list">
                    {loading ? (
                        <div className="notification-loading">
                            <Spinner animation="border" size="sm"/>
                            <span>알림을 불러오는 중입니다.</span>
                        </div>

                    ) : (
                        <div>
                            {mberNtcnList.length > 0 ? (
                                <>
                                    {mberNtcnList.map(mberNtcn => {
                                        return (
                                            <div key={mberNtcn.mberNtcnNo} className={mberNtcn.redngAt === "N" ? "notification-item unread" : "notification-item"} onClick={() => handleNtcnClick(mberNtcn)}>
                                                <div className="notification-unread-area">
                                                    {mberNtcn.redngAt === "N" && (
                                                        <span className="notification-unread-dot"/>
                                                    )}
                                                </div>
                                                <div className={`notification-icon ${getIconClass(mberNtcn.ntcnCtgryCode)}`}>
                                                    {
                                                        getNotificationIcon(mberNtcn.iconCode, now)
                                                    }
                                                </div>
                                                <div className="notification-info">
                                                    <div className="notification-item-title">
                                                        {mberNtcn.sj}
                                                    </div>
                                                    <div className="notification-content">
                                                        {mberNtcn.cn}
                                                    </div>
                                                    <div className={mberNtcn.redngAt === "N" ? "notification-time unread" : "notification-time"}>
                                                        {formatTime(mberNtcn.registDt, now)}
                                                    </div>
                                                </div>
                                                {mberNtcn.fileUrl && (
                                                    <div className="notification-image">
                                                        <img src={mberNtcn.fileUrl}/>
                                                    </div>
                                                )}
                                                {(mberNtcn.menuUrl &&
                                                    (
                                                        <div className="notification-arrow">
                                                            <BsChevronRight/>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}

                                    <div ref={observerTarget}>
                                        {moreLoading && (
                                            <div className="more-loading">
                                                <Spinner animation="border" size="sm"/>
                                                <span>추가 알림 조회 중</span>
                                            </div>
                                        )}

                                        {!hasMore && mberNtcnList.length > 0 && (
                                            <div className="end-message">
                                                마지막 알림입니다.
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (<div className="notification-empty"><BsBellFill/><span>조회된 대상이 없습니다.</span></div>)}
                        </div>
                    )}
                    </div>
                </Modal.Body>
            </Modal>
            {ntcnSettingModal && <NtcnSetupDetail
                show={handleNtcnSetting}
                onHide={handleCloseNtcnSetting}
            />}
        </>
    );
}