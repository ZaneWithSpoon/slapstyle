import SongDropdown from './songDropdown'
import UserDropdown from './userDropdown'

var Header = React.createClass({
  render: function() {
    var roommates = []
    this.props.roommates.forEach(function (user) {
      roommates.push(this.roommateIcon(user))
    }.bind(this))

    return (
      <header style={headerStyle}>
        <div style={logo}>
          <span>SlapStyle</span>
        </div>
        <div id='searchbar' style={searchbarStyle}>
          <img src='./assets/png/search.png' alt='search' style={searchbarStyle.glass}/>
          <input id='invited' type='text' onKeyPress={this.addUser} placeholder='Invite friends by email' style={searchbarStyle.input} />
        </div>
        <div id='songList' style={songListStyle} onClick={this.showSongs}>
          <span style={songListStyle.name}>{this.props.songId} &#9662; </span>
        </div>
        {roommates}
        <div id='user' style={userStyle} onClick={this.showUserConfig}>
          <p style={userStyle.name}>{this.props.user.firstname}</p>
          <img src={this.props.user.photo} alt='prof' style={userStyle.pic} />
        </div>
        <UserDropdown 
          active={this.state.userConfig} 
          hideUserConfig={this.hideUserConfig}
          signout={this.props.signout} />
        <SongDropdown 
          active={this.state.dropdown} 
          songList={this.state.songList}
          changeSongs={this.props.changeSongs}
          hideSongs={this.hideSongs}
          newSong={this.newSong} />
      </header>
    )
  },
  getInitialState: function() {
    return {
      dropdown: false,
      userConfig: false,
      songList: []
    }
  },
  roommateIcon: function(user) {
    return (
      <div key={user.username} style={userStyle}>
        <p style={userStyle.name}>{user.username}</p>
        <img src={user.photo} alt='prof' style={userStyle.pic} />
      </div>
    )
  },
  newSong: function() {
    console.log('newSong')
    $.ajax({
      url: this.props.ip + "/newSong",
      type: "post",
      data: {userid: this.props.user.id},
      success: function(response) {
        console.log(response)
        this.props.changeSongs(response.songid)
      }.bind(this),
      error: function(xhr) {
        console.log('broke')
        console.log(xhr)
      }
    })
  },
  showSongs: function() {
    $.ajax({
      url: this.props.ip + "/userSongs",
      type: "get", //send it through get method
      data: {'userid': this.props.user.id},
      success: function(response) {
        this.setState({dropdown: true, songList: response})
      }.bind(this),
      error: function(xhr) {
        console.log('broke')
        console.log(xhr)
      }
    })
  },
  hideSongs: function() {
    this.setState({dropdown: false})
  },
  showUserConfig: function() {
    this.setState({userConfig: true})
  },
  hideUserConfig: function() {
    this.setState({userConfig: false})
  },
  addUser: function(e) {
    if (e.key === 'Enter') {
      var input = document.getElementById('invited')
      var email = input.value.toLowerCase()

      $.ajax({
        url: this.props.ip + '/invite',
        type: 'get',
        data: {'email': email},
        success: function(response) {
          if(response.exists){
            this.props.socket.emit('invite to room', {
              userid: response.userid, 
              origin: this.props.user.firstname,
              songid: this.props.songId
            })
            alert(response.firstname + ' has been invited to this song')
            input.value = ''
          } else {
            input.value = ''
            alert('no user exists with that email')
          }
        }.bind(this),
        error: function(xhr) {
          console.log('broke')
          console.log(xhr)
        }
      })
    }
  }
})
 
var searchbarStyle = {
  float: 'left',
  height: '70%',
  width: '250px',
  marginTop: '7px',
  marginLeft: '25px',
  backgroundColor: '#30353a',
  borderRadius: '15px',
  overflow: 'hidden',
  glass: {
    height: '30px', 
    width: '12%',
    float:'left',
    marginTop: '2px'
  },
  input: {
    backgroundColor: '#30353a',
    borderWidth: '0px',
    outlineWidth: '0px',
    marginTop: '5px',
    fontSize: '16px',
    opacity: '1.0',
    color: 'white',
    width: '85%',
    height: '80%'
  }
}
var songListStyle = {
  float: 'right',
  height: '100%',
  minWidth: '10em',
  maxWidth: '12em',
  color: 'white',
  textAlign: 'center',
  marginLeft: '5px',
  paddingLeft: '2px',
  cursor: 'pointer',
  name: {
    marginTop: '1.5em'
  }
}
var userStyle = {
  cursor: 'pointer',
  float: 'right',
  height: '100%',
  name: {
    float: 'left'
  },
  pic: {
    height: '2.5em',
    marginLeft: '8px',
    marginTop: '2px',  
    boxShadow: '0px 0px 10px #1CCAD8',
    borderRadius: '25px'
  }
}
var headerStyle = {
  width: '100%',
  minHeight: '3em',
  maxHeight: '3em'
}
var logo = {
  marginTop: '10px',
  marginLeft: '10px',
  marginBottom: '0px',
  width: '110px',
  fontSize: '1.75em',
  float: 'left'
}
var loginStyle = {
  marginRight: '1em',
  marginTop: '.5em',
  float: 'right',
  width: '5em',
  height: '1.75em',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
  backgroundColor: 'white',
  borderRadius: '.5em',
  textAlign: 'center',
  boxShadow: '1px 1px 2px black',
  cursor: 'pointer'
}

export default Header