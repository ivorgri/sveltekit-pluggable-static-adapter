# @ivorgri/sveltekit-pluggable-static-adapter

Adaption of the standard static adapter from the Sveltekit team. Inspiration for this custom adapter is based on [the input in issue #3166](https://github.com/sveltejs/kit/issues/3166) provided by [Adam Coster](https://github.com/adam-coster). The goal of the adapter is to allow custom logic to be run at specific hooks inside the build process of the static adapter. 

## Usage

Install package with `npm i -D @ivorgri/sveltekit-pluggable-static-adapter`, then add the adapter to your `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@ivorgri/sveltekit-pluggable-static-adapter';
```
## Hooks

There are three possible hooks:
* afterCleanupCallback
* afterPrerenderCallback
* afterPrecompressCallback

These hooks should be provided with functions that should be run in order by the callback hooks. This should be done in the svelte.config.js file. 

In these hooks, the following information from the static adapter is available:
* builder (can be used for adding logging to build process)
* pages (folder where the pages are generated)
* assets (folder where the assets are stored)

```js
// svelte.config.js
export default {
	kit: {
		adapter: adapter({
			// default options provided by regular static adapter
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
            afterCleanupCallback: async (builder, pages, assets) => {
				// Add functions here
			},
            afterPrerenderCallback: async (builder, pages, assets) => {
				// Add functions here
			},
            afterPrecompressCallback: async (builder, pages, assets) => {
				// Add functions here
			},
		})
	}
};
```
## Plugin

You can make your own plugin by creating an async function, which does something with the build files (or before they are build). For some examples, see the list of plugins below. 

### List of plugins

Below you can find a list of plugins that are already out there. 

* [Convert images to WEBP](https://www.npmjs.com/package/@ivorgri/sveltekit-pluggable-static-adapter-webp-plugin)

```js
// svelte.config.js

// ...

import convertAssetsToWebp from '@ivorgri/sveltekit-pluggable-static-adapter-webp-plugin';

//...

export default {
	kit: {
		adapter: adapter({
            // ...
            afterPrerenderCallback: async (builder, pages, assets) => {
				await convertAssetsToWebp(builder,assets);
			},
		})
	}
};
```

* [Download images from external origin](https://www.npmjs.com/package/@ivorgri/sveltekit-pluggable-static-adapter-external-image-plugin)

```js
// svelte.config.js

// ...

import replaceExternalImages from '@ivorgri/sveltekit-pluggable-static-adapter-external-image-plugin';

//...

export default {
	kit: {
		adapter: adapter({
            // ...
            afterPrerenderCallback: async (builder, pages, assets) => {
				await replaceExternalImages("origin.domain.of.images.com",builder,pages,assets)
			},
		})
	}
};
```

* [Create sitemap after generation](https://www.npmjs.com/package/@ivorgri/sveltekit-pluggable-static-adapter-sitemap-plugin)

```js
// svelte.config.js

// ...

import generateSitemap from '@ivorgri/sveltekit-pluggable-static-adapter-sitemap-plugin';

//...

export default {
	kit: {
		adapter: adapter({
            // ...
            afterPrerenderCallback: async (builder, pages, assets) => {
				await generateSitemap("your.site.domain.com",builder,pages)
			},
		})
	}
};
```

## Changelog

[The Changelog for this package is available on GitHub](https://github.com/ivorgri/sveltekit-pluggable-static-adapter/CHANGELOG.md).

## License

[MIT](LICENSE)
