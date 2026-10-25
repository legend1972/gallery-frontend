import { Container, Row, Col, Card, Image } from "react-bootstrap";
import LoginForm from "./LoginForm";
import atriumImage from "../../assets/atrium-gallery.png";
import "./LoginPage.css";

export default function LoginPage({onLoginSuccess}) {
    return (
        <div>
            <Container>
                <Row>
                    <Col lg={4}>
                        <Image
                            src={atriumImage}
                            alt="아트리움 갤러리"
                            fluid
                            className="login-gallery-image"
                        />
                    </Col>
                    <Col lg={8}>
                        <Card>
                            <Card.Body>
                                <LoginForm onLoginSuccess={onLoginSuccess} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}