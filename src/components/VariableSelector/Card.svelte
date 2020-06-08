<script>
  import {
    Button, Card, CardBody, CardFooter, CardHeader,
    CardImg, CardSubtitle, CardText, CardTitle, CustomInput } from "sveltestrap";
  import Available from './List.svelte'
  import {module} from './module.js'

  let isOpen = false
  let id0 = 'variableSelector'
  let currentModule = 'surfaceFire'
  let title
  let moduleKeys = Object.keys(module)
  let currentItems
  $: currentItems = module[currentModule].items
  function changeModule() {
    title = `Select a ${currentModule} variable...`
  }
</script>

<Card class="mb-3">
  <CardHeader>
    <CustomInput type="select" id={id0+'-moduleSelect'}
        bind:value={currentModule} on:change={changeModule}>
      {#each moduleKeys as key}
        <option value={key}>{module[key].label}</option>
      {/each}
    </CustomInput>
  </CardHeader>
  <CardBody>
    <CardText>
      <Available module={currentModule}  items={module[currentModule].items} />
    </CardText>
  </CardBody>
  <CardFooter>
  <Button color="secondary">Cancel</Button>
  <Button color="success">Apply</Button>
  </CardFooter>
</Card>
