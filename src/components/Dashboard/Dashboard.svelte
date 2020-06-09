<script>
  import CarList from "../Cars/List.svelte";
  import CarPage from "../Cars/Page.svelte";
  import DashboardChart from './Chart.svelte'
  import DashboardNavbar from './Navbar.svelte'
  import DashboardSidebar from './Sidebar.svelte'
  import DashboardTable from './Table.svelte'
  import DashboardToolbar from './Toolbar.svelte'
  import GraphProduct from "../GraphProduct.svelte";
  import VariableSelector from "../VariableSelector/VariableSelector.svelte";
  // Note that 'export' actually declares the props being passed
  // INTO into this component by its parent/client.
  export let title, author, products, company, logo, homePage

  let cars = false
  let dashboardChart = false
  let dashboardNavbar = true
  let dashboardSidebar = true
  let dashboardTable = false
  let dashboardToolbar = false
  let graphProduct = false
  let variableSelector = true

</script>

{#if dashboardNavbar}<DashboardNavbar {logo} {company} {title} {author} {homePage} />{/if}
<div class="container-fluid">
  <div class="row">
    {#if dashboardSidebar}<DashboardSidebar/>{/if}
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      {#if dashboardToolbar}<DashboardToolbar/>{/if}
      {#if cars}<CarList /><CarPage />{/if}
      {#if dashboardChart}<DashboardChart/>{/if}
      {#if dashboardTable}<DashboardTable/>{/if}
      {#if graphProduct}<GraphProduct {products} />{/if}
      {#if variableSelector}<VariableSelector/>{/if}
    </main>
  </div>
</div>
