import { Container, Row, Col, Card, Image } from "react-bootstrap";
import SignUpForm from "./SignUpForm";
import signupImage from "../../assets/signup-gallery.png";
import "./SignUpPage.css";

export default function SignUpPage() {
    return (
    <div>
        <Container>
            <Row>
                <Col lg={4}>
                    <Image
                        src={signupImage}
                        alt="아트리움 갤러리"
                        fluid
                        className="signup-gallery-image"
                    />
                </Col>
                <Col lg={8}>
                    <Card className="signup-card">
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