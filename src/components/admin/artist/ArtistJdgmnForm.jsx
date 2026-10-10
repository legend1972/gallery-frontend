import { Badge, Button, Card, Col, Container, Form, InputGroup, Nav, Row, Spinner } from "react-bootstrap";
import "./ArtistJdgmnForm.css";
import { useEffect, useRef, useState } from "react";
import api from "../../../api/api";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import ArtistJdgmnDetail from "./ArtistJdgmnDetail";
// import { useSearchParams } from "react-router-dom";

/**
 * 작가심사관리
 * @returns 
 */
export default function ArtistJdgmnForm() {
    /********************************************************
     * 변수 선언
     ********************************************************/
    /**
     * 공통코드 및 공통코드 데이터 셋
     */
    const jdgmnSt = useRef("JDGMN_ST");
    const [jdgmnStList, setJdgmnStList] = useState([]);
    
    /**
     * 검색 조건에 사용
     */
    const [nm, setNm] = useState(""); //작가명
    const [searchNm, setSearchNm] = useState(""); //검색 버튼 클릭 혹은 입력 창에 데이터 입력 후 엔터 시 값 세팅되는 값
    const [jdgmnStTab, setJdgmnStTab] = useState("ALL"); //심사 상태 탭

    /**
     * 심사 상태 건수 및 작가 심사 정보 데이터 셋
     */
    const [counts, setCounts] = useState({ALL: 0,});
    const [writrJdgmnList, setWritrJdgmnList] = useState([]);

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
     * 작사심사상세 호출 시 input 값으로 사용 (모달에 사용)
     */
    const [selectedMberNo, setSelectedMberNo] = useState(null); //회원번호
    const [selectedEmail, setSelectedEmail] = useState(null); //이메일주소
    const [showDetailModal, setShowDetailModal] = useState(false); //모달 Show

    /**
     * 파라미터 처리
     */
    // const [searchParams] = useSearchParams();
    // const queryMberNo = searchParams.get("mberNo");
    // const queryEmail = searchParams.get("email");

    /********************************************************
     * API 호출
     ********************************************************/
    /**
     * 심사상태 조회
     * 1. 마운트시에 호출
     */
    useEffect(() => {
        const writrJdgmnAdminList = async () => {
            try {
                const responseJdgmnSt = await api.get("/codes/" + jdgmnSt.current); //심사상태
                setJdgmnStList(responseJdgmnSt.data?.data ?? []); //심사상태
            } catch (error) {
                console.error(error.response?.data?.message ?? "심사상태 조회 실패");
                setJdgmnStList([]); //심사상태 초기화
            }
        };

        writrJdgmnAdminList();
    }, []);

    /********************************************************
     * 초기화 및 API 호출
     ********************************************************/
    /**
     * 1. 마운트 시 or 탭 선택 시 or 작가명 입력 후 엔터 시 혹은 검색 버튼 클릭 시
     *    심사할 작가 정보 조회 및 심사상태별 건수 조회
     * 
     * 2. 기존 목록을 비우고 첫 페이지부터 다시 조회
     */
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setWritrJdgmnList([]);

        getArtistJdgmnInfo(1, true); //작가를 심사할 정보 조회 및 심사상태별 건수 조회
    }, [searchNm, jdgmnStTab]);

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
    }, [hasMore, loading, moreLoading, page, searchNm, jdgmnStTab]);

    /**
     * 다음 페이지 조회
     */
    const loadMore = () => {
        if(moreLoading || loading || !hasMore) {
            return;
        }

        const nextPage = page + 1;
        setPage(nextPage);
        getArtistJdgmnInfo(nextPage, false);
    };

    /********************************************************
     * API 호출
     ********************************************************/
    /**
     * 작가를 심사할 정보 조회 및 심사상태별 건수 조회
     */
    const getArtistJdgmnInfo = async (currentPage, reset=false) => {
        try {
            if(reset) {
                setLoading(true);
            } else {
                setMoreLoading(true);
            }

            const response = await api.get("/artist/jdgmn", {
                params: {
                    page: currentPage,
                    size: PAGE_SIZE,
                    nm: searchNm === "" ? "" : searchNm,
                    jdgmnSttusCode: jdgmnStTab === "ALL" ? "" : jdgmnStTab
                },
            });
            
            const data = response.data?.data;
            
            const newList = data?.writrJdgmnInfoList ?? [];

            /**
             * 첫 조회
             */
            if(reset) {
                setWritrJdgmnList(newList);
            } else { /** 다음 조회 시 */
                setWritrJdgmnList(
                    (prev) => [
                        ...prev,
                        ...newList,
                    ]
                );
            }

            /**
             * 검색 조건에 해당하는 삼사상태 별 전체 건수 조회
             */
            setCounts(data?.writrJdgmnInfoCnt ?? {ALL: 0,});

            /**
             * 조회된 건수가 PAGE_SIZE보다 작으면 마지막 페이지
             */
            setHasMore(
                newList.length === PAGE_SIZE
            );

        } catch (error) {
            console.error(error.response?.data?.message ?? "작가 심사 목록 조회 실패");

            if(reset) {
                setWritrJdgmnList([]);
            }

            setHasMore(false);

            setCounts({});
        } finally {
            if(reset) {
                setLoading(false);
            } else {
                setMoreLoading(false);
            }
        }
    };

    /********************************************************
     * 버튼 처리
     ********************************************************/
    /**
     * 검색 버튼 클릭 혹은 입력 창에 데이터 입력 후 엔터 시 값 세팅
     */
    const handleSearch = () => {
        setSearchNm(nm.trim());
    };

    /**
     * 검색 조건 초기화
     */
    const handleReset = () => {
        setNm("");
        setSearchNm("");
        setJdgmnStTab("ALL");
    };

    /**
     * 상세보기 시 값 세팅
     */
    const handleDetail = (mberNo, email) => {
        setSelectedMberNo(mberNo);
        setSelectedEmail(email);
        setShowDetailModal(true);
    };

    /********************************************************
     * 탭 처리
     ********************************************************/
    /**
     * 심사 상태 선택 처리
     */
    const handleTabChange = (status) => {
        if(!status) {
            return;
        }
        setJdgmnStTab(status);
    };

    /**
     * 심사상태별 색깔 표현
     */
    const getStatusClassName = (status) => {
        switch (status) {
            case "PEND":
                return "status-waiting";
            case "REVW":
                return "status-review";
            case "RCHG":
                return "status-modify";
            case "CMPL":
                return "status-approved";
            case "REJT":
                return "status-rejected";
            default:
                return "status-default";
        }
    };

    /********************************************************
     * 조회 내역 표시 변경
     ********************************************************/
    /**
     * 승인 혹은 거절인 경우 "심사 결과" 표시
     * 그 외는 "심사 안내" 표시
     */
    const getResultLabel = (status) => {
        if(status === "CMPL" || status === "REJT") {
            return "심사 결과";
        }

        return "심사 안내";
    };

    /********************************************************
     * 모달 처리
     ********************************************************/
    /**
     * 상세보기 닫을 시 값 초기화
     */
    const handleCloseDetailModal = () => {
        setSelectedMberNo(null);
        setSelectedEmail(null);
        setShowDetailModal(false);

        navigate(-1);
    };

    return (
        <div className="artist-review-page">
            <Container fluid className="review-container">
                <h1 className="h2 fw-bold mb-2">작가 심사 관리</h1>
                <hr className="my-4 my-lg-5"/>
                <Nav className="review-tabs" onSelect={handleTabChange} activeKey={jdgmnStTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="ALL">
                            전체 ({counts["ALL"] ?? 0})
                        </Nav.Link>
                    </Nav.Item>
                    {jdgmnStList.map((jdgmnSt) => {
                        return (
                            <Nav.Item key={jdgmnSt.code}>
                                <Nav.Link eventKey={jdgmnSt.code}>
                                    {jdgmnSt.codeNm} ({counts[jdgmnSt.code] ?? 0})
                                </Nav.Link>
                            </Nav.Item>
                        )
                    })}
                </Nav>
                <div className="search-section">
                    <InputGroup>
                        <InputGroup.Text>
                            <FiSearch/>
                        </InputGroup.Text>
                        <Form.Control id="nm" name="nm" value={nm} onChange={(e) => {setNm(e.target.value)}} type="text" placeholder="작가명 검색" onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                handleSearch();
                            }
                        }}/>
                    </InputGroup>
                    <Button className="search-button" onClick={handleSearch}>검색</Button>
                    <Button variant="outline-primary" className="reset-button" onClick={handleReset}><FiRefreshCw className="me-2"/> 초기화</Button>
                </div>
                
                {loading ? (
                    <div>
                        <Spinner animation="border" size="sm"/>
                        <span>조회 중입니다.</span>
                    </div>
                ) : (
                    <div className="review-list">
                        {writrJdgmnList.length > 0 ? (
                            <>
                            {writrJdgmnList.map((writrJdgmn) => {
                                const statusClassName = getStatusClassName(writrJdgmn.jdgmnSttusCode);
                                return (
                                    <Card key={writrJdgmn.mberNo} className="review-card">
                                        <Card.Body>
                                            <Row className="g-3 align-items-center">
                                                <Col xs={12} lg={6}>
                                                    <div className="apply-date">
                                                        <span>신청일</span>
                                                        <strong>{writrJdgmn.rqstdt}</strong>
                                                    </div>
                                                    <div className="applicant-area">
                                                        <img src={writrJdgmn.writrFileUrl} alt={writrJdgmn.nm} className="profile-image"/>
                                                        <div  className="applicant-info">
                                                            <div className="applicant-name">
                                                                {writrJdgmn.nm}
                                                            </div>
                                                            <div className="applicant-email">
                                                                {writrJdgmn.email}
                                                            </div>
                                                        </div>
                                                        <img src={writrJdgmn.reprsntPrdctFileUrl} alt="대표 작품" className="artwork-image" />
                                                    </div>
                                                </Col>
                                                <Col xs={12} lg={6}>
                                                    <div className="review-result-area">
                                                        <div className="status-row">
                                                            <span>심사 상태</span>
                                                            <Badge className={statusClassName}>{writrJdgmn.jdgmnSttusNm}</Badge>
                                                        </div>
                                                        <div className="status-row">
                                                            <span>{getResultLabel(writrJdgmn.jdgmnSttusCode)}</span>
                                                            <strong>{writrJdgmn.jdgmnRefer1Nm}</strong>
                                                        </div>
                                                        <div className="result-title">
                                                            <span>{writrJdgmn.jdgmnSumry}</span>
                                                        </div>
                                                        <Button variant="outline-secondary" className="detail-button" onClick={() => handleDetail(writrJdgmn.mberNo, writrJdgmn.email)}>상세보기</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                );
                            })}

                            <div ref={observerTarget} className="scroll-observer">
                                {moreLoading && (
                                    <div className="more-loading">
                                        <Spinner animation="border" size="sm"/>
                                        <span>추가 조회 중</span>
                                    </div>
                                )}

                                {!hasMore && writrJdgmnList.length > 0 && (
                                    <div className="end-message">
                                        마지막 목록입니다.
                                    </div>
                                )}
                            </div>
                            </>
                        ) : (<div className="empty-result"><FiSearch size={30} className="empty-icon"/>조회된 대상이 없습니다.</div>)}
                    </div>
                )}
            </Container>

            {showDetailModal && <ArtistJdgmnDetail
                    mberNo={selectedMberNo}
                    email={selectedEmail}
                    show={showDetailModal}
                    onHide={handleCloseDetailModal}
                    onSaved={getArtistJdgmnInfo}
                />
            }
        </div>

        
    );
}