import SongDropdown from './songDropdown'
import UserDropdown from './userDropdown'
import SearchResults from './searchResults'

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
        <div id='searchbar' style={searchbarStyle} onClick={this.showFriends} onBlur={this.hideFriends}>
          <img src='./assets/png/search.png' alt='search' style={searchbarStyle.glass}/>
          <input id='invited' type='text' onKeyPress={this.addUser} placeholder='Invite friends' style={searchbarStyle.input} />
        </div>
        <SearchResults
          active={this.state.showFriends}
          friends={this.state.friendList}
          onlineFriends={this.state.onlineFriends}
          addUserById={this.addUserById}
          hideFriends={this.hideFriends} />
        <div id='songList' style={songListStyle} onClick={this.showSongs}>
          <span style={songListStyle.name}>{this.props.songName} &#9662; </span>
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
          active={this.state.songDropdown} 
          songList={this.state.songList}
          changeSongs={this.props.changeSongs}
          hideSongs={this.hideSongs}
          newSong={this.newSong}
          songId={this.props.songId} />
      </header>
    )
  },
  getInitialState: function() {
    return {
      songDropdown: false,
      userConfig: false,
      showFriends: false,
      songList: [],
      friendList: [],
      onlineFriends: []
    }
  },
  componentDidMount: function() {
    // this.props.socket.on('friend online', function (data) {
    //   var newOnlineFriends = this.state.onlineFriends
    //   this.setState({newOnlineFriends.push(data.friend)})
    // })
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
        this.setState({songDropdown: true, songList: response})
      }.bind(this),
      error: function(xhr) {
        console.log('broke')
        console.log(xhr)
      }
    })
  },
  hideSongs: function() {
    this.setState({songDropdown: false})
  },
  showUserConfig: function() {
    this.setState({userConfig: true})
  },
  hideUserConfig: function() {
    this.setState({userConfig: false})
  },
  showFriends: function() {
    this.setState({onlineFriends: []})

    var friends = []
    this.props.user.friends.forEach(function(friend) {
      friends.push(friend.id)
    })

    $.ajax({
      url: this.props.ip + "/friends",
      type: "get", //send it through get method
      data: {
        id: this.props.user.id,
        friends: friends
      },
      success: function(response) {
        console.log(response)
        this.setState({showFriends: true, friendList: response})
      }.bind(this),
      error: function(xhr) {
        console.log('broke')
        console.log(xhr)
      }
    })
  },
  hideFriends: function() {
    window.setTimeout(() => {
      this.setState({showFriends: false})
    }, 200)
  },
  addUserById: function(id) {
    console.log(id + ' added')
    this.props.socket.emit('invite to room', {
      userid: id, 
      origin: this.props.user.firstname,
      songid: this.props.songId
    })
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
            this.addUserById(response.id)
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
  minHeight: '3em',
  color: 'white',
  textAlign: 'center',
  marginLeft: '5px',
  paddingLeft: '2px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  name: {
    margiTop: '1.5em',
    fontSize: '20px'
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