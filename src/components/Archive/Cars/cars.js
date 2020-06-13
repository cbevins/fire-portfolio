// see https://blog.logrocket.com/application-state-management-with-svelte/
import { writable } from 'svelte/store';

let CARS = [
    { make: "Ford", model: "Taurus", year: "2015" },
    { make: "Toyota", model: "Avalon", year: "2013" }
]

const { subscribe, set, update } = writable(CARS)

const addCar = newCar => update(currentCars => {
  return [...currentCars, newCar]
})

const reset = () => {
  set(CARS)
}

export default {
  subscribe,
  addCar,
  reset
}