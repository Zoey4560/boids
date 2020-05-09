import Boids from './boids.js'
import {rotate} from './helpers.js'

let resizeTimer, animationTimer

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight

window.onresize = resizeCanvas
start()


function resizeCanvas() {
	width = window.innerWidth
	height = window.innerHeight
	window.clearTimeout(resizeTimer)
	resizeTimer = window.setTimeout(() => {
		start()
	}, 100)
}

function start() {
	window.clearInterval(animationTimer)
	let boids = new Boids(width, height, 100)
	canvas.width = width
	canvas.height = height
	animationTimer = window.setInterval(() => {
		drawFrame()
	}, 10)


	function drawFrame() {
		ctx.clearRect(0, 0, width, height)
		boids.boids.forEach(drawBoid)
	}

	function drawBoid(boid) {
		let w = 10
		let h = 30
		ctx.beginPath();
		let top = rotate(0, -0.5 * h, boid.rot)
		let r = rotate(0.5 * w, 0.5 * h, boid.rot)
		let l = rotate(-0.5 * w, 0.5 * h, boid.rot)
		// console.log(top, r, l)
		ctx.moveTo(boid.locX + top[0], boid.locY + top[1])
		ctx.lineTo(boid.locX + r[0], boid.locY + r[1])
		ctx.lineTo(boid.locX + l[0], boid.locY + l[1])
		ctx.fill()
	}
}
