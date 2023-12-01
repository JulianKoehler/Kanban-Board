import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <div id="backdrop" />
                <div id="overlay" />
                <NextScript />
            </body>
        </Html>
    );
}
