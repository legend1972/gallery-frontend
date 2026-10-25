import { Outlet } from "react-router-dom";
import NtcnDetail from "../ntcn/NtcnDetail";
import NtcnSetupDetail from "../ntcn/NtcnSetupDetail";
import BottomNavi from "./BottomNavi";
import Header from "./Header";
import "./MobileLayout.css";
import { useState } from "react";

export default function MobileLayout({showHeader = true, showBottom = true, routes = []}) {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [ntcnSettingModal, setNtcnSettingModal] = useState(false);

    /**
     * 알림 모달 열기
     */
    const openNotification = () => {
        setShowDetailModal(true);
    };

    /**
     * 알림 설정 모달 열기
     */
    const openNotificationSetup = () => {
        setShowDetailModal(false);
        setNtcnSettingModal(true);
    };

    /**
     * 알림 설정에서 알림 목록으로 돌아가기
     */
    const backToNotification = () => {
        setNtcnSettingModal(false);
        setShowDetailModal(true);
    };

    return (
        <div className="mobile-layout">
            {showHeader&&<Header onOpenNotification={openNotification}/>}
            <main className="mobile-content">
                <Outlet context={{openNotification, openNotificationSetup}}/>
            </main>
            {showBottom&&<BottomNavi routes={routes}/>}

            {/* 알림 목록 모달 */}
            <NtcnDetail
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                onOpenSetup={openNotificationSetup}
            />

            {/* 알림 설정 모달 */}
            <NtcnSetupDetail
                show={ntcnSettingModal}
                onHide={() => setNtcnSettingModal(false)}
                onBack={backToNotification}
            />
        </div>
    );
}