/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'
import audio from './audio'

//socket
var socket = io.connect('http://localhost:8080')

//creating empty measure for rendering editor view
var division = 8
var range = ['kick', 'snare', 'tom', 'hat']
var bpm = 120
var speed = 60000/bpm/(division/2)
var playingBeat = -1
var beatWait = []
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


var Main = React.createClass({
  render: function() {
    return (
      <site>
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
          roommates={this.state.roommates} />
        <Toolbar 
          playing={this.state.playing} 
          play={this.play}
          stop={this.stop} />
        <Editor 
          range={range}
          audio={audio}
          measure={this.state.measures[this.state.focusId]} 
          division={this.state.division} 
          toggleNote={this.toggleNote}
          playingBeat={this.state.playingBeat} />
        <InstrumentPanel
          channels={this.state.channels}
          measures={this.state.measures} />
      </site>
    )
  },
  getInitialState: function() {
    return {
      user: {
        username: 'fakeName',
        id: "user-7bc40883-73be-41e9-8339-5ac54e2b688e",
        photo: './assets/dolphin.png'
      },
      isLoggedIn: false,
      isModal: false,
      roommates: [],
      playingBeat: -1,
      playing: false,
      songId: '',
      focusId: 'test',
      division: division,
      channels: {},
      measures: {'test': { notes: testMeasure }}
    }
  },
  play: function() {
    this.setState({playing: true})
    if (this.state.playingBeat === 31) {
      this.setState({playingBeat: 0}, function() {
        for (var note in this.state.measures[this.state.focusId].notes[this.state.playingBeat]) {
          audio.playSample(this.state.measures[this.state.focusId].notes[this.state.playingBeat][note])
        }
      })
    } else {
      this.setState({playingBeat: this.state.playingBeat+1}, function() {
        for (var note in this.state.measures[this.state.focusId].notes[this.state.playingBeat]) {
          audio.playSample(this.state.measures[this.state.focusId].notes[this.state.playingBeat][note])
        }
      })
    }
    beatWait.push(setTimeout(() => this.play(), speed))
  },
  stop: function() {
    console.log('stop')
    this.setState({playing: false, playingBeat: -1})
    for(i = 0; i < beatWait.length; i++){
      clearTimeout(beatWait[i])
    }
    beatWait = []
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
  socketListeners: function() {
    var that = this
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
      that.organizeHypermeasures(data)
    })
    socket.on('updated measure', function (data) {
      that.updateMeasure(data.hmid, data.measure)
    })
    socket.on('invited', function (data) {
      alert(data + ' has invited you to work on a song')
    })
    socket.on('working event', function (data) {
      console.log(data)
    })
  },
  updateMeasure: function (id, replacement) {
    var tempMeasures = this.state.measures
    tempMeasures[id] = replacement
    this.setState({measures: tempMeasures})
  },
  organizeHypermeasures: function (hms) {
    var channels = {}
    var measures = {}
    var focusId = ''

    for (var i = 0; i < hms.length; i++) {
      if (channels[hms[i].channelid] === null) {
        channels[hms[i].channelid] = {
          name: hms[i].channelname,
          position: hms[i].channelposition,
          sampletype: hms[i].sampletype
        }
      } 
      measures[hms[i].hmid] = {
        name: hms[i].hmname,
        position: hms[i].hmposition,
        notes: hms[i].notes,
        sampletype: hms[i].sampletype
      }
      if (hms[i].channelposition === 0 && hms[i].hmposition === 0 ) {
        focusId = hms[i].hmid
      }
    }
    this.setState({channels: channels, measures: measures, focusId: focusId})
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
        sampletype: this.state.measures[this.state.focusId].sampletype
      }
    })
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

export default Main