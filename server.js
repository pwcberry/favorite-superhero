import { getSuperheroes } from "./src/sqlite.js";

const superheroes = await getSuperheroes();

console.log(superheroes);

