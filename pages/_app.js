import { ThemeProvider } from 'next-themes';

import '../styles/layouts/globals.scss';
import '../styles/third-party/sanitize.scss';

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
