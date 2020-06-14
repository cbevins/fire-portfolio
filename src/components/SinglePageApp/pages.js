export const getGraphPages = function () {
  return [
    {
      id: 'graphIntroPage',
      title: 'Begin Graph',
      component: 'GraphIntro'
    }, {
      id: 'graphYVariablePage',
      title: 'Select Graph Y Variable',
      component: 'GraphYVariable'
    }, {
      id: 'graphModelConfigPage',
      title: 'Configure Fire Modules',
      component: 'GraphModelConfig'
    }, {
      id: 'graphXVariablePage',
      title: 'Select Graph X Variable',
      component: 'GraphXVariable'
    }, {
      id: 'graphZVariablePage',
      title: 'Select Graph Z Variable',
      component: 'GraphZVariable'
    }, {
      id: 'graphInputsPage',
      title: 'Enter Fire Model Inputs',
      component: 'GraphInputs'
    }, {
      id: 'graphDecorationsPage',
      title: 'Enter Graph Decorations',
      component: 'GraphDecorations'
    }, {
      id: 'graphResultsPage',
      title: 'View Graph',
      component: 'GraphResults'
    }
  ]
}