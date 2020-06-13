<script>
  import { Col, Row, Container, Button } from "sveltestrap"
  import GraphYSelect from "./GraphYSelect.svelte";
  import ModuleSelect from "./ModuleSelect.svelte";
  import PaletteSelect from "./PaletteSelect.svelte";
  import ProductSelect from "./ProductSelect.svelte";

  export let products

  let color = 'info'
  let help = 'Info'
</script>

<Container>
  <Row>
      <Col xs="3">Product</Col>
      <Col xs="8"><ProductSelect {products} /></Col>
      <Col xs="1"><Button outline {color} size="sm">{help}</Button></Col>
  </Row>
  <Row>
      <Col xs="3">BehavePlus Module</Col>
      <Col xs="8"><ModuleSelect {products} /></Col>
      <Col xs="1"><Button outline {color} size="sm">{help}</Button></Col>
  </Row>
  <Row>
      <Col xs="3">Variable Palette</Col>
      <Col xs="8"><PaletteSelect {products} /></Col>
      <Col xs="1"><Button outline {color} size="sm">{help}</Button></Col>
  </Row>
  <Row>
      <Col xs="3">Graph Y Variable</Col>
      <Col xs="8"><GraphYSelect {products} /></Col>
      <Col xs="1"><Button outline {color} size="sm">{help}</Button></Col>
  </Row>
</Container>
