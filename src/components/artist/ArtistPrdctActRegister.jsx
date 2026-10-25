import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import * as Bs from "react-icons/bs";
import "./activity.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import api from "../../api/api";
import ImageUploadBox from "../common/ImageUploadBox";
import { FiMapPin } from "react-icons/fi";
import SectionTitle from "../common/SectionTitle";
import {validateImageFile} from "../../utils/fileUtils";

export default function ArtistPrdctActRegister({show, onHide}) {
    const actTy = useRef("ACT_TY");
    const [actTyList, setActTyList] = useState([]);

    const role = useRef("ROLE");
    const [roleList, setRoleList] = useState([]);

    const imageTy = useRef("IMAGE_TY");
    const [imageTyList, setImageTyList] = useState([]);

    const [selectedImageTy, setSelectedImageTy] = useState("");

    /**
     * 기본 정보 애표 작품 이미지
     */
    const [reprsntPrdctImageFile, setReprsntPrdctImageFile] = useState(null); // 기존 작품활동 파일 DTO
    const [reprsntPrdctImageNo, setReprsntPrdctImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [reprsntPrdctFileNo, setReprsntPrdctFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    /**
     * 관련 기관 / 주최 이미지
     */
    const [reprsntImageFile, setReprsntImageFile] = useState(null); // 기존 작품활동 파일 DTO
    const [reprsntImageNo, setReprsntImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [reprsntFileNo, setReprsntFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    /**
     * 이미지 유형별 이미지
     */
    const [imageFile, setImageFile] = useState(null); // 기존 작품활동 파일 DTO
    const [imageNo, setImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [fileNo, setFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    const [formData, setFormData] = useState({
        prdctActNo: "",
        prdctSn: 0,
        mberNo: "",
        actTyCode: "",
        actNm: "",
        actBgnde: "",
        actEndde: "",
        actPlace: "",
        reprsntPrdctFileNo: "",
        actIntrcn: "",
        othbcAt: "N",
    });

    const [insttAuspcData, setInsttAuspcData] = useState({
        insttAuspcNo: "",
        sn: 0,
        prdctActNo: "",
        prdctSn: 0,
        mberNo: "",
        insttAuspcNm: "",
        roleCode: "",
        partcptnBgnde: "",
        partcptnEndde: "",
        insttAuspcIntrcn: "",
        reprsntFileNo: "",
        adres: "",
        telno: "",
        hmpg: "",
    });

    //대표 작품 파일 이미지
    const handleReprsntPrdctFileNo = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!validateImageFile(file)) {
            e.target.value = "";
            return;
        }

        setReprsntPrdctFileNo(file);
    };

    //관련 기관 / 주최 파일 이미지
    const handleReprsntFileNo = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!validateImageFile(file)) {
            e.target.value = "";
            return;
        }

        setReprsntFileNo(file);
    };

    //이미지 유형별 파일 이미지
    const handleFileNo = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!validateImageFile(file)) {
            e.target.value = "";
            return;
        }

        setFileNo(file);
    };

    useEffect(() => {
        const retrieveActTy = async () => {
            try {
                const [responseActTyList, responseRoleList, responseImageTyList] = await Promise.all([
                    api.get("/codes/" + actTy.current),
                    api.get("/codes/" + role.current),
                    api.get("/codes/" + imageTy.current),
                ]);

                setActTyList(responseActTyList.data?.data ?? []);
                setRoleList(responseRoleList.data?.data ?? []);
                setImageTyList(responseImageTyList.data?.data ?? []);
            } catch (error) {
                console.error(error.response?.data?.message ?? "활동유형 조회 싪패");

                setActTyList([]);
                setRoleList([]);
                setImageTyList([]);
            }
        };

        retrieveActTy();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInsttAuspcChange = (e) => {
        const {name, value} = e.target;

        setInsttAuspcData((prev) => ({
            ...prev,
            [name]: value
        }));

        console.log(value);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen className="artist-activity-modal">
                <Modal.Header className="activity-modal-header">
                    <div>
                        <Button type="button" className="activity-back-btn" variant="link" aria-label="뒤로가기" onClick={onHide}>
                            <Bs.BsChevronLeft/>
                        </Button>
                        <div className="activity-header-title">
                            <Modal.Title>작품 활동 등록</Modal.Title>
                            <p>작가의 전시, 수상, 레지던시 등 주요 활동을 등록해 주세요.</p>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="activity-modal-body">
                    <div className="activity-container">
                        { /* 기본 정보 */ }
                        <section>
                            <SectionTitle icon="bi-brush" number={`1. `} title="기본 정보"/>
                            <Row>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>활동 유형<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Select name="actTyCode" value={formData.actTyCode} onChange={handleChange}>
                                                <option value="">
                                                    선택하세요.
                                                </option>
                                                {actTyList.map((actTy) => (
                                                    <option key={actTy.code} value={actTy.code}>
                                                        {actTy.codeNm}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <p className="form-hint">ex. 개인전, 단체전, 수상, 레지던시, 참여</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>활동명(제목)<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Control type="text" id="actNm" name="actNm" value={formData.actNm} onChange={handleChange} placeholder="활동명을 입력해 주세요." required></Form.Control>
                                            <p className="form-hint">ex. 빛이 머무는 곳</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>기간<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <div className="activity-date-row">
                                                <Form.Control type="date" required />
                                                <span className="date-separator">~</span>
                                                <Form.Control type="date" required />
                                                <Form.Check type="checkbox" id="no-end-date" label="종료일 미정"/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>장소<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Control type="text" id="actPlace" name="actPlace" value={formData.actPlace} onChange={handleChange} placeholder="활동 장소" required />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>대표 작품 이미지</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <ImageUploadBox
                                                inputId="reprsntPrdctFileNo"
                                                icon="bi-camera"
                                                title="대표작품이미지"
                                                desc={["JPG, PNG (권장 사이즈: 800x800px 이상)", "최대 5MB"]}
                                                image={reprsntPrdctFileNo}
                                                existingFileUrl={reprsntPrdctImageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                                                fileNo={reprsntPrdctImageFile?.fileNo ?? ""} //파일번호
                                                onChange={handleReprsntPrdctFileNo}
                                            />
                                            <p className="form-hint">* 대표 작품 이미지는 전시를 소개하는 썸네일로 사용됩니다.</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </section>
                        { /* 활동 소개 */ }
                        <section>
                            <SectionTitle icon="bi-file-text" number={`2. `} title="활동 소개"/>
                            <div className="intro-wrap">
                                <Form.Control
                                    as="textarea"
                                    maxLength={300}
                                    rows={4}
                                    id="actIntrcn"
                                    name="actIntrcn"
                                    value={formData.actIntrcn}
                                    onChange={handleChange}
                                />
                                <span className="char-count">
                                    {
                                        formData.actIntrcn.length
                                    }{" "}/ 300
                                </span>
                            </div>
                        </section>
                        { /* 관련기관 / 주최 */ }
                        <section>
                            <SectionTitle icon="bi-building" number={`3. `} title="관련기관 / 주최"/>
                            <Row>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>관련기관 / 주최명<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Control type="text" id="insttAuspcNm" name="insttAuspcNm" value={insttAuspcData.insttAuspcNm} placeholder="관련 기관명을 입력해 주세요." onChange={handleInsttAuspcChange}/>
                                        </Col>
                                        <Col md={1}>
                                            <Form.Label>역활<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Select name="roleCode" value={insttAuspcData.roleCode} onChange={handleInsttAuspcChange}>
                                                <option value="">
                                                    선택하세요.
                                                </option>
                                                {roleList.map((role) => (
                                                    <option key={role.code} value={role.code}>
                                                        {role.codeNm}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>참여 기간<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <div className="activity-date-row">
                                                <Form.Control type="date" required />
                                                <span className="date-separator">~</span>
                                                <Form.Control type="date" required />
                                                <Form.Check type="checkbox" id="no-end-date" label="종료일 미정"/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>소개</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <div className="intro-wrap">
                                                <Form.Control
                                                    as="textarea"
                                                    maxLength={200}
                                                    rows={3}
                                                    id="insttAuspcIntrcn"
                                                    name="insttAuspcIntrcn"
                                                    value={insttAuspcData.insttAuspcIntrcn}
                                                    onChange={handleInsttAuspcChange}
                                                />
                                                <span className="char-count">
                                                    {
                                                        insttAuspcData.insttAuspcIntrcn.length
                                                    } {" "} / 200
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>이미지</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <ImageUploadBox
                                                inputId="reprsntFileNo"
                                                icon="bi-camera"
                                                title="이미지"
                                                desc={["JPG, PNG (권장 사이즈: 800x800px 이상)", "최대 5MB"]}
                                                image={reprsntFileNo}
                                                existingFileUrl={reprsntImageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                                                fileNo={reprsntImageFile?.fileNo ?? ""} //파일번호
                                                onChange={handleReprsntFileNo}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>주소</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <div className="address-input-group">
                                                <Form.Control type="text" id="adres" name="adres" value={insttAuspcData.adres} placeholder="주소" onChange={handleInsttAuspcChange}/>
                                                <Button  type="button" variant="light" className="address-icon-btn" aria-label="주소 검색">
                                                    <FiMapPin />
                                                </Button>

                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>'
                                            <Form.Label>연락처</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Form.Control type="text" id="telno" name="telno" value={insttAuspcData.telno} placeholder="연락처" onChange={handleInsttAuspcChange}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>홈페이지</Form.Label>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control type="text" id="hmpg" name="hmpg" value={insttAuspcData.hmpg} placeholder="홈페이지" onChange={handleInsttAuspcChange}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Button type="button" variant="outline-primary" className="add-button"><i className="bi bi-plus-lg me-2">관련 기간 / 주최 추가</i></Button>
                                </Col>
                            </Row>
                        </section>
                        { /* 등록된 관련 기관 / 주최 */ }
                        <section>
                            <SectionTitle icon="bi-buildings" number={`4. `} title="등록된 관련 기관 / 주최" />
                        </section>
                        { /* 이미지 (선택) */ }
                        <section>
                            <SectionTitle icon="bi-images" number={`5. `} title="이미지 (선택)" />
                            <p className="form-hint">활동 유형에 맞는 이미지를 등록해 주세요. (최대 10장까지 등록 가능)</p>
                            <Row>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={2}>
                                            <Form.Label>이미지 유형<em> *</em></Form.Label>
                                        </Col>
                                        <Col md={10}>
                                            <div className="activity-image-categories">
                                                {imageTyList.map((imageTy) => (
                                                    <button key={imageTy.code} type="button" className={
                                                        selectedImageTy === imageTy.code
                                                            ? "category active"
                                                            : "category"
                                                        }
                                                        onClick={() =>
                                                            setSelectedImageTy(imageTy.code)
                                                        }>
                                                        {imageTy.codeNm}

                                                        {selectedImageTy === imageTy.code && (
                                                            <Bs.BsCheckCircleFill
                                                                className="ms-2"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                                
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <ImageUploadBox
                                                inputId="fileNo"
                                                icon="bi-camera"
                                                title="이미지"
                                                desc={["JPG, PNG (권장 사이즈: 800x800px 이상)", "최대 5MB"]}
                                                image={fileNo}
                                                existingFileUrl={imageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                                                fileNo={imageFile?.fileNo ?? ""} //파일번호
                                                onChange={handleFileNo}
                                            />
                                        </Col>
                                    </Row>
                                    
                                </Col>
                            </Row>
                        </section>
                        { /* 공개 설정 */ }
                        <section>
                            <SectionTitle icon="bi-eye" number={`6. `} title="공개 설정"/>
                            <Row>
                                <Col xs={12}>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Label>공개 여부</Form.Label>
                                        </Col>
                                        <Col md={9}>
                                            <Row>
                                                <Col>
                                                    <Form.Check type="radio" id="public-y" label="공개" value="Y" checked={formData.othbcAt === "Y"} onChange={handleChange} />
                                                    <p className="form-hint radio-hint">프로필과 작품 활동 내역에 공개됩니다.</p>
                                                    <Form.Check type="radio" id="public-y" label="비공개" value="N" checked={formData.othbcAt === "N"} onChange={handleChange} />
                                                    <p className="form-hint radio-hint">나에게만 보이며 공개되지 않습니다.</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </section>
                        <div className="activity-bottom-buttons">
                            <Button type="button" variant="outline-primary" onClick={onHide}>취소</Button>
                            <Button type="button" variant="primary" >등록하기</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}