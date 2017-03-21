const DraftLog = require('draftlog')
DraftLog(console)

let step
let taskCount
let currentTaskCount = 0
let currentDraft


export default {
  
  step(stepName, taskNum) {
    step = stepName
    taskCount = taskNum
    currentTaskCount = 0
    currentDraft = console.draft(`[${step}] 0/${taskCount} ...`)
  },

  task(taskName) {
    currentTaskCount ++
    currentDraft(`[${step}] ${currentTaskCount}/${taskCount} ${taskName}`)
  },

  done(message) {
    currentDraft(`[${step}] ${currentTaskCount}/${taskCount} ${message}`)
  }
  

}