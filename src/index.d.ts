import { Adapter } from '@sveltejs/kit';

interface AdapterOptions {
	pages?: string;
	assets?: string;
	fallback?: string;
	precompress?: boolean;
	afterCleanupCallback?: Function;
	afterPrerenderCallback?: Function;
	afterPrecompressCallback?: Function;
}
