<template>
	<div class="dummy-blue">
		<p>
			Meta: {{ JSON.stringify(meta) }}
		</p>
		<p>
			Data: {{ JSON.stringify(data) }}
		</p>
	</div>
</template>

<style lang="scss">
.dummy-blue {
	background-color: #6098ce;
	width: 100%;
	height: 100%;
}
</style>

<script>
export default {
	name: 'dummy-blue',
	props: [ 'meta', 'data' ]
}
</script>
