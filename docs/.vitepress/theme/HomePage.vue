<script setup lang="ts">
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { TorusGeometry, ConeGeometry, BoxGeometry } from 'three'
import { onMounted, onUnmounted } from 'vue'

// import * as dat from 'dat.gui'

// const gui = new dat.GUI({ width: 400 })

// 创建场景
const scene = new THREE.Scene()

// 添加星空背景
const starsGeometry = new THREE.BufferGeometry()
const starsMaterial = new THREE.PointsMaterial({
	color: 0xffffff,
	size: 0.02,
	transparent: true,
	opacity: 0.8,
})

// 创建大量星星粒子
const starsVertices = []
for (let i = 0; i < 5000; i++) {
	const x = (Math.random() - 0.5) * 200
	const y = (Math.random() - 0.5) * 200
	const z = (Math.random() - 0.5) * 200
	starsVertices.push(x, y, z)
}

starsGeometry.setAttribute(
	'position',
	new THREE.Float32BufferAttribute(starsVertices, 3)
)

const starField = new THREE.Points(starsGeometry, starsMaterial)
scene.add(starField)

// 添加星云背景效果
const nebulaParticles = []
const nebulaGeometry = new THREE.BufferGeometry()
const nebulaMaterial = new THREE.PointsMaterial({
	size: 0.2,
	transparent: true,
	opacity: 0.3,
	color: new THREE.Color(0x4488ff),
	blending: THREE.AdditiveBlending,
})

const nebulaVertices = []
const nebulaColors = []

for (let i = 0; i < 1000; i++) {
	// 星云粒子分布在球形区域内
	const radius = 50
	const theta = Math.random() * Math.PI * 2
	const phi = Math.acos(2 * Math.random() - 1)

	const x = radius * Math.sin(phi) * Math.cos(theta)
	const y = radius * Math.sin(phi) * Math.sin(theta)
	const z = radius * Math.cos(phi)

	nebulaVertices.push(x, y, z)

	// 添加颜色变化
	const color = new THREE.Color(
		Math.random() * 0.5 + 0.5,
		Math.random() * 0.5 + 0.3,
		Math.random() * 0.8 + 0.2
	)
	nebulaColors.push(color.r, color.g, color.b)
}

nebulaGeometry.setAttribute(
	'position',
	new THREE.Float32BufferAttribute(nebulaVertices, 3)
)
nebulaGeometry.setAttribute(
	'color',
	new THREE.Float32BufferAttribute(nebulaColors, 3)
)

nebulaMaterial.vertexColors = true
const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial)
scene.add(nebula)
nebulaParticles.push(nebula)

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

// gui.add(camera.position, 'z').min(0).max(100).step(0.1)

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
let textMesh: THREE.Mesh | null = null
let blogTextMesh: THREE.Mesh | null = null
let aboutTextMesh: THREE.Mesh | null = null
let startTime: number | null = null
let donuts: THREE.Mesh[] = []
let mouseX = 0
let mouseY = 0
let targetRotationY = 0
let currentRotationY = 0
let currentRotationX = 0
let targetRotationX = 0
let mouseDown = false
let donutOriginalPositions: THREE.Vector3[] = []

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

// 鼠标事件处理函数
const handleMouseMove = (event: MouseEvent) => {
	// 将鼠标位置映射为旋转角度
	mouseX = (event.clientX - windowHalfX) / windowHalfX
	mouseY = (event.clientY - windowHalfY) / windowHalfY
	targetRotationY = (mouseX * Math.PI) / 3
	targetRotationX = (mouseY * Math.PI) / 3
}

const handleMouseDown = () => {
	mouseDown = true
}

const handleMouseUp = () => {
	mouseDown = false
}

// 添加鼠标事件监听器
onMounted(() => {
	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('mousedown', handleMouseDown)
	window.addEventListener('mouseup', handleMouseUp)
})

// 移除鼠标事件监听器
onUnmounted(() => {
	window.removeEventListener('mousemove', handleMouseMove)
	window.removeEventListener('mousedown', handleMouseDown)
	window.removeEventListener('mouseup', handleMouseUp)
})

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

	// 创建Blog文本
	const blogGeometry = new TextGeometry('Blog', {
		font,
		size: 0.3,
		depth: 0.1,
		curveSegments: 1,
		bevelEnabled: true,
		bevelThickness: 0.02,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 1,
	})

	blogGeometry.center()
	const blogMaterial = new THREE.MeshNormalMaterial()
	blogTextMesh = new THREE.Mesh(blogGeometry, blogMaterial)
	blogTextMesh.position.set(-0.8, -1.5, 0)
	blogTextMesh.visible = false
	scene.add(blogTextMesh)

	// 创建About文本
	const aboutGeometry = new TextGeometry('About', {
		font,
		size: 0.3,
		depth: 0.1,
		curveSegments: 1,
		bevelEnabled: true,
		bevelThickness: 0.02,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 1,
	})

	aboutGeometry.center()
	const aboutMaterial = new THREE.MeshNormalMaterial()
	aboutTextMesh = new THREE.Mesh(aboutGeometry, aboutMaterial)
	aboutTextMesh.position.set(0.8, -1.5, 0)
	aboutTextMesh.visible = false
	scene.add(aboutTextMesh)

	const donutGeometry = new THREE.TorusGeometry(0.1, 0.05, 20, 45)
	const coneGeometry = new THREE.ConeGeometry(0.1, 0.3, 8)
	const boxGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15)

	// 创建一个函数来生成不与文字重叠的位置
	function generatePositionAwayFromText() {
		let x, y, z
		do {
			x = (Math.random() - 0.5) * 7
			y = (Math.random() - 0.5) * 7
			z = (Math.random() - 0.5) * 7
		} while (
			// 确保不在文字附近（文字大约占据-1到1的空间）
			Math.abs(x) < 1.5 &&
			Math.abs(y) < 1 &&
			Math.abs(z) < 1
		)
		return { x, y, z }
	}

	for (let i = 0; i < 150; i++) {
		const donut = new THREE.Mesh(donutGeometry, material)
		const position = generatePositionAwayFromText()

		donut.position.x = position.x
		donut.position.y = position.y
		donut.position.z = position.z

		donut.rotation.x = Math.random() * Math.PI
		donut.rotation.y = Math.random() * Math.PI

		const scale = Math.random() * 0.5 + 0.5

		donut.scale.set(scale, scale, scale)

		// 保存甜甜圈引用和原始位置以便后续动画
		donuts.push(donut)
		donutOriginalPositions.push(donut.position.clone())

		scene.add(donut)
	}

	// 添加圆锥体
	for (let i = 0; i < 100; i++) {
		const cone = new THREE.Mesh(coneGeometry, material)
		const position = generatePositionAwayFromText()

		cone.position.x = position.x
		cone.position.y = position.y
		cone.position.z = position.z

		cone.rotation.x = Math.random() * Math.PI
		cone.rotation.y = Math.random() * Math.PI

		const scale = Math.random() * 0.5 + 0.5

		cone.scale.set(scale, scale, scale)

		// 保存圆锥引用和原始位置以便后续动画
		donuts.push(cone)
		donutOriginalPositions.push(cone.position.clone())

		scene.add(cone)
	}

	// 添加立方体
	for (let i = 0; i < 100; i++) {
		const box = new THREE.Mesh(boxGeometry, material)
		const position = generatePositionAwayFromText()

		box.position.x = position.x
		box.position.y = position.y
		box.position.z = position.z

		box.rotation.x = Math.random() * Math.PI
		box.rotation.y = Math.random() * Math.PI

		const scale = Math.random() * 0.5 + 0.5

		box.scale.set(scale, scale, scale)

		// 保存立方体引用和原始位置以便后续动画
		donuts.push(box)
		donutOriginalPositions.push(box.position.clone())

		scene.add(box)
	}
})

onMounted(() => {
	const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
	renderer = new THREE.WebGLRenderer({
		canvas,
	})
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	scene.add(camera)
	animate()
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
	} else {
		// 确保Blog和About文本可见
		if (blogTextMesh) {
			blogTextMesh.visible = true
		}

		if (aboutTextMesh) {
			aboutTextMesh.visible = true
		}

		// 平滑地将文字旋转到目标角度
		currentRotationY += (targetRotationY - currentRotationY) * 0.05
		currentRotationX += (targetRotationX - currentRotationX) * 0.05

		if (textMesh) {
			textMesh.rotation.y = currentRotationY
			textMesh.rotation.x = currentRotationX
		}

		// 甜甜圈轻微浮动和旋转效果
		donuts.forEach((donut, index) => {
			// 每个物体有不同的旋转速度和方向
			const speed = 0.1 + (index % 10) * 0.01

			// 根据物体类型应用不同的旋转效果
			if (donut.geometry instanceof THREE.TorusGeometry) {
				// 甜甜圈绕两个轴旋转
				donut.rotation.x += speed * 0.02
				donut.rotation.y += speed * 0.04
			} else if (donut.geometry instanceof THREE.ConeGeometry) {
				// 圆锥体绕Y轴快速旋转
				donut.rotation.y += speed * 0.06
			} else if (donut.geometry instanceof THREE.BoxGeometry) {
				// 立方体绕所有轴旋转
				donut.rotation.x += speed * 0.03
				donut.rotation.y += speed * 0.03
				donut.rotation.z += speed * 0.03
			}

			// 轻微上下浮动效果
			donut.position.y += Math.sin(elapsed * 2 + index) * 0.001

			// 鼠标按下时物体远离，松开时恢复
			if (donutOriginalPositions[index]) {
				if (mouseDown) {
					// 计算远离方向（从原点向外）
					const direction = donut.position.clone().normalize()
					// 计算当前位置与原始位置的距离
					const distanceFromOrigin = donut.position.length()
					// 设置最大远离距离为原始位置的3倍
					const maxDistance = donutOriginalPositions[index].length() * 3

					// // 只有当距离小于最大距离时才继续远离
					// if (distanceFromOrigin < maxDistance) {
					// 	// 逐渐远离
					// 	console.log('donut.position', donut.position)
					// 	donut.position.add(direction.multiplyScalar(0.3))
					// }

					if (textMesh && textMesh.position.z < 0.5) {
						console.log('textMesh.position--------', textMesh.position.z)
						textMesh.position.z += 0.0001
						donut.position.add(direction.multiplyScalar(0.3))
					}
				} else {
					// 逐渐回到原始位置
					if (textMesh && textMesh.position.z > 0) {
						console.log('textMesh.position', textMesh.position.z)
						textMesh.position.z -= 0.0001
					}

					donut.position.lerp(donutOriginalPositions[index], 0.2)
				}
			}
		})
	}

	// 让相机始终看向原点
	camera.lookAt(scene.position)

	// 星空背景动画效果
	if (starField) {
		// 缓慢旋转星空背景，营造宇宙深邃感
		starField.rotation.x += 0.0001
		starField.rotation.y += 0.0002
	}

	// 星云动画效果
	if (nebulaParticles.length > 0) {
		nebulaParticles.forEach((nebula, index) => {
			nebula.rotation.y += 0.0003 * (index + 1)
			nebula.rotation.x += 0.0002 * (index + 1)
		})
	}

	renderer?.render(scene, camera)
}

// 鼠标悬停效果
let hoveredObject: THREE.Object3D | null = null

function onMouseMove(event: MouseEvent) {
	// 计算鼠标位置标准化设备坐标 (-1 到 +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

	// 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera(mouse, camera)

	// 计算物体相交情况
	const intersects = raycaster.intersectObjects(
		[blogTextMesh, aboutTextMesh].filter(Boolean)
	)

	// 重置之前悬停的对象
	if (
		hoveredObject &&
		!intersects.find((intersect) => intersect.object === hoveredObject)
	) {
		if (hoveredObject === blogTextMesh) {
			;(blogTextMesh as THREE.Mesh).material = new THREE.MeshNormalMaterial()
		} else if (hoveredObject === aboutTextMesh) {
			;(aboutTextMesh as THREE.Mesh).material = new THREE.MeshNormalMaterial()
		}
		hoveredObject = null
	}

	// 如果悬停在文本上，改变其颜色
	if (intersects.length > 0) {
		const object = intersects[0].object
		if (object !== hoveredObject) {
			// 重置之前悬停的对象
			if (hoveredObject === blogTextMesh) {
				;(blogTextMesh as THREE.Mesh).material = new THREE.MeshNormalMaterial()
			} else if (hoveredObject === aboutTextMesh) {
				;(aboutTextMesh as THREE.Mesh).material = new THREE.MeshNormalMaterial()
			}

			// 设置新的悬停对象
			hoveredObject = object
			if (object === blogTextMesh || object === aboutTextMesh) {
				;(object as THREE.Mesh).material = new THREE.MeshBasicMaterial({
					color: 0xff0000,
				})
			}
		}
	}
}

// 处理点击事件
function handleClick(object: THREE.Object3D) {
	if (object === blogTextMesh) {
		window.location.href = '/blog/blog/20251207MCP.html'
	} else if (object === aboutTextMesh) {
		window.location.href = '/blog/about/introduce.html'
	}
}

// 添加射线检测
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseClick(event: MouseEvent) {
	// 计算鼠标位置标准化设备坐标 (-1 到 +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

	// 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera(mouse, camera)

	// 计算物体相交情况
	const intersects = raycaster.intersectObjects(
		[blogTextMesh, aboutTextMesh].filter(Boolean)
	)

	if (intersects.length > 0) {
		handleClick(intersects[0].object)
	}
}

onMounted(() => {
	window.addEventListener('click', onMouseClick)
	window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
	window.removeEventListener('click', onMouseClick)
	window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
	<div>
		<canvas id="canvas"></canvas>
	</div>
</template>
<style scoped></style>
