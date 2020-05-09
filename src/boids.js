import {rotate} from './helpers.js'

export default class Boids {
	/* Container for grouping of boids/flock */
	constructor(width, height, count) {
		this._simulationTimer = null
		this.width = width
		this.height = height
		this.boids = []
		for (let i=0; i < count; i++) {
			this.boids.push(new Boid(
				Math.random() * width,
				Math.random() * height,
				Math.random() * Math.PI * 2 //in radians
			))
		}
		this.startSimulation()
	}

	startSimulation() {
		console.log(this)
		clearInterval(this._simulationTimer)
		this._simulationTimer = setInterval(
			this.stepSimulation.bind(this), 1
		)
	}

	stepSimulation() {
		this.boids.forEach(boid => {
			boid.rot = (boid.rot + 0.01) % (Math.PI * 2)
			let forward = rotate(0, -1, boid.rot)
			boid.locX += forward[0]
			boid.locY += forward[1]
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
}
