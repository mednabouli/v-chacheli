<template>
	<div class="chacheli" :style="style" @mousedown.left.prevent.stop="mousedown('drag', $event)">
		<div class="content" ref="content">{{ chacheli.text }}</div>
		<div class="close" @click.prevent.stop="close" @mousedown.prevent.stop></div>
		<div class="resize-handle" @mousedown.left.prevent.stop="mousedown('resize', $event)"></div>
	</div>
</template>

<style lang="scss">
.chacheli-designer-layout {
	.chacheli {
		padding: 5px;
		position: absolute;
		z-index: 2;

		.content,
		.close {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.content {
			height: 100%;
			border: 1px solid #ccc;
			background: #f4f4f4;
		}

		.close {
			position: absolute;
			right: 5px;
			top: 5px;
			width: 23px;
			height: 23px;
			background: #fff;
			border: 1px solid #ccc;
			border-bottom-left-radius: 5px;

			&::before,
			&::after {
				content: '';
				position: absolute;
				height: 2px;
				top: 50%;
				left: 2px;
				right: 2px;
				margin-top: -1px;
				background: #ccc;
			}
			&::before {
				transform: rotate(45deg);
			}
			&::after {
				transform: rotate(-45deg);
			}

			&:hover {
				background-color: rgba(128, 128, 128, 0.1);

				&::before,
				&::after {
					background: #999;
				}
			}
		}

		.resize-handle {
			position: absolute;
			right: 5px;
			bottom: 5px;
			width: 13px;
			height: 13px;
			cursor: nwse-resize;
			border: 1px solid #ccc;
			background: #fff;

			&:hover {
				background-color: rgba(128, 128, 128, 0.1);
			}
		}
	}

	&.interact .chacheli {
		transition-property: top, left, width, height;
		transition-duration: 0.4s;
	}
}
</style>

<script>
export default {
	name: 'chacheli',
	props: [ 'layout', 'chacheli', 'units' ],

	computed: {
		style() {
			return {
				top: (this.chacheli.y * this.units.v) + '%',
				left: (this.chacheli.x * this.units.h) + '%',
				width: (this.chacheli.w * this.units.h) + '%',
				height: (this.chacheli.h * this.units.v) + '%'
			}
		}
	},

	methods: {
		mousedown(name, e) {
			let outer = document.defaultView.getComputedStyle(this.$el)
			let inner = document.defaultView.getComputedStyle(this.$refs.content)

			this.$emit(name, {
				chacheli: this.chacheli,
				event: e,
				initialPos: {
					left: parseFloat(outer.getPropertyValue('left')) +
						parseFloat(outer.getPropertyValue('padding-left')) +
						parseFloat(outer.getPropertyValue('border-left-width')),
					top: parseFloat(outer.getPropertyValue('top')) +
						parseFloat(outer.getPropertyValue('padding-top')) +
						parseFloat(outer.getPropertyValue('border-top-width')),
					width: parseFloat(inner.getPropertyValue('width')),
					height: parseFloat(inner.getPropertyValue('height'))
				}
			})
		},

		close() {
			this.chacheli.available = true
		}
	}
}
</script>
