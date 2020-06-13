<script>
export let company, logo, title, homePage
</script>

<style>
  h1, .title {
    color: #ff3e00;
    font-size: 1.5em;
    font-weight: 100;
  }
</style>

<nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">

  <!-- Branding with link to company home page -->
  <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href={homePage}>
    <img src={logo} alt="SEM"/> <span class="title">{company}</span>
  </a>

  <!-- Menu button that appears on narrow displays -->
  <button class="navbar-toggler position-absolute d-md-none collapsed"
      type="button"
      data-toggle="collapse"
      data-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <h1>{title}</h1>
<!--
  <input class="form-control form-control-dark w-100"
    type="text"
    placeholder="Search"
    aria-label="Search">
-->

  <ul class="navbar-nav px-3">
    <li class="nav-item text-nowrap">
      <a class="nav-link" href="#top">Sign out</a>
    </li>
  </ul>
</nav>
