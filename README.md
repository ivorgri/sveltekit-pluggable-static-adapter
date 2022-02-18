# @ivorgri/sveltekit-pluggable-static-adapter

Adaption of the standard static adapter from the Sveltekit team. Inspiration for this custom adapter is based on [the input in issue #3166](https://github.com/sveltejs/kit/issues/3166) provided by [Adam Coster](https://github.com/adam-coster).

## Usage

Install with `npm i -D @ivorgri/sveltekit-adapter-static-local-image`, then add the adapter to your `svelte.config.js`:

```js
// svelte.config.js
import adapter from '@ivorgri/sveltekit-adapter-static-local-image';

export default {
	kit: {
		adapter: adapter({
			// default options provided by regular static adapter
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
            // Add domain static image downloader
            cmsUrls: ["your.domain.com/potential/sub/route"],
			// Added converted JPG/JPEG/PNG to WEBP images
			convertWebpImages: false
		})
	}
};
```
## Options

### cmsUrls

A list of strings containing the URLs from which you would like to download the images. The adapter will take these URLs and start going through the generated files. Once it finds a complete link, including an image extension, it will download the files into the "img" folder inside the folder that provided for "assets". Once all the files are downloaded, the URL in the generated files with be replaced with a relative link to the "img" folder. 

Be aware: the adapter looks for the base URL which is similar for ALL images. Any dynamic routing (i.e. date sub directories) are added to the "img" folder. 

For example, if you have the following URL:
```
    https://your.domain.com/upload/folder/2022/02/02/image.jpg
```

You should provide the following URL:

```
    https://your.domain.com/upload/folder
```

The adapter will then create the following directory in the "img" folder:

```
img
└─── 2022
     └─── 02
          └─── 02
               |   image.jpg
```

### convertWebpImages

When set to "true", the adapter will take all the JPG/JPEG/PNG files it can find, and convert those to WEBP files. This option should be used in conjunction with a specific implementation for a <code><picture></code> component. It should convert the existing URL for an image to a WEBP variant. When running this in a development environment, without having access to the WEBP file, a condition is added which checks if a WEBP source set should be used. Make sure to change this when running the build, so the sourceset is added to the result.  

```
<script lang="ts">
    export let imageSrc:string;
    export let imageAlt:string;
    
    let useWebp = import.meta.env.VITE_USE_WEBP; // Or another environment variable that you would like to use

    $: imageSrcWebp = imageSrc.replace(/jpg|jpeg|png/g,"webp");
</script>

<picture>
    {#if useWebp}
        <source srcset="{imageSrcWebp}" type="image/webp"> 
    {/if}
    <img src="{imageSrc}" alt="{imageAlt}">
</picture>
```

## Changelog

[The Changelog for this package is available on GitHub](https://github.com/ivorgri/sveltekit-adapter-static-local-image/CHANGELOG.md).

## License

[MIT](LICENSE)
