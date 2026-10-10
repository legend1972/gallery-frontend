import { Col, Row } from "react-bootstrap";
import SectionTitle from "../../common/SectionTitle";
import ImageUploadBox from "../../common/ImageUploadBox";

export default function ArtistProfileImageSection({writrImageNo, writrImageFile, handleWritrFileNo, writrFileNo}) {
    return (
            <section className="form-section">
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
            </section>
    );
}