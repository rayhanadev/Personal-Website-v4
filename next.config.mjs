import withPlugins from 'next-compose-plugins';

import nextMDX from '@next/mdx';
const withMDX = nextMDX({
	extension: /\.mdx?$/,
	options: {
		providerImportSource: '@mdx-js/react',
	},
});

import nextBundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = nextBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

import nextTranspileModules from 'next-transpile-modules';
const withTranspileModules = nextTranspileModules([]);

const dev = !(process.env.NODE_ENV === 'production');

export default withPlugins(
	[[withBundleAnalyzer], [withMDX], [withTranspileModules]],
	{
		pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
		reactStrictMode: true,
		swcMinify: true,
		webpack5: true,
		esmExternals: 'loose',
		webpack: (config, { dev, isServer }) => {
			config.module.rules.push({
				test: /\.(png|jpe?g|gif|mp4)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: '/_next',
							name: 'static/media/[name].[hash].[ext]',
						},
					},
				],
			});

			config.module.rules.push({
				test: /\.(graphql|gql)/,
				use: [
					{
						loader: 'graphql-tag/loader',
					},
				],
			});

			config.module.rules.push({
				test: /\.svg$/,
				use: ['@svgr/webpack'],
			});

			if (!dev) {
				// Replace React with Preact only in client production build
				Object.assign(config.resolve.alias, {
					react: 'preact/compat',
					'react-dom/test-utils': 'preact/test-utils',
					'react-dom': 'preact/compat',
				});
			}

			config.experiments = { topLevelAwait: true, layers: true };

			return config;
		},
	},
);
