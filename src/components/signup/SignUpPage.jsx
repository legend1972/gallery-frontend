import { Container, Row, Col, Card } from "react-bootstrap";
import SignUpForm from "./SignUpForm";
import Header from "./Header";

export default function SignUpPage() {
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
                            <SignUpForm/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
    );
}