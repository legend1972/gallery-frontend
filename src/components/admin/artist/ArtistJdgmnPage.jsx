import { Card, Col, Container, Row } from "react-bootstrap";
import ArtistJdgmnForm from "./ArtistJdgmnForm";

export default function ArtistJdgmnPage() {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <ArtistJdgmnForm/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}