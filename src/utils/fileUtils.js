    //파일 유효성 검사
    export const validateImageFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        if(!allowedTypes.includes(file.type)) {
            alert("JPG, JPEG, PNG 이미지 파일만 등록할 수 있습니다.");
            return false;
        }

        if(file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 최대 5MB 까지 등록할 수 있습니다.");
            return false;
        }

        return true;
    };