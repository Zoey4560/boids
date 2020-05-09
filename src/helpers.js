export class Vector {
	// 2D vector helper class
	// Relative to canvas x,y (+y is "down"/SOUTH)
	// Rotated so that 0 rad => NORTH FIXME?

	static NORTH = () => new Vector([0, -1])
	static SOUTH = () => new Vector([0, 1])
	static EAST = () => new Vector([1, 0])
	static WEST = () => new Vector([-1, 0])
	static ZERO = () => new Vector()
	static RANDOM = () => new Vector([Math.random() * 2 - 1, Math.random() * 2 - 1])

	constructor(param) {
		this.x = 0
		this.y = 0
		if (typeof(param) !== 'undefined') {
			this._set(param)
		}
	}

	_set(param) {
		if (typeof(param) == 'number') {
			// Expecting theta radians
			this.x = Math.cos(param - Math.PI / 2)
			this.y = Math.sin(param - Math.PI / 2)
		}
		else if (typeof(param) == 'object') {
			// Expecting [x,y]
			this.x = param[0]
			this.y = param[1]
		}
		else {
			console.error(param)
			throw 'Invalid _set()'
		}
		return this
	}

	get radians() {
		return Math.atan2(this.y, this.x) + Math.PI / 2
		// + PI to shift to NORTH => 0 rad
		//FIXME atan2(0,0) => 0   --   should be NaN?
		//      will cause ZERO.radians == EAST.radians
	}

	rotate(r){
		return this._set([
			this.x * Math.cos(r) - this.y * Math.sin(r),
			this.x * Math.sin(r) + this.y * Math.cos(r)
		])
	}

	add(v) {
		this.x += v.x
		this.y += v.y
		return this
	}

	subtract(v){
		this.x -= v.x
		this.y -= v.y
		return this
	}

	divide(n) {
		this.x /= n
		this.y /= n
		return this
	}

	static radiansBetween(v1, v2) {
		let rad = v2.radians - v1.radians
		if (rad > Math.PI) {
			rad -= 2 * Math.PI
		}
		if (rad < -Math.PI) {
			rad += 2 * Math.PI
		}
		return rad
	}

	static averageVectors(lst) {
			let sum = lst.reduce((acc, v) => acc.add(v), this.ZERO())
			return sum.divide(lst.length)
	}
}
