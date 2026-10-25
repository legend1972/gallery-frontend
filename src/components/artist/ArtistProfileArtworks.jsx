import { Button, Container } from "react-bootstrap";
import { FiInfo } from "react-icons/fi";

export default function ArtistProfileArtworks({onPrev, onNext}) {
    const handleNext = () => {
        onNext();
    };

    const handlePrev = () => {
        onPrev();
    };

    return (
        <div>
            <Container>
                <h1 className="h2 fw-bold mb-0">작품 목록</h1>
                <p className="text-secondary mb-0">프로필에 노출할 작품을 추가하고 순서를 설정해주세요.</p>
                <p className="text-secondary mb-0">드래그하여 순서를 변경할 수 있습니다.</p>
                <div className="auto-guide">
                    <FiInfo/>
                    <div>
                        <strong>
                            대표 작품은 최대 3개까지 선택할 수 있습니다.
                        </strong>
                    </div>
                </div>
                <Button type="button" variant="outline-primary" size="sm" className="add-button"><i className="bi bi-plus-lg me-2"/>작품 추가</Button>
                <p className="text-secondary my-1">최대 20까지 등록할 수 있습니다.</p>
                <div className="bottom-button-area">
                    <Button variant="outline-secondary" className="cancel-button" onClick={handlePrev}>
                        이전
                    </Button>

                    <Button className="next-button" onClick={handleNext}>
                        다음
                    </Button>
                </div>
            </Container>
        </div>
    );
}