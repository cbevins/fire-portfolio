<script>
  import { Nav, NavItem, NavLink } from 'sveltestrap';
  import SideBarSampleContent from './SideBarSampleContent.svelte'

  let steps = [
    {
      id: 'selectVariablesMenuItem',
      label: 'Select Variables',
      href: 'selectVariablesComponent'
    }, {
      id: 'configureModulesMenuItem',
      label: 'Configure Modules',
      href: 'configureModulesComponent'
    }, {
      id: 'selectProductMenuItem',
      label: 'Select Product',
      href: 'selectProductComponent'
    }
  ]
</script>

<nav id="sidebarMenu"
    class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
  <div class="sidebar-sticky pt-3">
    <SideBarSampleContent/>
  </div>
</nav>
