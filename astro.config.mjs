// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Orchestera Platform',
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				themes: ['github-dark'],
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Orchestera/' }],
			sidebar: [
				{
					label: 'Setting Up Your Account',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Orchestera Account Sign Up', slug: 'guides/orchestera-account-signup' },
						{ label: 'AWS Account Setup', slug: 'guides/aws-account-setup' },
						{ label: 'Creating your first Spark Cluster', slug: 'guides/creating-your-first-stack' },
						{ label: 'Giving workspace users access to the Spark K8s Cluster', slug: 'guides/user-access-to-spark-cluster' },
						{ label: 'Giving your Spark jobs access to S3 and other AWS resources', slug: 'guides/giving-access-to-s3' },
						{ label: 'Injecting secrets into your Spark jobs', slug: 'guides/injecting-secrets-into-your-spark-jobs' },
					],
				},
				{
					label: 'Tutorials',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Developing Spark applications using Jupyter Notebooks', slug: 'tutorials/jupyter-notebooks' },
						{ label: 'Writing your first hello-world Spark pipeline', slug: 'tutorials/hello-world' },
						{ label: 'Using Iceberg tables with Spark', slug: 'tutorials/iceberg-hello-world' },
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
