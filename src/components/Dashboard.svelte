<script>
  import { Col, Row, Container, Button } from "sveltestrap";
  import DashboardChart from './DashboardChart.svelte'
  import DashboardNavbar from './DashboardNavbar.svelte'
  import DashboardSidebar from './DashboardSidebar.svelte'
  import DashboardTable from './DashboardTable.svelte'
  import DashboardToolbar from './DashboardToolbar.svelte'
  import ModuleSelect from "./ModuleSelect.svelte";
  import PaletteSelect from "./PaletteSelect.svelte";
  import ProductSelect from "./ProductSelect.svelte";

  export let title, products, author

  let color = 'info'
  let help = 'Info'
</script>

<DashboardNavbar/>
<div class="container-fluid">
  <div class="row">
    <DashboardSidebar/>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      <DashboardToolbar {title}/>


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
</Container>
      <DashboardChart/>
      <DashboardTable/>
    </main>
  </div>
</div>
