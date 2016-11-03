var SearchResults = React.createClass({
  render: function() {
    var rows = []
    this.props.friends.forEach(function (friend) {
      rows.push(this.drawFriend(friend))
    }.bind(this))
    if (this.props.active) {
      return (
        <div id='userDropdown' style={dropdownStyle}  onBlur={this.props.hideFriends} > 
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
      <div key={friend.userid} style={resultStyle} onClick={() => {this.props.addUserById(friend.userid); this.props.hideFriends();}}>

        <img src={friend.imageurl} alt='prof' style={pic} />
        <span> {friend.firstname} {friend.lastname}</span>
      </div>
    )
  }
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
  boxShadow: '1px 1px 2px black'
}
var resultStyle = {
  borderTop: 'grey',
  paddingLeft: '5px',
  borderTop: '1px solid #23272A',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  minHeight: '2.9em',
  cursor: 'pointer'
}
var pic = {
  height: '2.5em',
  width: '2.5em',
  marginLeft: '8px',
  marginTop: '2px',  
  borderRadius: '8px'
}

export default SearchResults