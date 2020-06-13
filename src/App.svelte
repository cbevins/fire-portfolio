<script>
  /*
  This is the <App /> component instantiated by 'main.js' via `new App(obj)`,
  where the `obj.props` arg contains all props passed into <App />.

  Note that in Svelte, the 'export' statement actually declares the props
  that *this* component accepts from its parent/client.
*/
  export let dag

/*
  The purpose of App.svelte simply to
  - setContext() for shared data, and
  - add the <SinglePageApp/> component.

  The first setContext() is a component map that can be accessed by any subcomponent,
  rather than trying to maintain component `import` file locations across many files and folders.
  So, we import ALL components here in one place and add them to the componentMap.
  Subcomponents the access (and dynamically inject) other subcomponents via:

    import { getContext } from 'svelte'
    const {getMap, getComponent} = getContext('componentMap')
    <svelte:component this={getComponent('ReallyNiftyComponentKey')}/>

  without ever importing them.
*/
  import { onMount, setContext } from 'svelte'
  import SinglePageApp from "./components/SinglePageApp/SinglePageApp.svelte"
  import RedThing from './components/Archive/Things/RedThing.svelte'
  import GreenThing from './components/Archive/Things/GreenThing.svelte'
  import BlueThing from './components/Archive/Things/BlueThing.svelte'
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

// The second Context is The Dag!
  setContext('dag', dag)
</script>

<SinglePageApp/>
