<script>
	import Leaf from './Leaf.svelte';
  import FaPlusCircle from 'svelte-icons/fa/FaPlusCircle.svelte'
  import FaMinusCircle from 'svelte-icons/fa/FaMinusCircle.svelte'

	export let expanded = false;
	export let label;
	export let items;

	function toggle() {
		expanded = !expanded;
	}
</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(https://svelte.dev/tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	.expanded {
		background-image: url(https://svelte.dev/tutorial/icons/folder-open.svg);
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	}
</style>

<span class:expanded on:click={toggle}>{label}</span>

{#if expanded}
	<ul>
		{#each items as item}
			<li>
				{#if item.type === 'container'}
					<svelte:self {...item}/>
				{:else}
					<Leaf {...item}/>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
