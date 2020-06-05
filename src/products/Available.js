export const ProductsList = [
  'graph',
  'table0Ranges',
  'table1Range',
  'table2Ranges',
  'runRecords',
  'diagram',
  'caseComparisons',
  'timeSeries'
]

export const VariablesList = {
  surfaceFire: {
    common: [
      'surface.weighted.fire.arithmeticMean.spreadRate',
      'surface.weighted.fire.heading.fromUpslope',
      'surface.primary.fuel.model.catalogKey'
    ],
    intermediate: ['surface.weighted.fire.heatPerUnitArea'],
    advanced: ['surface.primary.fuel.bed.packingRatio']
  },
  fireEllipse: {
    common: [
      'surface.fire.ellipse.axis.lengthToWidthRatio',
      'surface.fire.ellipse.head.spreadRate',
      'surface.fire.ellipse.head.firelineIntensity',
      'surface.fire.ellipse.head.flameLength',
      'surface.fire.ellipse.head.scorchHeight',
      'surface.fire.ellipse.head.spreadDistance',
      'surface.fire.ellipse.head.treeMortality'
    ],
    intermediate: ['surface.fire.ellipse.axis.eccentricity'],
    advanced: []
  },
  scorchHeight: {
    common: [],
    intermediate: [],
    advanced: []
  },
  treeMortality: {
    common: [],
    intermediate: [],
    advanced: []
  },
  crownFire: {
    common: [],
    intermediate: [],
    advanced: []
  },
  spottingDistance: {
    common: [],
    intermediate: [],
    advanced: []
  },
  ignitionProbability: {
    common: [],
    intermediate: [],
    advanced: []
  }
}

export const ModulesList = Object.keys(VariablesList)
export const PalettesList = Object.keys(VariablesList.surfaceFire)
