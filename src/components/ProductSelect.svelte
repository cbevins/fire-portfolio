<script>
  import { CustomInput } from "sveltestrap";
  import { _product } from './stores.js'
  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'productSelector'
  let data = products.requestProduct();
  let keys = Object.keys(data.options);
  // Callbacks
  function setValue() {
    products.setProduct($_product)
  }
</script>

<CustomInput type="select" id={selector} name={selector}
  bind:value={$_product} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label}</option>
  {/each}
</CustomInput>
