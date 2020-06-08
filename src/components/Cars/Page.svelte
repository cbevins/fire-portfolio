<script>
// see https://blog.logrocket.com/application-state-management-with-svelte/
  import cars from "./cars.js"
</script>

<div id="carPage">
  { #each $cars as car }
    <p>{car.make} {car.model}</p>
    <p>{car.year}</p>
    <hr />
  { /each }
</div>