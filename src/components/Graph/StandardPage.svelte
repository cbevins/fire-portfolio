<script>
  import NavButtons from './NavButtons.svelte'
  import { Card, CardHeader, CardFooter, CardTitle, CardBody, CardText } from "sveltestrap";

  export let pages, pageIndex
  let page = pages[pageIndex]
  let borderColor = 'border-success'
  let cardBodyClasses = "overflow-auto "+borderColor
</script>

<div id={page.id+"Component"}>
  <Card id={page.id} style="height: 400px" class={borderColor}>
    <CardHeader class={borderColor}>
      <CardTitle>
        <slot name='title'>
          <span class="missing">Unknown title</span>
        </slot>
      </CardTitle>
    </CardHeader>
    <CardBody class={cardBodyClasses}>
      <slot name='content'>
        <span class="missing">Unknown content</span>
      </slot>
    </CardBody>
    <CardFooter class={borderColor}>
      <NavButtons {pages} {pageIndex} />
    </CardFooter>
  </Card>
</div>
