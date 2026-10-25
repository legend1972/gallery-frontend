// import { useNavigate, useLocation } from "react-router-dom";
// import {
//     FiHome,
//     FiUser,
//     FiImage,
//     FiCalendar,
//     FiMenu
// } from "react-icons/fi";

import { Container } from "react-bootstrap";
import AllMenu from "./AllMenu";

// const bottomMenus = [
// {
//     menuId: "BOTTOM001",
//     menuNm: "홈",
//     menuUrl: "/",
//     icon: FiHome
// },
// {
//     menuId: "BOTTOM002",
//     menuNm: "작가",
//     menuUrl: "/artists",
//     icon: FiUser
// },
// {
//     menuId: "BOTTOM003",
//     menuNm: "작품",
//     menuUrl: "/artwork/exhibition/",
//     icon: FiImage
// },
// {
//     menuId: "BOTTOM004",
//     menuNm: "전시",
//     menuUrl: "/exhibitions",
//     icon: FiCalendar
// },
// {
//     menuId: "BOTTOM005",
//     menuNm: "전체",
//     menuUrl: "/menu/all",
//     icon: FiMenu
// }
// ];

export default function AllMenuPage() {
    return (
        <div>
            <Container>
                <AllMenu/>
            </Container>
        </div>
    );
    // const navigate = useNavigate();
    // const location = useLocation();

    // return (
    //         <nav className="all-bottom-nav" aria-label="하단 메뉴">
    //             {bottomMenus.map((menu) => {
    //                 const Icon = menu.icon;
    //                 const isActive =
    //                 menu.menuUrl === "/"
    //                 ? location.pathname === "/"
    //                 : location.pathname === menu.menuUrl ||
    //                 location.pathname.startsWith(menu.menuUrl + "/");

    //             return (
    //                     <button
    //                         type="button"
    //                         key={menu.menuId}
    //                         className={`all-bottom-item ${
    //                         isActive ? "active" : ""
    //                         }`}
    //                         onClick={() => navigate(menu.menuUrl)}
    //                         aria-current={isActive ? "page" : undefined}
    //                     >
    //                     <Icon size={25} />
    //                     <span>{menu.menuNm}</span>
    //                     </button>
    //                     );
    //                 })}
    //         </nav>
    // );
}