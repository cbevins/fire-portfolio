<script>
  import NavButtons from './NavButtons.svelte'
  import { Card, CardHeader, CardFooter, CardTitle, CardBody, CardText } from "sveltestrap";

  export let pages, pageIndex
  let page = pages[pageIndex]
  const borderColor = 'border-success'
  let cardClasses = 'border-success'
  let headerClasses = 'border-success'
  let footerClasses = 'border-success'
  let bodyClasses = "overflow-auto "+borderColor
</script>

<div id={page.id+"Component"}>
  <Card id={page.id} style="height: 400px" class={cardClasses}>
    <CardHeader class={headerClasses}>
      <CardTitle>
        <slot name='title'>
          <span class="missing">Unknown title</span>
        </slot>
      </CardTitle>
    </CardHeader>
    <CardBody class={bodyClasses}>
      <slot name='content'>
        <span class="missing">Unknown content</span>
      </slot>
    </CardBody>
    <CardFooter class={footerClasses}>
      <NavButtons {pages} {pageIndex} />
    </CardFooter>
  </Card>
</div>
