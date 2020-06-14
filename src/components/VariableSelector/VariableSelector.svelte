<script>
  import SelectedPanel from './SelectedPanel.svelte'
  import SelectorTree from './SelectorTree.svelte'
  import { Row, CardText } from "sveltestrap";
</script>

<div id="selectVariablesComponent">
  <slot>
    <CardText>
      Select as many Graph Y Variables as you like from the first panel;
      the selected variables will appear in the second panel.
    </CardText>
    <CardText>
      A separate graph will be produced for each selected Y variable.
      As you select and unselect Y variables,
      the number of applicable BehavePlus configuration options will likely change,
      as may the set of required input variables.
    </CardText>
    <Row>
      <SelectorTree/>
      <SelectedPanel/>
    </Row>
  </slot>
</div>
