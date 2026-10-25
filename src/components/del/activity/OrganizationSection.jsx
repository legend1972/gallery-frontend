import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FiEdit2, FiPlus, FiTrash2, FiMapPin } from 'react-icons/fi';
import ImagePicker from './ImagePicker.jsx';
const blank = { name: '', role: '주최', description: '', address: '', phone: '', homepage: '', images: [] };
export default function OrganizationSection({ organizations, onChange }) {
  const [draft, setDraft] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const field = (key, value) => setDraft(prev => ({ ...prev, [key]: value }));
  const reset = () => { setDraft(blank); setEditingId(null); };
  const add = () => {
    if (!draft.name.trim() || !draft.images.length) { window.alert('기관/주최명과 이미지를 입력해 주세요.'); return; }
    if (editingId) onChange(organizations.map(o => o.id === editingId ? { ...draft, id: o.id } : o));
    else onChange([...organizations, { ...draft, id: crypto.randomUUID() }]);
    reset();
  };
  return <>
    <section className="activity-section">
      <h2>관련 기관 / 주최</h2>
      <div className="activity-field">
        <label className="field-label">관련 기관 / 주최명 <em>*</em></label>
        <div className="org-name-row">
          {/* <Form.Control value={draft.name} onChange={e => field('name', e.target.value)} placeholder="관련 기관명을 입력해 주세요" /> */}
          <label className="field-label inline-label">역할 <em>*</em></label>
          <Form.Select value={draft.role} onChange={e => field('role', e.target.value)}>
            {['주최', '주관', '후원', '협력', '참여'].map(x => <option key={x}>{x}</option>)}
          </Form.Select>
        </div>
      </div>
      <div className="activity-field"><label className="field-label">소개</label><div className="intro-wrap"><Form.Control as="textarea" maxLength={200} rows={3} value={draft.description} onChange={e => field('description', e.target.value)} /><span className="char-count">{draft.description.length} / 200</span></div></div>
      <div className="activity-field"><label className="field-label">이미지 <em>*</em></label><ImagePicker value={draft.images} onChange={v => field('images', v)} sizeMb={5} compact /></div>
      <div className="activity-field"><label className="field-label">주소</label><div className="with-icon"><Form.Control value={draft.address} onChange={e => field('address', e.target.value)} /><FiMapPin /></div></div>
      <div className="activity-field"><label className="field-label">연락처</label><Form.Control value={draft.phone} onChange={e => field('phone', e.target.value)} /></div>
      <div className="activity-field"><label className="field-label">홈페이지</label><Form.Control type="url" value={draft.homepage} onChange={e => field('homepage', e.target.value)} placeholder="https://" /></div>
      <Button className="outline-purple add-organization" variant="outline-primary" onClick={add}><FiPlus /> {editingId ? '관련 기관 / 주최 수정 완료' : '관련 기관 / 주최 추가'}</Button>
      {editingId && <Button variant="link" className="text-secondary" onClick={reset}>수정 취소</Button>}
    </section>
    {organizations.length > 0 && <section className="activity-section"><h2>등록된 관련 기관 / 주최 ({organizations.length})</h2>
      {organizations.map(o => <div className="org-item" key={o.id}>
        {o.images[0] ? <img className="org-image" src={o.images[0].preview} alt={o.name} /> : <div className="org-image" />}
        <div className="org-summary"><strong>{o.name}</strong> <span className="org-role">{o.role}</span><p>{o.description || '소개 없음'}</p></div>
        <div className="org-actions"><Button size="sm" variant="light" onClick={() => {setDraft(o); setEditingId(o.id);}}> <FiEdit2 /> 정보 수정</Button><Button size="sm" variant="light" aria-label={`${o.name} 삭제`} onClick={() => { if (window.confirm('기관을 삭제할까요?')) {onChange(organizations.filter(item => item.id !== o.id)); if(editingId === o.id) reset();} }}><FiTrash2 color="red" /></Button></div>
      </div>)}
    </section>}
  </>;
}
