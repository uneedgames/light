const DraftLog = require('draftlog')
DraftLog(console)

let step
let taskCount
let currentTaskCount = 0
let currentDraft
let log = true


export default {

  setLog(isLog) {
    log = isLog
  },

  log() {
    if(!log) return
    console.log.apply(console, arguments)
  },
  
  step(stepName, taskNum) {
    if(!log) return
    step = stepName
    taskCount = taskNum
    currentTaskCount = 0
    currentDraft = console.draft(`[${step}] 0/${taskCount} ...`)
  },

  task(taskName) {
    if(!log) return
    currentTaskCount ++
    currentDraft(`[${step}] ${currentTaskCount}/${taskCount} ${taskName}`)
  },

  done(message) {
    if(!log) return
    currentDraft(`[${step}] ${taskCount}/${taskCount} ${message}`)
  }
  

}