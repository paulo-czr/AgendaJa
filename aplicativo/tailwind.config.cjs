module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				marca: {
					50: '#effbf4',
					100: '#d8f6e3',
					500: '#20a464',
					600: '#168650',
					700: '#126b42',
				},
			},
			boxShadow: {
				painel: '0 24px 70px -35px rgba(17, 47, 33, 0.28)',
			},
		},
	},
	plugins: [],
};
