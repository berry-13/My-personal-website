const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack(config) {
        config.resolve.alias["~"] = path.resolve(__dirname, "src/");
        return config;
    },
    async redirects() {
        return [
            {
                source: "/github",
                destination: "https://github.com/berry-13",
                permanent: true,
            },
            {
                source: "/x",
                destination: "https://x.com/Berry13000",
                permanent: true,
            },
            {
                source: "/linkedin",
                destination: "https://linkedin.com/in/marco-beretta-berry/",
                permanent: true,
            },
        ];
    },
};
