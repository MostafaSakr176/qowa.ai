import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'api.qowa.ai',
				port: '',
				pathname: '/media/**'
			},
			{
				protocol: 'https',
				hostname: 'api.qowa.ai',
				port: '',
				pathname: '/media/**'
			}
		]
	}
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);