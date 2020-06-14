import { writable } from 'svelte/store'
import { getVariableMap } from '../../appData.js'

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
  return isSelected ? [...currentItems, item]
    : currentItems.filter(key => key !== item)
})
