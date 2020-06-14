<script>
  import { getContext } from 'svelte'
  import { keyLabel } from '../../appData.js'
  import { _selected } from './variablesStore.js'
  import { Badge, Button, Collapse, Card, CardBody, CardHeader, CardTitle } from "sveltestrap";

  let variableMap = getContext('variableMap')
  let isOpen = true
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
            <li>{keyLabel(key)}</li>
          {/each}
        </ul>
      </CardBody>
    </Collapse>
  </Card>
