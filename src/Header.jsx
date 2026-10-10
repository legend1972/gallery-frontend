import { Button, Container, Navbar, Nav } from "react-bootstrap";
export default function Header(){
  return <Navbar bg="white" expand="md" className="artgr-header shadow-sm">
    <Container fluid className="px-3 px-md-4">
      <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
        <span className="brand-text"><strong>ART</strong><strong className="brand-gr">GR</strong></span>
        <span className="brand-subtitle">아트갤러리</span>
      </Navbar.Brand>
      <Nav className="ms-auto flex-row align-items-center gap-3">
        <Nav.Link href="/login" className="fw-semibold text-secondary">로그인</Nav.Link>
        <Button variant="outline-primary" href="/" className="d-inline-flex align-items-center gap-2 px-3">⌂ 메인으로</Button>
      </Nav>
    </Container>
  </Navbar>;
}
