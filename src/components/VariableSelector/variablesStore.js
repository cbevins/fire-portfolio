import { derived, writable } from 'svelte/store'
import { dag, getVariableMap } from '../../appData.js'

const variableMap = getVariableMap()

const initialSelected = []
variableMap.forEach(item => {
  if (item.isSelected) {
    initialSelected.push(item.key)
  }
})

export const _selected = writable(initialSelected)

_selected.select = (item, isSelected) => _selected.update(currentItems => {
  variableMap.get(item).selected = isSelected
  dag.runSelected([[item, isSelected]])
  return isSelected ? [...currentItems, item]
    : currentItems.filter(key => key !== item)
})

export const _configs = derived(_selected, () =>
  dag.requiredConfigNodes().map(node => node.node.key))

export const _inputs = derived(_selected, () =>
  dag.requiredInputNodes().map(node => node.node.key))
