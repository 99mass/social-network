import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head >
                    {/* font awsome cdn */}
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                        crossorigin="anonymous"
                        referrerpolicy="no-referrer"
                    />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SYtiFz9zOePnL+5ujzIeA1kTTTKF9cYucUUTPr" crossorigin="anonymous" />

                    {/* font awsom local */}
                    {/* <link rel="stylesheet" href="/font-awesome/css/all.css" /> */}
                </Head>
                <body>

                    <Main />
                    <NextScript />

                </body>
            </Html>
        )
    }
}

export default MyDocument