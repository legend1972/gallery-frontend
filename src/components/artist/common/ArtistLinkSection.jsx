import { Button, Form } from "react-bootstrap";
import SectionTitle from "../../common/SectionTitle";

export default function ArtistLinkSection({sites, siteList, changeSite, removeSite, addSite, num}) {
    return (
            <section>
                <div className="section-header">
                    <SectionTitle icon="bi-link-45deg" number={`${num}. `} title="웹사이트/SNS"/>
                    <Button type="button" variant="outline-primary" size="sm" className="add-button" onClick={addSite}><i className="bi bi-plus-lg me-2"/>링크 추가</Button>
                </div>
                <div className="career-table-wrapper">
                    <table className="career-table mb-2">
                        <thead>
                            <tr>
                                <th style={{width: "40%"}}>구분</th>
                                <th>주소(URL)</th>
                                <th style={{width: "52px"}} className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.sn}>
                                    <td>
                                        <Form.Select value={site.siteCode} onChange={(e) => changeSite(site.sn, "siteCode", e.target.value)}>
                                            <option value="">
                                                선택하세요.
                                            </option>
                                            {siteList.map((item) => {
                                                return (
                                                    <option key={item.code} value={item.code}>
                                                        {item.codeNm}
                                                    </option>
                                                )
                                            })}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Control value={site.url} onChange={(e) => changeSite(site.sn, "url", e.target.value)} placeholder="http://naver.com"/>
                                    </td>
                                    <td className="text-center align-middle">
                                        <button type="button" className="delete-icon-button" aria-label="웹사이트/SNS 삭제" onClick={() => removeSite(site.sn)}>
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
};