import {Vector} from './helpers.js'

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
		this.boids[0].initConfig() //HACK: only init one. Might need all
		this.startSimulation()
	}

	startSimulation() {
		clearInterval(this._simulationTimer)
		this._simulationTimer = setInterval(
			this.stepSimulation.bind(this), 1
		)
	}

	stepSimulation() {
		this.boids.forEach(boid => {
			// Avoid walls
			let padding = 0.1 * Math.min(this.width, this.height)
			let direction = 0
			if ( //left
				boid.locX < padding
				&& boid.rot > Math.PI
				&& boid.rot < 2 * Math.PI
					//TODO needs extra angle padding?8
			) {
				//TODO direct rotation is naive?
				//     some way to average intended angles?
				//     unit vectors
				//FIXME Math.sign(0) returns 0... no wall influence
				direction = Math.sign(
					boid.rot - (3 * Math.PI / 2)
				)
			}
			else if ( //Right
				boid.locX > this.width - padding
				&& boid.rot > 0
				&& boid.rot < Math.PI
			) {
				direction = Math.sign(
					boid.rot - (Math.PI / 2)
				)
			}
			if ( //Top
				boid.locY < padding
				&& (
					boid.rot > 3 * Math.PI / 2
					|| boid.rot < Math.PI / 2
				)
			) {
				direction = -1 * Math.sign(
					boid.rot - Math.PI
				)
			}
			else if ( //Bottom
				boid.locY > this.height - padding
				&& boid.rot > Math.PI / 2
				&& boid.rot < (3 * Math.PI / 2)
			) {
				direction = Math.sign(
					boid.rot - Math.PI
				)
			}
			boid.rot += direction * boid.getConfig('rotSpeed')


			// Separation

			// Alignment

			// Cohesion


			// test - circling
			boid.rot = (boid.rot + 0.01) % (Math.PI * 2)


			if (boid.getConfig('debug')) {
				console.log(boid.rot)
			}

			if (boid.getConfig('fly')) {
				// fly forward
				let forward = new Vector([0, -1]).rotate(boid.rot)
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

	// TODO: member specific overrides; if needed
	getConfig(key) {
		return window.BoidConfig[key]
	}

	setConfig(key, value) {
		window.BoidConfig[key] = value
	}

}
