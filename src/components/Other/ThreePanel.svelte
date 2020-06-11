<script>
  import { Col, Container, Row } from "sveltestrap";
  import { Card, CardHeader, CardBody, CardFooter } from "sveltestrap";
</script>

<div class="container-fluid">
  <div class="row" style="height: 400px">
    <Card class="flex-grow-1">
      <CardHeader>Left Pane</CardHeader>
      <CardBody></CardBody>
    </Card>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4"  style="height: 400px">
      <Card class="flex-grow-1 h-75">
        <CardHeader>Main Pane 1</CardHeader>
        <CardBody></CardBody>
      </Card>
      <Card>
        <CardHeader>Main Pane 2</CardHeader>
        <CardBody></CardBody>
      </Card>
    </main>
  </div>
</div>
