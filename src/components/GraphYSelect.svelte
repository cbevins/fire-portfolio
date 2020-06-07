<script>
  import { CustomInput } from "sveltestrap";

  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'graphYSelector'
  let data = products.requestGraphYVariable();
  let keys = Object.keys(data.options);
  let inputValue = '?'
  // Callbacks
  function setValue() {
    products.setGraphYVariable(inputValue, data.options[inputValue].units)
  }
</script>

<CustomInput type="select" id={selector} name={selector}
    bind:value={inputValue} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label} ({data.options[key].units})</option>
  {/each}
</CustomInput>
