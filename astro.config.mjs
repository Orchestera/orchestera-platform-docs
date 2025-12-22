// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Orchestera Platform',
			expressiveCode: {
				themes: ['github-dark'],
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Setting Up Your Account',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Orchestera Account Sign Up', slug: 'guides/orchestera-account-signup' },
						{ label: 'AWS Account Setup', slug: 'guides/aws-account-setup' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
	site: 'https://orchestera.github.io',
});
