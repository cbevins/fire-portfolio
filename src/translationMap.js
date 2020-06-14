export const PaletteText = [
  ['palette/label@en_US', 'Variable Palette'],
  ['palette/option=common/label@en_US',
    'just the most commonly used variables'],
  [
    'palette/option=intermediate/label@en_US',
    'commonly used PLUS more technical variables'
  ],
  ['palette/option=advanced/label@en_US',
    'commonly used, technical, PLUS advanced variables']
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
    'Table with no multi-valued inputs'
  ],
  [
    'product/option=table1Range/label@en_US',
    'Table with 1 multi-valued input'
  ],
  [
    'product/option=table2Ranges/label@en_US',
    'Table with 2 multi-valued inptus'
  ],
  ['product/option=runRecords/label@en_US',
    'Set of data records (any number of multi-valued inputs)'],
  ['product/option=diagram/label@en_US', 'A diagram'],
  ['product/option=caseComparison/label@en_US',
    'A set of case-wise comparisons between discrete cases'],
  ['product/option=timeSeries/label@en_US',
    'A table or graph of conditions over time']
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
    'surface.weighted.fire.spreadRate/label@en_US',
    'Surface Fire Maximum Spread Rate'
  ],
  [
    'surface.weighted.fire.flameLength/label@en_US',
    'Surface Fire Maximum FlameLength'
  ],
  [
    'surface.weighted.fire.scorchHeight/label@en_US',
    'Surface Fire Maximum Scorch Height'
  ],
  [
    'surface.weighted.fire.heading.fromUpslope/label@en_US',
    'Direction of Maximum Spread from Upslope'
  ],
  [
    'surface.weighted.fire.heading.fromNorth/label@en_US',
    'Direction of Maximum Spread from North'
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
