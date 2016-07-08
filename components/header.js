var Header = React.createClass({
  render: function() {
    if (this.props.isLoggedIn) {
      return (
        <header style={headerStyle}>
          <p style={logo}>lightBeat</p>
          <div style={rightStyle}>
            <p style={{float: 'left'}}>{this.props.user.username}</p>
            <img src={this.props.user.photo} alt='prof' style={picStyle} />
          </div>
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
  }
})

var rightStyle = {
  float: 'right',
  height: '100%'
}
var picStyle = {
  height: '90%',
  marginLeft: '8px'
}
var headerStyle = {
  width: '100%',
  height: '3em'
}
var logo = {
  margin: 0,
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
  textAlign: 'center'
}

export default Header