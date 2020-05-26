import {Vector} from './helpers.js'

export default class Boids {
	/* Container for grouping of boids/flock */
	simulationTickDelay = 15
	constructor(width, height, count) {
		this._simulationTimer = null
		this._frameTimes = [Date.now()]
		this.width = width
		this.height = height
		this.boids = []
		for (let i=0; i < count; i++) {
			this.boids.push(new Boid(
				(Math.random() * (width - 2*50)) + 50,
				(Math.random() * (height - 2*50)) + 50,
				Math.random() * Math.PI * 2 //in radians
			))
		}
		this.config = {
			'moveSpeed': 4,
			'visionRange': 0.1 * Math.min(width, height),
			'turnSpeed': 0.05,
			'wallFactor': 10,
			'seperationFactor': 3,
			'alignmentFactor': 1,
			'cohesionFactor': 1,
		}
		this.startSimulation()
	}

	getFrameTime() {
		let frameTimeSum = this._frameTimes.slice(1).reduce((acc, cur, i) => {
			return acc + cur - this._frameTimes[i]
		}, 0)
		return frameTimeSum/this._frameTimes.length
	}

	startSimulation() {
		clearInterval(this._simulationTimer)
		this._simulationTimer = setInterval(
			this.stepSimulation.bind(this), this.simulationTickDelay
		)
	}

	stepSimulation() {
		this._frameTimes.push(Date.now())
		if (this._frameTimes.length > 10) {
			this._frameTimes.shift()
		}

		//TODO
		//organize boids into sectors
		// let sectors = []
		// this.boids.forEach(boid => {
		// 	let sectorKey = toString(Math.floor(boid.locX/this.config.visionRange))
		// 	if (!)
		// });


		this.boids.forEach(boid => {
			let desiredVectors = []

			// [[boid, relativeVector], ...]
			let boidMapsInVision = this.boids.map(b => {
				if (b == boid) { return null }
				let vectorBetween = new Vector([
					b.locX - boid.locX,
					b.locY - boid.locY
				])
				if (vectorBetween.magnitude > this.config.visionRange) {
					return null
				}
				else {
					return [b, vectorBetween]
				}
			}).filter(x => x != null)
			//TODO boids shouldn't be able to see behind themselves (traditionally)


			// Avoid walls
			let wallVector = Vector.ZERO()
			if (boid.locX < this.config.visionRange) { //Left
				wallVector = Vector.EAST()
			}
			else if (boid.locX > this.width - this.config.visionRange) { //Right
				wallVector = Vector.WEST()
			}
			if (boid.locY < this.config.visionRange) { //Top
				wallVector = Vector.SOUTH()
			}
			else if (boid.locY > this.height - this.config.visionRange) { //Bottom
				wallVector = Vector.NORTH()
			}
			desiredVectors.push(wallVector.multiply(this.config.wallFactor))

			if (boidMapsInVision.length > 0)
			{
				// Separation
				let closestDist = Infinity
				let closestVector = boidMapsInVision.reduce((acc, cur) => {
					let m = cur[1].magnitude
					if (m < closestDist) {
						closestDist = m
						return cur[1]
					}
					else {
						return acc
					}
				}, Vector.ZERO())
				let distanceFactor = (this.config.visionRange - closestDist) / this.config.visionRange
				desiredVectors.push(
					Vector.ZERO()
						.subtract(closestVector)
						.normalize()
						.multiply(this.config.seperationFactor)
						.multiply(distanceFactor)
				)

				// Alignment
				let averageVisionVector = Vector.averageVectors(
					boidMapsInVision.map(bm => bm[0].vector)
				)
				desiredVectors.push(averageVisionVector.normalize().multiply(
					this.config.alignmentFactor
				))

				// Cohesion
				let averageRelativeLocation = Vector.averageVectors(
					boidMapsInVision.map(bm => bm[1]).concat([Vector.ZERO()])
																						//include self
				)
				desiredVectors.push(averageRelativeLocation.normalize().multiply(
					this.config.cohesionFactor
				))
			}



			let averageDesire
			if (desiredVectors.length > 0) {
				averageDesire = Vector.averageVectors(desiredVectors)
			}
			else {
				//default behavior
				// averageDesire = Vector.RANDOM()
				// averageDesire = boid.vector.rotate(0.01)
				averageDesire = Vector.ZERO()
			}
			//steer towards desire
			if (averageDesire.magnitude > 0) {
				let desiredSteer = Vector.radiansBetween(boid.vector, averageDesire)
				let allowedSteerMagnitude = Math.min(
					Math.abs(desiredSteer),
					this.config.turnSpeed
				)
				boid.rot += Math.sign(desiredSteer) * allowedSteerMagnitude
			}
			//TODO could only steer if greater than some minimum threshold. Reduce wobbles

			// fly forward
			let forward = Vector.NORTH().rotate(boid.rot).multiply(
				this.config.moveSpeed
			)
			boid.locX += forward.x
			boid.locY += forward.y
		})
	}
}

class Boid {
	/* Singular boid/bird */
	constructor(locX, locY, rot) {
		this.locX = locX
		this.locY = locY
		this.rot = rot
	}

	get vector() {
		return new Vector(this.rot)
	}

}
