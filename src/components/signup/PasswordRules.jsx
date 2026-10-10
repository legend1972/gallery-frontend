import { ListGroup } from "react-bootstrap";

export default function PasswordRules({password}) {
    //variant="flush": Accordion에서 바깥쪽 테두리와 둥근 모서리를 제거하는 스타일
    const rules = [
        {label: "영문 대소문자를 포함 (A~Z, a~z)", passed:/[A-Z]/.test(password)&&/[a-z]/.test(password)},
        {label: "숫자를 포함 (0~9)", passed:/\d/.test(password)},
        {label: "특수문자를 포함 (!@#$%^&* 등)", passed:/[^A-Za-z0-9]/.test(password)},
        {label: "8자 이상 20자 이하", passed:password.length>8 && password.length<=20}
    ];

    return (
        <div className="password-rule-box rounded-3 p-3 mt-3">
            <p className="fw-semibold mb-2">비밀번호는 다음 조건을 모두 만족해야 합니다.</p>
            <ListGroup variant="flush">
                {rules.map(r=>
                    <ListGroup.Item key={r.label} className="bg-transparent border-0 px-0 py-1 d-flex align-items-center gap-2">
                        <span className={r.passed?"rule-check passed":"rule-check"}>{r.passed?"●":"○"}</span>
                        <span>{r.label}</span>
                    </ListGroup.Item>)
                }
            </ListGroup>
        </div>
    );
}