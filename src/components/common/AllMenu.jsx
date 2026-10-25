import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import api from "../../api/api";
import Icon from "./Icon";
import "./AllMenu.css";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function AllMenu() {
    const [groupList, setGroupList] = useState([]);
    const [nm, setNm] = useState("");

    const navigate = useNavigate();
    const {openNotification,openNotificationSetup} = useOutletContext();

    useEffect(() => {
        const allMenuList = async () => {
            try {
                const response = await api.get("/mber/role/menu/all?nm="+nm);
                setGroupList(response.data?.data ?? []);
            } catch (error) {
                console.error(error.response?.data?.message ?? "메뉴 정보 조회 오류");
                setGroupList([]);
            }
        };

        allMenuList();

    }, [nm]);

    const handleMenuClick = (menu) => {
        if(!menu) {
            return;
        }

        //내부 경로만 이동
        if(!menu.menuUrl.startsWith("/") || menu.menuUrl.startsWith("//") || menu.menuUrl.includes("\\")) {
            return;
        }

        //알림
        if(menu.menuId === "M9901") {
            openNotification();
            return;
        }

        //알림설정
        if(menu.menuId === "M9902") {
            openNotificationSetup();
            return;
        }

        if(menu.menuUrl) {
            navigate(menu.menuUrl);
        }
    };

    return (
        <div className="all-menu-page">
            <Container fluid="lg">
                <h1 className="all-menu-title">전체 메뉴</h1>
                <hr className="my-4 my-lg-5"/>
                <div>
                    <InputGroup className="all-menu-search">
                        <InputGroup.Text>
                            <FiSearch size={23} />
                        </InputGroup.Text>
                        <Form.Control id="nm" name="nm" value={nm} onChange={(e) => setNm(e.target.value)} type="text" placeholder="메뉴명 또는 메뉴 설명을 검색하세요."/>
                    </InputGroup>
                </div>
                <div className="all-menu-group-list">
                    {groupList.length > 0 ? (
                        <>
                            {groupList.map((group) => {
                                return (
                                    <Card key={group.groupId} className="all-menu-card">
                                        <Card.Body>
                                            <Row className="all-menu-group-header align-items-center">
                                                <Col xs="auto"><h2 className="all-menu-group-name">{group.groupNm}</h2></Col>
                                                <Col className="all-menu-group-description">{group.groupDc}</Col>
                                            </Row>
                                            {group.list.map((menu) => {
                                                return (
                                                    <Button type="button" key={menu.menuId} variant="link" className="all-menu-item" onClick={() => handleMenuClick(menu)}>
                                                        <Row className="all-menu-item-row align-items-center">
                                                            <Col xs="auto" className="all-menu-icon-col">
                                                                <div className={`all-menu-icon icon-${menu.iconColor || "blue"}`}>
                                                                    <Icon iconNm={menu.iconNm}/>
                                                                </div>
                                                            </Col>
                                                            <Col xs="auto" className="all-menu-name-col">
                                                                <span className="all-menu-item-name">
                                                                    {menu.menuNm}
                                                                </span>
                                                            </Col>
                                                            <Col className="all-menu-desc-col">
                                                                <span className="all-menu-item-description">
                                                                    {menu.menuDc}
                                                                </span>
                                                            </Col>
                                                            <Col xs="auto" className="all-menu-arrow-col">
                                                                <FiChevronRight size={21}/>
                                                            </Col>
                                                        </Row>
                                                    </Button>
                                                )
                                            })
                                            }
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </>
                    ) : (
                        <div>
                            <FiSearch size={30}/>조회된 대상이 없습니다.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}