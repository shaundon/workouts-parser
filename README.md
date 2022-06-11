# Workouts Parser

Tool for taking a HealthKit export, extracting the workouts and turning them into JSON.

## Usage

Export your data from health.app and you'll get a file named `export.xml`. Place that in this repo at the top level.

```sh
yarn # Install dependencies
yarn start # Run the script
```

Results will be saved to `output.json`.

## Not yet implemented

* Heart rate data isn't currently included
* Workout routes are referred to by their filename only(which is included in the health.app export)