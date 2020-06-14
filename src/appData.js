/**
 * This file either creates, or provides access to, all the application data for main.js
 */
import { BehavePlus, Dag, Equations } from 'behaveplus-core'
import { TranslationMap } from './translationMap.js'

const root = new Dag.Root(
  BehavePlus.BpxGenome,
  BehavePlus.BpxVariantMap,
  Equations.MethodMap,
  TranslationMap
)

export const dag = root.addDag('Products')

export const variableTree = [
  {
    type: 'container',
    key: 'surfaceFire',
    label: 'Surface Fire',
    items: [
      {
        type: 'container',
        key: 'surfaceFireCommon',
        label: 'Common',
        items: [
          { type: 'item', key: 'surface.weighted.fire.spreadRate' },
          { type: 'item', key: 'surface.weighted.fire.flameLength' },
          { type: 'item', key: 'surface.weighted.fire.scorchHeight' }
        ]
      }, {
        type: 'container',
        key: 'surfaceFireTechnical',
        label: 'Technical',
        items: [
          { type: 'item', key: 'surface.weighted.fire.heading.fromNorth' },
          { type: 'item', key: 'surface.weighted.fire.heading.fromUpslope' },
          { type: 'item', key: 'surface.weighted.fire.heatPerUnitArea' }
        ]
      }]
  }, {
    type: 'container',
    key: 'fireEllipse',
    label: 'Fire Ellipse',
    items: [
      { type: 'item', key: 'surface.fire.ellipse.head.spreadRate' },
      { type: 'item', key: 'surface.fire.ellipse.head.flameLength' },
      { type: 'item', key: 'surface.fire.ellipse.head.scorchHeight' },
      { type: 'item', key: 'surface.fire.ellipse.head.firelineIntensity' },
      { type: 'item', key: 'surface.fire.ellipse.head.spreadDistance' },
      { type: 'item', key: 'surface.fire.ellipse.head.treeMortality' },
      { type: 'item', key: 'surface.fire.ellipse.head.mapDistance' }]
  }, {
    type: 'container',
    key: 'scorchHeight',
    label: 'Scorch Height',
    items: [{ type: 'item', key: 'mortality.scorchHeight' }]
  }, {
    type: 'container',
    key: 'treeMortality',
    label: 'Tree Mortality',
    items: [
      { type: 'item', key: 'mortality.crownLengthScorched' },
      { type: 'item', key: 'mortality.crownVolumeScorched' },
      { type: 'item', key: 'mortality.rate' }]
  }
]

const variableMap = new Map()

export const getVariableMap = () => {
  if (!variableMap.size) buildVariableMap()
  return variableMap
}

const addContainer = (item) => {
  if (item.type === 'container') {
    item.items.forEach(child => addContainer(child))
  } else {
    const node = dag.get(item.key)
    variableMap.set(item.key, {
      key: item.key,
      node: node,
      order: variableMap.size,
      selected: false
    })
    item.node = node
  }
}

const buildVariableMap = () => {
  variableTree.forEach(item => addContainer(item))
}

export const language = 'en_US'
/**
 * Helper function that returns the TranslationMap text for a `${key}/label@${lang}`
 * @param {string} key The TranslationMap key prefix that ends at '/label'
 */
export const keyLabel = (key) => dag.tr(`${key}/label`, language, `${key}*`)

/**
 * Helper function that returns the TranslationMap text for a `${key}/option=${option}/label@${lang}`
 * @param {string} key `${key}/option=${option}/label@${lang}`
 * @param {string} option `${key}/option=${option}/label@${lang}`
 */
export const optionLabel = (key, option) => dag.tr(`${key}/option=${option}/label`, language, `${option}*`)
