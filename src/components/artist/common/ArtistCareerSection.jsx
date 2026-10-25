import DatePicker from "react-datepicker";
import SectionTitle from "../../common/SectionTitle";
import { Button, Form } from "react-bootstrap";

export default function ArtistCareerSection({careers, careerSeList, removeCareer, changeCareer, addCareer, num}) {
    return (
            <section className="form-section">
                <div className="section-header">
                    <SectionTitle icon="bi-briefcase" number={`${num}. `} title="주요 경력"/>
                    <Button type="button" variant="outline-primary" size="sm" className="add-button" onClick={addCareer}><i className="bi bi-plus-lg me-2"/>경력 추가</Button>
                </div>
                <div className="career-table-wrapper">
                    <table className="career-table mb-2">
                        <thead>
                            <tr>
                                <th style={{width: "22%"}}>연도</th>
                                <th style={{width: "22%"}}>구분</th>
                                <th>경력 내용</th>
                                <th style={{width: "52px"}} className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {careers.map((career) => (
                                <tr key={career.sn}>
                                    <td>
                                        <DatePicker
                                            selected={
                                                career.careerYear ? new Date(Number(career.careerYear), 0, 1) : null
                                            }
                                            onChange={(date) => {
                                                changeCareer(career.sn, "careerYear", date ? String(date.getFullYear()) : "");
                                            }}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            placeholderText="연도 선택"
                                            className="form-control"
                                            maxDate={new Date()}
                                        />
                                    </td>
                                    <td>
                                        <Form.Select value={career.careerSeCode} onChange={(e) => changeCareer(career.sn, "careerSeCode", e.target.value)}>
                                            <option value="">
                                                선택하세요.
                                            </option>
                                            {careerSeList.map((item) => {
                                                return (
                                                    <option key={item.code} value={item.code}>
                                                        {item.codeNm}
                                                    </option>
                                                )
                                            })}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Control value={career.careerCn} onChange={(e) => changeCareer(career.sn, "careerCn", e.target.value)} placeholder="예) 개인전 '빛의 기록' (갤러리 A)"/>
                                    </td>
                                    <td className="text-center align-middle">
                                        <button type="button" className="delete-icon-button" aria-label="경력 삭제" onClick={() => removeCareer(career.sn)}>
                                            <i className="bi bi-x-lg"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
    );
}