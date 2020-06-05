<script>
  // This is the <App /> component,
  // which is instantiated by main.js by invoking 'new App(obj)', where
  // the obj.props arg contains all props passed into <App />.
  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  export let title;
  export let author;
  export let products;

  import ModuleSelect from "./components/ModuleSelect.svelte";
  import PaletteSelect from "./components/PaletteSelect.svelte";
  import ProductSelect from "./components/ProductSelect.svelte";
  import Tutorial from "./components/Tutorial.svelte";
  import Welcome from "./components/Welcome.svelte";

  // These are local
  let name = "Collin";
  let prompt = "Hello";

  function handleButton() {
    name = name === "Collin" ? "Barbara" : "Collin";
    prompt = prompt === "Hello" ? "Goodbye" : "Hello";
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <!-- The 'title' prop is passed directly into the Welcome component -->
  <Welcome {title} />
  <h3>by {author}</h3>
  <ProductSelect {products} />
  <ModuleSelect {products} />
  <PaletteSelect {products} />
  <Tutorial />
</main>
