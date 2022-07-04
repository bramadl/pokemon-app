export const uniqueArray = (a: any[]) =>
	[...new Set(a.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));
