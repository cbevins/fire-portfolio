<script>
  import DashboardChart from './Chart.svelte'
  import DashboardNavbar from './Navbar.svelte'
  import DashboardSidebar from './Sidebar.svelte'
  import DashboardTable from './Table.svelte'
  import DashboardToolbar from './Toolbar.svelte'
  import GraphProduct from "../GraphProduct.svelte";
  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  export let title, author, products, company, logo, homePage
</script>

<DashboardNavbar {logo} {company} {title} {author} {homePage} />
<div class="container-fluid">
  <div class="row">
    <DashboardSidebar/>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      <DashboardToolbar/>
      <GraphProduct {products} />
      <DashboardChart/>
      <DashboardTable/>
    </main>
  </div>
</div>
