/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'
import Chatbox from './chatbox'
import audio from './audio'
import {
  Song,
  Sequencer,
  Sampler
} from 'react-music'
import cookie from 'react-cookie'


var dev = true
if (dev) {
  var fbAppId='1645822355708621'
  var ip = 'http://localhost:8080'
} else {
  var fbAppId='1612283222395868'
  var ip = 'http://54.211.58.93:8080'
}

//server ip
//
//socket
var socket = io.connect(ip)

//creating empty measure for rendering editor view
var userColors = ['#1CCAD8', '#1cd82a', '#d81cca', '#d82a1c']
var users = 1
var division = 8
var range = ['kick', 'snare', 'tom', 'hat']

//starter measure for new songs
var testMeasure = []
for (var i = 0; i < 8*4; i++)
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

var trapHat = []
for (var i = 0; i < 8*4; i++)
  trapHat.push([])
for (var i = 0; i < 8*4; i+=2)
  trapHat[i].push('hat')
  trapHat[7].push('hat')
  trapHat[15].push('hat')
  trapHat[29].push('hat')

var chords = []
for (var i = 0; i < 8*4; i++)
  chords.push([])
  chords[0].push('C6')
  chords[0].push('G5')
  chords[0].push('E5')
  chords[4].push('C6')
  chords[4].push('G5')
  chords[4].push('E5')
  chords[10].push('C5')
  chords[10].push('A5')
  chords[10].push('E5')
  chords[16].push('B5')
  chords[16].push('G5')
  chords[16].push('D5')
  chords[22].push('C5')
  chords[22].push('G5')
  chords[22].push('E5')
  chords[22].push('C6')

var Main = React.createClass({
  render: function() {
    return (
      <site style={containerStyle}>
      <div class="g-hangout" data-render="createhangout"></div>
        <Overlay 
          ip={ip}
          fbAppId={fbAppId}
          visible={this.state.isModal} 
          toggleOverlay={this.toggleOverlay} 
          signIn={this.signIn} />
        <Header 
          ip={ip}
          toggleOverlay={this.toggleOverlay} 
          isLoggedIn={this.state.isLoggedIn} 
          user={this.state.user} 
          songId={this.state.songId}
          socket={socket}
          changeSongs={this.changeSongs}
          roommates={this.state.roommates}
          userColors={userColors}
          signout={this.signout} />
        <Toolbar 
          playing={this.state.playing} 
          play={this.play}
          stop={this.stop}
          bpm={this.state.bpm}
          updateBpm={this.updateBpm}
          waitingInstruments={this.state.waitingInstruments} />
        <Editor 
          range={range}
          audio={audio}
          toggleOverlay={this.toggleOverlay}
          isLoggedIn={this.state.isLoggedIn}
          measures={this.state.measures} 
          focusId={this.state.focusId}
          division={this.state.division} 
          toggleNote={this.toggleNote}
          playingBeat={this.state.playingBeat} />
        <InstrumentPanel
          channels={this.state.channels}
          measures={this.state.measures}
          instruments={audio.instruments}
          toggleOverlay={this.toggleOverlay}
          isLoggedIn={this.state.isLoggedIn}
          songId={this.state.songId}
          focusId={this.state.focusId}
          updateFocus={this.updateFocus}
          toggleNextLoop={this.toggleNextLoop}
          thisLoop={this.state.thisLoop}
          nextLoop={this.state.nextLoop}
          socket={socket}
          audio={audio} />
        {/*
        <test onClick={this.playSomething}>
          test
        </test>
        <some onClick={this.changeSteps}>
          some
        </some>
        <Song 
          playing={this.state.playing}
          tempo={this.state.bpm}>
          <Sequencer resolution={16} bars={1}>
            <Sampler
              sample='./assets/sounds/hat.wav'
              steps={this.state.steps}
              detune={0} />
          </Sequencer>
        </Song>
        <Song 
          playing={this.state.otherPlaying}
          tempo={this.state.bpm}>
          <Sequencer resolution={16} bars={1}>
            <Sampler
              sample='./assets/sounds/hat.wav'
              steps={this.state.steps}
              detune={700} />
          </Sequencer>
        </Song>
      */}
      </site>
    )
  },
  playSomething: function() {
    this.setState({playing: true})
  },
  changeSteps: function() {
    this.setState({otherPlaying: true})
  },
  getInitialState: function() {
    return {
      otherPlaying: false,
      steps: [0],
      user: {
        username: 'fakeName',
        id: 'user-cd955ef7-3e72-4eac-96f9-c4affd9f8b7a',
        photo: './assets/png/businessman.png',
        friends: []
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
      waitingInstruments: [],
      thisLoop: ['test', 'test3', 'test2'],
      nextLoop: ['test', 'test3', 'test2'],
      channels: { 'fakeId': {name: 'drums', position: 0, sampletype: 'drums'},  'alsoFake': {name: 'vibraphone', position: 1, sampletype: 'vibraphone'} },
      measures: {
        'test': { name: 'trap beat', notes: testMeasure, position: 0, channelid: 'fakeId', sampletype: 'drums'},
        'test3': { name: 'trap hat', notes: trapHat, position: 1, channelid: 'fakeId', sampletype: 'drums'},
        'test2': { name: 'chord progression', notes: chords, position: 0, channelid: 'alsoFake', sampletype: 'vibraphone'}
      }
    }
  },
  componentDidMount: function() {
    //load initial instruments
    audio.startup()
    this.loadInstrument('vibraphone')

    if (!this.state.isLoggedIn) {
      //loads usr profile from cookies
      var userid = cookie.load('userid')

      if (userid) {
        var longToken = cookie.load('longToken')

          $.ajax({
          url: ip + '/userid',
          type: "get", //send it through get method
          data: {'userid': userid},
          success: function(profile) {
            if (profile.profile !== 'unknown' && profile.profile !== null) { //returning user
              if (profile.user.fbid !== null && profile.user.fbid !== '') { //has signed in with fb
                $.ajax({
                  url: 'https://graph.facebook.com/v2.7/' + profile.user.fbid + '/friends',
                  type: 'get',
                  data: {access_token: longToken},
                  success: function(fbFriends) {
                    this.signIn(profile, fbFriends.data)
                  }.bind(this),
                  error: function(xhr) {
                    console.log('couldn\'t grab fb friends')
                    console.log(xhr)
                    this.signIn(profile, null)
                  }.bind(this)
                })
              } else { //never signed in with fb
                this.signIn(profile, null)
              }   
            } else { //new user
              this.setState({isModal: true})
            }
          }.bind(this),
          error: function(xhr) {
            console.log('couldn\'t load profile from cookie')
            console.log(xhr)
            this.setState({isModal: true})
          }
        })
      } else { //no cookies
        this.setState({isModal: true})
      }
    }
  },
  socketListeners: function() {
    var that = this
    //room listeners
    socket.on('user joined', function (data) {
      console.log('user has joined your room')
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
      alert(data + ' has invited you to work on a song. Find it in your song list.')
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

    var newThisLoop = this.state.thisLoop.slice()
    var newNextLoop = this.state.nextLoop.slice()

    var index = newThisLoop.indexOf(hmid)
    if (index > -1)
      newThisLoop.splice(index, 1)

    index = newNextLoop.indexOf(hmid)
    if (index > -1)
      newNextLoop.splice(index, 1)

    if (hmid === this.state.focusId) {
      for (var id in this.state.measures) {
        if (id !== hmid) {
          this.setState({
            focusId: id, 
            measures: newMeasures,
            thisLoop: newThisLoop,
            nextLoop: newNextLoop
          })
        }
      }
    } else {
      this.setState({
        measures: newMeasures,
        thisLoop: newThisLoop,
        nextLoop: newNextLoop
      })
    }
  },
  addChannel: function(channel) {
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
          for (var i in this.state.thisLoop) {
            var id = this.state.thisLoop[i]
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
        this.setState({thisLoop: this.state.nextLoop.slice()})
      }.bind(this))
  },
  stop: function() {
    this.setState({playing: false, playingBeat: -1, thisLoop: this.state.nextLoop.slice()})
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
        this.loadInstrument(data.channels[i].sampletype)
      }
    }
    var loops = []
    var measures = {}
    for (var i=0; i<data.measures.length; i++) {
      measures[data.measures[i].hmid] = data.measures[i]
      loops.push(data.measures[i].hmid)
    }

    this.setState({
      channels: channels, 
      measures: measures, 
      focusId: data.measures[0].hmid,
      thisLoop: loops.slice(),
      nextLoop: loops.slice()
    })
  },
  loadInstrument: function(instrument) {
    var newWaiting = this.state.waitingInstruments.slice()
    newWaiting.push(instrument)
    this.setState({waitingInstruments: newWaiting})

    audio.loadInstrument(instrument, function (instrument) {
      var newWaiting = this.state.waitingInstruments.slice()
      var index = newWaiting.indexOf(instrument)
      if (index > -1)
        newWaiting.splice(index, 1)

      this.setState({waitingInstruments: newWaiting})
    }.bind(this))
  },
  toggleOverlay: function() {
    if (this.state.playing) {
      this.stop()
    } 
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
    var index = this.state.nextLoop.indexOf(hmid)
    var newNextLoop = this.state.nextLoop.slice()
    if (index > -1){
      newNextLoop.splice(index, 1)
    } else {
      newNextLoop.push(hmid)
    }
    if (!this.state.playing) {
      this.setState({thisLoop: newNextLoop.slice(), nextLoop: newNextLoop})
    } else {
      this.setState({nextLoop: newNextLoop})
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
  signIn: function(data, friends) {
    data.user.friends = friends
    data.user.name = data.user.firstname + ' ' + data.user.lastname
    this.setState({
      user: data.user,
      isLoggedIn: true,
      isModal: false
    })

    this.giveCookie(data.user.id, data.user.fbtoken, data.user.expires)

    socket.emit('my room', {id: data.user.id})
    this.socketListeners()
    for(var i=0; i<data.songs.length; i++){
      if (data.songs[i].songid === data.user.primarySong) {
        this.changeSongs(data.songs[i].songid)
      }
    }
  },
  giveCookie: function(userid, longToken, expires) {
    var seconds = Math.floor(new Date() / 1000)
    expires = parseInt(expires)
    if (isNaN(expires)) {
      cookie.save('userid', userid, { path: '/', maxAge: 5184000 })
      cookie.save('longToken', longToken, { path: '/', maxAge: 5184000 })
    } else {
      cookie.save('userid', userid, { path: '/', maxAge: expires })
      cookie.save('longToken', longToken, { path: '/', maxAge: expires })
    }
  },
  signout: function() {
    socket.emit('leave room', { old: this.state.songId, user: this.state.user })
    this.setState({isLoggedIn: false, isModal: true})

    cookie.remove('userid', { path: '/' })
    cookie.remove('longToken', { path: '/' })
  }
})

var containerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}

export default Main