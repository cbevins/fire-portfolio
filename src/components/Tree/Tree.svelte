<script>
  import { _selected } from './modulesStore.js'
  import { modules, variableMap } from './modules.js'
  import Branch from './Branch.svelte';
  import { Button, Collapse,
    Card, CardBody, CardFooter, CardHeader,
    CardImg, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  let isOpen = false
</script>


<div class="overflow-auto" max-height="100">
<Card class="mb-3">
  <CardHeader>
    <Button color="primary" size="sm"
        on:click={() => (isOpen = !isOpen)} class="mb-3">
        {#if isOpen}
        <span class="fa fa-toggle-up"></span>
        {:else}
        <span class="fa fa-toggle-down"></span>
        {/if}
    </Button>
    Currently {$_selected.length} Selected Output Variables
  </CardHeader>
  <Collapse {isOpen}>
  <CardBody>
  <ul>
    {#each $_selected.sort() as key}
      <li>{variableMap.get(key).label}</li>
    {/each}
  </ul>
  </CardBody>
  </Collapse>
</Card>
</div>

<div class="overflow-auto" max-height="800">
  <Card>
  <CardHeader>
    Select Variables Here
  </CardHeader>
  <CardBody>
    <Branch label="Home" items={modules} expanded/>
  </CardBody>
  </Card>
</div>
