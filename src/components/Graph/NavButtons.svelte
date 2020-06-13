<script>
  export let pages, pageIndex
  let page = pages[pageIndex]
  let last = pages.length-1
  let prev = Math.max(0, pageIndex-1)
  let next = Math.min(pages.length-1, pageIndex+1)

  let buttonClasses = 'btn btn-outline-primary btn-sm'
</script>

<a href={"#"+pages[prev].id} class={buttonClasses} role="button">
  <span class="fa fa-angle-double-left"/>&nbsp;Prev ({pages[prev].title})</a>
<a href={"#"+pages[next].id} class={buttonClasses} role="button">
  <span class="fa fa-angle-double-right"/>&nbsp;Next ({pages[next].title})</a>
<a href={"#"+pages[0].id} class={buttonClasses} role="button">
  <span class="fa fa-angle-double-up"/>&nbsp;First</a>
<a href={"#"+pages[last].id} class={buttonClasses} role="button">
  <span class="fa fa-angle-double-down"/>&nbsp;Last</a>
