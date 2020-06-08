<script>
  // This is the <App /> component,
  // which is instantiated by main.js via 'new App(obj)', where
  // the obj.props arg contains all props passed into <App />.
  import Dashboard from './components/Dashboard/Dashboard.svelte'
  import Welcome from "./components/Other/Welcome.svelte";

  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  export let title, author, products, company, logo, homePage
</script>

<Dashboard {title} {author} {products} {company} {logo} {homePage} />
<!--
  <Welcome {title} {author} {products}/>
 -->

