import { Card, Col, Container, Row } from "react-bootstrap";
import ArtistPrdctActManageForm from "./ArtistPrdctActManageForm";

export default function ArtistPrdctActManagePage() {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <ArtistPrdctActManageForm/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}