<template>
	<div class="chacheli-chooser">
		<div class="inner">
			<div class="chacheli-outer" v-for="(c, idx) in chachelis" v-if="c.available" :key="c.id">
				<div class="chacheli" :class="{ dragging: dragging.active && idx === dragging.index }"
					@mousedown.left.prevent.stop="mousedown(idx, $event)">
					{{ c.text }}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.chacheli-chooser {
	padding: 0 10px;
	border-left: 1px solid #bbb;
	flex: 0 0 200px;
	position: relative;

	.inner {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 10px 10px 0;
		overflow: auto;
	}

	.chacheli-outer {
		margin: 0 0 10px;
	}

	.chacheli {
		padding: 15px 10px;
		border: 1px solid #ccc;
		background: #f4f4f4;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;

		&.dragging {
			pointer-events: none;
			position: fixed;
			z-index: 1000;
			opacity: 0.8;
		}
	}
}
</style>

<script>
export default {
	name: 'chacheli-chooser',
	props: [ 'chachelis', 'dragging' ],

	methods: {
		mousedown(idx, e) {
			let cs = document.defaultView.getComputedStyle(e.target)
			let bounds = e.target.getBoundingClientRect()

			this.dX = bounds.left - e.clientX
			this.dY = bounds.top - e.clientY

			this.dragElement = e.target
			this.dragElement.style.width = parseFloat(cs.width) + 'px'
			this.dragElement.style.height = this.dragElement.parentElement.style.height = parseFloat(cs.height) + 'px'

			this.dragMove(e)

			document.documentElement.addEventListener('mousemove', this.dragMove, false)
			document.documentElement.addEventListener('mouseup', this.dragStop, false)
			document.documentElement.addEventListener('keydown', this.keyDown, false)

			this.dragging.active = true
			this.dragging.cancelled = false
			this.dragging.index = idx
		},

		keyDown(e) {
			if (e.keyCode === 27) {
				this.dragging.cancelled = true
				this.dragStop()
			}
		},

		dragMove(e) {
			this.dragElement.style.left = (e.clientX + this.dX) + 'px'
			this.dragElement.style.top = (e.clientY + this.dY) + 'px'
		},

		dragStop() {
			document.documentElement.removeEventListener('mousemove', this.dragMove, false)
			document.documentElement.removeEventListener('mouseup', this.dragStop, false)
			document.documentElement.removeEventListener('keydown', this.keyDown, false)

			this.dragElement.parentElement.removeAttribute('style')
			this.dragElement.removeAttribute('style')
			this.dragElement = null

			this.dragging.active = false
		}
	}
}
</script>
