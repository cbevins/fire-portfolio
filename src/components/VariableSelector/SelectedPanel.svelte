<script>
  import { _selected } from './variablesStore.js'
  import { variableTree, variableMap } from './variables.js'
  import { Badge, Button, Collapse, Card, CardBody, CardHeader, CardTitle } from "sveltestrap";
  let isOpen = false
</script>

  <Card class="mb-3">
    <CardHeader>
      <CardTitle>
      <Button color="primary" size="sm"
          on:click={() => (isOpen = !isOpen)} class="mb-3">
          {#if isOpen}
            <span class="fa fa-toggle-up"></span>
          {:else}
            <span class="fa fa-toggle-down"></span>
          {/if}
      </Button>
        There are currently
        <Badge color="success">{$_selected.length}</Badge>
        Selected Variables of Interest
      </CardTitle>
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
