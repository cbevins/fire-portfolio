<script>
  import { CustomInput } from "sveltestrap";

  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'moduleSelector'
  let data = products.requestModule();
  let keys = Object.keys(data.options);
  let inputValue = '?'
  // Callbacks
  function setValue() { products.setModule(inputValue) }
</script>

<CustomInput type="select" id={selector} name={selector}
    bind:value={inputValue} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label}</option>
  {/each}
</CustomInput>
