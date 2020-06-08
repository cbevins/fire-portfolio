<script>
  import DashboardChart from './Chart.svelte'
  import DashboardNavbar from './Navbar.svelte'
  import DashboardSidebar from './Sidebar.svelte'
  import DashboardTable from './Table.svelte'
  import DashboardToolbar from './Toolbar.svelte'
  import GraphProduct from "../GraphProduct.svelte";
  export let title, products
</script>

<DashboardNavbar/>
<div class="container-fluid">
  <div class="row">
    <DashboardSidebar/>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      <DashboardToolbar {title}/>
      <GraphProduct {products} />
      <DashboardChart/>
      <DashboardTable/>
    </main>
  </div>
</div>
