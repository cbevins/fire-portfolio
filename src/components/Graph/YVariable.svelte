<script>
  import { getContext } from 'svelte';
  import StandardPage from './StandardPage.svelte'

  export let pages, pageIndex
  let page = pages[pageIndex]
  const { getComponent } = getContext('componentMap')
  const content = getComponent('VariableSelector')
</script>

<StandardPage {pages} {pageIndex}>
  <span slot="title">{page.title}</span>
  <span slot="content">
    <svelte:component this={content}/>
  </span>
</StandardPage>
