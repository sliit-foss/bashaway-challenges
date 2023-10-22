/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
	],
	theme: {
		extend: {
			colors: {},
			fontFamily: {
				inter: ['Inter', 'sans']
			},
			transitionDuration: {
				medium: '300ms',
				long: '500ms'
			},
		}
	},
	plugins: []
};
