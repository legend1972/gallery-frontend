import React, { useEffect, useRef, useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';

/** 이미지 파일은 미리보기용 URL로 관리합니다. 서버 전송 시 file 필드를 사용하세요. */
export default function ImagePicker({ value, onChange, multiple = false, max = 1, sizeMb = 5, label = '이미지 업로드', compact = false }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const images = value || [];
  useEffect(() => () => { /* URL 정리는 최상위 폼의 언마운트에서 담당 */ }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(file => ['image/png', 'image/jpeg'].includes(file.type) && file.size <= sizeMb * 1024 * 1024);
    setError(files.length !== valid.length ? `JPG, PNG 파일만 가능하며 파일당 ${sizeMb}MB 이하여야 합니다.` : '');
    const added = valid.slice(0, multiple ? Math.max(0, max - images.length) : 1).map(file => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }));
    onChange(multiple ? [...images, ...added] : added);
    e.target.value = '';
  };
  const remove = id => {
    const item = images.find(image => image.id === id);
    if (item?.file && item.preview?.startsWith('blob:')) URL.revokeObjectURL(item.preview);
    onChange(images.filter(image => image.id !== id));
  };
  return <div>
    <div className={`image-picker ${compact ? 'compact' : ''}`}>
      {images.map(image => <div className="image-thumb" key={image.id}>
        <img src={image.preview} alt="등록 이미지 미리보기" />
        <button type="button" aria-label="이미지 삭제" className="image-remove" onClick={() => remove(image.id)}><FiX /></button>
      </div>)}
      {images.length < max && <button className="image-add" type="button" onClick={() => inputRef.current?.click()}>
        <FiImage size={19} /><strong>{images.length && !multiple ? '이미지 변경' : label}</strong><span>JPG, PNG (최대 {sizeMb}MB)</span>
      </button>}
    </div>
    <input ref={inputRef} className="d-none" type="file" accept="image/jpeg,image/png" multiple={multiple} onChange={handleFiles} />
    {error && <div className="text-danger form-hint">{error}</div>}
  </div>;
}
