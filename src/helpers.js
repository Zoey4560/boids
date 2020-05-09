export class Vector {
	// 2D vector helper class
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
			//TODO North relative?
			this.x = Math.cos(param)
			this.y = Math.sin(param)
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

	divide(n) {
		this.x /= n
		this.y /= n
		return this
	}

	static averageVectors(lst) {
			let sum = lst.reduce((acc, v) => acc.add(v), new this())
			return sum.divide(lst.length)
	}
}
