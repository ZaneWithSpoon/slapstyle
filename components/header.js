import SongDropdown from './songDropdown'

var Header = React.createClass({
  render: function() {
    if (this.props.isLoggedIn) {
      var roommates = []
      this.props.roommates.forEach(function (user) {
        roommates.push(this.roommateIcon(user))
      }.bind(this))

      return (
        <header style={headerStyle}>
          <div style={logo}>
            <span>lightBeat</span>
          </div>
          <div id='searchbar' style={searchbarStyle}>
            <img src='./assets/search.png' alt='search' style={searchbarStyle.glass}/>
            <input id='invited' type='text' onKeyPress={this.addUser} placeholder='Invite friends by username' style={searchbarStyle.input} />
          </div>
          <div id='songList' style={songListStyle} onClick={this.showSongs}>
            <span style={songListStyle.name}>{this.props.songId} &#9662; </span>
          </div>
          {roommates}
          <div id='user' style={userStyle}>
            <p style={userStyle.name}>{this.props.user.username}</p>
            <img src={this.props.user.photo} alt='prof' style={userStyle.pic} />
          </div>
          <SongDropdown 
            active={this.state.dropdown} 
            songList={this.state.songList}
            changeSongs={this.props.changeSongs}
            hideSongs={this.hideSongs} />
        </header>
      )
    } else {
      return (
        <header style={headerStyle}>
          <p style={logo}>lightBeat</p>
          <div style={loginStyle} onClick={this.props.toggleOverlay}>
            Sign In
          </div>
        </header>
      )
    }
  },
  getInitialState: function() {
    return {
      dropdown: false,
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
  showSongs: function() {
    $.ajax({
      url: "http://localhost:8080/userSongs",
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
  addUser: function(e) {
    if (e.key === 'Enter') {
      var username = document.getElementById('invited').value.toLowerCase()

      $.ajax({
        url: "http://localhost:8080/username",
        type: "get", //send it through get method
        data: {'username': username},
        success: function(response) {
          if(response.available){
            alert('no user exists by that username')
          } else {
            this.props.socket.emit('invite to room', {
              invited: username, 
              origin: this.props.user.username,
              songid: this.props.songId
            })
            alert(username + ' has been invited to this song')
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
  name: {
    marginTop: '1.5em'
  }
}
var userStyle = {
  float: 'right',
  height: '100%',
  name: {
    float: 'left'
  },
  pic: {
    height: '87%',
    marginLeft: '8px',
    marginTop: '2px',  
    boxShadow: '0px 0px 10px #1CCAD8',
    borderRadius: '25px'
  }
}
var headerStyle = {
  width: '100%',
  height: '3em'
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
  color: 'black',
  backgroundColor: 'white',
  borderRadius: '.5em',
  textAlign: 'center',
  boxShadow: '1px 1px 2px black'
}

export default Header