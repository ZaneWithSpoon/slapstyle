import Soundfont from 'soundfont-player'

var audio = {
  beatWait: [],
  kick: new Audio('./assets/sounds/kick.wav'),
  snare: new Audio('./assets/sounds/snare.wav'),
  tom: new Audio('./assets/sounds/tom.wav'),
  hat: new Audio('./assets/sounds/hat.wav'),
  playMeasure: function (bpm) {
    var speed = 60000/bpm/2    
  },
  playSample: function (name) {
    this[name].play()
  },
  doTimer: function (steps, bpm, onInstance, onComplete) {
    var flexSteps = steps
    var speed = 60000/bpm/4
    var count = -1
    var start = new Date().getTime()
    var that = this

    function instance() {
      if (count++ === flexSteps-1) {
        onComplete(count, function (repeat) {
          if (repeat) {
            onInstance(count%steps)

            flexSteps*=2
            var diff = (new Date().getTime() - start) - (count * speed)
            that.beatWait.push(window.setTimeout(instance, (speed - diff)))
          }
        })
      } else {
        onInstance(count%steps)

        var diff = (new Date().getTime() - start) - (count * speed)
        that.beatWait.push(window.setTimeout(instance, (speed - diff)))
      }
    }

    window.setTimeout(instance, speed)
  },
  killItAll: function () {
    for(var i = 0; i < this.beatWait.length; i++){
      clearTimeout(this.beatWait[i])
    }
    this.beatWait = []
  }
}

//Playing Audio Functions
function loadAudio(sourceBuffer, url) {

  let request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function() {
    ctx.decodeAudioData(request.response, function(buffer) {
      sourceBuffer.buffer = buffer
    })
  }
  request.send()
}

function playNote(note, instrument) {

  let inst = soundfont.instrument(instrument)
  inst.onready(function() {
    inst.play(note, 0)
  })
}

function playPrecussion(instrument) {
  //Create the audio buffer source Node
  let sourceBuffer = ctx.createBufferSource()

  let url = '../sounds/' + instrument + '.wav'

  loadAudio(sourceBuffer, url)
  sourceBuffer.connect(ctx.destination)
  sourceBuffer.loop = false

  sourceBuffer.start()  

  
}
export default audio