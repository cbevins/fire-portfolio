// This extends the Dag.node.map via shared keys
// with additional user interface properties
// such as 'selected', 'module', 'palette', 'units', etc props

export const variables = new Map([
  ['a1', {selected: false, label: 'Maximum Fire Spread Rate' }],
  ['a2', {selected: false, label: 'Direction of Maximum Spread from Upslope'}],
  ['a3', {selected: false, label: 'Maximum Flame Length'}],
  ['b1', {selected: false, label: 'Spread Rate at Ellipse Head'}],
  ['b2', {selected: false, label: 'Flame Length at Ellipse Head'}],
  ['b3', {selected: false, label: 'Spread Rate at Ellipse Flank'}],
  ['b4', {selected: false, label: 'Flame Length at Ellipse Flank'}],
  ['b5', {selected: false, label: 'Spread Rate at Ellipse Back'}],
  ['b6', {selected: false, label: 'Flame Length at Ellipse Back'}],
  ['c1', {selected: false, label: 'Scorch Height'}],
  ['d1', {selected: false, label: 'Tree Mortality'}],
  ['d2', {selected: false, label: 'Bark Thckness'}],
  ['d3', {selected: false, label: 'Scorch Height'}],
])

function map(key) {
  const obj = variables.get(key)
  return {type: 'item', key: key, label: obj.label, items: []}
}

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
