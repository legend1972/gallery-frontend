import React from 'react';
import { Form } from 'react-bootstrap';
export default function IntroductionSection({ value, onChange }) {
  return <section className="activity-section"><h2>활동 소개</h2><div className="intro-wrap">
    <Form.Control as="textarea" rows={4} maxLength={300} value={value} onChange={e => onChange(e.target.value)} placeholder="활동을 소개해 주세요." />
    <span className="char-count">{value.length} / 300</span>
  </div></section>;
}
