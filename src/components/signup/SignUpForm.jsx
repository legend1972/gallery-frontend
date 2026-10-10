import { Col, Form, Row, Button, Alert } from "react-bootstrap";
import PasswordField from "./PasswordField";
import PasswordRules from "./PasswordRules";
import TermsSection from "./TermsSection";
import { useMemo, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const initialForm = {
    nickname: "", email: "", password: "", passwordConfirm: ""
};

//이용약관 및 수신 동의 초기 세팅
const initialAgreements = {
    terms: false, privacy: false, marketing: false, email: false, sms: false
};

export default function SignUpForm() {
    const [form, setForm] = useState(initialForm);
    const [agreements, setAgreements] = useState(initialAgreements);
    const [message, setMessage] = useState({type: "", text: ""});
    const [emailChecked, setEmailChecked] = useState(false);
    const navigate = useNavigate();

    //이메일 형식 체크 및 중복 체크
    const handleEmailCheck = async () => {
        if(!/^\S+@\S+\.\S+$/.test(form.email)) {
            setMessage({type:"danger", text:"올바른 이메일 형식을 입력해주세요."});
            return;
        }

        const mberInfoDto = {
            email: form.email
        };

        try {
            const response = await api.post("/member/dplct", mberInfoDto);
            if(response.data.success) {
                setMessage({type: "success", text: response.data.message});
            }
        } catch (error) {
            //?. 는 Optional Chaining
            //error.response가 존재할 때만 data, message에 접근. 만약 error.response가 undefined여도 오류를 발생시키지 않고 결과를 undefined로 처리
            //?? 는 Nullish Coalescing 연산자
            //왼쪽 값이 null 또는 undefined이면 오른쪽 값을 사용
            setMessage({type: "danger", text: error.response?.data?.message ?? "회원가입 중 오류가 발생했습니다."});
            return;
        }

        setEmailChecked(true);
        // setMessage({type: "success", text: "사용 가능한 이메일입니다."})
    };

    //패스워드 체크
    const passwordMatched = useMemo(
        () => form.password !== "" && form.password === form.passwordConfirm,
        [form.password, form.passwordConfirm]
    );

    //입력 창 변경 확인
    const handleFieldChange = e=>{
        const {name, value} = e.target;
        setForm(p=>({...p, [name]:value}));

        //이메일 변경인 경우 이메일 중복 확인 필요
        if(name === "email") setEmailChecked(false);
    };

    //가입 처리
    const handleSubmit =async e=>{
        e.preventDefault();
        const valid = /[A-Z]/.test(form.password)&&/[a-z]/.test(form.password)&&/[^A-Za-z0-9]/.test(form.password)&&form.password.length>=8&&form.password.length<=20;
        //필수 입력 체크
        if(!form.nickname || !form.email || !form.password || !form.passwordConfirm) return setMessage({type: "danger", text: "필수 입력 항목을 모두 입력해주세요."});

        //이메일 중목 체크
        if(!emailChecked) return setMessage({type: "danger", text: "이메일 중복 확인을 진행해주세요."});

        //비밀번호 조건 체크
        if(!valid)return setMessage({type:"danger",text:"비밀번호 조건을 확인해주세요."});

        //비밀번호 일치 여부 확인
        if(!passwordMatched) return setMessage({type: "danger", text: "비밀번호가 일치하지 않습니다."});

        //필수 약관 동의 여부 체크
        if(!agreements.terms || !agreements.privacy) return setMessage({type: "danger", text: "필수 약관에 동의해주세요."});

        const mberInfoInDto = {
            ncnm: form.nickname,
            email: form.email,
            secretNo: form.password,
            stplatAgreAt: agreements.terms?"Y":"N",
            indvdlinfoColctAgreAt: agreements.privacy?"Y":"N",
            marktColctAgreAt: agreements.marketing?"Y":"N",
            emailColctAgreAt: agreements.email?"Y":"N",
            smsColctAgreAt: agreements.sms?"Y":"N"
        };

        try {
            const response = await api.post("/member/signup", mberInfoInDto);
            if(response.data.success) {
//                setMessage({type: "success", text: response.data.message});
                navigate("/login");
            }
        } catch (error) {
            //?. 는 Optional Chaining
            //error.response가 존재할 때만 data, message에 접근. 만약 error.response가 undefined여도 오류를 발생시키지 않고 결과를 undefined로 처리
            //?? 는 Nullish Coalescing 연산자
            //왼쪽 값이 null 또는 undefined이면 오른쪽 값을 사용
            setMessage({type: "success", text: error.response?.data?.message ?? "회원가입 중 오류가 발생했습니다."});
            return;
        }
    };

    //noValidate: HTML <form>의 브라우저 기본 유효성 검사를 비활성화하는 속성
    return (
        <Form onSubmit={handleSubmit} noValidate>
            <div className="d-flex align-items-center gap-4 mb-4"><div className="member-icon flex-shrink-0">👤＋</div><div><h1 className="h2 fw-bold mb-2">일반회원 가입</h1><p className="text-secondary mb-0">아트리움 회원이 되어 다양한 서비스를 이용해보세요.</p></div></div>
            <hr className="my-4 my-lg-5"/>
            <Row className="g-4">
                <Col xs={12}>
                    <Row className="align-items-center g-3">
                        <Col md={3}>
                            <Form.Label htmlFor="nickname" className="fw-bold mb-md-0">닉네임</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Form.Control id="nickname" name="nickname" value={form.nickname} onChange={handleFieldChange} placeholder="닉네임을 입력해 주세요." size="lg"/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Col md={3}>
                            <Form.Label htmlFor="email" className="fw-bold mb-md-0">이메일</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Row className="g-2">
                                <Col>
                                    <Form.Control id="email" name="email" value={form.email} onChange={handleFieldChange} placeholder="이메일을 입력해주세요." size="lg"/>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-primary" size="lg" type="button" className="duplicate-button" onClick={handleEmailCheck}>
                                        중복 확인
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Label htmlFor="password" className="fw-bold pt-md-3 mb-md-0">비밀번호</Form.Label>
                        </Col>
                        <Col md={9}>
                            <PasswordField id="password" name="password" value={form.password} onChange={handleFieldChange} placeholder="비밀번호를 입력하세요." autoComplete="new-password"/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Label htmlFor="passwordConfirm" className="fw-bold pt-md-3 mb-md-0">비밀번호 확인</Form.Label>
                        </Col>
                        <Col md={9}>
                            <PasswordField id="passwordConfirm" name="passwordConfirm" value={form.passwordConfirm} onChange={handleFieldChange} placeholder="비밀번호를 다시 입력해주세요." autoComplete="new-password"></PasswordField>
                            <PasswordRules password={form.password}></PasswordRules>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr className="my-4 my-lg-5"/>
            <TermsSection agreements={agreements} onChange={(key, checked) => setAgreements(p=>({...p, [key]:checked}))} onToggleAll={checked=>setAgreements({terms: checked, privacy: checked, marketing: checked, email: checked, sms: checked})}/>
            {message.text&&<Alert variant={message.type} className="mt-4 mb-0 py-2 text-center">{message.text}</Alert>}
            <Button type="submit" className="signup-button w-100 mt-4" size="lg">가입하기</Button>
            <p className="text-center text-secondary mt-3 mb-0">이미 계정이 있으신가여? <a href="/login" className="fw-bold text-primary text-decoration-none">로그인</a></p>
        </Form>
    )
}