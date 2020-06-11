<script>
  import { Col, Container, Row } from "sveltestrap";
  import { Button, Card, CardFooter, CardHeader, CardBody } from "sveltestrap";
  import { getGraphPages } from './pages.js'

  let pages = getGraphPages()
  let pageFirst = pages[0]
  let pageLast = pages[pages.length-1]
  let borderColor = 'border-success'
  let buttonClass = 'btn btn-outline-primary btn-sm'
</script>

<div class="container-fluid">
  <main role="main" class="col-md-12 ml-sm-auto col-lg-10 px-md-4"  style="height: 400px">
    {#each pages as page, idx}
      <Card id={page.id} style="height: 400px" class={borderColor}>
        <CardHeader class={borderColor}>{page.title}</CardHeader>
        <CardBody class={borderColor}>
          <slot>
            Content goes in this slot
          </slot>
        </CardBody>
        <CardFooter class={borderColor}>
          <a href={"#"+pages[Math.max(0,idx-1)].prev} class={buttonClass} role="button">
            <span class="fa fa-angle-double-left"></span>Prev</a>
          <a href={"#"+page.next} class={buttonClass} role="button">
            <span class="fa fa-angle-double-right"></span>Next</a>
          <a href={"#"+pageFirst.id} class={buttonClass} role="button">
            <span class="fa fa-angle-double-up"></span>First</a>
          <a href={"#"+pageLast.id} class={buttonClass} role="button">
            <span class="fa fa-angle-double-down"></span>Last</a>
        </CardFooter>
      </Card>
    {/each}
  </main>
</div>