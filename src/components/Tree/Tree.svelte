<script>
  import Branch from './Branch.svelte';
  import { root } from './root.js'
  import { modules } from './modules.js'
</script>

<Branch label="Home" items={modules} expanded/>