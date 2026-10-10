import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function ImageUploadBox({inputId, icon, title, desc, image, existingFileUrl = "", fileNo, onChange}) {
    // const previewUrl = fileNo instanceof File ? URL.createObjectURL(fileNo) : image;
                            // image={reprsntPrdctFileNo} //사용자가 선택한 파일
                            // existingFileUrl={reprsntPrdctImageNo ?? ""} //서버에서 받은 파일 정보 (api/file/파일번호/순번)
                            // fileNo={reprsntPrdctImageFile?.fileNo ?? ""} //파일번호
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        // 사용자가 새 파일을 선택한 경우에는 File/Blob으로 미리보기 URL을 만든다.
        if (image instanceof Blob) {
            const objectUrl = URL.createObjectURL(image);
            setPreviewUrl(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

        // 새 파일이 없으면 서버에 이미 저장된 기존 파일 URL을 그대로 사용한다.
        setPreviewUrl(existingFileUrl || "");

        return undefined;
    }, [image, existingFileUrl]);

    return (
        <Form.Label htmlFor={inputId} className="image-upload-box">
            <Form.Control type="file" accept="image/jpeg, image/png" hidden onChange={onChange} id={inputId} name={inputId}></Form.Control>
            {previewUrl ? (
                <div className="image-preview-wrapper">
                    <img src={previewUrl} alt={`${title} 미리보기`} className="image-preview"/>
                    <div className="image-change-text">
                        클릭하여 이미지 변경
                    </div>
                    {fileNo && !image && (
                        <div className="image-file-no">
                            기존 파일: {fileNo}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <i className={`bi ${icon} upload-icon`}/>
                    <strong>{title}</strong>
                    <ul>
                        {desc.map((text) => (
                            <li key={text}>{text}</li>
                        ))}
                    </ul>
                </>
            )}
        </Form.Label>
    );
}