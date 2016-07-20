/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'
import audio from './audio'

//socket
var socket = io.connect('http://localhost:8080')

//preloading piano
audio.loadInstrument('vibraphone')
audio.startup()

//fuck you nextList thisList
var thisLoop = ['test', 'test3', 'test2']
var nextLoop = ['test', 'test3', 'test2']

//creating empty measure for rendering editor view
var userColors = ['#1CCAD8', 'green', 'purple', 'red']
var users = 1
var division = 8
var range = ['kick', 'snare', 'tom', 'hat']
var testMeasure = []
for (var i = 0; i < division*4; i++)
  testMeasure.push([])

  testMeasure[0].push('kick')
  testMeasure[6].push('kick')
  testMeasure[14].push('kick')
  testMeasure[22].push('kick')
  testMeasure[28].push('kick')
  testMeasure[8].push('snare')
  testMeasure[24].push('snare')
  testMeasure[2].push('tom')
  testMeasure[18].push('tom')

  testMeasure[0].push('hat')
  testMeasure[2].push('hat')
  testMeasure[4].push('hat')
  testMeasure[6].push('hat')
  testMeasure[7].push('hat')
  testMeasure[8].push('hat')
  testMeasure[10].push('hat')
  testMeasure[14].push('hat')
  testMeasure[16].push('hat')
  testMeasure[18].push('hat')
  testMeasure[20].push('hat')  
  testMeasure[21].push('hat')
  testMeasure[23].push('hat')
  testMeasure[24].push('hat')
  testMeasure[26].push('hat')
  testMeasure[28].push('hat')
  testMeasure[30].push('hat')

var anothertestMeasure = []
for (var i = 0; i < 8*4; i++)
  anothertestMeasure.push([])

var Main = React.createClass({
  render: function() {
    return (
      <site style={containerStyle}>
        <Overlay 
          visible={this.state.isModal} 
          toggleOverlay={this.toggleOverlay} 
          signIn={this.signIn} />
        <Header 
          toggleOverlay={this.toggleOverlay} 
          isLoggedIn={this.state.isLoggedIn} 
          user={this.state.user} 
          songId={this.state.songId}
          socket={socket}
          changeSongs={this.changeSongs}
          roommates={this.state.roommates}
          userColors={userColors} />
        <Toolbar 
          playing={this.state.playing} 
          play={this.play}
          stop={this.stop}
          bpm ={this.state.bpm}
          updateBpm={this.updateBpm} />
        <Editor 
          range={range}
          audio={audio}
          measures={this.state.measures} 
          focusId={this.state.focusId}
          division={this.state.division} 
          toggleNote={this.toggleNote}
          playingBeat={this.state.playingBeat} />
        <InstrumentPanel
          channels={this.state.channels}
          measures={this.state.measures}
          instruments={audio.instruments}
          songId={this.state.songId}
          focusId={this.state.focusId}
          updateFocus={this.updateFocus}
          toggleNextLoop={this.toggleNextLoop}
          socket={socket}
          audio={audio} />
      </site>
    )
  },
  getInitialState: function() {
    return {
      user: {
        username: 'fakeName',
        id: 'user-163c2b38-1007-4aaf-a234-268647bc3124',
        photo: './assets/dolphin.png'
      },
      isLoggedIn: false,
      isModal: false,
      roommates: [],
      playingBeat: -1,
      playing: false,
      songId: '',
      focusId: 'test',
      bpm: 110,
      division: division,
      channels: { 'fakeId': {name: 'drums', position: 0, sampletype: 'drums'},  'alsoFake': {name: 'vibraphone', position: 1, sampletype: 'vibraphone'} },
      measures: {
        'test': { name: 'trap beat', notes: testMeasure, position: 0, channelid: 'fakeId', sampletype: 'drums'},
        'test3': { name: '4 to the floor', notes: anothertestMeasure, position: 1, channelid: 'fakeId', sampletype: 'drums'},
        'test2': { name: 'vibraphone', notes: anothertestMeasure, position: 0, channelid: 'alsoFake', sampletype: 'vibraphone'}
      }
    }
  },
  socketListeners: function() {
    var that = this
    //room listeners
    socket.on('user joined', function (data) {
      console.log('received log in thing')
      that.userHasJoined(data.user)
      socket.emit('in room', {user: that.state.user, songid: that.state.songId, to: data.user.id})
    })
    socket.on('user in room', function (data) {
      that.userHasJoined(data.user)
    })
    socket.on('user left', function (data) {
      that.userHasLeft(data.user.id)
    })
    socket.on('new room', function (data) {
      that.loadSong(data)
    })
    //measure listeners
    socket.on('add measure', function (data) {
      that.addMeasure(data)
    })
    socket.on('remove measure', function (data) {
      that.removeMeasure(data)
    })
    socket.on('updated measure', function (data) {
      that.updateMeasure(data.hmid, data.measure)
    })
    //channel listeners
    socket.on('add channel', function (data) {
      that.addChannel(data)
    })
    socket.on('remove channel', function (data) {
      that.removeChannel(data)
    })
    //misc listeners
    socket.on('invited', function (data) {
      alert(data + ' has invited you to work on a song')
    })
    socket.on('working event', function (data) {
      console.log(data)
    })
  },
  updateFocus: function(newFocus) {
    if (this.state.focusId !== newFocus) {
      this.setState({focusId: newFocus})
    }
  },
  addMeasure: function(newMeasure) {
    var newMeasures = this.state.measures
    newMeasures[newMeasure.id] = newMeasure
    this.setState({measures: newMeasures})
    this.toggleNextLoop(newMeasure.id)
  },
  removeMeasure: function(hmid) {
    var newMeasures = this.state.measures
    delete newMeasures[hmid]

    var index = thisLoop.indexOf(hmid)
    if (index > -1)
      thisLoop.splice(index, 1)

    index = newNextLoop.indexOf(hmid)
    if (index > -1)
      newNextLoop.splice(index, 1)

    if (hmid === this.state.focusId) {
      for (var id in this.state.measures) {
        if (id !== hmid) {
          this.setState({
            focusId: id, 
            measures: newMeasures
          })
        }
      }
    } else {
      this.setState({measures: newMeasures})
    }
  },
  addChannel: function(channel) {
    console.log(channel)
    audio.loadInstrument(channel.sampletype)
    var newChannels = this.state.channels
    newChannels[channel.channelid] = channel
    this.setState({channels: newChannels})
  },
  removeChannel: function(channelid) {
    var newChannels = this.state.channels
    delete newChannels[channelid]
    this.setState({channel: newChannels})
  },
  play: function() {
    this.setState({playing: true})
    this.playMeasure('blah')
  },
  playMeasure: function(hmid) {
    audio.doTimer(division*4, this.state.bpm, 
      function (step) {
        this.setState({playingBeat: step})
          for (var i in thisLoop) {
            var id = thisLoop[i]
            var sampletype = this.state.measures[id].sampletype
            if (sampletype === 'drums') {
              for (var note in this.state.measures[id].notes[step]) {
                audio.playSample(this.state.measures[id].notes[step][note])
              }
            } else {
              for (var note in this.state.measures[id].notes[step]) {
                audio.playSample(this.state.measures[id].notes[step][note], sampletype)
              }
            }
          }
      }.bind(this),
      function (step) {
        thisLoop = nextLoop.slice()
      }.bind(this))
  },
  stop: function() {
    this.setState({playing: false, playingBeat: -1})
    thisLoop = nextLoop.slice()
    audio.killItAll()
  },
  userHasJoined: function(newUser) {
    var newRoommates = this.state.roommates
    newRoommates.push(newUser)
    this.setState({roommates: newRoommates})
  },
  userHasLeft: function(userid) {
    var newRoommates = []
    this.state.roommates.map(function (user) {
      console.log(user)
      if (user.id !== userid) {
        newRoommates.push(user)
      }
    })
    this.setState({roommates: newRoommates})
  },
  updateMeasure: function (id, replacement) {
    var tempMeasures = this.state.measures
    tempMeasures[id] = replacement
    this.setState({measures: tempMeasures})
  },
  updateBpm: function (newBpm) {
    this.setState({bpm: newBpm})
    document.getElementById('sliderBpm').value = newBpm
    document.getElementById('textBpm').value = newBpm
  },
  loadSong: function (data) {
    var channels = {}
    for (var i=0; i<data.channels.length; i++) {
      channels[data.channels[i].id] = data.channels[i]
      if (data.channels[i].sampletype !== 'drums') {
        audio.loadInstrument(data.channels[i].sampletype)
      }
    }
    var loops = []
    var measures = {}
    for (var i=0; i<data.measures.length; i++) {
      measures[data.measures[i].hmid] = data.measures[i]
      loops.push(data.measures[i].hmid)
    }
    thisLoop=loops.slice()
    nextLoop=loops.slice()

    this.setState({
      channels: channels, 
      measures: measures, 
      focusId: data.measures[0].hmid})
  },
  toggleOverlay: function() {
    this.setState({ isModal: (this.state.isModal) ? false : true})
  },
  toggleNote: function(note, beat) {
    var newMeasure = []

    var found = false
    for (var i = 0; i < this.state.measures[this.state.focusId].notes.length; i++) {
      if (i !== beat ){
        newMeasure.push(this.state.measures[this.state.focusId].notes[i])
      } else {
        var replacement = []
        for (var j = 0; j < this.state.measures[this.state.focusId].notes[i].length; j++) {
          if (this.state.measures[this.state.focusId].notes[i][j] !== note) {
            replacement.push(this.state.measures[this.state.focusId].notes[i][j])
          } else {
            found = true
          }
        }
        if (!found) {
          replacement.push(note)
        }
        newMeasure.push(replacement)
      }
    }

    socket.emit('update notes', {
      songid: this.state.songId,
      hmid: this.state.focusId,
      replacement: {
        notes: newMeasure,
        position: this.state.measures[this.state.focusId].position,
        name: this.state.measures[this.state.focusId].name,
        sampletype: this.state.measures[this.state.focusId].sampletype,
        channelid: this.state.measures[this.state.focusId].channelid
      }
    })
  },
  toggleNextLoop: function(hmid) {
    var index = nextLoop.indexOf(hmid)
    if (index > -1){
      nextLoop.splice(index, 1)
    } else {
      nextLoop.push(hmid)
    }
    if (!this.state.playing) {
      thisLoop = nextLoop.slice()
    }
  },
  changeSongs: function(songid) {
    if (songid !== this.state.songId){
      this.setState({roommates: []})
      if (this.state.songId === '') {
        socket.emit('switch room', { new: songid, user: this.state.user })
      } else {
        socket.emit('switch room', { old: this.state.songId, new: songid, user: this.state.user })
      }
      this.setState({songId: songid})
    }
  },
  signIn: function(data) {
    this.setState({
      user: data.user,
      isLoggedIn: true,
      isModal: false
    })
    socket.emit('my room', {id: data.user.id})
    this.socketListeners()
    for(var i=0; i<data.songs.length; i++){
      if (data.songs[i].songid === data.user.primarySong) {
        this.changeSongs(data.songs[i].songid)
      }
    }
  }
})

var containerStyle = {

}

export default Main