<script>
  // Properties passed in by the parent
  export let products;
  // Local data
  let data = products.requestProduct();
  let currentValue = products.product;
  let keys = Object.keys(data.options);
  let value = currentValue
  // Callbacks
  function setValue() {
    products.setProduct(value);
    currentValue = products.product;
  }
</script>

<h2>{data.prompt} ({currentValue})</h2>
<select bind:value={value} on:change={setValue}>
  {#each keys as key}
    <option value={key}>{data.options[key].label}</option>
  {/each}
</select>
