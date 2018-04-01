<template>
	<div class="dummy-green">
		<p>
			Meta: {{ JSON.stringify(meta) }}
		</p>
		<p>
			Data: {{ JSON.stringify(data) }}
		</p>
	</div>
</template>

<style lang="scss">
.dummy-green {
	background-color: #75c375;
	width: 100%;
	height: 100%;
}
</style>

<script>
export default {
	name: 'dummy-green',
	props: [ 'meta', 'data' ]
}
</script>
