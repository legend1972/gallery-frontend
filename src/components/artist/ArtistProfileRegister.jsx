import { Button, Container } from "react-bootstrap";
import "./ArtistProfileRegister.css" ;
import "./ArtistApplForm.css";

import ProfileStep from "./common/ProfileStep";
import { FiInfo } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import ArtistBasicInfoSection from "./common/ArtistBasicInfoSection";
import ArtistProfileImageSection from "./common/ArtistProfileImageSection";
import ArtistCareerSection from "./common/ArtistCareerSection";
import ArtistLinkSection from "./common/ArtistLinkSection";
import {validateImageFile} from "../../utils/fileUtils";
// import ArtistReprsntSection from "./common/ArtistReprsntSection";

export default function ArtistProfileRegister({onNext}) {
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

    // const [reprsntPrdctImageFile, setReprsntPrdctImageFile] = useState(null); // 기존 대표작품 파일 DTO
    // const [reprsntPrdctImageNo, setReprsntPrdctImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    // const [reprsntPrdctFileNo, setReprsntPrdctFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

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
    // const [writrMberNo, setWritrMberNo] = useState("");
    // const [gnrlMberNo, setGnrlMberNo] = useState("");

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
                    // setReprsntPrdctImageFile(responseData.reprsntPrdctFileDtlsOutDto ?? null);

                    // 재조회 직후에는 사용자가 새로 선택한 파일이 없다.
                    setWritrFileNo(null);
                    // setReprsntPrdctFileNo(null);

                    // setWritrMberNo(responseData?.writrInfoOutDto.mberNo ?? ""); //작가회원번호
                    // setGnrlMberNo(responseData?.writrInfoOutDto.gnrlMberNo ?? ""); //작가의 일반회원번호

                    setWritrImageNo(responseData?.writrFileDtlsOutDto.fileUrl ?? ""); //예) api/file/파일번호/순서
                    // setReprsntPrdctImageNo(responseData?.reprsntPrdctFileDtlsOutDto.fileUrl ?? ""); //예) api/file/파일번호/순서
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
    // const handleReprsntPrdctFileNo = (e) => {
    //     const file = e.target.files?.[0];
    //     if(!file) return;

    //     if(!validateImageFile(file)) {
    //         e.target.value = "";
    //         return;
    //     }

    //     setReprsntPrdctFileNo(file);
    // };

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

    const handleNext = () => {
        onNext();
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

    return (
        <div>
            <Container fluid className="profile-register">
                {/* <div className="page-header">
                    <div>
                        <h1>프로필 등록</h1>
                        <p>작가 등록 신청 정보를 바탕으로 프로필을 완성해 주세요.</p>
                    </div>
                </div>
                <ProfileStep num={0}/> */}
                <div className="auto-guide">
                    <FiInfo className="auto-guide-icon"/>
                    <div>
                        <strong>
                            작가 등록 신청 시 입력한 정보가 자동으로 반영되었습니다.
                        </strong>
                        <p>
                            아래 정보를 확인하고, 필요에 따라 수정하여 프로필을 완성해 주세요.
                        </p>
                    </div>
                </div>

                <ArtistBasicInfoSection formData={formData} handleChange={handleChange} activityTypeList={activityTypeList} num={1}/>
                <ArtistProfileImageSection writrImageNo={writrImageNo} writrImageFile={writrImageFile} handleWritrFileNo={handleWritrFileNo} writrFileNo={writrFileNo} num={2}/>
                <ArtistCareerSection careers={careers} careerSeList={careerSeList} removeCareer={removeCareer} changeCareer={changeCareer} addCareer={addCareer} num={3}/>
                <ArtistLinkSection sites={sites} siteList={siteList} changeSite={changeSite} removeSite={removeSite} addSite={addSite}  num={4}/>

                <div className="bottom-button-area">
                    <Button variant="outline-secondary" className="cancel-button">
                        취소
                    </Button>

                    <Button className="next-button" onClick={handleNext}>
                        다음
                    </Button>
                </div>
            </Container>
        </div>
    );
};