import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "../signup/Header";
import LoginForm from "./LoginForm";

export default function LoginPage({onLoginSuccess}) {
    return (
        <div>
            <Header/>
            <Container>
                <Row>
                    <Col lg={4}>
                        <span>기본 개발 후 작성 예정임</span>
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