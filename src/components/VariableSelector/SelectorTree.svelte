<script>
  import { _selected } from './variablesStore.js'
  import { variableTree, variableMap } from './variables.js'
  import Branch from './Branch.svelte';
  import { Button, Collapse, UncontrolledCollapse,
    Card, CardBody, CardFooter, CardHeader,
    CardImg, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  let isOpen = false
</script>

<div class="overflow-auto" max-height="800">
  <Card>
    <CardHeader>
      <Button color="primary" size="sm" id="variableTree"
          on:click={() => (isOpen = !isOpen)} class="mb-3">
          {#if isOpen}
            <span class="fa fa-toggle-up"></span>
          {:else}
            <span class="fa fa-toggle-down"></span>
          {/if}
      </Button>
      Select/Unselect Variables of Interest Here
    </CardHeader>

    <UncontrolledCollapse toggler="variableTree" isOpen={isOpen}>
    <CardBody>
      <Branch label="Home" items={variableTree} expanded/>
    </CardBody>
    </UncontrolledCollapse>
    </Card>
</div>
