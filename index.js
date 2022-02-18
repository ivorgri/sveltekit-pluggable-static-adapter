// import type { Builder } from '@sveltejs/kit'
import { createReadStream, createWriteStream, statSync } from 'fs';
import { pipeline } from 'stream';
import glob from 'tiny-glob';
import { promisify } from 'util';
import zlib from 'zlib';

const pipe = promisify(pipeline);

//: {pages:string, assets:string, fallback:string, precompress:boolean, afterCleanupPlugins:[()=>void], afterPrerenderPlugins:[()=>void], afterPrecompressPlugins:[()=>void]}) 
/** @type {import('.')} */
export default function ({ pages = 'build', assets = pages, fallback, precompress = false, afterCleanupPlugins, afterPrerenderPlugins, afterPrecompressPlugins
 }) 
 {
	return {
		name: '@ivorgri/sveltekit-pluggable-adapter-static',

		async adapt(builder) {
			builder.rimraf(assets);
			builder.rimraf(pages);

			await executePlugins(builder,afterCleanupPlugins,'prerender');

			builder.writeStatic(assets);
			builder.writeClient(assets);

			await builder.prerender({
				fallback,
				all: !fallback,
				dest: pages
			});

			await executePlugins(builder,afterPrerenderPlugins,'prerender');

			if (precompress) {
				console.log("Compressing..")
				if (pages === assets) {
					builder.log.minor('Compressing assets and pages');
					await compress(assets);
				} else {
					builder.log.minor('Compressing assets');
					await compress(assets);

					builder.log.minor('Compressing pages');
					await compress(pages);
				}
			}

			await executePlugins(builder,afterPrecompressPlugins,'precompress');

			if (pages === assets) {
				builder.log(`Wrote site to "${pages}"`);
			} else {
				builder.log(`Wrote pages to "${pages}" and assets to "${assets}"`);
			}
		}
	};
}

/**
 * @param {[()=>void]} plugin_array
 * @param {string} process
 */
// https://www.coreycleary.me/executing-arrays-of-async-await-javascript-functions-in-series-vs-concurrently/
async function executePlugins(builder, plugin_array,process) {
	if (plugin_array && plugin_array.length > 0) {
		builder.log(`Performing after ${process} plugins [${plugin_array.length}]`);
		for (const plugin of plugin_array) {
			builder.log(`Plugin: ${plugin.name ? plugin.name : 'Unnamed plugin'}`);
			await plugin();
		}
	}
}

/**
 * @param {string} directory
 */
 async function compress(directory) {
	const files = await glob('**/*.{html,js,json,css,svg,xml}', {
		cwd: directory,
		dot: true,
		absolute: true,
		filesOnly: true
	});

	await Promise.all(
		files.map((file) => Promise.all([compress_file(file, 'gz'), compress_file(file, 'br')]))
	);
}

/**
 * @param {string} file
 * @param {'gz' | 'br'} format
 */
async function compress_file(file, format = 'gz') {
	const compress =
		format == 'br'
			? zlib.createBrotliCompress({
				params: {
					[zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
					[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
					[zlib.constants.BROTLI_PARAM_SIZE_HINT]: statSync(file).size
				}
			})
			: zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });

	const source = createReadStream(file);
	const destination = createWriteStream(`${file}.${format}`);

	await pipe(source, compress, destination);
}
