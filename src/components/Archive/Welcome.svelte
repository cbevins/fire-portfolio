<script>
  import { Button } from 'sveltestrap';
  import Tutorial from "./Tutorial.svelte";

  // 'title' and 'author' are props passed in by the client of Welcome
  export let title;
  export let author;

  // These are local
  let name = "Collin";
  let prompt = "Hello";

  function handleButton() {
    name = name === "Collin" ? "Barbara" : "Collin";
    prompt = prompt === "Hello" ? "Goodbye" : "Hello";
  }
</script>

<main>
  <h1>Welcome to the {title}</h1>
  <h3>by {author}</h3>
  <p>Hello, {name}!</p>
  <Button outline color='primary' on:click={handleButton}>Who?</Button>
  <Tutorial />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  h1 {
    color: #ff3e00;
    font-size: 2em;
    font-weight: 100;
  }
</style>
