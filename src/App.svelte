<script>
  // This is the <App /> component,
  // which is instantiated by main.js via 'new App(obj)', where
  // the obj.props arg contains all props passed into <App />.
  // import Dashboard from './components/Dashboard/Dashboard.svelte'
  // import ThreePanel from "./components/Other/ThreePanel.svelte"
  // import Welcome from "./components/Other/Welcome.svelte"

  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  // export let title, author, products, company, logo, homePage

  // Create a Map if component name-reference pairs
  // so subcomponents can dynamically inject other subcomponents
  // without first importing them
  import { onMount, setContext } from 'svelte'
  import Spa from "./components/Spa/Spa.svelte"
  import RedThing from './components/Spa/RedThing.svelte'
  import GreenThing from './components/Spa/GreenThing.svelte'
  import BlueThing from './components/Spa/BlueThing.svelte'
  import VariableSelector from './components/VariableSelector/VariableSelector.svelte'

  const compMap = new Map([
    ['RedThing', RedThing],
    ['BlueThing', BlueThing],
    ['GreenThing', GreenThing],
    ['VariableSelector', VariableSelector],
  ])

  setContext('componentMap', {
    getMap: () => compMap,
    getComponent: (key) => compMap.get(key)
  })
</script>

<Spa/>
<!--
<Dashboard {title} {author} {products} {company} {logo} {homePage} />
<Welcome {title} {author} {products}/>
 -->

