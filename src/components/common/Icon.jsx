import * as Fi from "react-icons/fi";
import * as Bs from "react-icons/bs";
import * as Ic from "react-bootstrap-icons";

const iconMap = {
    FiHome: Fi.FiHome,
    FiUser: Fi.FiUser,
    FiImage: Fi.FiImage,
    FiCalendar: Fi.FiCalendar,
    FiMenu: Fi.FiMenu,
    FiHeart: Fi.FiHeart,
    FiBell: Fi.FiBell,
    FiFilePlus: Fi.FiFilePlus,
    FiClipboard: Fi.FiClipboard,
    FiMessageCircle: Fi.FiMessageCircle,
    FiMessageSquare: Fi.FiMessageSquare,
    FiVolume2: Fi.FiVolume2,
    FiHelpCircle: Fi.FiHelpCircle,
    FiGrid: Fi.FiGrid,
    FiUsers: Fi.FiUsers,
    FiCheckCircle: Fi.FiCheckCircle,
    FiSettings: Fi.FiSettings,
    FiSearch: Fi.FiSearch,
    FiLogOut: Fi.FiLogOut,
    BsBell: Bs.BsBellFill,
    BsHeart: Bs.BsHeartFill,
    BsChatDots: Bs.BsChatDotsFill,
    BsCheckCircle: Bs.BsCheckCircleFill,
    BsHandThumbsUp: Bs.BsHandThumbsUpFill,
    BsMegaphone: Bs.BsMegaphoneFill,
    BsPersonPlus: Bs.BsPersonPlusFill,
    BsPersonCheck: Bs.BsPersonCheck,
    BsClipboardCheck: Bs.BsClipboardCheck,
    BsImage: Bs.BsImage,
    BsBuilding: Bs.BsBuilding,
    BsEnvelope: Bs.BsEnvelope,
    BsPeople: Bs.BsPeopleFill,
    BsBoxArrowInRight: Bs.BsBoxArrowInRight,
    BsImages: Bs.BsImages,
    BsBellGear: Bs.BsBellGear,
    BsPersonBadge: Bs.BsPersonBadge,
    BsPalette: Bs.BsPalette,
    HouseFill: Ic.HouseFill,
    Heart: Ic.Heart,
    CalendarEvent: Ic.CalendarEvent,
    PersonCheck: Ic.PersonCheck,
};

export default function Icon({iconNm, size=22, className=""}) {
    const Icon = iconMap[iconNm] ?? Fi.FiGrid;
    return (
        <Icon size={size} className={className} aria-hidden="true"/>
    );
}