import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import "./ArtistProfileComplete.css";
import { FiCheck, FiLink2, FiMapPin } from "react-icons/fi";

import writerImage from "../../assets/atrium-gallery.png";
import prdctImage1 from "../../assets/signup-gallery.png";
import prdctImage2 from "../../assets/signup-gallery.png";
import { useNavigate } from "react-router-dom";

export default function ArtistProfileComplete() {
    const navigate = useNavigate();

    /**
     * 홈으로 이동
     */
    const handleHome = () => {
        navigate("/");
    };

    return (
        <div>
            <Container fluid className="profile-complete-page">
                <div className="complete-result">
                    <div className="complete-check-area">
                        <span className="confetti c1"/>
                        <span className="confetti c2"/>
                        <span className="confetti c3"/>
                        <span className="confetti c4"/>
                        <span className="confetti c5"/>
                        <span className="confetti c6"/>

                        <div className="complete-check-circle">
                            <FiCheck/>
                        </div>
                    </div>
                    <h2>
                        프로필 등록이
                        <br/>
                        완료되었습니다.
                    </h2>
                    <p>
                        작가님의 프로필이 성공적으로 등록되었습니다.
                    </p>
                </div>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <Image
                                    src={writerImage}
                                    alt="작가 사진"
                                    fluid
                                    roundedCircle
                                    className=""/>
                            </Col>
                            <Col>
                                <h3>김하영</h3>
                                <div>회화 작가</div>
                                <div>
                                    <div>
                                        <FiMapPin/>
                                        <san>
                                            서울, 대한민국
                                        </san>
                                    </div>
                                    <div>
                                        <FiLink2/>
                                        <span>
                                            www.naver.com
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Image
                                    src={prdctImage1}
                                    alt="대표 작품"
                                    fluid
                                    className=""
                                />
                            </Col>
                            <Col>
                                <Image
                                    src={prdctImage2}
                                    alt="대표 작품"
                                    fluid
                                    className=""
                                />
                            </Col>
                        </Row>
                        <Button type="button" variant="outline-primary" className="profile-preview-button">프로필 미리보기</Button>
                    </Card.Body>
                </Card>
                <Button type="button" className="home-button" onClick={handleHome}>홈으로 이동</Button>
            </Container>
        </div>
    );
}