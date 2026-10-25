import React from 'react';
import { Form } from 'react-bootstrap';
import ImagePicker from './ImagePicker.jsx';
const categories = ['포스터', '갤러리 외관', '전시장 전경', '전시장 내부', '작품 이미지', '기타'];
export default function AdditionalImagesSection({ category, setCategory, images, setImages }) {
  return <section className="activity-section"><h2>이미지 (선택)</h2><p className="form-hint">활동 유형에 맞는 이미지를 등록해 주세요. (최대 10장까지 등록 가능)</p>
    <div className="category-row"><label className="field-label">이미지 유형 <em>*</em></label><div className="category-buttons">
      {categories.map(item => <button className={category === item ? 'category active' : 'category'} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}
    </div></div>
    <ImagePicker value={images} onChange={setImages} multiple max={10} sizeMb={5} label="이미지 추가" />
  </section>;
}
