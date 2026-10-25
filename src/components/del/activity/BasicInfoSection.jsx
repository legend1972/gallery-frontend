import React from 'react';
import { Form } from 'react-bootstrap';
import ImagePicker from './ImagePicker.jsx';

export default function BasicInfoSection({ data, setField, representativeImages, setRepresentativeImages }) {
  return <section className="activity-section"><h2>기본 정보</h2>
    <div className="activity-field"><label className="field-label">활동 유형 <em>*</em></label><div>
      <Form.Select value={data.type} onChange={e => setField('type', e.target.value)} required>
        {['개인전', '단체전', '수상', '레지던시', '참여', '기타'].map(x => <option key={x}>{x}</option>)}
      </Form.Select><p className="form-hint">ex. 개인전, 단체전, 수상, 레지던시, 참여</p>
    </div></div>
    <div className="activity-field">
      <label className="field-label">활동명(제목) <em>*</em></label>
      <div>
          <Form.Control value={data.title} onChange={e => setField('title', e.target.value)} placeholder="활동명을 입력해 주세요" required />
          <p className="form-hint">ex. 빛이 머무는 곳</p>
      </div>
    </div>

    <div className="activity-field">
      <label className="field-label">기간 <em>*</em></label>
      <div className="date-group">
        <Form.Control type="date" value={data.startDate} onChange={e => setField('startDate', e.target.value)} required />
        <span>~</span>
        <Form.Control type="date" value={data.endDate} min={data.startDate} onChange={e => setField('endDate', e.target.value)} disabled={data.noEndDate} required={!data.noEndDate} />
        <Form.Check id="no-end-date" label="종료일 미정" checked={data.noEndDate} onChange={e => setField('noEndDate', e.target.checked)} />
      </div>
    </div>
    
    <div className="activity-field"><label className="field-label">장소 <em>*</em></label><div><Form.Control value={data.place} onChange={e => setField('place', e.target.value)} placeholder="활동 장소" required /><p className="form-hint">ex. 갤러리 온, 서울</p></div></div>
    <div className="activity-field"><label className="field-label">대표 작품 이미지</label><div><ImagePicker value={representativeImages} onChange={setRepresentativeImages} max={1} sizeMb={10} /><p className="form-hint">* 대표 작품 이미지는 전시를 소개하는 썸네일로 사용됩니다.</p></div></div>
  </section>;
}
