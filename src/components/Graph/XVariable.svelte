<script>
  import StandardPage from './StandardPage.svelte'
  export let pages, pageIndex
  let page = pages[pageIndex]
</script>

<StandardPage {pages} {pageIndex}>
  <span slot="title">{page.title}</span>
  <span slot="content">This is the '{page.title}' page</span>
</StandardPage>
