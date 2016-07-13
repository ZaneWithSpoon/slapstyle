var Toolbar = React.createClass({
  render: function() {
    return (
      //changing div name moves off screen
      <div style={toolbarStyle}> 
        <play style={playStyle} onClick={this.props.playing ? this.props.stop : this.props.play}>
          <img src='../assets/play.png' alt='play' style={playStyle.triangle}/> 
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
  float: 'left',
  height: '100%',
  width: '1.75em',
  fontSize: '1.75em',
  borderRight: '2px solid #23272A',

  triangle : {
    height: '1.5em',
    margin: 'auto'
  }
}

export default Toolbar