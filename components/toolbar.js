var Toolbar = React.createClass({
  render: function() {
    return (
      //changing div name moves off screen
      <div style={toolbarStyle}> 
        <play style={playStyle} onClick={this.play}>
          {/* TODO: img src not working */}
          <img src='../assets/play.png' alt='play' /> 
        </play>
      </div>
    )
  }
})

var toolbarStyle = {
  width: '100%',
  height: '3em',
  backgroundColor: '#30353a'
}
var playStyle = {
  margin: 0,
  height: '100%',
  width: '3em',
  backgroundColor: 'black',
  fontSize: '1.75em'
}

export default Toolbar