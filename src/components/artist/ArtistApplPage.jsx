import { Card, Col, Container, Row } from "react-bootstrap";
import ArtistApplForm from "./ArtistApplForm";

export default function ArtistApplPage() {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <ArtistApplForm/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}