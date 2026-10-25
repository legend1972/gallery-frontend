// import { Modal } from "react-bootstrap";

import { Badge, Button, Card, Col, Form, Image, Modal, Row, Stack } from "react-bootstrap";
import "./ArtistJdgmnDetail.css";
import { useEffect, useRef, useState } from "react";
import api from "../../../api/api";
import {BsChevronLeft} from "react-icons/bs";
import { useAuth } from "../../../context/AuthContext";

//.length 같은 연산을 하기 때문에 초기화 필요
const initialFormData = {
    mberNo: "",
    gnrlMberNo: "",
    nm: "",
    prdctNm: "",
    mnfctYear: "",
    prdctDc: "",
    rqstdt: "",
    actArea: "",
    selfIntrcn: "",
    mberSttusCode: "",
    jdgmnSttusCode: "",
    jdgmnOpinion: "",
    jdgmnSumry: "",
    JdgmnNo: ""
};

export default function ArtistJdgmnDetail({mberNo, email, show, onHide, onSaved}) {
    /**
     * 작가 관련 정보 데이터 셋
     */
    const [formData, setFormData] = useState(initialFormData); //작가 정보
    const [careers, setCareers] = useState([]); //경력
    const [sites, setSites] = useState([]); //URL
    const [writrFileDtls, setWritrFileDtls] = useState({}); //작가프로필 파일 내역
    const [reprsntPrdctFileDtls, setReprsntPrdctFileDtls] = useState({}); //대표작품 파일 내역

    const [jdgmnCeckDetail, setJdgmnCeckDetail] = useState([]); //심사체크상세

    /**
     * 공통코드 및 공통코드 데이터 셋
     */
    const urlCode = useRef("SITE"); //URL
    const [siteList, setSiteList] = useState([]); //URL 리스트
    const jdgmnCeckCode = useRef("W_JDGMN_CECK"); //작가심사체크
    const [jdgmnCeckList, setJdgmnCeckList] = useState([]); //심사체크리스트
    const jdgmnSt = useRef("JDGMN_ST"); //심사상태
    const [jdgmnStList, setJdgmnStList] = useState([]); //심사상태리스트

    const [isDisabled, setIsDisabled] = useState(false);
    const {user} = useAuth();

    /**
     * 공통코드, 작가 정보, 경력, URK, 작가프로필 파일 내역, 대표작품 파일 내역 조회
     */
    useEffect(() => {
        if(!show || !mberNo) {
            return;
        }

        const artistJdgmnDetail = async () => {
            try {
                const [siteResponse, response, jdgmnCeckResponse, responseJdgmnSt] = await Promise.all([
                    api.get("/codes/" + urlCode.current),
                    api.get("/artist/jdgmn/detail?mberNo=" + mberNo ),
                    api.get("/codes/" + jdgmnCeckCode.current),
                    api.get("/codes/" + jdgmnSt.current),
                ]);

                /**
                 * 작가 관련 정보 데이터 셋 처리
                 */
                const data = response.data.data;
                const writrInfo = data.writrInfoOutDto ?? {};
                setFormData({
                    mberNo: writrInfo.mberNo ?? "",
                    gnrlMberNo: writrInfo.gnrlMberNo ?? "",
                    nm: writrInfo.nm ?? "",
                    prdctNm: writrInfo.prdctNm ?? "",
                    mnfctYear: writrInfo.mnfctYear ?? "",
                    prdctDc: writrInfo.prdctDc ?? "",
                    rqstdt: writrInfo.rqstdt ?? "",
                    actArea: writrInfo.actArea ?? "",
                    selfIntrcn: writrInfo.selfIntrcn ?? "",
                    mberSttusCode: writrInfo.mberSttusCode ?? "",
                    jdgmnSttusCode: writrInfo.jdgmnSttusCode ?? "",
                    jdgmnOpinion: writrInfo.jdgmnOpinion ?? "",
                    jdgmnSumry: writrInfo.jdgmnSumry ?? "",
                    JdgmnNo: writrInfo.JdgmnNo ?? "",
                });

                setCareers(data.writrCareerOutDtoList ?? []);
                setSites(data.writrUrlOutDtoList ?? []);
                setWritrFileDtls(data.writrFileDtlsOutDto ?? {});
                setReprsntPrdctFileDtls(data.reprsntPrdctFileDtlsOutDto ?? {});
                setJdgmnCeckDetail(data.jdgmnCeckDetailOutDtoList ?? []);

                /**
                 * 공통코드 및 공통코드 데이터 셋 처리
                 */
                setSiteList(siteResponse.data?.data ?? []);
                setJdgmnCeckList(jdgmnCeckResponse.data?.data ?? []);
                setJdgmnStList(responseJdgmnSt.data?.data ?? []);

            } catch (error) {
                console.error(error.response?.data?.message ?? "작가 심사 상세 조회 실패 혹은 코드 조회 실패");
                
                setFormData(initialFormData);
                setCareers([]);
                setSites([]);
                setWritrFileDtls({});
                setReprsntPrdctFileDtls({});
                jdgmnCeckDetail([]);

                setSiteList([]);
                setJdgmnCeckList([]);
                setJdgmnStList([]);
            }
        };

        artistJdgmnDetail();
    }, [show, mberNo]);

    useEffect(() => {
        if(formData.jdgmnSttusCode === "CMPL" || formData.jdgmnSttusCode === "REJT" || user.mberSbscrbTyCode !== "ADMN") {
            setIsDisabled(true);
        }
    }, [formData]);

    const siteNm = (siteCode) => {
        return siteList.find((site) => site.code === siteCode)?.codeNm ?? "";
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const jdgmnCeckChange = (code, checked) => {
        setJdgmnCeckDetail((prev) => {
            //some: 배열 안에 조건을 만족하는 요소가 하나라도 있는지 확인하는 함수
            const exists = prev.some(
                item => item.jdgmnCeckCode === code
            );

            if (exists) {
                return prev.map(item =>
                    item.jdgmnCeckCode === code
                        ? {
                            ...item,
                            ceckAt: checked ? "Y" : "N"
                        }
                        : item
                );
            }
            return [
                ...prev,
                {
                    jdgmnCeckCode: code,
                    mberNo: mberNo,
                    ceckAt: checked === true ? "Y" : "N"
                }
            ]
        });
    };

    const currentJdgmnSt = jdgmnStList.find(
        item => item.code === formData.jdgmnSttusCode
    );

    const handleSubmit = async (changeStatusCode) => {
        const writrInfoBindingDto = {
            changeJdgmnSttusCode: changeStatusCode,
            writrInfoInDto: formData,
            jdgmnCeckDetailInDtoList: jdgmnCeckDetail
        }

        try {
            const response = await api.post("/artist/jdgmn/change", writrInfoBindingDto);

            setFormData(prev => ({
                ...prev,
                jdgmnSttusCode: changeStatusCode
            }));

            alert(response.data.message);

            await onSaved?.(1, true);

            onHide();

        } catch (error) {
            console.error(error.response?.data?.message ?? "작가 심사 변경 처리 실패");
        }
    }

    return (
        <Modal show={show} onHide={onHide} fullscreen dialogClassName="artist-review-modal" contentClassName="artist-review-modal-content">
            <Modal.Header className="review-modal-header">
                <Button variant="link" onClick={onHide} aria-label="뒤로가기" className="notification-back-button">
                    <BsChevronLeft />
                </Button>
                <Modal.Title className="notification-title">작가 심사 상세</Modal.Title>
            </Modal.Header>
            <Modal.Body className="review-modal-body">
                <section className="artist-summary-section">
                    <Row className="align-items-center g-4">
                        <div className="d-flex align-items-center">
                            <Col>
                                <div className="d-flex align-items-center">
                                    <Image src={writrFileDtls.fileUrl} roundedCircle className="artist-profile-image"/>
                                    <div className="ms-4">
                                        <h3 className="artist-name">{formData.nm}</h3>
                                        <div className="artist-email">{email}</div>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div className="representative-work-title">대표작</div>
                                <div className="d-flex align-items-center gap-3">
                                    <Image src={reprsntPrdctFileDtls.fileUrl} className="representative-work-image"/>
                                    <div>
                                        <div className="representative-work-name">
                                            {formData.prdctNm}
                                        </div>
                                        <div className="representative-work-info">
                                            {formData.mnfctYear} {formData.prdctDc}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </Row>
                    
                </section>
                <Card className="review-card mb-3">
                    <Card.Body>
                        <Row className="info-row">
                            <Col xs={4} md={3} className="info-label">
                                <div>신청일</div>
                            </Col>
                            <Col xs={8} md={9}>
                                <div>{formData.rqstdt}</div>
                            </Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={4} md={3} className="info-label">
                                <div>활동지역</div>
                            </Col>
                            <Col xs={8} md={9}>
                                <div>{formData.actArea}</div>
                            </Col>
                        </Row>
                        {sites.map((site) => {
                            return (
                                <Row className="info-row" key={site.sn}>
                                    <Col xs={4} md={3} className="info-label">
                                        <div>{siteNm(site.siteCode)}</div>
                                    </Col>
                                    <Col xs={8} md={9}>
                                        <div>{site.url}</div>
                                    </Col>
                                </Row>
                            );
                        }) }
                        <hr/>
                        <div className="detail-section">
                            <h6>소개</h6>
                            <p className="artist-introduction">{formData.selfIntrcn}</p>
                        </div>
                        <div className="detail-section">
                            <h6>주요 경력</h6>
                            <ul className="career-list">
                            {careers.map((carrer) => {
                                return (
                                    <li key={carrer.sn}>{carrer.careerYear} {carrer.careerCn}</li>
                                );
                            }
                            )}
                            </ul>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="review-card">
                    <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                            <strong className="me-3">심사 상태</strong>
                            {currentJdgmnSt &&
                                <Badge key={currentJdgmnSt.code}>{currentJdgmnSt.codeNm}</Badge>            
                            }
                        </div>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                심사 의견 <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="textarea-wrapper">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    maxLength={500}
                                    id="jdgmnOpinion"
                                    name="jdgmnOpinion"
                                    value={formData.jdgmnOpinion}
                                    onChange={handleChange}
                                    placeholder="아직 심사가 시작되지 않았습니다. 검토 시작 시 심사 의견을 입력할 수 있습니다."
                                    disabled={isDisabled}
                                />
                                <span className="textarea-count">
                                    {
                                        formData.jdgmnOpinion.length
                                    }{" "}
                                    / 500
                                </span>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                심사 결과 (한 줄 요약)
                            </Form.Label>
                            <div>
                                <Form.Control
                                    type="text"
                                    maxLength={100}
                                    id="jdgmnSumry"
                                    name="jdgmnSumry"
                                    value={formData.jdgmnSumry}
                                    onChange={handleChange}
                                    placeholder="예) 작품 완성도와 포트폴리오가 우수하여 승인합니다."
                                    disabled={isDisabled}
                                />
                                <div  className="text-end text-muted mt-1">
                                    {
                                        formData.jdgmnSumry.length
                                    }
                                    / 100
                                </div>
                            </div>
                        </Form.Group>
                        <div>
                            <Form.Label className="fw-bold">
                                심사 체크 리스트
                            </Form.Label>

                            <Stack gap={2}>
                                {jdgmnCeckList.map((jdgmnCeck) => {
                                    return (
                                        <Form.Check
                                            key={jdgmnCeck.code}
                                            type="checkbox"
                                            checked={jdgmnCeckDetail.find(item => item.jdgmnCeckCode === jdgmnCeck.code)?.ceckAt === "Y"}
                                            onChange={e=>jdgmnCeckChange(jdgmnCeck.code, e.target.checked)}
                                            id={jdgmnCeck.code}
                                            name={jdgmnCeck.code}
                                            label={jdgmnCeck.codeNm}
                                            disabled={isDisabled}
                                        />
                                    );
                                })}
                            </Stack>
                        </div>
                    </Card.Body>
                </Card>
                <div className="review-button-area mt-4">
                    {formData.jdgmnSttusCode === "PEND" && !isDisabled && (
                        <>
                            <Button variant="primary" onClick={() => handleSubmit("CHNG")}>저장</Button>
                            <Button variant="primary" onClick={() => handleSubmit("REVW")}>리뷰 시작</Button>
                        </>
                    )}

                    {formData.jdgmnSttusCode === "REVW" && !isDisabled && (
                        <>
                            <Button variant="warning" onClick={() => handleSubmit("RCHG")}>수정 요청</Button>
                            <Button variant="danger" onClick={() => handleSubmit("REJT")}>거절</Button>
                            <Button variant="success" onClick={() => handleSubmit("CMPL")}>승인</Button>
                        </>
                    )}

                    {formData.jdgmnSttusCode === "RCHG" && !isDisabled && (
                        <Button variant="warning" onClick={() => handleSubmit("REVW")}>재심사 시작</Button>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}