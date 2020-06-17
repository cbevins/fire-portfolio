<script>
  import { _inputs } from '../VariableSelector/variablesStore.js'
  import { keyLabel } from '../../appData.js'
  import StandardPage from './StandardPage.svelte'
  import { Badge } from "sveltestrap";

  export let pages, pageIndex

  let page = pages[pageIndex]
</script>

<StandardPage {pages} {pageIndex}>
  <span slot="title">{page.title}</span>
  <span slot="content">
    There are currently
    <Badge color="success">{$_inputs.length}</Badge>
    Input Variables as Possible X Axis candidates:
  <ul>
    {#each $_inputs as key}
      <li>{keyLabel(key)}</li>
    {/each}
  </ul>
  </span>
</StandardPage>
