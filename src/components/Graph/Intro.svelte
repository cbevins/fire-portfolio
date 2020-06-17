<script>
  import { getContext } from 'svelte';
  import StandardPage from './StandardPage.svelte'
  export let pages, pageIndex

  let dag = getContext('dag')
  let variableTree = getContext('variableTree')
  let variableMap = getContext('variableMap')
  let varray = Array.from(variableMap.values())
  let page = pages[pageIndex]
</script>

<StandardPage {pages} {pageIndex}>
  <span slot="title">{page.title}</span>
  <span slot="content">
   {new Date()}
    <!-- {#each varray as v, index}
      {index} {v.key}<br/>
    {/each} -->
  </span>
</StandardPage>
