var UserDropdown = React.createClass({
  render: function() {
    if (this.props.active) {
      return (
        <div id='userDropdown' tabIndex='-1' onBlur={this.props.hideUserConfig} style={dropdownStyle}> 
          <signout onClick={this.props.signout}>
            Sign Out
          </signout>
        </div>
      )
    } else { 
      return null
    }
  },
  componentDidUpdate: function() {
    var dropdown = document.getElementById('userDropdown')
    if (dropdown !== null) {
      dropdown.focus()
    }
  }
})

var dropdownStyle = {
  zIndex: 99,
  position: 'fixed',
  float:'right',
  marginRight: '12em',
  top: '3em',
  right: '0em',
  minWidth: '10em',
  outlineWidth: '0px',
  backgroundColor: '#30353a',
  border: 'solid',
  borderColor: '#23272A',
  borderWidth: '1px',
  borderTop: '0px',
  boxShadow: '1px 1px 2px black',
  height: '3em',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
}

export default UserDropdown