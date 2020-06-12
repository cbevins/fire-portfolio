<script>
  import { _selected } from './variablesStore.js'
  import { variableMap } from './variables.js'

  export let label, key, selected

  $: type = label.slice(label.lastIndexOf('.') + 1);

  let checked = ''
  if ( selected ) {
    checked = "checked"
    _selected.select(key, true)
  }

  function clicked() {
    selected = !selected
    _selected.select(key, selected)
  }
</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>

<span style="background-image: url(https://svelte.dev/tutorial/icons/{type}.svg)">
  <label>
    <input type=checkbox
      id={'variable-selector-checkbox-'+key}
      on:change={clicked(selected)} {checked}>
    {label}
  </label>
</span>
