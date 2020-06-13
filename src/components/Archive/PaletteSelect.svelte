<script>
  import { CustomInput } from "sveltestrap";
  import { _palette } from '../stores/stores.js'
  // Properties passed in by the parent
  export let products;
  // Local data
  let selector = 'paletteSelector'
  let data = products.requestPalette();
  let keys = Object.keys(data.options);
  // Callbacks
  function setValue() {
    products.setPalette($_palette)
  }
</script>

<CustomInput type="select" id={selector} name={selector}
    bind:value={$_palette} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label}</option>
  {/each}
</CustomInput>
