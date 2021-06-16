import Header from "../components/header";
import Footer from "../components/footer";
import { CSSProperties } from "react";

/**
 * Includes the header and the footer
 * @param user should include an 'mail' attribute to be shown
 * @param children react components which will be included inside the layout
 * @constructor
 */
export default function Layout({ user, children }) {
    const layoutStyle : CSSProperties = {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%"
    };
    const contentStyle : CSSProperties = {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    };

    return (
        <div className={"Layout"} style={layoutStyle}>
            <Header user={user} />
            <div className="Content" style={contentStyle}>
                {children}
            </div>
            <Footer />
        </div>
    );
}
