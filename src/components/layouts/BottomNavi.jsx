import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./MobileLayout.css";
import Icon from "../common/Icon";

export default function BottomNavi({routes = []}) {
    const bottomRoutes = routes.filter(route => route.lptMenuAt === "Y").sort((a, b) => a.lptMenuSn - b.lptMenuSn);

    return (
        <nav className="bottom-navigation">
            <Container fluid className="h-100 px-0">
                <Row className="h-100 g-0">
                    {bottomRoutes.map((route) => {
                        return (
                            <Col key={route.menuId}>
                                <NavLink to={route.menuUrl} className={({inActive}) => `bottom-menu ${inActive ? "active" : ""}`}>
                                    <Icon iconNm={route.lptIconNm}/>
                                    <span>
                                        {route.menuNm}
                                    </span>
                                </NavLink>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </nav>
    );
}