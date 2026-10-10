import BottomNavi from "./BottomNavi";
import Header from "./Header";
import "./MobileLayout.css";

export default function MobileLayout({showHeader, showBottom, routes = [], children}) {
    return (
        <div className="mobile-layout">
            {showHeader&&<Header/>}
            <main className="mobile-content">
                {children}
            </main>
            {showBottom&&<BottomNavi routes={routes}/>}
        </div>
    );
}