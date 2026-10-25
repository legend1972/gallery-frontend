import "../ArtistProfileRegister.css";

export default function ProfileStep({num}) {
    const steps = [
        "기본 정보",
        "작품 설명",
        "작품 목록",
        "완료",
    ];

    return (
        <div className="profile-step">
            {steps.map((step, index) => (
                <div className="step-container" key={step}>
                    <div className={`step ${index === num ? "active" : ""}`}>
                        <div className="step-number">
                            {index + 1}
                        </div>
                        <div className="step-label">
                            {step}
                        </div>
                    </div>

                    {index !== steps.length - 1 && (
                        <div className="step-line"/>
                    )}
                </div>
            ))}
        </div>
    );
};