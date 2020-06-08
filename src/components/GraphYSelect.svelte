<script>
  import { CustomInput } from "sveltestrap";
  import { _module, _palette, _graphYVariable, _graphYUnits } from '../stores/stores.js'
  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'graphYSelector'
  let data, available, keys
  $: {
    console.log('Refreshing vailable Graph Y Variables...')
    data = products.requestGraphYVariable();
    available = data.options // {[nodeKey]: {label: string, units: [strings]}}
    keys = Object.keys(available);
  }
  // Callbacks
  function setValue() {
    products.setGraphYVariable($_graphYVariable, available[$_graphYVariable].units[0])
  }
</script>

<CustomInput type="select" id={selector} name={selector}
    bind:value={$_graphYVariable} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{available[key].label})</option>
  {/each}
</CustomInput>
