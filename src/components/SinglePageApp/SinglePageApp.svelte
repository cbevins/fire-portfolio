<script>
/*
  SinglePageApp generates the app pages defined by pages.js
*/
  import { getContext } from 'svelte';
  import { getGraphPages } from './pages.js'

  let pages = getGraphPages()
  const {getMap, getComponent} = getContext('componentMap')
</script>

<div class="container-fluid">
  <main role="main" class="col-md-12 ml-sm-auto col-lg-10 px-md-4"  style="height: 400px">
    {#each pages as page, pageIndex}
      <svelte:component this={getComponent(page.component)} {pages} {pageIndex}/>
    {/each}
  </main>
</div>
