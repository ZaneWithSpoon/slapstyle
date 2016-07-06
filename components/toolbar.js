var Toolbar = React.createClass({
  render: function() {
    return (
      //changing div name moves off screen
      <div style={toolbarStyle}> 
        <p style={play}>play</p>
      </div>
    )
  }
})

var toolbarStyle = {
  width: '100%',
  height: '3em',
  backgroundColor: '#30353a'
}
var play = {
  margin: 0,
  fontSize: '1.75em'
}

export default Toolbar