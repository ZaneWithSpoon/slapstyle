var Toolbar = React.createClass({
  render: function() {
    console.log(this.props)
    return (
      //changing div name moves off screen
      <div style={toolbarStyle}> 
        <play style={playStyle} onClick={this.props.playing ? this.props.stop : this.props.play}>
          <img src='../assets/play.png' alt='play' style={playStyle.triangle}/> 
        </play>
        <bpm>
          <input style={sliderBpmStyle} id='sliderBpm' type='range' min='60' max='240' defaultValue={this.props.bpm} onMouseUp={this.updateBpm} onChange={this.changeBpm}/>
          <input style={textBpmStyle} id='textBpm' type='text' defaultValue={this.props.bpm} onKeyPress={this.updateBpm} onBlur={this.updateBpm}/>BPM
        </bpm>
      </div>
    )
  },
  updateBpm: function(e) {
    if (e.type === 'mouseup' || (e.type === 'keypress' && e.key === 'Enter'))
      this.props.updateBpm(e.currentTarget.value)
  },
  changeBpm: function (e) {
    document.getElementById('textBpm').value = e.currentTarget.value
  }
})



var toolbarStyle = {
  zIndex: 1,
  width: '100%',
  height: '3em',
  backgroundColor: '#30353a',
  boxShadow: '1px 1px 2px black'
}
var playStyle = {
  float: 'left',
  height: '100%', 
  width: '1.75em',
  fontSize: '1.75em',
  borderRight: '2px solid #23272A',
  cursor: 'pointer',

  triangle : {
    height: '1.5em',
    margin: 'auto'
  }
}
var sliderBpmStyle = {
  height: '3.5em',
  margin: 'auto'
}
var textBpmStyle = {
  height: '1em',
  backgroundColor: '#30353a',
  width: '2.0em',
  float: 'auto'
}

export default Toolbar