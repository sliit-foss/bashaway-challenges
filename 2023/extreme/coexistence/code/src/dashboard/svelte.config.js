import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {}
	},
	preprocess: vitePreprocess()
};

export default config;
