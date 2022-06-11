const Parser = require('node-xml-stream')
const fs = require('fs')

const INPUT_FILE_NAME = './workouts.xml'
const OUTPUT_FILE_NAME = './output.json'

let inputStream = fs.createReadStream(INPUT_FILE_NAME)
let outputStream = fs.createWriteStream(OUTPUT_FILE_NAME)

let currentWorkout

const writeCurrentWorkout = () => {
    let asJson = JSON.stringify(currentWorkout, {}, 2)
    outputStream.write(`${asJson},\n`)
    console.log(`Wrote ${currentWorkout.workoutActivityType} workout from ${currentWorkout.endDate}.`)
} 

const handleTag = (name, attrs) => {
    if (name === "Workout") {
        currentWorkout = attrs
        currentWorkout.metadata = []
        currentWorkout.workoutEvents = []
    }
    if (currentWorkout) {
        if (name === "MetadataEntry") {
            currentWorkout.metadata.push(attrs)
        }
        if (name === "WorkoutEvent") {
            currentWorkout.workoutEvents.push(attrs)
        }
        if (name === "FileReference") {
            if (attrs.path) {
                currentWorkout.workoutRoutePath = attrs.path
            }
        }
    }
}

const handleTagClose = (name) => {
    if (name === "Workout") {
        writeCurrentWorkout()
        currentWorkout = null
    }
}

const onFinish = () => {
    console.log(`\nFinished parsing XML. Workouts have been written to ${OUTPUT_FILE_NAME}.`)
    outputStream.write(`]`)
    outputStream.close()
}

const parser = new Parser()
parser.on('opentag', handleTag)
parser.on('closetag', handleTagClose)
parser.on('finish', onFinish)

outputStream.write(`[`)
console.log("Beginning XML parsing. This may take a while (5 minutes or so)..\n")
inputStream.pipe(parser)