import { BehavePlus, Dag, Equations } from 'behaveplus-core'
import { TranslationMap } from './translationMap.js'
import App from './App.svelte'

const root = new Dag.Root(
  BehavePlus.BpxGenome,
  BehavePlus.BpxVariantMap,
  Equations.MethodMap,
  TranslationMap.translationMap
)
const dag = root.addDag('Products')

const app = new App({
  target: document.body,
  props: {
    dag: dag
  }
})

export default app
