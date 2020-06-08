<script>
  import { CustomInput, FormGroup, Label } from "sveltestrap";

  export let module, items
</script>

<FormGroup>
  <Label for="exampleCheckbox">Variables</Label>
  <div>
    {#each items as item}
    <!-- 'name' but be the same, and 'id' must be unique-->
    <CustomInput
      type="switch"
      id={module+'-'+item.key+'-switch'}
      name={module+'-switch'}
      label={item.label} />
    {/each}
  </div>
</FormGroup>
