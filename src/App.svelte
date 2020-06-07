<script>
  // This is the <App /> component,
  // which is instantiated by main.js via 'new App(obj)', where
  // the obj.props arg contains all props passed into <App />.
  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  export let title;
  export let author;
  export let products;

  import Dashboard from './components/Dashboard.svelte'
  import Welcome from "./components/Welcome.svelte";
</script>

<Dashboard {title} {author} {products} />
<!--
  <Welcome {title} {author} {products}/>
 -->

