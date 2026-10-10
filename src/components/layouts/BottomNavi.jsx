import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./MobileLayout.css";
import {HouseFill, Heart, CalendarEvent, PersonCheck} from "react-bootstrap-icons";

//일반회원, 작가, 관리자 등에 따라서 메뉴 내용이 달라질수 있기 때문에 일단, 하단 메뉴로 적용할 대상은 모두 등록함
//이러한 경우 DB 에서 관리를 하면 자동으로 처리된다.
const menuIconMap = {
    M0001: HouseFill,
    M0002: Heart,
    M0003: CalendarEvent,
    M4001: PersonCheck,
};

export default function BottomNavi({routes = []}) {
    const bottomRoutes = routes.filter(route => route.lptMenuAt === "Y").sort((a, b) => a.lptMenuSn - b.lptMenuSn);

    return (
        <nav className="bottom-navigation">
            <Container fluid className="h-100 px-0">
                <Row className="h-100 g-0">
                    {bottomRoutes.map((route) => {
                        const Icon = menuIconMap[route.menuId];

                        return (
                            <Col key={route.menuId}>
                                <NavLink to={route.menuUrl} className={({inActive}) => `bottom-menu ${inActive ? "active" : ""}`}>
                                    {Icon && (
                                        <Icon size={23}/>
                                    )}

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