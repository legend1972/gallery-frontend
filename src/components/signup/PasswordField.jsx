import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

export default function PasswordField({id, name, value, onChange, placeholder, autoComplete}) {
    const [visible, setVisible] = useState(false);
    // variant="outline-secondary": React-Bootstrap 컴포넌트의 디자인 스타일. 회색 계열 테두리 버튼
    // aria-label="검색": 접근성(Accessibility)을 위한 속성. 이 버튼이 "검색 버튼"이라는 의미를 보조기기에 알려줌
    // autoComplete: HTML 입력창에서 브라우저의 자동완성 기능을 제어하는 속성
    //               autoComplete="on" → 자동완성 허용
    // autoComplete="off" → 자동완성 비활성화를 요청
    // autoComplete="email" → 이메일 자동완성
    // autoComplete="username" → 사용자명 자동완성
    // autoComplete="current-password" → 현재 비밀번호
    // autoComplete="new-password" → 새 비밀번호
    // autoComplete="name" → 이름
    // autoComplete="tel" → 전화번호
    //               
    return <InputGroup>
                <Form.Control id={id} name={name} type={visible?"text":"password"} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}/>
                <Button variant="outline-secondary" type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible?"비밀번호 숨기기":"비밀번호 보기"}>{visible?"👁":"◉̸"}</Button>
           </InputGroup>;
}