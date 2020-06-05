<script>
  // Properties passed in by the parent
  export let products;
  // Local data
  let data = products.requestProduct();
  let keys = Object.keys(data.options);
  let product = "diagram";
  let currentProduct = products.product;
  // Callbacks
  function setProduct() {
    products.setProduct(product);
    currentProduct = products.product;
  }
</script>

<h2>{data.prompt}</h2>
<div>
  {#each keys as key}
    <label>
      <input
        type="radio"
        bind:group={product}
        value={key}
        on:change={setProduct} />
      {data.options[key].label}
    </label>
  {/each}
</div>
<p>The current choice is '{currentProduct}'</p>
