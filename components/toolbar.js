var Toolbar = React.createClass({
  render: function() {
    return (
      //changing div name moves off screen
      <div style={toolbarStyle}> 
        <this.playStop />
        {/*}
        <bpm>
          <input style={sliderBpmStyle} id='sliderBpm' type='range' min='60' max='240' defaultValue={this.props.bpm} onMouseUp={this.updateBpm} onChange={this.changeBpm}/>
          <input style={textBpmStyle} id='textBpm' type='text' defaultValue={this.props.bpm} onKeyPress={this.updateBpm} onBlur={this.updateBpm}/>BPM
        </bpm>
      */}
      {/*}
        <chatroom style={{height:'100%'}}>
          <img src='../assets/png/chat.png' alt='chat' style={chatStyle}/>
        </chatroom>
      */}
      </div>
    )
  },
  playStop: function () {
    if (this.props.waitingInstruments.length === 0) {
    //if (false) {
      if (this.props.playing) {
        return (
          <play style={playStyle} onClick={this.props.playing ? this.props.stop : this.props.play}>
            <img src='../assets/png/stop.png' alt='play' style={playStyle.square}/> 
          </play>
        )
      } else {
        return (
          <play style={playStyle} onClick={this.props.playing ? this.props.stop : this.props.play}>
            <img src='../assets/png/play.png' alt='play' style={playStyle.triangle}/> 
          </play>
        )      
      }
    } else {
      return (
        <play style={playStyle}>
          <div className='spinner' style={{cursor:'progress'}}>
            <div className='rect1'></div>
            <div className='rect2'></div>
            <div className='rect3'></div>
            <div className='rect4'></div>
            <div className='rect5'></div>
          </div>
        </play>
      )
    }
  },
  updateBpm: function(e) {
    if (e.type === 'mouseup' || (e.type === 'keypress' && e.key === 'Enter'))
      this.props.updateBpm(e.currentTarget.value)
  },
  changeBpm: function (e) {
    document.getElementById('textBpm').value = e.currentTarget.value
  }
})

var chatStyle = {
  height: '90%'
}

var toolbarStyle = {
  zIndex: 1,
  position: 'relative',
  width: '100%',
  minHeight: '3em',
  maxHeight: '3em',
  backgroundColor: '#30353a',
  boxShadow: '1px 1px 2px black',
  display: 'flex',
  justifyContent: 'space-between'
}
var playStyle = {
  float: 'left',
  width: '1.75em',
  fontSize: '1.75em',
  borderRight: '2px solid #23272A',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  triangle: {
    height: '1.5em'
  },
  square: {
    height: '1em'
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