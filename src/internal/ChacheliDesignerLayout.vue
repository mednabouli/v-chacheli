<template>
	<div class="chacheli-designer-layout" :class="interactClass">
		<template v-for="r in parseInt(layout.rows)">
			<template v-for="c in parseInt(layout.cols)">
				<div class="grid"
					:key="r + '-' + c"
					:class="{ right: c == layout.cols, bottom: r == layout.rows}"
					:style="{ top: ((r - 1) * units.v) + '%', left: ((c - 1) * units.h) + '%', width: units.h + '%', height: units.v + '%'}">
					{{ (c - 1) }}, {{ (r - 1) }}
				</div>
			</template>
		</template>
		<chacheli v-for="chacheli in chachelis" v-if="!chacheli.available" :key="chacheli.id"
			:layout="layout" :units="units" :chacheli="chacheli" @resize="resizeStart" @drag="positionStart">
		</chacheli>
		<div v-show="!placeholder.hidden" class="placeholder"
			:class="{ invalid: placeholder.invalid }" :style="placeholderStyle">
		</div>
	</div>
</template>

<style lang="scss">
.chacheli-designer-layout {
	flex: 1 1 auto;
	position: relative;
	margin: 0;
	overflow: hidden;

	&, * {
		box-sizing: border-box;
	}

	.grid {
		position: absolute;
		z-index: 1;
		border-style: solid;
		border-color: #eee;
		border-width: 0 1px 1px 0;
		color: #ddd;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&.right {
			border-right-width: 0;
		}
		&.bottom {
			border-bottom-width: 0;
		}
	}

	.placeholder {
		position: absolute;
		z-index: 3;
		border: 1px solid #ddd;
		background-color: rgba(160, 160, 160, 0.1);
		transition: background-color 0.6s;

		&.invalid {
			border-color: #ffa7a7 !important;
			background-color: rgba(255, 0, 0, 0.1) !important;
		}
	}

	&.interact {
		&.resize {
			cursor: nwse-resize;
		}

		&.drag {
			cursor: move;
		}

		&.dnd {
			.placeholder {
				border-color: transparent;
				background-color: rgba(0, 255, 0, 0.1);
				transition-property: top, left, width, height, background-color;
				transition-duration: 0.4s, 0.4s, 0.4s, 0.4s, 0.6s;
			}
		}
	}
}
</style>

<script>
import Chacheli from './Chacheli.vue'

export default {
	name: 'chacheli-designer-layout',
	components: { Chacheli },
	props: [ 'layout', 'chachelis', 'dragging' ],

	data() {
		return {
			placeholder: {
				interaction: 'resize',
				hidden: true,
				invalid: false,
				unit: 'px',
				t: 0,
				l: 0,
				w: 1,
				h: 1
			},
			units: {
				v: 0,
				h: 0
			}
		}
	},

	computed: {
		placeholderStyle() {
			return {
				top: this.placeholder.t + this.placeholder.unit,
				left: this.placeholder.l + this.placeholder.unit,
				width: this.placeholder.w + this.placeholder.unit,
				height: this.placeholder.h + this.placeholder.unit
			}
		},

		interactClass() {
			if (this.placeholder.hidden)
				return ''
			return 'interact ' + this.placeholder.interaction
		}
	},

	watch: {
		'layout.cols'() {
			this.calc()
		},
		'layout.rows'() {
			this.calc()
		},
		'dragging.active'(v) {
			if (v)
				this.dragStart()
			else
				this.dragEnd()
		}
	},

	created() {
		this.calc()

		// this is internal and should not be reactive
		this.interact = {
			chacheli: null,
			handler: null,
			x0: 0,
			y0: 0,
			l0: 0,
			t0: 0,
			w0: 0,
			h0: 0,
			xu: 0,
			yu: 0,
			grid: null,
			dragging: 0
		}
	},

	methods: {
		calc() {
			this.units.v = 100 / this.layout.rows
			this.units.h = 100 / this.layout.cols
		},

		//----------------------------------------------------------------------
		// resizing
		resizeStart(e) {
			this.interactStart(e, 'resize', this.resizeMove)
		},

		resizeMove(e) {
			this.placeholder.w = this.interact.w0 + e.clientX - this.interact.x0
			this.placeholder.h = this.interact.h0 + e.clientY - this.interact.y0

			this.maybeUpdateChacheli(
				this.interact.chacheli.x,
				this.interact.chacheli.y,
				Math.max(1, Math.round(this.placeholder.w / this.interact.xu)),
				Math.max(1, Math.round(this.placeholder.h / this.interact.yu)))
		},


		//----------------------------------------------------------------------
		// positioning a chacheli on the layout
		positionStart(e) {
			this.interactStart(e, 'drag', this.positionMove)
		},

		positionMove(e) {
			this.placeholder.l = this.interact.l0 + e.clientX - this.interact.x0
			this.placeholder.t = this.interact.t0 + e.clientY - this.interact.y0

			this.maybeUpdateChacheli(
				Math.round(this.placeholder.l / this.interact.xu),
				Math.round(this.placeholder.t / this.interact.yu),
				this.interact.chacheli.w,
				this.interact.chacheli.h)
		},

		//----------------------------------------------------------------------
		// drag and drop a chacheli from the chooser
		dragStart() {
			this.interact.dragging = false
			this.$el.addEventListener('mouseenter', this.dragEnter, false)
			this.$el.addEventListener('mouseleave', this.dragLeave, false)
			this.$el.addEventListener('mousemove', this.dragOver, false)
		},

		dragEnter(e) {
			if (!this.dragging.active)
				return
			this.interact.dragging = true
			this.interact.x0 = this.interact.y0 = -1

			this.placeholder.unit = '%'
			this.placeholder.hidden = false
			this.placeholder.interaction = 'dnd'
			this.placeholder.invalid = false
			this.placeholder.w = this.units.h
			this.placeholder.h = this.units.v

			this.createValidationGrid(null)
			this.calcInteractUnits()

			this.dragOver(e)
		},

		dragOver(e) {
			let bounds = this.$el.getBoundingClientRect()
			let x = Math.floor((e.clientX - bounds.left) / this.interact.xu)
			let y = Math.floor((e.clientY - bounds.top) / this.interact.yu)
			if (x == this.interact.x0 && y == this.interact.y0)
				return

			this.interact.x0 = x
			this.interact.y0 = y
			this.placeholder.l = x * this.units.h
			this.placeholder.t = y * this.units.v

			this.placeholder.invalid = !this.validateChacheli(x, y, 1, 1)
		},

		dragLeave() {
			this.placeholder.hidden = true
			this.interact.dragging = false
		},

		dragEnd() {
			this.$el.removeEventListener('mouseenter', this.dragEnter, false)
			this.$el.removeEventListener('mouseleave', this.dragLeave, false)
			this.$el.removeEventListener('mousemove', this.dragOver, false)
			this.interactCleanup()

			if (!this.interact.dragging || this.dragging.cancelled || this.placeholder.invalid)
				return

			let c = this.chachelis[this.dragging.index]
			if (c && c.available) {
				c.available = false
				c.x = this.interact.x0
				c.y = this.interact.y0
				c.w = c.h = 1
			}
		},

		//----------------------------------------------------------------------
		// code shared between resize/position
		interactStart(e, type, handler) {
			this.placeholder.unit = 'px'
			this.placeholder.hidden = false
			this.placeholder.invalid = false
			this.placeholder.interaction = type
			this.placeholder.t = this.interact.t0 = e.initialPos.top
			this.placeholder.l = this.interact.l0 = e.initialPos.left
			this.placeholder.w = this.interact.w0 = e.initialPos.width
			this.placeholder.h = this.interact.h0 = e.initialPos.height
			this.interact.x0 = e.event.clientX
			this.interact.y0 = e.event.clientY
			this.interact.chacheli = e.chacheli
			this.interact.handler = handler

			this.calcInteractUnits()
			this.createValidationGrid(e.chacheli)

			document.documentElement.addEventListener('mousemove', this.interact.handler, false)
			document.documentElement.addEventListener('mouseup', this.interactStop, false)
		},

		interactStop() {
			document.documentElement.removeEventListener('mousemove', this.interact.handler, false)
			document.documentElement.removeEventListener('mouseup', this.interactStop, false)
			this.interactCleanup()
		},

		//----------------------------------------------------------------------
		// helpers, etc.
		calcInteractUnits() {
			let cs = document.defaultView.getComputedStyle(this.$el)
			this.interact.xu = Math.floor(parseInt(cs.width) / this.layout.cols)
			this.interact.yu = Math.floor(parseInt(cs.height) / this.layout.rows)
		},

		createValidationGrid(ref) {
			let rows = parseInt(this.layout.rows)
			let cols = parseInt(this.layout.cols)

			this.interact.grid = new Array(rows)
			for (let r = 0; r < rows; r++) {
				let a = this.interact.grid[r] = new Array(cols)
				for (let c = 0; c < cols; c++)
					a[c] = 1
			}

			for (let i = 0; i < this.chachelis.length; i++) {
				let c = this.chachelis[i]
				if (c === ref || c.available)
					continue
				for (let j = 0; j < c.h; j++) {
					for (let k = 0; k < c.w; k++)
						this.interact.grid[c.y + j][c.x + k] = 0
				}
			}
		},

		validateChacheli(x, y, w, h) {
			for (let j = 0; j < h; j++) {
				for (let k = 0; k < w; k++) {
					let r = this.interact.grid[y + j]
					if (!r || !r[x + k])
						return false
				}
			}
			return true
		},

		maybeUpdateChacheli(x, y, w, h) {
			let c = this.interact.chacheli
			if (c.x == x && c.y == y && c.w == w && c.h == h) {
				this.placeholder.invalid = false
				return
			}

			if (this.validateChacheli(x, y, w, h)) {
				c.x = x
				c.y = y
				c.w = w
				c.h = h
				this.placeholder.invalid = false
			} else {
				this.placeholder.invalid = true
			}
		},

		interactCleanup() {
			this.placeholder.hidden = true
			this.interact.chacheli = null
			this.interact.grid = null
		},

		minColumns() {
			let min = 1
			for (let i = 0; i < this.chachelis.length; i++) {
				let c = this.chachelis[i]
				if (!c.available)
					min = Math.max(min, c.x + c.w)
			}
			return min
		},
		minRows() {
			let min = 1
			for (let i = 0; i < this.chachelis.length; i++) {
				let c = this.chachelis[i]
				if (!c.available)
					min = Math.max(min, c.y + c.h)
			}
			return min
		}
	}
}
</script>
