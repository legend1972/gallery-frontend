import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtistJdgmnDetail from "./ArtistJdgmnDetail";

export default function ArtistJdgmnDetailPage() {
    const navigate = useNavigate();
    const {mberNo, email} = useParams();
    const [show, setShow] = useState(true);

    /**
     * 상세보기 닫을 시 값 초기화
     */
    const handleCloseDetailModal = () => {
        setShow(false);

        navigate(-1);
    };
    
    return (
        <ArtistJdgmnDetail
            mberNo={mberNo}
            email={email}
            show={show}
            onHide={handleCloseDetailModal}
            // onSaved={getArtistJdgmnInfo}
        />
    );

}
