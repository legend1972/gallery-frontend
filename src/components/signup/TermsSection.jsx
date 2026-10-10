import { Button, Form, Stack } from "react-bootstrap";

const TERMS = [
    {key: "terms", required: true, label:"이용약관에 동의합니다."},
    {key: "privacy", required: true, label:"개인정보 수집 및 이용에 동의합니다."},
    {key: "marketing", required: false, label:"마케팅 정보 수신에 동의합니다."},
    {key: "email", required: false, label:"이메일 수신에 동의합니다."},
    {key: "sms", required: false, label:"SMS 수신에 동의합니다."}
]

export default function TermsSection({agreements,onChange,onToggleAll}) {
    const allChecked = TERMS.every(i=>agreements[i.key]);
    
    return (
        <section>
            <h2 className="h5 fw-bold mb-4">이용약관 및 수신 동의</h2>
            <div className="all-agree-box rounded-3 p-3 mb-3">
                <Form.Check type="checkbox" id="agree-all" checked={allChecked} onChange={e=>onToggleAll(e.target.checked)} label={<strong>전체 동의합니다.</strong>}/>
            </div>
            <Stack gap={1}>
                {TERMS.map(r=>
                    <div className="d-flex justify-content-between align-items-center gap-3 py-2" key={r.key}>
                        <Form.Check type="checkbox" id={`agree-${r.key}`} checked={agreements[r.key]} onChange={e=>onChange(r.key,e.target.checked)} label={<span className="text-secondary">[{r.required?"필수":"선택"}] {r.label}</span>}/><Button variant="link" className="detail-link p-0 text-decoration-none">자세히 보기 ›</Button>
                    </div>)
                }
            </Stack>
        </section>
    );
}