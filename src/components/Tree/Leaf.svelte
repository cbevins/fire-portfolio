<script>
  import { CustomInput, Label, Input } from "sveltestrap";
  export let label, key, selected;
  $: type = label.slice(label.lastIndexOf('.') + 1);

  function clicked() {
    selected = !selected
    //alert(`${label} selected=${selected}`)
  }
</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>

<span style="background-image: url(https://svelte.dev/tutorial/icons/{type}.svg)">
  <label>
    <input type=checkbox id={key} on:change={clicked(selected)}>
    {label}
  </label>
</span>
