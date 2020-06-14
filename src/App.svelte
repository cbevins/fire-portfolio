<script>
  /*
  This is the <App /> component instantiated by 'main.js' via `new App(obj)`,
  where the `obj.props` arg contains all props passed into <App />.

  Note that in Svelte, the 'export' statement actually declares the props
  that *this* component accepts from its parent/client.
*/
  export let dag, variableTree, variableMap

/*
  The purpose of App.svelte simply to
  - setContext() for all shared data, and
  - add the <SinglePageApp/> component.

  The first setContext() is a component map that can be accessed by any subcomponent,
  rather than trying to maintain component `import` file locations across many files and folders.
  So, we import *ALL* components here in one place and add them to the componentMap.
  Subcomponents the access (and dynamically inject) other subcomponents via:

    import { getContext } from 'svelte'
    const {getMap, getComponent} = getContext('componentMap')
    <svelte:component this={getComponent('ReallyNiftyComponentKey')}/>

  without ever importing them.
*/
  import { onMount, setContext } from 'svelte'
  import SinglePageApp from "./components/SinglePageApp/SinglePageApp.svelte"
  import VariableSelector from './components/VariableSelector/VariableSelector.svelte'

  import GraphIntro from './components/Graph/Intro.svelte'
  import GraphDecorations from './components/Graph/Decorations.svelte'
  import GraphInputs from './components/Graph/Inputs.svelte'
  import GraphModelConfig from './components/Graph/ModelConfig.svelte'
  import GraphResults from './components/Graph/Results.svelte'
  import GraphXVariable from './components/Graph/XVariable.svelte'
  import GraphYVariable from './components/Graph/YVariable.svelte'
  import GraphZVariable from './components/Graph/ZVariable.svelte'

  const compMap = new Map([
    ['GraphDecorations', GraphDecorations],
    ['GraphInputs', GraphInputs],
    ['GraphIntro', GraphIntro],
    ['GraphModelConfig', GraphModelConfig],
    ['GraphResults', GraphResults],
    ['GraphXVariable', GraphXVariable],
    ['GraphYVariable', GraphYVariable],
    ['GraphZVariable', GraphZVariable],
    ['VariableSelector', VariableSelector],
  ])

  setContext('componentMap', {
    getMap: () => compMap,
    getComponent: (key) => compMap.get(key)
  })

// The second Context is The Dag!
  setContext('dag', dag)
  setContext('variableTree', variableTree)
  setContext('variableMap', variableMap)
</script>

<SinglePageApp/>
