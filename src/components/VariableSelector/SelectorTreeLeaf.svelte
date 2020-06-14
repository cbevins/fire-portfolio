<script>
  import { getContext } from 'svelte'
  import { keyLabel } from '../../appData.js'
  import { _selected } from './variablesStore.js'

  export let key

  let variableMap = getContext('variableMap')
  let variable = variableMap.get(key)
  let label = keyLabel(key)
  let selected = variable.node.status.isSelected

  $: type = 'gif'

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
