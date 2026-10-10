import { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import { Bell, Search } from "react-bootstrap-icons";
import api from "../../api/api";
import "./Header.css";
import NtcnDetail from "../ntcn/NtcnDetail";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
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
     * 상세보기 시 값 세팅
     */
    const handleDetail = () => {
        setShowDetailModal(true);
    };

    /**
     * 상세보기 닫을 시 값 초기화
     */
    const handleCloseDetail = () => {
        setShowDetailModal(false);
    }

    const handleLogout = async () => {
        try {
            await logout();

            navigate("/login", {replace: true});

            // console.log(window.location.pathname);
        } catch (error) {
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <header className="border-bottom bg-white flex-shrink-0" style={{height: "70px"}}>
            <Container fluid className="h-100 px-3">
                <Stack direction="horizontal" className="h-100 justify-content-between align-items-center">
                    <h1 className="mb-0" style={{fontSize: "25px", fontWeight: "700"}}>아트리움</h1>
                    <Stack direction="horizontal" gap={3}>
                        <h5><span>{user?.ncnm}님</span></h5>
                        <Button variant="link" className="text-dark p-0 text-decoration-none">
                            <Search size={26}/>
                        </Button>
                        <Button variant="link" className="text-dark p-0 text-decoration-none" onClick={() => handleDetail()}>
                            <div className="notification-area-h">
                                <Bell size={26}/>
                                {cnt > 0 && (
                                    <span className="notification-count-h">
                                        {cnt > 99 ? "99+" : cnt}
                                    </span>
                                )}
                            </div>
                        </Button>
                        <Button type="button" variant="outline-secondary" onClick={handleLogout}>
                            로그아웃
                        </Button>
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