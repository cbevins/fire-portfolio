<script>
  import { getContext } from 'svelte';
  import { Col, Container, Row } from "sveltestrap";
  import { Button, Card, CardFooter, CardHeader, CardTitle, CardBody } from "sveltestrap";
  import { getExamplePages } from './pages.js'
  import { getGraphPages } from './pages.js'

  //let pages = getGraphPages()
  let pages = getGraphPages()
  let pageFirst = pages[0]
  let pageLast = pages[pages.length-1]
  let borderColor = 'border-success'
  let buttonClasses = 'btn btn-outline-primary btn-sm'
  let cardBodyClasses = "overflow-auto "+borderColor
  const {getMap, getComponent} = getContext('componentMap')
</script>

<div class="container-fluid">
  <main role="main" class="col-md-12 ml-sm-auto col-lg-10 px-md-4"  style="height: 400px">
    {#each pages as page, idx}
      <Card id={page.id} style="height: 400px" class={borderColor}>
        <CardHeader class={borderColor}>
          <CardTitle>{page.title}</CardTitle>
        </CardHeader>
        <CardBody class={cardBodyClasses}>
          {#each page.components as compKey}
            <svelte:component this={getComponent(compKey)}/>
          {/each}
        </CardBody>
        <CardFooter class={borderColor}>
          <a href={"#"+pages[Math.max(0,idx-1)].id} class={buttonClasses} role="button">
            <span class="fa fa-angle-double-left"/>
            Prev ({pages[Math.max(0,idx-1)].title})</a>
          <a href={"#"+pages[Math.min(pages.length-1,idx+1)].id} class={buttonClasses} role="button">
            <span class="fa fa-angle-double-right"/>
              Next ({pages[Math.min(pages.length-1,idx+1)].title})</a>
          <a href={"#"+pageFirst.id} class={buttonClasses} role="button">
            <span class="fa fa-angle-double-up"/>First</a>
          <a href={"#"+pageLast.id} class={buttonClasses} role="button">
            <span class="fa fa-angle-double-down"/>Last</a>
        </CardFooter>
      </Card>
    {/each}
  </main>
</div>