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
                                    } else {
                                        document.documentElement.classList.add('dark');
                                    }
                                } catch (e) {
                                    document.documentElement.classList.add('dark');
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
