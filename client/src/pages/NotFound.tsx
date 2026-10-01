import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
    const { pathname } = useLocation();
    return (
        <>
            <h1 className="text-[clamp(1.6rem,4.2vw,2.35rem)] leading-tight">No such entry</h1>
            <p className="mt-3 font-mono text-[13px] text-muted">
                404 &middot; nothing lives at <span className="text-ink">{pathname}</span>
            </p>
            <p className="mt-8 text-[17px]">
                <Link to="/" viewTransition className="link">
                    Back to the index
                </Link>
            </p>
        </>
    );
};

export default NotFound;
