<script>
  import { _product, _module, _palette } from '../../stores/stores.js'

  let currentProduct, currentModule, currentPalette
  $: currentProduct = $_product
  $: currentModule = $_module
  $: currentPalette = $_palette
</script>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <div class="btn-toolbar mb-2 mb-md-0">
    <div class="btn-group mr-2">
      <button type="button" class="btn btn-sm btn-outline-secondary">
        {currentProduct}</button>
      <button type="button" class="btn btn-sm btn-outline-secondary">
        {currentModule}</button>
      <button type="button" class="btn btn-sm btn-outline-secondary">
        {currentPalette}</button>
    </div>
    <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
      <span data-feather="calendar"></span>
      This week
    </button>
  </div>
</div>
