import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { BsBell, BsBuilding, BsChatDots, BsChevronLeft, BsClipboardCheck, BsClock, BsEnvelope, BsHeart, BsImage, BsMegaphone, BsPersonCheck, BsPersonPlus } from "react-icons/bs";
import "./NtcnSetupDetail.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import {formatTimeChange, formatTimeReChange} from "../../utils/dateUtils";

const iconMap = {
    BsHeart,
    BsChatDots,
    BsClipboardCheck,
    BsPersonCheck,
    BsImage,
    BsMegaphone,
    BsBuilding,
    BsPersonPlus,
};

export default function NtcnSetupDetail({show, onHide}) {
    const [mberNtcnSetup, setMberNtcnSetup] = useState({
        mberNo: "",
        allRecptnAt: true,
        aplctnRecptnAt: true,
        emailRecptnAt: true,
        smsRecptnAt: false,
        ntcnTimeLmttAt: true,
        ntcnBeginTime: "090000",
        ntcnEndTime: "220000",
    });

    const [mberNtcnIemSetupList, setMberNtcnIemSetupList] = useState([]);

    const {user} = useAuth();

    useEffect(() => {
        const mberNtcnSetupDetail = async () => {
            let mberNo = user.mberNo;
            if(mberNo === null || mberNo === "") {
                mberNo = user.gnrlMberNo;
            }

            try {
                const [responseSetup, reponseIemSetup] = await Promise.all([
                    api.get("/ntcn/setup/inqire?mberNo=" + mberNo),
                    api.get("/ntcn/iem/setup/inqire?mberNo=" + mberNo + "&roleId=" + user.roleId),
                ]);
                
                const dataSetup = responseSetup.data?.data;
                const dataIemSetup = reponseIemSetup.data?.data;

                setMberNtcnSetup({
                    mberNo: dataSetup.mberNo ?? mberNo,
                    allRecptnAt: dataSetup.allRecptnAt === "Y" ?? true,
                    aplctnRecptnAt: dataSetup.aplctnRecptnAt === "Y" ?? true,
                    emailRecptnAt: dataSetup.emailRecptnAt === "Y" ?? true,
                    smsRecptnAt: dataSetup.smsRecptnAt === "Y" ?? false,
                    ntcnTimeLmttAt: dataSetup.ntcnTimeLmttAt === "Y" ?? true,
                    ntcnBeginTime: dataSetup.ntcnBeginTime ?? "090000",
                    ntcnEndTime: dataSetup.ntcnEndTime ?? "220000",
                });

                /**
                 * 알림설정항목에는 추가 등록한 경우 회원알림항목설정에는 등록된 대상이 없는 경우가 있을 수 있음.
                 */
                const convertList = dataIemSetup.map(item => ({
                    ...item,
                    mberNo: item.mberNo ?? mberNo, 
                    aplctnRecptnAt: item.aplctnRecptnAt === "Y" ?? true,
                    emailRecptnAt: item.emailRecptnAt === "Y" ?? true,
                    smsRecptnAt: item.smsRecptnAt === "Y" ?? false,
                }));

                setMberNtcnIemSetupList(convertList);

            } catch (error) {
                console.error(error.response?.data?.message ?? "회원알림설정 조회 실패 혹은 회원알림항목설정 조회 실패");
                setMberNtcnSetup({
                    mberNo: mberNo,
                    allRecptnAt: true,
                    aplctnRecptnAt: true,
                    emailRecptnAt: true,
                    smsRecptnAt: false,
                    ntcnTimeLmttAt: true,
                    ntcnBeginTime: "090000",
                    ntcnEndTime: "220000",
                });

                setMberNtcnIemSetupList([]);
            }
        };

        mberNtcnSetupDetail();
    }, [show]);

    /**
     * 
     * field: 'allRecptnAt', value: true/false
     */
    const handleRecptnChange = async (field, value) => {
        let mberNo = user.mberNo;
        if(mberNo === null || mberNo === "") {
            mberNo = user.gnrlMberNo;
        }

        const prevSetup = {
            ...mberNtcnSetup
        };

        const nextSetup = {
            ...mberNtcnSetup,
            [field]: value
        }

        if((field === "ntcnBeginTime" || field === "ntcnEndTime") && nextSetup.ntcnBeginTime && nextSetup.ntcnEndTime && nextSetup.ntcnBeginTime >= nextSetup.ntcnEndTime) {
            alert("종료 시간은 시작 시간보다 이후여야 합니다.");
            return;
        }

        setMberNtcnSetup(nextSetup);

        try {
            const response = await api.post("/ntcn/setup/change", {
                mberNo: mberNo,
                recptnTy: convertRecptnTy(field), //allRecptnAt, 기타 => ALL 등
                value: convertRecptnValue(field, value) //allRecptnAt, true/false => "Y"/"N" 혹은 입력값 value
            });

            console.log(response.data?.message ?? "회원알림설정 변경 성공");
        } catch (error) {
            console.error(error.response?.data?.message ?? "회원알림설정 변경 실패");

            setMberNtcnSetup(prevSetup);
        }
    };

    const handleItemChange = async (code, field, value) => {
        let mberNo = user.mberNo;
        if(mberNo === null || mberNo === "") {
            mberNo = user.gnrlMberNo;
        }

        const target = mberNtcnIemSetupList.find((prev) => prev.ntcnSetupCode === code);
        if(!target) {
            return;
        }

        const prevValue = target[field];

        setMberNtcnIemSetupList(prevList => prevList.map(
            prev => prev.ntcnSetupCode === code ? {
                ...prev,
                [field]: value
            } : prev
        ));

        try {
            const response = await api.post("/ntcn/iem/setup/change", {
                mberNo: mberNo,
                code: code,
                recptnTy: convertRecptnTy(field),
                value: convertRecptnValue(field, value),
            });

            console.log(response.data?.message ?? "회원알림항목설정 변경");
        } catch (error) {
            console.error(error.response.data?.message ?? "회원알림항목설정 변경 실패");

            setMberNtcnIemSetupList(prevList => prevList.map(
                prev => prev.ntcnSetupCode === code ? {
                    ...prev,
                    [field]: prevValue
                } : prev
            ));
        }
    };

    /**
     * 수신, 제한, 시작시간, 종료시간 변환
     */
    const convertRecptnTy = (field) => {
        switch (field) {
            case "allRecptnAt":
                return "ALL";
            case "aplctnRecptnAt":
                return "APLCTN";
            case "emailRecptnAt":
                return "EMAIL";
            case "smsRecptnAt":
                return "SMS";
            case "ntcnTimeLmttAt":
                return "LMTT";
            case "ntcnBeginTime":
                return "BEGIN";
            case "ntcnEndTime":
                return "END";
            default:
                throw new Error("잘못된 알림 설정 항목입니다.");
        }
    };

    /**
     * value 값 변환
     */
    const convertRecptnValue = (field, value) => {
        if(field === "allRecptnAt" ||
        field === "aplctnRecptnAt" ||
        field === "emailRecptnAt" ||
        field === "smsRecptnAt" ||
        field === "ntcnTimeLmttAt"
        ) {
            return value ? "Y" : "N";
        }

        return value;
    };

    const getNtcnIemSetupIcon = (iconCode) => {
        const Component = iconMap[iconCode] ?? BsHeart;

        return (
            <Component/>
        );
    };

    const getIconClass = (iconCode) => {
        switch (iconCode) {
            case "BsHeart":
                return "ntcn-setting-icon icon-red";
            case "BsChatDots":
                return "ntcn-setting-icon icon-blue";
            case "BsClipboardCheck":
                return "ntcn-setting-icon icon-orange";
            case "BsPersonCheck":
                return "ntcn-setting-icon icon-purple";
            case "BsImage":
                return "ntcn-setting-icon icon-green";
            case "BsMegaphone":
                return "ntcn-setting-icon icon-yellow";
            case "BsBuilding":
                return "ntcn-setting-icon icon-violet";
            case "PERSBsPersonPlusON_PLUS":
                return "ntcn-setting-icon icon-mint";
            default:
                return "ntcn-setting-icon icon-gray";
        }
    };

    return (
        <Modal show={show} onHide={onHide} fullscreen centered size="lg" dialogClassName="ntcn-setting-modal" contentClassName="ntcn-setting-modal-content"  scrollable>
            <Modal.Header className="ntcn-setting-header">
                <div className="ntcn-setting-container">
                    <Button variant="link" onClick={onHide} aria-label="뒤로가기" className="ntcn-setting-back">
                        <BsChevronLeft/>
                    </Button>
                    <Modal.Title className="ntcn-setting-title">알림 설정</Modal.Title>
                    {/* <div className="ntcn-setting-description">
                        원하는 알림을 선택하고 수신 방법과 시간을 설정하세요.
                    </div> */}
                </div>
            </Modal.Header>
            <Modal.Body>
                <Card className="ntcn-setting-card">
                    <Card.Body>
                        <div className="ntcn-setting-card-header">
                            <div>
                                <h5>전체 알림 설정</h5>
                                <p>
                                    모든 알림의 수신 여부와 수신 방법을 한 번에 설정할 수 있습니다.
                                </p>
                            </div>
                            <div className="ntcn-setting-switch-area">
                                <span>전체 알림 받기</span>
                                <Form.Check
                                    type="switch"
                                    checked={mberNtcnSetup.allRecptnAt}
                                    onChange={(e) => handleRecptnChange("allRecptnAt", e.target.checked)}
                                />
                            </div>
                        </div>
                        <Row className="ntcn-setting-method-area">
                            <Col>
                                <div className="ntcn-setting-method">
                                    <BsBell className="ntcn-setting-method-icon"/>
                                    <strong>앱 알림 (인앱)</strong>
                                    <Form.Check
                                        type="switch"
                                        checked={mberNtcnSetup.aplctnRecptnAt}
                                        disabled={!mberNtcnSetup.allRecptnAt}
                                        onChange={(e) => handleRecptnChange("aplctnRecptnAt", e.target.checked)}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="ntcn-setting-method method-border">
                                    <BsEnvelope className="ntcn-setting-method-icon"/>
                                    <strong>이메일</strong>
                                    <Form.Check
                                        type="switch"
                                        checked={mberNtcnSetup.emailRecptnAt}
                                        disabled={!mberNtcnSetup.allRecptnAt}
                                        onChange={(e) => handleRecptnChange("emailRecptnAt", e.target.checked)}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="ntcn-setting-method method-border">
                                    <BsChatDots className="ntcn-setting-method-icon"/>
                                    <strong>문자 (SMS)</strong>
                                    <Form.Check
                                        type="switch"
                                        checked={mberNtcnSetup.smsRecptnAt}
                                        disabled={!mberNtcnSetup.allRecptnAt}
                                        onChange={(e) => handleRecptnChange("smsRecptnAt", e.target.checked)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                
                <h4 className="ntcn-setting-section-title">알림 항목별 설정</h4>
                <Card className="ntcn-setting-card ntcn-setting-item-card">
                    <Card.Body className="p-0">
                        <div className="ntcn-setting-table-header">
                            <div className="ntcn-setting-info-col">
                                알림 유형
                            </div>
                            <div>
                                앱 알림(인앱)
                            </div>
                            <div>
                                이메일
                            </div>
                            <div>
                                문자(SMS)
                            </div>
                        </div>
                        {mberNtcnIemSetupList.map(
                            (mberNtcnIemSetup) => (
                                <div key={mberNtcnIemSetup.iconCode} className="ntcn-setting-row">
                                    <div className="ntcn-setting-info-col">
                                        <div className={getIconClass(mberNtcnIemSetup.iconCode)}>
                                            {getNtcnIemSetupIcon(mberNtcnIemSetup.iconCode)}
                                        </div>
                                        <div className="ntcn-setting-text">
                                            <strong>
                                                {mberNtcnIemSetup.ntcnSetupNm}
                                            </strong>
                                            <span>
                                                {mberNtcnIemSetup.ntcnSetupCn}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            checked={mberNtcnIemSetup.aplctnRecptnAt}
                                            disabled={!mberNtcnSetup.allRecptnAt || !mberNtcnSetup.aplctnRecptnAt}
                                            onChange={(e) => handleItemChange(mberNtcnIemSetup.ntcnSetupCode, "aplctnRecptnAt", e.target.checked)}
                                        />
                                    </div>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            checked={mberNtcnIemSetup.emailRecptnAt}
                                            disabled={!mberNtcnSetup.allRecptnAt || !mberNtcnSetup.emailRecptnAt}
                                            onChange={(e) => handleItemChange(mberNtcnIemSetup.ntcnSetupCode, "emailRecptnAt", e.target.checked)}
                                        />
                                    </div>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            checked={mberNtcnIemSetup.smsRecptnAt}
                                            disabled={!mberNtcnSetup.allRecptnAt || !mberNtcnSetup.smsRecptnAt}
                                            onChange={(e) => handleItemChange(mberNtcnIemSetup.ntcnSetupCode, "smsRecptnAt", e.target.checked)}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </Card.Body>
                </Card>

                <Card className="ntcn-setting-card">
                    <Card.Body>
                        <div className="ntcn-setting-card-header">
                            <div>
                                <h5>알림 시간 설정</h5>
                                <p>이메일 및 문자 알림을 받을 시간을 설정할 수 있습니다.</p>
                            </div>
                            <div className="ntcn-setting-switch-area">
                                <span>알림 수신 시간 설정</span>
                                <Form.Check
                                    type="switch"
                                    checked={mberNtcnSetup.ntcnTimeLmttAt}
                                    disabled={!mberNtcnSetup.allRecptnAt}
                                    onChange={(e) => handleRecptnChange("ntcnTimeLmttAt", e.target.checked)}
                                />
                            </div>
                        </div>
                        <Row className="ntcn-setting-time-row">
                            <Col md={5}>
                                <div className="ntcn-setting-time-area">
                                    <label>시작 시간</label>
                                    <div className="ntcn-setting-time-input">
                                        <BsClock/>
                                        <Form.Control
                                            type="time"
                                            value={formatTimeChange(mberNtcnSetup.ntcnBeginTime)}
                                            disabled={!mberNtcnSetup.allRecptnAt || !mberNtcnSetup.ntcnTimeLmttAt}
                                            onChange={(e) => handleRecptnChange("ntcnBeginTime", formatTimeReChange(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col md={1} className="ntcn-setting-time-wave">
                                ~
                            </Col>
                            <Col md={5}>
                                <div className="ntcn-setting-time-area">
                                    <label>종료 시간</label>
                                    <div className="ntcn-setting-time-input">
                                        <BsClock/>
                                        <Form.Control
                                            type="time"
                                            value={formatTimeChange(mberNtcnSetup.ntcnEndTime)}
                                            disabled={!mberNtcnSetup.allRecptnAt || !mberNtcnSetup.ntcnTimeLmttAt}
                                            onChange={(e) => handleRecptnChange("ntcnEndTime", formatTimeReChange(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="ntcn-setting-time-description">
                            설정한 시간 외에는 이메일 및 문자 알림이 발송되지 않습니다.
                            <br/>
                            (앱 알림은 시간과 관계없이 수신됩니다.)
                        </div>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
}