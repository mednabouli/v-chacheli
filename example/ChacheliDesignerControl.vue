<template>
	<div class="chacheli-designer-control">
		<span class="button-group">
			<button type="button" :disabled="editMode" @click.prevent.stop="$emit('editMode', true)">
				Edit
			</button><button type="button" :disabled="!editMode" @click.prevent.stop="$emit('editMode', false)">
				Show
			</button>
		</span>
		<span class="form" v-show="editMode">
			<b>Cols</b>: <number-input :value="layout.cols" @input="setCols" />
			<b>Rows</b>: <number-input :value="layout.rows" @input="setRows" />
		</span>
		<span class="form" v-show="editMode">
			<b>Add new</b>: text: <input v-model="chacheli.text" type="text" @keyup.enter="add">
			component: <select v-model="chacheli.comp">
				<option value="dummy-red">Red</option>
				<option value="dummy-green">Green</option>
				<option value="dummy-blue">Blue</option>
			</select>
			local data: <input v-model="localData.content" type="text" @keyup.enter="add">
			<button type="button" @click.prevent.stop="add">Add</button>
		</span>
	</div>
</template>

<style lang="scss">
.chacheli-designer-control {
	padding: 10px;
	border-bottom: 1px solid #ddd;

	button + button {
		margin-left: -1px;
	}

	span.form {
		padding-left: 20px;
	}
}
</style>

<script>
import NumberInput from './NumberInput.vue'
export default {
	name: 'chacheli-designer-control',
	components: { NumberInput },
	props: [ 'layout', 'data', 'editMode' ],

	data() {
		return {
			chacheli: {
				text: '',
				comp: 'dummy-green'
			},
			localData: {
				content: ''
			}
		}
	},

	methods: {
		add() {
			this.$emit('add', Object.assign({}, this.chacheli), Object.assign({}, this.localData))
		},
		setCols(v) {
			this.$emit('cols', v)
		},
		setRows(v) {
			this.$emit('rows', v)
		}
	}
}
</script>
