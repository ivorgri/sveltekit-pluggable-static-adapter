import { Adapter } from '@sveltejs/kit';

interface AdapterOptions {
	pages?: string;
	assets?: string;
	fallback?: string;
	precompress?: boolean;
	afterCleanupPlugins?: [() => void];
	afterPrerenderPlugins?: [() => void];
	afterPrecompressPlugins?: [() => void];
}

declare function plugin(options?: AdapterOptions): Adapter;
export = plugin;
