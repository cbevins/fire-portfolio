<script>
  import { CustomInput } from "sveltestrap";
  import { _module } from '../stores/stores.js'
  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'moduleSelector'
  let data = products.requestModule();
  let keys = Object.keys(data.options);
  // Callbacks
  function setValue() { products.setModule($_module) }
</script>

<CustomInput type="select" id={selector} name={selector}
    bind:value={$_module} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label}</option>
  {/each}
</CustomInput>
