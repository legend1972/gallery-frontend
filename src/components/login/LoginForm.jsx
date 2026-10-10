import { useState } from "react";
import { Col, Form, Row, Button, Alert } from "react-bootstrap";
import PasswordField from "../signup/PasswordField";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
    email: "", password: ""
};

export default function LoginForm({onLoginSuccess}) {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState({type: "", text: ""});
    const navigate = useNavigate();

    const {fetchUser} = useAuth();

    const handleFieldChange = (e) => {
        const {name, value} = e.target;
        setForm(p=>({...p, [name]:value}));
    };

    //로그인 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const mberInfoDto = {
            email: form.email,
            secretNo: form.password
        };

        try {
            //React에서 Axios를 사용할 때 프론트와 백엔드 주소가 서로 다르면 withCredentials 설정이 중요
            const response = await api.post("/member/login", mberInfoDto);
            if(response.data.success) {
                /**
                 * 로그인 세션 생성 후
                 * 사용자정보 재조회
                 */
                await fetchUser();

                await onLoginSuccess();

                navigate("/");
            }
            
        } catch (error) {
            setMessage({type: "danger", text: error.response?.data?.message ?? "로그인 중 오류가 발생했습니다."});
            return;
        }
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <h1 className="h2 fw-bold mb-2">로그인</h1>
            <p className="text-secondary mb-0">아트리움 갤러리에 오신 것을 환영합니다.</p>
            <hr className="my-4 my-lg-5"/>
            <Row className="g-4">
                <Col xs={12}>
                    <Row>
                        <Col md={3}>
                            <Form.Label htmlFor="email" className="fw-bold mb-md-0">이메일</Form.Label>
                        </Col>
                        <Col md={9}>
                            <Form.Control id="email" name="email" value={form.email} onChange={handleFieldChange} placeholder="이메일을 입력해 주세요." size="lg"/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Col md={3}>
                            <Form.Label htmlFor="password" className="fw-bold pt-md-3 mb-md-0">비밀번호</Form.Label>
                        </Col>
                        <Col md={9}>
                            <PasswordField id="password" name="password" value={form.password} onChange={handleFieldChange} placeholder="비밀번호를 입력하세요."/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr className="my-4 my-lg-5"/>
            {message.text&&<Alert variant={message.type} className="mt-4 mb-0 py-2 text-center">{message.text}</Alert>}
            <Button type="submit" className="signup-button w-100 mt-4" size="lg">로그인</Button>
            <p className="text-center text-secondary mt-3 mb-0">아직 계정이 없으신가여? <a href="/signup" className="fw-bold text-primary text-decoration-none">회원가입</a></p>
        </Form>
    );
}