var SearchResults = React.createClass({
  render: function() {
    var rows = []
    this.props.friends.forEach(function (friend) {
      rows.push(this.drawFriend(friend))
    }.bind(this))
    if (this.props.active) {
      return (
        <div id='userDropdown' style={dropdownStyle}> 
          {rows}
        </div>
      )
    } else { 
      return null
    }
  },
  getInitialState: function() {
    return {
      open: true
    }
  },
  drawFriend: function(friend) {
    return (
      <div key={friend.id} style={songStyle} onClick={() => {}}>
        <img src={friend.imageurl} alt='prof' style={pic} />
        <span> {friend.firstname} {friend.lastname}</span>
      </div>
    )
  }
  // },
  // componentDidUpdate: function() {
  //   var dropdown = document.getElementById('songDropdown')
  //   if (dropdown !== null) {
  //     dropdown.focus()
  //   }
  // }
})

var dropdownStyle = {
  zIndex: 99,
  position: 'fixed',
  marginLeft: '9em',
  top: '2.4em',
  minWidth: '15em',
  outlineWidth: '0px',
  backgroundColor: '#30353a',
  border: 'solid',
  borderColor: '#23272A',
  borderWidth: '1px',
  borderTop: '0px',
  boxShadow: '1px 1px 2px black',
  height: '3em',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  cursor: 'pointer'
}
var songStyle = {
  borderTop: 'grey',
  paddingLeft: '5px',
  borderTop: '1px solid #23272A',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
}
var pic = {
  height: '2.5em',
  marginLeft: '8px',
  marginTop: '2px',  
  borderRadius: '8px'
}

export default SearchResults