<template>
	<div class="chacheli-designer" :class="{ dragging: dragging.active }">
		<chacheli-designer-layout ref="layoutComp" :layout="layout" :chachelis="chachelis" :dragging="dragging" />
		<chacheli-chooser :chachelis="chachelis" :dragging="dragging" />
	</div>
</template>

<style lang="scss">
.chacheli-designer {
	height: 100%;
	display: flex;
	flex-direction: row;

	&.dragging {
		cursor: move;
	}
}
</style>

<script>
import ChacheliDesignerLayout from './internal/ChacheliDesignerLayout.vue'
import ChacheliChooser from './internal/ChacheliChooser.vue'

export default {
	name: 'chacheli-designer',
	components: { ChacheliDesignerLayout, ChacheliChooser },
	props: [ 'layout', 'chachelis' ],

	data() {
		return {
			dragging: {
				active: false,
				cancelled: false,
				index: 0
			}
		}
	},

	methods: {
		minColumns() {
			return this.$refs.layoutComp.minColumns()
		},
		minRows() {
			return this.$refs.layoutComp.minRows()
		}
	}
}
</script>
