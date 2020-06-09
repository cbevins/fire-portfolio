import { writable } from 'svelte/store';

export const _selected = writable([])

_selected.select = item => _selected.update(currentItems => {
  return [...currentItems, item]
})

_selected.remove = item => _selected.update(currentItems => {
  return currentItems.filter(key => key !== item);
})

export const modules = [
  { type: 'container',
    key:  'surfaceFire',
    label: 'Surface Fire',
    items: [
      {type: 'item', key: 'a1', selected: false, label: 'Maximum Fire Spread Rate' },
      {type: 'item', key: 'a2', selected: false, label: 'Direction of Maximum Spread from Upslope' },
      {type: 'item', key: 'a3', selected: false, label: 'Maximum Flame Length'}
    ]
  }, {
    type: 'container',
    key: 'fireEllipse',
    label: 'Fire Ellipse',
    items: [
      {type: 'item', key: 'b1', selected: false, label: 'Spread Rate at Ellipse Head'},
      {type: 'item', key: 'b2', selected: false, label: 'Flame Length at Ellipse Head'},
      {type: 'item', key: 'b3', selected: false, label: 'Spread Rate at Ellipse Flank'},
      {type: 'item', key: 'b4', selected: false, label: 'Flame Length at Ellipse Flank'},
      {type: 'item', key: 'b5', selected: false, label: 'Spread Rate at Ellipse Back'},
      {type: 'item', key: 'b6', selected: false, label: 'Flame Length at Ellipse Back'},
    ]
  }, {
    type: 'container',
    key: 'scorchHeight',
    label: 'Scorch Height',
    items: [
      {type: 'item', key: 'c1', selected: false, label: 'Scorch Height'}
    ]
  }, {
    type: 'container',
    key: 'treeMortality',
    label: 'Tree Mortality',
    items: [
      {type: 'item', key: 'd1', selected: false, label: 'Tree Mortality'},
      {type: 'item', key: 'd2', selected: false, label: 'Bark Thckness'},
      {type: 'item', key: 'd3', selected: false, label: 'Scorch Height'}
    ]
  }
]
