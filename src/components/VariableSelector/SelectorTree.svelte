<script>
  import { _selected } from './variablesStore.js'
  import { variableTree, variableMap } from './variables.js'
  import Branch from './Branch.svelte';
  import { Button, Collapse, UncontrolledCollapse,
    Card, CardBody, CardFooter, CardHeader,
    CardImg, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  let isOpen = true

  function clearAll() {
    console.log('Before clear: ',$_selected)
    $_selected.forEach(key => {
      _selected.select(key, false)
      document.getElementById('variable-selector-checkbox-'+key).checked = false;
    })
    console.log('After clear: ',$_selected)
  }
</script>

<div class="overflow-auto" max-height="800">
  <Card>
    <CardHeader>
      <Button color="primary" size="sm"
          on:click={() => (isOpen = !isOpen)} class="mb-3">
          {#if isOpen}
            <span class="fa fa-toggle-up"></span>
          {:else}
            <span class="fa fa-toggle-down"></span>
          {/if}
      </Button>
      Select/Unselect Variables of Interest Here
      <Button size="sm" on:click={clearAll}>
        Clear All
      </Button>
    </CardHeader>

    <Collapse {isOpen}>
    <CardBody>
      <Branch label="Modules" items={variableTree} expanded/>
    </CardBody>
    </Collapse>
    </Card>
</div>
