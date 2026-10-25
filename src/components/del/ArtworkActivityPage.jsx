import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import BasicInfoSection from '../components/activity/BasicInfoSection.jsx';
import IntroductionSection from '../components/activity/IntroductionSection.jsx';
import OrganizationSection from '../components/activity/OrganizationSection.jsx';
import AdditionalImagesSection from '../components/activity/AdditionalImagesSection.jsx';
const initial = { type:'개인전', title:'', startDate:'', endDate:'', noEndDate:false, place:'', description:'', publicYn:'Y' };
/** onSubmit(data)에서 API FormData로 전송할 수 있습니다. */
export default function ArtworkActivityPage({ onSubmit, onCancel = () => window.history.back() }) {
  const [form, setForm] = useState(initial);
  const [representativeImages, setRepresentativeImages] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [category, setCategory] = useState('포스터');
  const [additionalImages, setAdditionalImages] = useState([]);
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  // 제출할 때 필요한 File 객체는 각각의 image.file로 접근 가능합니다.
  const submit = e => {
    e.preventDefault();
    if (!form.noEndDate && form.endDate < form.startDate) {window.alert('종료일은 시작일 이후여야 합니다.'); return;}
    const payload = { ...form, representativeImage: representativeImages[0]?.file || null,
      organizations: organizations.map(({ images, ...org }) => ({...org, image: images[0]?.file || null})),
      additionalImages: additionalImages.map(image => ({ category, file:image.file })) };
    if (onSubmit) onSubmit(payload);
    else { console.log('작품 활동 등록 payload', payload); window.alert('입력값 확인 완료! 서버 연동 시 onSubmit을 연결하세요.'); }
  };
  return <main className="activity-page"><header className="activity-header"><button aria-label="뒤로가기" type="button" onClick={onCancel}><FiArrowLeft /></button>
    <div><h1>작품 활동 등록</h1><p>작가의 전시, 수상, 레지던시 등 주요 활동을 등록해 주세요.</p></div>
    <button aria-label="닫기" type="button" onClick={onCancel}><FiX /></button></header>
    <Form onSubmit={submit}>
      <BasicInfoSection data={form} setField={setField} representativeImages={representativeImages} setRepresentativeImages={setRepresentativeImages} />
      <IntroductionSection value={form.description} onChange={value => setField('description', value)} />
      <OrganizationSection organizations={organizations} onChange={setOrganizations} />
      <AdditionalImagesSection category={category} setCategory={setCategory} images={additionalImages} setImages={setAdditionalImages} />

      <section className="activity-section publish-section"><h2>공개 설정</h2><div className="activity-field"><label className="field-label">공개 여부</label><div>
        <Form.Check type="radio" name="publicYn" label="공개" id="public-y" checked={form.publicYn === 'Y'} onChange={() => setField('publicYn','Y')} />
        <p className="form-hint radio-hint">프로필과 작품 활동 내역에 공개됩니다.</p>
        <Form.Check type="radio" name="publicYn" label="비공개" id="public-n" checked={form.publicYn === 'N'} onChange={() => setField('publicYn','N')} />
        <p className="form-hint radio-hint">나에게만 보이며 공개되지 않습니다.</p>
      </div></div><div className="bottom-actions"><Button variant="outline-primary" onClick={onCancel}>취소</Button><Button type="submit">등록하기</Button></div></section>
    </Form>
  </main>;
}
