export const PaletteText = [
  ['palette/label@en_US', 'Variable Palette'],
  ['palette/option=common/label@en_US', 'just the most commonly used variables'],
  [
    'palette/option=intermediate/label@en_US',
    'plus the more technical, intermediate variables'
  ],
  ['palette/option=advanced/label@en_US', 'plus the most advanced, wonky variables']
]

export const SelectorText = [
  ['selector.graph.x.variable/label@en_US', 'Graph X variable'],
  [
    'selector.graph.x.variable/option=range/label@en_US',
    'Enter x-axis min and max values, and number of data points'
  ],
  [
    'selector.graph.x.variable/option=menu/label@en_US',
    'Select the x variable values'
  ],
  ['selector.graph.y.variable/label@en_US', 'Graph Y variable'],
  [
    'selector.graph.z.variable/label@en_US',
    'Graph Z variable'
  ]
]

export const ModuleText = [
  ['module/label@en_US', 'BehavePlus Module'],
  ['module/option=surfaceFire/label@en_US', 'Surface Fire'],
  ['module/option=fireEllipse/label@en_US', 'Fire Ellipse'],
  ['module/option=scorchHeight/label@en_US', 'Scorch Height'],
  ['module/option=treeMortality/label@en_US', 'Tree Mortality'],
  ['module/option=crownFire/label@en_US', 'Crown Fire'],
  ['module/option=spottingDistance/label@en_US', 'Spotting Distance'],
  ['module/option=ignitionProbability/label@en_US', 'Ignition Probability']
]

export const ProductText = [
  ['product/label@en_US', 'Product'],
  ['product/option=graph/label@en_US', 'Graph'],
  [
    'product/option=table0Ranges/label@en_US',
    'Table with single values for all inputs and outputs'
  ],
  [
    'product/option=table1Range/label@en_US',
    'Table with output values for columns and 1 muilti-valued input for rows'
  ],
  [
    'product/option=table2Ranges/label@en_US',
    'Table of output values for cells and 2 multi-valued inputs for rows and columns'
  ],
  ['product/option=runRecords/label@en_US', 'A set of data records'],
  ['product/option=diagram/label@en_US', 'A diagram'],
  ['product/option=caseComparisons/label@en_US', 'A set of case-wise comparisons'],
  ['product/option=timeSeries/label@en_US', 'A time series']
]

export const SurfaceFireText = [
  [
    'surface.fire.ellipse.axis.lengthToWidthRatio/label@en_US',
    'Fire Ellipse Length-toWidth Ratio'
  ],
  [
    'surface.fire.ellipse.head.spreadRate/label@en_US',
    'Spread Rate at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.head.firelineIntensity/label@en_US',
    'Fireline Intensity at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.head.flameLength/label@en_US',
    'Flame Length at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.head.scorchHeight/label@en_US',
    'Scorch Height at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.head.spreadDistance/label@en_US',
    'Spread Distance at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.head.treeMortality/label@en_US',
    'Tree Mortality at Ellipse Head'
  ],
  [
    'surface.fire.ellipse.axis.eccentricity/label@en_US',
    'Fire Ellipse Eccentricity'
  ],
  [
    'surface.primary.fuel.bed.packingRatio/label@en_US',
    'Primary Fuel Bed Packing Ratio'
  ],
  ['surface.primary.fuel.model.catalogKey', 'Primary Fuel Catalog Key'],
  [
    'surface.weighted.fire.arithmeticMean.spreadRate/label@en_US',
    'Surface Fire Maximum Spread Rate'
  ],
  [
    'surface.weighted.fire.heading.fromUpslope/label@en_US',
    'Direction of Maximum Spread from Upslope'
  ],
  [
    'surface.weighted.fire.heatPerUnitArea/label@en_US',
    'Surface Fire Heat per Unit Area'
  ]
]

export const SiteMoistureText = [
  ['site.moisture.dead.tl1h/label@en_US', 'Dead 1-h Fuel Moisture'],
  ['site.moisture.dead.tl10h/label@en_US', 'Dead 10-h Fuel Moisture'],
  ['site.moisture.dead.tl100h/label@en_US', 'Dead 100-h Fuel Moisture'],
  ['site.moisture.live.herb/label@en_US', 'Live Herbaceous Fuel Moisture'],
  ['site.moisture.live.stem/label@en_US', 'Live Stem Fuel Moisture']
]

export const ConfigureFuelText = [
  [
    'configure.fuel.primary/label@en_US',
    'Primary fuels are specified by entering'
  ],
  ['configure.fuel.primary/option=catalog/label@en_US', 'a fuel catalog key'],
  [
    'configure.fuel.primary/option=behave/label@en_US',
    'Behave fuel parameters'
  ],
  [
    'configure.fuel.primary/option=chaparral/label@en_US',
    'chaparral dynamic stand parameters'
  ],
  [
    'configure.fuel.primary/option=palmettoGallberry/label@en_US',
    'palmetto-gallberry dynamic stand parameters'
  ],
  [
    'configure.fuel.primary/option=westernAspen/label@en_US',
    'western aspen dynamic stand parameters'
  ],
  [
    'configure.fuel.secondary/label@en_US',
    'Secondary fuels are specified by entering'
  ],
  [
    'configure.fuel.secondary/option=none/label@en_US',
    'there is no secondary fuel'
  ],
  ['configure.fuel.secondary/option=catalog/label@en_US', 'a fuel catalog key'],
  [
    'configure.fuel.secondary/option=behave/label@en_US',
    'Behave fuel parameters'
  ],
  [
    'configure.fuel.secondary/option=chaparral/label@en_US',
    'chaparral dynamic stand parameters'
  ],
  [
    'configure.fuel.secondary/option=palmettoGallberry/label@en_US',
    'palmetto-gallberry dynamic stand parameters'
  ],
  [
    'configure.fuel.secondary/option=westernAspen/label@en_US',
    'western aspen dynamic stand parameters'
  ]
]

export const TranslationMap = new Map([
  ...ModuleText,
  ...PaletteText,
  ...ProductText,
  ...SelectorText,
  ...ConfigureFuelText,
  ...SiteMoistureText,
  ...SurfaceFireText
])
