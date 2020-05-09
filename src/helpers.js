export function rotate(x, y, r) {
	return [
		x * Math.cos(r) - y * Math.sin(r),
		x * Math.sin(r) + y * Math.cos(r)
	]
}
