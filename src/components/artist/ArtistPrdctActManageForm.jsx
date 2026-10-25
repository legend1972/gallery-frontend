import { Button, Container } from "react-bootstrap";
import "./ArtistPrdctActManageForm.css";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ArtistPrdctActRegister from "./ArtistPrdctActRegister";

export default function ArtistPrdctActManageForm () {
    const [showPrdctAct, setShowPrdctAct] = useState(false);
    // const navigate = useNavigate();

    const openPrdctAct = () => {
        // navigate("/artist/prdct/detail");
        setShowPrdctAct(true);
    }

    return (
        <div className="activity-manage-page">
            <header className="activity-page-header">
                <h1>작품활동관리</h1>
            </header>
            <main className="activity-page-content">
                <div className="activity-register-area">
                    <Button className="activity-register-btn" onClick={openPrdctAct}>
                        <FiPlus size={22} />
                        <span>작품활동 추가</span>
                    </Button>
                </div>
            </main>
            {showPrdctAct && <ArtistPrdctActRegister
                show={showPrdctAct}
                onHide={() => {setShowPrdctAct(false)}}
            />}
        </div>
    );
}