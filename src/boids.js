import {Vector} from './helpers.js'

export default class Boids {
	/* Container for grouping of boids/flock */
	simulationTickDelay = 1
	constructor(width, height, count) {
		this._simulationTimer = null
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
		this.boids[0].initConfig() //HACK: only init one. Might need all
		this.boids[0].setConfig('B', this)
		this.startSimulation()
	}

	startSimulation() {
		clearInterval(this._simulationTimer)
		this._simulationTimer = setInterval(
			this.stepSimulation.bind(this), this.simulationTickDelay
		)
	}

	stepSimulation() {
		this.boids.forEach(boid => {
			let desiredVectors = []

			// Avoid walls
			let padding = 0.1 * Math.min(this.width, this.height)
			if (boid.locX < padding) { //Left
				desiredVectors.push(Vector.EAST())
			}
			else if (boid.locX > this.width - padding) { //Right
				desiredVectors.push(Vector.WEST())
			}
			if (boid.locY < padding) { //Top
				desiredVectors.push(Vector.SOUTH())
			}
			else if (boid.locY > this.height - padding) { //Bottom
				desiredVectors.push(Vector.NORTH())
			}

			// Separation

			// Alignment

			// Cohesion



			let averageDesire
			if (desiredVectors.length > 0) {
				averageDesire = Vector.averageVectors(desiredVectors)
			}
			else {
				//default behavior
				// averageDesire = Vector.RANDOM()
				// averageDesire = boid.vector.rotate(0.01)
				averageDesire = boid.vector
			}
			//steer towards desire
			let desiredSteer = Vector.radiansBetween(boid.vector, averageDesire)
			let allowedSteerMagnitude = Math.min(
				Math.abs(desiredSteer),
				boid.getConfig('rotSpeed')
			)
			boid.rot += Math.sign(desiredSteer) * allowedSteerMagnitude

			if (boid.getConfig('debug')) {
				debugger;
			}

			if (boid.getConfig('fly')) {
				// fly forward
				let forward = Vector.NORTH().rotate(boid.rot)
				boid.locX += forward.x
				boid.locY += forward.y
				// could add speed here
			}
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

	initConfig() {
		if (!window.hasOwnProperty('BoidConfig')) {
			window.BoidConfig = {
				// Default config values
				'fly': true,
				'debug': false,
				'rotSpeed': 0.05,
			}
		}
	}

	get vector() {
		return new Vector(this.rot)
	}

	// TODO: member specific overrides; if needed
	getConfig(key) {
		return window.BoidConfig[key]
	}

	setConfig(key, value) {
		window.BoidConfig[key] = value
	}

}
