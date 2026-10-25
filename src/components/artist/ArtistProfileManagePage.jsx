import { useState } from "react";
import { Container } from "react-bootstrap";
import ArtistProfileRegister from "./ArtistProfileRegister";
import ArtistProfileDescription from "./ArtistProfileDescription";
import ArtistProfileArtworks from "./ArtistProfileArtworks";
import ArtistProfileComplete from "./ArtistProfileComplete";
import ProfileStep from "./common/ProfileStep";

export default function ArtistProfileManagePage() {
    const [step, setStep] = useState(1);

    const handlePrev = () => {
        setStep((prev) => Math.max(prev-1, 1));
        window.scrollTo(0, 0); //웹페이지의 스크롤 위치를 맨 위로 이동시키는 JavaScript 명령어
    };

    const handleNext = () => {
        setStep((prev) => Math.min(prev + 1, 4));
        window.scrollTo(0, 0); //웹페이지의 스크롤 위치를 맨 위로 이동시키는 JavaScript 명령어
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <ArtistProfileRegister onNext={handleNext}/>
                );
            case 2:
                return (
                    <ArtistProfileDescription onPrev={handlePrev} onNext={handleNext}/>
                );
            case 3:
                return (
                    <ArtistProfileArtworks onPrev={handlePrev} onNext={handleNext}/>
                );
            case 4:
                return (
                    <ArtistProfileComplete/>
                );
            default:
                throw new Error("프로필 등록에 없는 단계입니다.");
        }
    }

    return (
        <div>
            <Container fluid className="profile-register">
                <div className="page-header">
                    <div>
                        <h1>프로필 등록</h1>
                        <p>작가 등록 신청 정보를 바탕으로 프로필을 완성해 주세요.</p>
                    </div>
                </div>
                <ProfileStep num={step - 1}/>
                {renderStep()}
            </Container>
        </div>
    );
}