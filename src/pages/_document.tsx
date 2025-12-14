import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" suppressHydrationWarning>
            <Head />
            <body>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme');
                                    if (theme === 'light') {
                                        document.documentElement.classList.remove('dark');
                                    } else if (theme === 'dark') {
                                        document.documentElement.classList.add('dark');
                                    } else {
                                        // No preference saved, use system preference
                                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                            document.documentElement.classList.add('dark');
                                        }
                                    }
                                } catch (e) {
                                    // On error, respect system preference
                                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                        document.documentElement.classList.add('dark');
                                    }
                                }
                            })();
                        `,
                    }}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
