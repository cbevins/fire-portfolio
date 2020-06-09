<script>
  import { _selected } from './variablesStore.js'
  import { variableTree, variableMap } from './variables.js'
  import Branch from './Branch.svelte';
  import { Button, Collapse, UncontrolledCollapse,
    Card, CardBody, CardFooter, CardHeader,
    CardImg, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  let isOpen = false
  let isOpen2 = false
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
    Currently {$_selected.length} Selected Variables of Interest
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
    <Button color="primary" size="sm" id="variableTree"
        on:click={() => (isOpen2 = !isOpen2)} class="mb-3">
        {#if isOpen2}
          <span class="fa fa-toggle-up"></span>
        {:else}
          <span class="fa fa-toggle-down"></span>
        {/if}
    </Button>
    Select/Unselect Variables of Interest Here
  </CardHeader>
  <UncontrolledCollapse toggler="variableTree" isOpen={isOpen2}>
  <CardBody>
    <Branch label="Home" items={variableTree} expanded/>
  </CardBody>
  </UncontrolledCollapse>
  </Card>
</div>
