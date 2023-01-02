import { RelayProvider } from '@/lib/relay'
import { AppProps } from 'next/app'

import '@/tailwind.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RelayProvider pageProps={pageProps}>
            <Component {...pageProps} />
        </RelayProvider>
    )
}
