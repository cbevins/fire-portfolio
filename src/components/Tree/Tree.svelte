<script>
  import { _selected } from './modulesStore.js'
  import { modules, variableMap } from './modules.js'
  import Branch from './Branch.svelte';
</script>

Currently selected:
  <ul>
    {#each $_selected.sort() as key}
      <li>{key}</li>
    {/each}
  </ul>

<Branch label="Home" items={modules} expanded/>