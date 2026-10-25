import { Button, Form } from "react-bootstrap";
import "./ArtistApplForm.css";
// import SectionTitle from "../common/SectionTitle";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
// import ImageUploadBox from "../common/ImageUploadBox";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import ArtistBasicInfoSection from "./common/ArtistBasicInfoSection";
import ArtistProfileImageSection from "./common/ArtistProfileImageSection";
import ArtistCareerSection from "./common/ArtistCareerSection";
import ArtistLinkSection from "./common/ArtistLinkSection";
import ArtistReprsntSection from "./common/ArtistReprsntSection";
import {validateImageFile} from "../../utils/fileUtils";

//bi-person 등은 bootstrap-icons/font/bootstrap-icons.css 에서 지원
//xs={12}: xs: Extra Small (모바일 크기부터 적용된다는 의미), 12: 한 행(Row) 전체 12칸을 모두 사용한다는 뜻
export default function ArtistApplForm() {
    const navigate = useNavigate();
    const [activityTypeList, setActivityTypeList] = useState([]);
    const [careerSeList, setCareerSeList] = useState([]);
    const [careers, setCareers] = useState([
        {
            sn: 1,
            careerYear: "",
            careerSeCode: "",
            careerCn: ""
        }
    ]);
    const [sites, setSites] = useState([
        {
            sn: 1,
            url: "",
            siteCode: ""
        }
    ]);
    const [siteList, setSiteList] = useState([]);

    const [writrImageFile, setWritrImageFile] = useState(null); // 기존 작가 프로필 파일 DTO
    const [writrImageNo, setWritrImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [writrFileNo, setWritrFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    const [reprsntPrdctImageFile, setReprsntPrdctImageFile] = useState(null); // 기존 대표작품 파일 DTO
    const [reprsntPrdctImageNo, setReprsntPrdctImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [reprsntPrdctFileNo, setReprsntPrdctFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    const actCode = useRef("ACT");
    const careerSeCode = useRef("CAREER_SE");
    const urlCode = useRef("SITE");
    const [formData, setFormData] = useState({
        nm: "",
        actCode: "",
        actArea: "",
        telno: "",
        selfIntrcn: "",
        prdctNm: "",
        mnfctYear: "",
        prdctDc: ""
    });
    const [writrMberNo, setWritrMberNo] = useState("");
    const [gnrlMberNo, setGnrlMberNo] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    /* mount 할때마다 호출 */
    useEffect(() => {
        const fetchActivityTypeList = async () => {
            try {
                const [actResponse, careerSeResponse, siteResponse, writrResponse] = await Promise.all([
                    api.get("/codes/" + actCode.current),
                    api.get("/codes/" + careerSeCode.current),
                    api.get("/codes/" + urlCode.current),
                    api.get("/artist/get")]);
                
                setActivityTypeList(actResponse.data?.data ?? []); //활동유형
                setCareerSeList(careerSeResponse.data?.data ?? []); //경력구분
                setSiteList(siteResponse.data?.data ?? []); //URL구분

                const responseData = writrResponse.data.data;
                if(responseData) {
                    const writrInfo = responseData.writrInfoOutDto ?? {};

                    // null/undefined가 Form.Control value나 .length에 들어가지 않도록 문자열로 보정한다.
                    setFormData({
                        nm: writrInfo.nm ?? "",
                        actCode: writrInfo.actCode ?? "",
                        actArea: writrInfo.actArea ?? "",
                        telno: writrInfo.telno ?? "",
                        selfIntrcn: writrInfo.selfIntrcn ?? "",
                        prdctNm: writrInfo.prdctNm ?? "",
                        mnfctYear: writrInfo.mnfctYear ?? "",
                        prdctDc: writrInfo.prdctDc ?? ""
                    });
                
                    const careerList = responseData.writrCareerOutDtoList ?? [];
                    setCareers(careerList.length > 0
                            ? careerList
                            : [{sn: 1, careerYear: "", careerSeCode: "", careerCn: ""}]);

                    const urlList = responseData.writrUrlOutDtoList ?? [];
                        setSites(urlList.length > 0
                            ? urlList
                            : [{sn: 1, url: "", siteCode: ""}]);
                    
                    // setSites(responseData?.writrUrlOutDtoList ?? [{sn: 1, url: "",siteCode: ""}]); //URL정보
                    // 기존 파일은 DTO 전체를 보관한다. 새 파일(File) state와 섞지 않는다.
                    setWritrImageFile(responseData.writrFileDtlsOutDto ?? null);
                    setReprsntPrdctImageFile(responseData.reprsntPrdctFileDtlsOutDto ?? null);

                    // 재조회 직후에는 사용자가 새로 선택한 파일이 없다.
                    setWritrFileNo(null);
                    setReprsntPrdctFileNo(null);

                    setWritrMberNo(responseData?.writrInfoOutDto.mberNo ?? ""); //작가회원번호
                    setGnrlMberNo(responseData?.writrInfoOutDto.gnrlMberNo ?? ""); //작가의 일반회원번호

                    setWritrImageNo(responseData?.writrFileDtlsOutDto.fileUrl ?? ""); //예) api/file/파일번호/순서
                    setReprsntPrdctImageNo(responseData?.reprsntPrdctFileDtlsOutDto.fileUrl ?? ""); //예) api/file/파일번호/순서

                    //심사 상태에 따라 화면 수정 불가 처리하도록 처리함.
                    const jdgmnSttusCode = writrInfo.jdgmnSttusCode;
                    if(jdgmnSttusCode === "PEND" || jdgmnSttusCode === "RCHG" ) {
                        setIsDisabled(false);
                    } else {
                        setIsDisabled(true);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivityTypeList();
    }, []);

    //작가 프로필 파일 
    const handleWritrFileNo = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!validateImageFile(file)) {
            e.target.value = "";
            return;
        }
        
        setWritrFileNo(file);
    };

    //대표 작품 파일 
    const handleReprsntPrdctFileNo = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(!validateImageFile(file)) {
            e.target.value = "";
            return;
        }

        setReprsntPrdctFileNo(file);
    };

    //작가 정보 변경 사항 반영
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "mnfctYear" ? value.substring(0, 4) : value,
        }));
    };

    //작가 URL 변경 반영
    const changeSite = (sn, field, value) => {
        setSites((prev) => prev.map((site) => site.sn === sn ? {
            ...site,
            [field]: value
        } : site))
    };

    //작가 URL 삭제 반영
    const removeSite = (sn) => {
        if(sites.length === 1) {
            alert("웹사이트/SNS 입력란은 최소 1개 이상 필요합니다.");
            return;
        }
        setSites((prev) => {
            const filteredSites = prev.filter((site) => site.sn !== sn);
            return filteredSites.map((site, index) => ({
                ...site,
                sn: index + 1
            }));
        });
    };

    //작가 URL 추가
    const addSite = () => {
        setSites((prev) => {
            const nextSn = prev.length === 0 ? 1 : Math.max(...prev.map((site) => site.sn)) + 1;

            return [
                ...prev,
                {
                    sn: nextSn,
                    url: "",
                    siteCode: ""
                }
            ]
        });
    };

    //작가 경력 변경 반영
    const changeCareer = (sn, field, value) => {
        setCareers((prev) => prev.map((career) => career.sn === sn ? {
            ...career,
            [field]:  value
        } : career))
    };

    //작가 경력 삭제 반영
    const removeCareer = (sn) => {
        if(careers.length === 1) {
            alert("경력 입력란은 최소 1개 이상 필요합니다.");
            return;
        }

        setCareers((prev) => {
            const filteredCareers = prev.filter((career) => career.sn !== sn);
            return filteredCareers.map((career, index) => ({
                ...career,
                sn: index + 1,
            }));
        });
    };

    ////작가 경력 추가 반영
    const addCareer = () => {
        setCareers((prev) => {
            const nextSn = prev.length === 0 ? 1 : Math.max(...prev.map((career) => career.sn)) + 1;

            return [
                ...prev,
                {
                    sn: nextSn,
                    careerYear: "",
                    careerSeCode: "",
                    careerCn: ""
                }
            ]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //신규 혹은 수정 대상 여부 판단
        //writrMberNo 가 없을 때 신규, writrMberNo 가 있을 때 수정
        const isUpdate = Boolean(writrMberNo);

        // console.log("writrImageFile.writrFileNo: ",writrImageFile.writrFileNo);

        const writrInfoBindingDto = {
            writrInfoInDto: {
                ...formData,
                mberNo: writrMberNo,
                gnrlMberNo: gnrlMberNo,
                writrFileNo: writrImageFile?.fileNo ?? "",
                reprsntPrdctFileNo: reprsntPrdctImageFile?.fileNo ?? ""
            },
            writrCareerInDtoList: careers,
            writrUrlInDtoList: sites
        };

        if(!isUpdate && !reprsntPrdctFileNo) {
            alert("대표 작품 등록하지 않았습니다. 확인히세요.");
            return;
        }

        if(!isUpdate && !writrFileNo) {
            alert("작가 프로필 사진을 등록하지 않았습니다. 확인하세요.");
        }

        // 수정 화면에서도 기존 파일 자체가 없는 경우는 파일 입력을 요구한다.
        if (isUpdate && !reprsntPrdctImageFile && !reprsntPrdctFileNo) {
            alert("대표 작품을 등록하지 않았습니다. 확인하세요.");
            return;
        }

        if (isUpdate && !writrImageFile && !writrFileNo) {
            alert("작가 프로필 사진을 등록하지 않았습니다. 확인하세요.");
            return;
        }

        const requestData = new FormData();

        /**
         * 작가 등록 정보
         * 기본 정보, 경력 정보, URL 정보
         */
        requestData.append("writrInfoBindingDto",
            new Blob(
                [JSON.stringify(writrInfoBindingDto)],
                {
                    type: "application/json",
                }
            )
        );

        /*
         * 새 파일을 선택한 경우에만 multipart에 첨부한다.
         * 새 파일이 없으면 백엔드는 기존 파일을 유지한다.
         */
        if (reprsntPrdctFileNo) {
            requestData.append("reprsntPrdctFile", reprsntPrdctFileNo);
        }

        if (writrFileNo) {
            requestData.append("writrFile", writrFileNo);
        }

        try {
            let response;
            if(isUpdate) {
                response = await api.put("/artist/change", requestData);
            } else {
                response = await api.post("/artist/regist", requestData);
            }
            
            alert(response.data.message);
            navigate("/");

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ?? "작가 등록 신청 중 오류가 발생했습니다.");
        }
    };

    return (
        <Form noValidate className="application-form" onSubmit={handleSubmit}>
            <fieldset disabled={isDisabled}>
                <h1 className="h2 fw-bold mb-2">{writrMberNo ? "작가 정보 수정" : "작가 등록 신청"}</h1>
                <p className="text-secondary mb-0">작가 정보를 입력하시면 관리자 검토 후 승인됩니다.</p>
                <hr className="my-4 my-lg-5"></hr>
                <ArtistBasicInfoSection formData={formData} handleChange={handleChange} activityTypeList={activityTypeList} num={1}/>
                <ArtistProfileImageSection writrImageNo={writrImageNo} writrImageFile={writrImageFile} handleWritrFileNo={handleWritrFileNo} writrFileNo={writrFileNo} num={2}/>
                <ArtistReprsntSection reprsntPrdctFileNo={reprsntPrdctFileNo} reprsntPrdctImageNo={reprsntPrdctImageNo} reprsntPrdctImageFile={reprsntPrdctImageFile} handleReprsntPrdctFileNo={handleReprsntPrdctFileNo} formData={formData} handleChange={handleChange} num={3}/>
                <ArtistCareerSection careers={careers} careerSeList={careerSeList} removeCareer={removeCareer} changeCareer={changeCareer} addCareer={addCareer} num={4}/>
                <ArtistLinkSection sites={sites} siteList={siteList} changeSite={changeSite} removeSite={removeSite} addSite={addSite} num={5}/>

                {/* <section className="form-section">
                    <SectionTitle icon="bi-person" number="1." title="기본 정보"/>
                    <Row className="g-4">
                        <Col xs={12}>
                            <Row>
                                <Col md={3}>
                                    <Form.Label htmlFor="nm">이름(예술가명)</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <Form.Control type="text" id="nm" name="nm" value={formData.nm} onChange={handleChange} placeholder="예) Kim Hayeon, 하연, Hayeon Kim 등"></Form.Control>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Form.Group>
                                    <Col md={3}>
                                        <Form.Label>직업/활동명</Form.Label>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Select name="actCode" value={formData.actCode} onChange={handleChange}>
                                            <option value="">
                                                작업/활동명을 선택해 주세요.
                                            </option>
                                            {activityTypeList.map((item) => {
                                                return (
                                                        <option key={item.code} value={item.code}>
                                                            {item.codeNm}
                                                        </option>
                                                )
                                            })}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col md={3}>
                                    <Form.Label htmlFor="actArea">활동 지역</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <Form.Control type="text" id="actArea" name="actArea" value={formData.actArea} onChange={handleChange} placeholder="예) 서울, 부산, 경기도 성남시 등"></Form.Control>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col md={3}>
                                    <Form.Label htmlFor="telno">연락처</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <Form.Control type="text" id="telno" name="telno" value={formData.telno} onChange={handleChange} placeholder="예) 010-1234-5678"></Form.Control>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col md={3}>
                                    <Form.Label htmlFor="selfIntrcn">자기 소개</Form.Label>
                                </Col>
                                <Col md={9}>
                                    <div className="textarea-wrapper">
                                        <Form.Control as="textarea" rows={5} maxLength={500} id="selfIntrcn" name="selfIntrcn" value={formData.selfIntrcn} onChange={handleChange} placeholder="자신을 대표할 수 있는 한 줄 소개를 입력해 주세요. (최대 500자)"></Form.Control>
                                        <div className="text-count">
                                            {
                                                formData.selfIntrcn.length
                                            }{" "}
                                            / 500
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </section> */}
                {/* <section className="form-section">
                    <SectionTitle icon="bi-camera" number="2." title="프로필 사진 업로드"/>
                    <Row className="g-4">
                        <Col md={4}>
                            <ImageUploadBox
                                inputId="writrFileNo"
                                icon="bi-camera"
                                title="프로필 사진 업로드"
                                desc={["JPG, PNG (권장 사이즈: 800x800px 이상)", "최대 5MB"]}
                                image={writrFileNo} //사용자가 선택한 파일
                                existingFileUrl={writrImageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                                fileNo={writrImageFile?.fileNo ?? ""} //파일번호
                                onChange={handleWritrFileNo}
                            />
                        </Col>
                        <Col md={8}>
                            <div className="info-box">
                                <div className="guide-title">
                                    <span>안내</span>
                                </div>
                                <ul>
                                    <li>얼굴이 잘 보이는 사진을 등록해 주세요.</li>
                                    <li>프로필 사진은 작가 페이지에 대표 이미지로 사용됩니다.</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </section> */}
                {/* <section className="form-section">
                    <SectionTitle icon="bi-image" number="3." title="대표 작품"/>
                    <Row className="g-4">
                        <Col md={4}>
                            <ImageUploadBox
                                inputId="reprsntPrdctFileNo"
                                icon="bi-image"
                                title="대표 작품 이미지 업로드"
                                desc={["JPG, PNG (최대 5MB)", "최근 3년 이내 작품 권장"]}
                                image={reprsntPrdctFileNo} //사용자가 선택한 파일
                                existingFileUrl={reprsntPrdctImageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                                fileNo={reprsntPrdctImageFile?.fileNo ?? ""} //파일번호
                                // image={reprsntPrdctImageNo}
                                // fileNo={reprsntPrdctFileNo}
                                onChange={handleReprsntPrdctFileNo}
                            />
                        </Col>
                        <Col md={8}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Label htmlFor="prdctNm">작품명</Form.Label>
                                    <Form.Control type="text" id="prdctNm" name="prdctNm" value={formData.prdctNm} onChange={handleChange} placeholder="작품명을 입력하세요."/>
                                </Col>
                                <Col md={6}>
                                    <Form.Label htmlFor="mnfctYear">제작 년도</Form.Label>
                                    <div className="w-100">
                                        <DatePicker
                                            selected={
                                                formData.mnfctYear ? new Date(Number(formData.mnfctYear), 0, 1) : null
                                            }
                                            onChange={(date) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    mnfctYear: date ? String(date.getFullYear()) : "",
                                                }))
                                            }}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            placeholderText="제작 년도 선택"
                                            className="form-control"
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <Form.Label htmlFor="prdctDc">작품 설명</Form.Label>
                                    <div className="textarea-wrapper">
                                        <Form.Control as="textarea" row={4} maxLength={500} id="prdctDc" name="prdctDc" value={formData.prdctDc} onChange={handleChange} placeholder="작품에 대한 간단한 설명을 입력해 주세요. (최대 500자)"/>
                                        <div className="text-count">
                                            {
                                                formData.prdctDc.length
                                            }{" "}
                                            / 500
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </section> */}
                {/* <section className="form-section">
                    <div className="section-header">
                        <SectionTitle icon="bi-briefcase" number="4." title="주요 경력"/>
                        <Button type="button" variant="outline-primary" size="sm" className="add-button" onClick={addCareer}><i className="bi bi-plus-lg me-2"/>경력 추가</Button>
                    </div>
                    <div className="career-table-wrapper">
                        <table className="career-table mb-2">
                            <thead>
                                <tr>
                                    <th style={{width: "22%"}}>연도</th>
                                    <th style={{width: "22%"}}>구분</th>
                                    <th>경력 내용</th>
                                    <th style={{width: "52px"}} className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {careers.map((career) => (
                                    <tr key={career.sn}>
                                        <td>
                                            <DatePicker
                                                selected={
                                                    career.careerYear ? new Date(Number(career.careerYear), 0, 1) : null
                                                }
                                                onChange={(date) => {
                                                    changeCareer(career.sn, "careerYear", date ? String(date.getFullYear()) : "");
                                                }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                placeholderText="연도 선택"
                                                className="form-control"
                                                maxDate={new Date()}
                                            />
                                        </td>
                                        <td>
                                            <Form.Select value={career.careerSeCode} onChange={(e) => changeCareer(career.sn, "careerSeCode", e.target.value)}>
                                                <option value="">
                                                    선택하세요.
                                                </option>
                                                {careerSeList.map((item) => {
                                                    return (
                                                        <option key={item.code} value={item.code}>
                                                            {item.codeNm}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control value={career.careerCn} onChange={(e) => changeCareer(career.sn, "careerCn", e.target.value)} placeholder="예) 개인전 '빛의 기록' (갤러리 A)"/>
                                        </td>
                                        <td className="text-center align-middle">
                                            <button type="button" className="delete-icon-button" aria-label="경력 삭제" onClick={() => removeCareer(career.sn)}>
                                                <i className="bi bi-x-lg"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section> */}
                {/* <section>
                    <div className="section-header">
                        <SectionTitle icon="bi-link-45deg" number="5." title="웹사이트/SNS"/>
                        <Button type="button" variant="outline-primary" size="sm" className="add-button" onClick={addSite}><i className="bi bi-plus-lg me-2"/>링크 추가</Button>
                    </div>
                    <div className="career-table-wrapper">
                        <table className="career-table mb-2">
                            <thead>
                                <tr>
                                    <th style={{width: "40%"}}>구분</th>
                                    <th>주소(URL)</th>
                                    <th style={{width: "52px"}} className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sites.map((site) => (
                                    <tr key={site.sn}>
                                        <td>
                                            <Form.Select value={site.siteCode} onChange={(e) => changeSite(site.sn, "siteCode", e.target.value)}>
                                                <option value="">
                                                    선택하세요.
                                                </option>
                                                {siteList.map((item) => {
                                                    return (
                                                        <option key={item.code} value={item.code}>
                                                            {item.codeNm}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control value={site.url} onChange={(e) => changeSite(site.sn, "url", e.target.value)} placeholder="http://naver.com"/>
                                        </td>
                                        <td className="text-center align-middle">
                                            <button type="button" className="delete-icon-button" aria-label="웹사이트/SNS 삭제" onClick={() => removeSite(site.sn)}>
                                                <i className="bi bi-x-lg"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section> */}

                <hr className="my-4 my-lg-5"></hr>
                <div className="application-guide">
                    <div className="guide-title">
                        <i className="bi bi-info-circle-fill"></i>
                        <span>신청 안내</span>
                    </div>
                    <ul>
                        <li>입력하신 정보는 관리자 검토 후 승인됩니다.</li>
                        <li>승인 결과는 이메일로 안내드리며, 마이페이지에서 신청 상태를 확인하실 수 있습니다.</li>
                        <li>승인 후 프로필을 추가로 작성하여 작품 활동을 시작할 수 있습니다.</li>
                    </ul>
                </div>
                <Button type="button" variant="outline-secondary" className="temp-save-button w-100 mt-4" size="lg">임시 저장</Button>
                <Button type="submit" className="submit-button w-100 mt-4" size="lg">{writrMberNo ? "신청정보 수정": "신청하기"}</Button>
            </fieldset>
        </Form>
    );
}