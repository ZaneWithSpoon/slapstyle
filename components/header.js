var Header = React.createClass({
  render: function() {
    return (
      <header style={headerStyle}>
        <p style={logo}>lightBeat</p>
        <div style={loginStyle}>
          Sign In
        </div>
      </header>
    )
  }
})

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