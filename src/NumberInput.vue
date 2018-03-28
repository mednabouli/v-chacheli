<template>
	<span class="number-input button-group">
		{{ value }}
		<button type="button" @click.prevent.stop="setValue(-1)">
			&minus;
		</button><button type="button" @click.prevent.stop="setValue(+1)">
			+
		</button>
	</span>
</template>

<style lang="scss">
.number-input {
	button {
		font-weight: bold;
	}
}
</style>

<script>
export default {
	name: 'number-input',
	props: [ 'value' ],

	methods: {
		setValue(v) {
			this.$emit('input', this.value + v)
		}
	}
}
</script>
