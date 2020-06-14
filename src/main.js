import { dag, variableTree, getVariableMap } from './appData.js'
import App from './App.svelte'

const app = new App({
  target: document.body,
  props: {
    dag,
    variableTree,
    variableMap: getVariableMap()
  }
})

export default app
