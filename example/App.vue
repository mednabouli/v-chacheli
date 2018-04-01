<template>
	<div id="app">
		<chacheli-designer-control :layout="layout" :edit-mode="editMode"
			@add="add" @cols="setCols" @rows="setRows" @editMode="editMode = $event" />
		<chacheli-designer v-show="editMode" ref="designer" :layout="layout" :chachelis="chachelis" />
		<chacheli-layout v-show="!editMode" :layout="layout" :chachelis="chachelis" :data="data" />
	</div>
</template>

<style lang="scss">
html,
body,
#app {
	height: 100%;
	display: flex;
	flex-direction: column;
}
body {
	margin: 0;
	padding: 0;
}
* {
	box-sizing: border-box;
}

button {
	border: 1px solid #ddd;
	border-radius: 3px;
	background: #fff;
	line-height: 20px;

	&:hover {
		background: #f2f2f2;
		border: 1px solid #ccc;
	}
}

.button-group {
	button {
		border-radius: 0;

		&[disabled] {
			background: #118fe4;
			border-color: #118fe4;
			color: #fff;
		}

		&:not(:first-of-type) {
			margin-left: -1px;
		}

		&:first-of-type {
			border-top-left-radius: 3px;
			border-bottom-left-radius: 3px;
		}
		&:last-of-type {
			border-top-right-radius: 3px;
			border-bottom-right-radius: 3px;
		}
	}

}
</style>

<script>
import ChacheliDesigner from 'v-chacheli/dist/ChacheliDesigner'
import ChacheliLayout   from 'v-chacheli/dist/ChacheliLayout'

import 'v-chacheli/dist/ChacheliDesigner.css'
import 'v-chacheli/dist/ChacheliLayout.css'

import ChacheliDesignerControl  from './ChacheliDesignerControl.vue'

export default {
	name: 'app',
	components: { ChacheliDesignerControl, ChacheliDesigner, ChacheliLayout },

	data() {
		return {
			idCounter: 10,
			layout: {
				cols: 4,
				rows: 3,
				v: 0,
				h: 0
			},
            editMode: true,
			chachelis: [
				{
					id: 1,
					x: 0,
					y: 0,
					w: 2,
					h: 1,
					text: 'Hoi',
					available: false,
					comp: 'dummy-red'
				},
				{
					id: 2,
					x: 0,
					y: 2,
					w: 1,
					h: 1,
					text: 'Hoi 2',
					available: false,
					comp: 'dummy-green'
				},
				{
					id: 3,
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					text: 'Hoi 3',
					available: false,
					comp: 'dummy-blue'
				},
				{
					id: 4,
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					text: 'Hoi 4',
					available: true,
					comp: 'dummy-red'
				}
			],
			data: {
				1: { content: 'some text' },
				2: { content: 'some text 2' },
				3: { content: 'some text 3' },
				4: { content: 'some text 4' }
			}
		}
	},

	methods: {
		add(props, data) {
			let c = Object.assign({
				x: 0,
				y: 0,
				w: 1,
				h: 1,
				text: '',
				available: true
			}, props)

			c.x = parseInt(c.x)
			c.y = parseInt(c.y)
			c.w = parseInt(c.w)
			c.h = parseInt(c.h)

			c.id = this.idCounter++
			this.chachelis.push(c)

			this.data[c.id] = data
		},
		setCols(v) {
			if (v >= this.$refs.designer.minColumns() && v <= 15)
				this.layout.cols = v
		},
		setRows(v) {
			if (v >= this.$refs.designer.minRows() && v <= 15)
				this.layout.rows = v
		}
	}
}
</script>
