import { Button, Container } from "react-bootstrap";
import "./ArtistApplForm.css";
import { useEffect, useState } from "react";
import api from "../../api/api";
import "react-datepicker/dist/react-datepicker.css";
import ArtistReprsntSection from "./common/ArtistReprsntSection";
import SectionTitle from "../common/SectionTitle";
import { useNavigate } from "react-router-dom";
import {validateImageFile} from "../../utils/fileUtils";

export default function ArtistProfileDescription({onPrev, onNext}) {
    const [reprsntPrdctImageFile, setReprsntPrdctImageFile] = useState(null); // 기존 대표작품 파일 DTO
    const [reprsntPrdctImageNo, setReprsntPrdctImageNo] = useState(null); //서버에 이미 저장된 기존 파일 정보
    const [reprsntPrdctFileNo, setReprsntPrdctFileNo] = useState(null); //사용자가 이번에 새로 선택한 File 객체

    const navigate = useNavigate();

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

    /* mount 할때마다 호출 */
    useEffect(() => {
        const fetchActivityTypeList = async () => {
            try {
                const writrResponse = await api.get("/artist/get");
                
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
                
                    setReprsntPrdctImageFile(responseData.reprsntPrdctFileDtlsOutDto ?? null);

                    // 재조회 직후에는 사용자가 새로 선택한 파일이 없다.
                    setReprsntPrdctFileNo(null);
                    setReprsntPrdctImageNo(responseData?.reprsntPrdctFileDtlsOutDto.fileUrl ?? ""); //예) api/file/파일번호/순서
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivityTypeList();
    }, []);

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

    const addPrdctAct = () => {
        navigate("/artist/prdct/detail");
    };

    const handleNext = () => {
        onNext();
    };

    const handlePrev = () => {
        onPrev();
    };

    return (
        <div>
            <Container>
                <h1 className="h2 fw-bold mb-2">작품 설명</h1>
                <p className="text-secondary mb-0">작가님의 작가 세계와 작업 방법을 소개해주세요.</p>
                <ArtistReprsntSection reprsntPrdctFileNo={reprsntPrdctFileNo} reprsntPrdctImageNo={reprsntPrdctImageNo} reprsntPrdctImageFile={reprsntPrdctImageFile} handleReprsntPrdctFileNo={handleReprsntPrdctFileNo} formData={formData} handleChange={handleChange} num={1}/>

                <section className="form-section">
                    <div className="section-header">
                        <div>
                            <SectionTitle icon="bi-palette" number="2. " title="작품 활동(선택)" />
                            <p className="text-secondary mb-0">전시, 수상, 레지던스 등 주요 활동을 입력해주세요.</p>
                        </div>
                        <Button type="button" variant="outline-primary" size="sm" className="add-button" onClick={addPrdctAct}><i className="bi bi-plus-lg me-2"/>활동 추가</Button>
                    </div>
                </section>
                <div className="bottom-button-area">
                    <Button variant="outline-secondary" className="cancel-button" onClick={handlePrev}>
                        이전
                    </Button>

                    <Button className="next-button" onClick={handleNext}>
                        다음
                    </Button>
                </div>
            </Container>
        </div>
    );
}