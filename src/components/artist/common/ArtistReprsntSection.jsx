import { Col, Form, Row } from "react-bootstrap";
import SectionTitle from "../../common/SectionTitle";
import ImageUploadBox from "../../common/ImageUploadBox";
import DatePicker from "react-datepicker";

export default function ArtistReprsntSection({reprsntPrdctFileNo, reprsntPrdctImageNo, reprsntPrdctImageFile, handleReprsntPrdctFileNo, formData, handleChange}) {
    return (
            <section className="form-section">
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
            </section>
    );
}