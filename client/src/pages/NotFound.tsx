import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
    const { pathname } = useLocation();
    return (
        <>
            <h1 className="text-[clamp(2.6rem,7.2vw,6.75rem)] leading-[1.02] tracking-[-0.025em]">No such entry</h1>
            <p className="mt-6 font-mono text-[13px] text-muted">
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
