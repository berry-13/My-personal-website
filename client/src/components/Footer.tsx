const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full flex flex-col items-start border-t-2 border-black/10 dark:border-white/10 px-4 py-8 dark:border-opacity-50 mb-20">
            <p className="text-black dark:text-white/50 text-2xl font-semibold">Marco Beretta</p>
            <p className="text-black/60 dark:text-white/30 text-base">
                Software Engineer &bull; {currentYear}
            </p>
        </footer>
    );
};

export default Footer;
