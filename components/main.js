/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'

//socket
var socket = io.connect('http://localhost:8080')

//creating empty measure for rendering editor view
var division = 4
var testMeasure = []
for (var i = 0; i < division; i++)
  testMeasure.push([])
for (var i = 0; i < division; i+=8)
  testMeasure[i].push('kick')

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
        <Toolbar />
        <Editor 
          range={this.state.range}
          measure={this.state.testMeasure} 
          division={this.state.division} />
        <div onClick={this.emitTest}>emit test</div>
        <InstrumentPanel />
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
      roommates: [],
      song: {},
      songId: '',
      isLoggedIn: false,
      isModal: false,
      testMeasure: testMeasure,
      division: division,
      range: ['kick', 'snare', 'tom', 'hat']
    }
  },
  emitTest: function() {
    // socket.emit('switch room', { new: "song-99abcb4e-b37f-4de4-b890-29039db4711a", user: {
    //     username: 'fakeName',
    //     id: "fake id",
    //     photo: './assets/dolphin.png'
    //   } })

    socket.emit('test room', {id: this.state.songId, message: 'this song'})
  },
  userHasJoined: function(newUser) {
    console.log('another user joined the room ')
    console.log(newUser)

    var newRoommates = this.state.roommates
    newRoommates.push(newUser)
    this.setState({roommates: newRoommates})
  },
  userHasLeft: function(userid) {
    console.log('user left')
    console.log(userid)

    var newRoommates = []
    this.state.roommates.map(function (user) {
      console.log(user)
      if (user.id !== userid) {
        newRoommates.push(user)
      }
    })

    console.log(newRoommates)
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
      console.log(data)
    })
    socket.on('invited', function (data) {
      console.log(data + ' has invited you to work on a song')
      alert(data + ' has invited you to work on a song')
    })
    socket.on('working event', function (data) {
      console.log(data)
    })
  },
  toggleOverlay: function() {
    this.setState({ isModal: (this.state.isModal) ? false : true})
  },
  changeSongs: function(songid) {
    //TODO: get song from db

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
    console.log(data)
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