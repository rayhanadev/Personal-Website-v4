import Head from 'next/head';

import { useTheme } from 'next-themes';

import styles from '../styles/pages/Home.module.scss';

export default function Home() {
	const { theme, setTheme } = useTheme();

	return (
		<div className={styles.container}>
			<Head>
				<title>Ray Arayilakath</title>
				<meta
					name="description"
					content="Work in Progress"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Coming Soon</h1>
				<button
					className={styles.button}
					onClick={() =>
						setTheme(theme === 'light' ? 'dark' : 'light')
					}
				>
					{theme === 'light'
						? 'Switch to Dark Theme'
						: 'Switch to Light Theme'}
				</button>
			</main>
		</div>
	);
}
