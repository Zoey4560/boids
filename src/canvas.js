import Boids from './boids.js'
import {Vector} from './helpers.js'

const count = 500

let resizeTimer, animationFrame

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
	window.cancelAnimationFrame(animationFrame)
	let boids = new Boids(width, height, count)
	canvas.width = width
	canvas.height = height
	let frameTimes = [Date.now()]
	animationFrame = window.requestAnimationFrame(drawFrame)


	function drawFrame() {
		ctx.clearRect(0, 0, width, height)
		boids.boids.forEach(drawBoid)

		frameTimes.push(Date.now())
		let frameTimeSum = frameTimes.slice(1).reduce((acc, cur, i) => {
			return acc + cur - frameTimes[i]
		}, 0)
		ctx.fillText(Math.round(frameTimeSum/frameTimes.length), 20, 20)
		if (frameTimes.length > 10) {
			frameTimes.shift()
		}

		animationFrame = window.requestAnimationFrame(drawFrame)
	}

	function drawBoid(boid) {
		let w = 10
		let h = 30

		// Drawn with NORTH as forward
		let top = new Vector([0, -0.5 * h]).rotate(boid.rot)
		let r = new Vector([0.5 * w, 0.5 * h]).rotate(boid.rot)
		let l = new Vector([-0.5 * w, 0.5 * h]).rotate(boid.rot)

		ctx.beginPath();
		ctx.moveTo(boid.locX + top.x, boid.locY + top.y)
		ctx.lineTo(boid.locX + r.x, boid.locY + r.y)
		ctx.lineTo(boid.locX + l.x, boid.locY + l.y)
		ctx.fill()
	}
}
