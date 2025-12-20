<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { onMounted } from 'vue'
import * as dat from 'dat.gui'

const gui = new dat.GUI({ width: 400 })

// 创建场景
const scene = new THREE.Scene()

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

// 创建相机
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
// 初始位置设置在更远的地方，以便有足够空间做动画
camera.position.set(0, 0, 10)

gui.add(camera.position, 'z').min(0).max(100).step(0.1)

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer?.setSize(sizes.width, sizes.height)
	renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let textMesh: THREE.Mesh | null = null
let startTime: number | null = null

/**
 * Fonts
 */

const fontLoader = new FontLoader()

fontLoader.load('/blog/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('inkwall', {
		font,
		size: 0.5,
		depth: 0.2,
		curveSegments: 1,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 1,
	})

	textGeometry.center()
	const material = new THREE.MeshNormalMaterial()
	// material.matcap = matcapTexture;
	// textMaterial.wireframe = true;
	textMesh = new THREE.Mesh(textGeometry, material)

	// 初始设置文字很小
	textMesh.scale.set(0.01, 0.01, 0.01)
	scene.add(textMesh)

	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

	for (let i = 0; i < 200; i++) {
		const donut = new THREE.Mesh(donutGeometry, material)

		donut.position.x = (Math.random() - 0.5) * 10
		donut.position.y = (Math.random() - 0.5) * 10
		donut.position.z = (Math.random() - 0.5) * 10

		donut.rotation.x = Math.random() * Math.PI
		donut.rotation.y = Math.random() * Math.PI

		const scale = Math.random()

		donut.scale.set(scale, scale, scale)

		scene.add(donut)
	}
})

onMounted(() => {
	const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
	console.log(canvas)
	renderer = new THREE.WebGLRenderer({
		canvas,
	})
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	// Controls
	controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true
	scene.add(camera)
})

// 渲染循环
function animate(timestamp?: number) {
	requestAnimationFrame(animate)

	// 初始化开始时间
	if (!startTime) {
		startTime = timestamp
	}

	// 计算经过的时间（秒）
	const elapsed = (timestamp - startTime) / 1000

	// 执行开场动画，持续约3秒
	if (elapsed < 3) {
		// 相机从远到近移动
		const progress = Math.min(elapsed / 3, 1)

		// 使用缓动函数使动画更自然
		const easeProgress = 1 - Math.pow(1 - progress, 3)

		// 相机移动 - 从(0,0,10)到(0,0,3)
		camera.position.z = 10 - 7 * easeProgress

		// 文字从小到大缩放 - 从(0.01,0.01,0.01)到(1,1,1)
		if (textMesh) {
			const scale = 0.01 + 0.99 * easeProgress
			textMesh.scale.set(scale, scale, scale)
		}
	}

	controls?.update()
	renderer?.render(scene, camera)
}
animate()
</script>

<template>
	<div>
		<canvas id="canvas"></canvas>
	</div>
</template>
