<script>
  // see https://blog.logrocket.com/application-state-management-with-svelte/
  import cars from "./cars.js";

  // binding values
  let make = ""
  let model = ""
  let year = ""

  // submit car
  const submitCar = () => {
    cars.addCar({ make, model, year })
    // reset values
    make = model = year = ""
  }
</script>

<div id="carList">
  <input type="text"  bind:value={make} placeholder="Enter vehicle make" />
  <input type="text"  bind:value={model} placeholder="Enter vehicle model" />
  <input type="year" bind:value={year} placeholder="Enter vehicle year" />
  <input type="submit" on:click={submitCar} value="Include Vehicle" />
  <input type="submit" on:click={cars.reset} value="Reset Vehicle list" />
</div>