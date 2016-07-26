var Chatbox = React.createClass({
  render: function() {
    return (
      <chatboxRow style={chatboxStyle}>
        <mainBox style={chatboxStyle.main}>
          <header style={chatboxStyle.header} onClick={this.toggleOpen}>
            <this.statusSymbol />
            <span style={chatboxStyle.text}>Chat</span>
          </header>
          <div style={this.state.open ? chatboxStyle.open : chatboxStyle.closed }>
            <middle style={chatboxStyle.middle}>
              <this.unreadMessages />
              <this.friendsList />
            </middle>
            <searchbar style={chatboxStyle.searchbar}>
              <img src='./assets/png/search.png' alt='search' style={chatboxStyle.searchbar.glass}/>
              <input id='chatSearch' type='text' placeholder='Search' style={chatboxStyle.searchbar.input} />
            </searchbar>
          </div>
        </mainBox>
      </chatboxRow>
    )
  },
  getInitialState: function() {
    return {
      open: true,
      unreadMessages: false
    }
  },
  unreadMessages: function() {
    return null
  },
  friendsList: function() {
    return (
      <friends>
        Friends
        <span> - you have no friends</span>
      </friends>
    )
  },
  statusSymbol: function() {
    return (
      <circle style={circleStyle} /> 
    )
  },
  toggleOpen: function() {
    this.setState({ open: this.state.open ? false : true })
  }
})

var chatboxStyle = {
  zIndex: 99,
  position: 'fixed',
  bottom: '0px',
  right: '0px',
  display: 'flex',
  justifyContent: 'flex-end',
  main: {
    width: '15em',
    marginRight: '1em',
    boxShadow: '1px -1px 2px black',
    borderRadius: '3px',
    border: '1px solid black'
  },
  header: {
    height: '1.5em',
    width: '100%',
    backgroundColor: '#23272A',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  text: {
    marginLeft: '.5em'
  },
  open: {
    height: '15em',
    width: '100%',
    backgroundColor:'#30353a',
    display: 'flex',
    flexDirection: 'column'
  },
  closed: {
    height: '0px',
    width: '100%',
    backgroundColor:'#30353a',
    flexDirection: 'column'
  },
  middle: {
    flexGrow: '1',
    padding: '5px'
  },
  searchbar: {
    height: '1.5em',
    width: '100%',
    borderTop: '1px solid black',
    alignSelf: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    glass: {
      height: '80%'
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
      height: '66%'
    }
  }
}
var circleStyle = {
  height: '.5em',
  width: '.5em',
  borderRadius: '.25em',
  backgroundColor: '#1cd82a',
  marginLeft: '.5em'
}

export default Chatbox