import { Col, Form, Row } from "react-bootstrap";
import SectionTitle from "../../common/SectionTitle";

export default function ArtistBasicInfoSection({formData, handleChange, activityTypeList, num}) {
    return (
            <section className="form-section">
                    <SectionTitle icon="bi-person" number={`${num}. `} title="기본 정보"/>
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
                </section>
    );
}