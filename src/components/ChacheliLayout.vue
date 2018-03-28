<template>
	<div class="chacheli-layout">
		<div class="chacheli"
			v-for="c in chachelis"
			v-if="!c.available"
			:key="c.id"
			:style="{ top: (c.y * v) + '%', left: (c.x * h) + '%', width: (c.w * h) + '%', height: (c.h * v) + '%'}">
			<component :is="c.comp" :meta="c" :data="data[c.id]"/>
		</div>
	</div>
</template>

<style lang="scss">
.chacheli-layout {
	height: 100%;
	flex: 1 1 auto;
	position: relative;
	margin: 0;
	overflow: hidden;

	&, * {
		box-sizing: border-box;
	}

    .chacheli {
		padding: 5px;
        position: absolute;

		> * {
			height: 100%;
			display: inline-block;
		}
    }
}
</style>

<script>
export default {
	name: 'chacheli-layout',
	props: [ 'layout', 'chachelis', 'data' ],

	data() {
		return {
			v: 0,
			h: 0
		}
	},

	watch: {
		'layout.cols'() {
			this.calc()
		},
		'layout.rows'() {
			this.calc()
		}
	},

	created() {
		this.calc()
	},

	methods: {
		calc() {
			this.v = 100 / this.layout.rows
			this.h = 100 / this.layout.cols
		}
	}
}
</script>
