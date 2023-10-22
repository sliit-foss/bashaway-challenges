import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	base: './',
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes'),
			$styles: path.resolve('./src/styles'),
		}
	}
});
