import { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import { Bell, Search } from "react-bootstrap-icons";
import api from "../../api/api";
import "./Header.css";
import NtcnDetail from "../ntcn/NtcnDetail";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowInLeft, BsBoxArrowInRight } from "react-icons/bs";

export default function Header({onOpenNotification}) {
    const [cnt, setCnt] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const {user, logout} = useAuth();

    const navigate = useNavigate();

    useEffect(()=>{
        getCnt();
    }, []);

    const getCnt = async () => {
        try {
            const response = await api.get("/ntcn/unread/cnt");

            setCnt(response.data?.data ?? 0);
        } catch (error) {
            console.error("회원알림 조회 실패");
        }
    };

    /**
     * 상세보기 닫을 시 값 초기화
     */
    const handleCloseDetail = () => {
        setShowDetailModal(false);
    }

    /**
     * 로그아웃
     */
    const handleLogout = async () => {
        try {
            await logout();

            navigate("/", {replace: true});
        } catch (error) {
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        }
    };

    /**
     * 로그인 페이지 이동
     */
    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <header className="app-header">
            <Container fluid className="header-container">
                <Stack direction="horizontal" className="header-inner">
                    <Button variant="link" className="header-logo" type="button" onClick={() => navigate("/")}>
                        아트리움
                    </Button>
                    <Stack direction="horizontal" className="header-actions">
                        {user && (
                                    <div className="header-user">
                                        <span className="header-user-name">
                                            {user?.ncnm}
                                        </span>
                                        <span className="header-user-suffix">
                                            님
                                        </span>
                                    </div>)}
                        <Button variant="link" className="header-icon-button">
                            <Search size={26}/>
                        </Button>
                        {user && (
                            <Button variant="link" className="header-icon-button" onClick={onOpenNotification}>
                                <div className="notification-area-h">
                                    <Bell size={26}/>
                                    {cnt > 0 && (
                                        <span className="notification-count-h">
                                            {cnt > 99 ? "99+" : cnt}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        )}
                        {user ?
                            (
                                <Button type="button" className="header-login-button" aria-label="로그아웃" onClick={handleLogout}>
                                    <BsBoxArrowInLeft size={21} />
                                </Button>)
                            : (
                                <Button type="button" className="header-login-button" aria-label="로그인" onClick={handleLogin}>
                                    <BsBoxArrowInRight size={21} />
                                </Button>
                            )
                        }
                    </Stack>
                </Stack>
            </Container>

            {showDetailModal && <NtcnDetail
                show={showDetailModal}
                onHide={handleCloseDetail}
            />}
        </header>
    );
}