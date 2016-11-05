//TODO: make instrument panel always hit bottom of page
var InstrumentPanel = React.createClass({
  render: function () {
    var channels = []
    for (var channel in this.props.channels) {
      //channels[this.props.channels[channel].position] = this.drawChannels(this.props.channels[channel], channel)
      channels.push(this.drawChannels(this.props.channels[channel], channel))
    }
    return (
      <div style={panelStyle}>
        {channels}
        <div style={newChannelStyle}>
          <div style={newChannelStyle.header}></div>
          <div tabIndex='-1' onBlur={this.closeList} style={{outlineWidth: '0px'}}>
            <div style={newChannelStyle.option}  onClick={this.toggleList}>
              <span>add more instruments</span>
            </div>
            <div id='instrumentList' 
              style={this.state.instrumentList ? newChannelStyle.list : newChannelStyle.hiddenList} >

              {this.props.instruments.map(function (name) {
                return (
                  <div key={name} style={newChannelStyle.instrument} onClick={() => this.props.isLoggedIn ? this.addChannel(name) : this.props.toggleOverlay()}>
                    <img src='../assets/png/speaker.png' alt='sample' onClick={(e) => this.playSample(e, name)} style={newChannelStyle.speaker} />
                    {name}
                  </div>
                )
              }.bind(this))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  getInitialState: function () {
    return {
      instrumentList: false,
      openOptions: '',
      showMeasureRenameBox: false
    }
  },
  drawChannels: function (channel, id) {
    //TODO: figure out ho to add channel options (hamburger menu?)
    //TODO: make add measure 'paper' pull down on hover
    var measures = []
    for (var measure in this.props.measures) {
      if (this.props.measures[measure].channelid === id){
        //measures[this.props.measures[measure].position] = this.drawMeasures(this.props.measures[measure], measure)
        measures.push(this.drawMeasures(this.props.measures[measure], measure))
      }
    }
    if (measures.length === 0 && channel.sampletype !== 'drums') {
      return (
        <div key={id} style={channelStyle}>
          <div style={channelStyle.header}>
            {channel.name}
            <div onClick={() => this.removeChannel(id)}>delete</div>
          </div>
          <div style={channelStyle.add} onClick={() => this.addMeasure(id, measures.length)}>
            <span>add a new measure</span>
            <span>&#65291;</span>
          </div>
        </div>
      )
    } else {
      return (
        <div key={id} style={channelStyle}>
          <div style={channelStyle.header}>{channel.name}</div>
          {measures}
          <div style={channelStyle.add} onClick={() => this.addMeasure(id, measures.length)}>
            <span>add a new measure</span>
            <span>&#65291;</span>
          </div>
        </div>
      )
    }
  },
  drawMeasures: function (measure, id) {
    //TODO: rename measures option next to delete
    return (
      <div key={id} style={this.props.focusId === id ? channelStyle.focusContainer : channelStyle.container}>
        <div style={channelStyle.measure} onClick={() => this.props.updateFocus(id)}>
          <div style={channelStyle.left}>
            <span style={channelStyle.name}>{measure.name}</span>
          </div>
          <div style={channelStyle.right}>
            <this.repeatSymbol id={id}/>
            <span style={{cursor: 'pointer'}} onClick={(e) => {e.stopPropagation(); this.updateOptions(id);}}>&#9662;</span>
          </div>
        </div>
        <div style={this.state.openOptions === id ? channelStyle.options : channelStyle.hiddenOptions}>
          <button style={channelStyle.button} onClick={() => (Object.keys(this.props.measures).length > 1) ? this.removeMeasure(id) : {} }>delete</button>
         {/* <button style={channelStyle.button} onClick={() => this.renameMeasure(id) }>rename</button> */}
          { this.state.showMeasureRenameBox ? <input type="text" style={channelStyle.input} value={measure.name} onChange={this.handleMeasureRename}></input> : null } 
        </div>
      </div>
    )
  },
  repeatSymbol: function (props) {
    var index = this.props.nextLoop.indexOf(props.id)
    if (index > -1){
      return (
        <img src='../assets/png/repeatBlue.png' alt='repeat' style={channelStyle.repeatBlue} onClick={(e) => {e.stopPropagation(); this.props.toggleNextLoop(props.id)}}/>
      )
    } else {
      return (
        <img src='../assets/png/repeatWhite.png' alt='repeat' style={channelStyle.repeatBlue} onClick={(e) => {e.stopPropagation(); this.props.toggleNextLoop(props.id)}}/>
      )
    }  
  },
  playSample: function (e, name) {
    e.stopPropagation()
    this.props.audio.exampleSound('C5', name)
  },
  addChannel: function (instrument) {
    this.closeList()

    var position = Object.keys(this.props.channels).length
    var newChannel = {
      position: position,
      sampletype: instrument,
      name: instrument,
      songid: this.props.songId
    }
    this.props.socket.emit('add channel', newChannel)
  },
  removeChannel: function (channelid) {
    console.log(channelid)
    this.props.socket.emit('remove channel', {channelid: channelid, songid: this.props.songId})
  },
  addMeasure: function (channelid, position) {
    var newMeasure = {
      name: this.props.channels[channelid].name,
      position: position,
      sampletype: this.props.channels[channelid].sampletype,
      channelid: channelid
    }
    this.props.socket.emit('add measure', {measure: newMeasure, songid: this.props.songId})
  },
  renameMeasure: function (hmid) {
    console.log(hmid)
    if (this.state.showMeasureRenameBox) {
      this.setState({ showMeasureRenameBox: false })
      // make renameButton close 
    } else {
      this.setState({ showMeasureRenameBox: true })
    }
  },
  handleMeasureRename: function () {
    console.log('handling measure rename')
  },
  removeMeasure: function (hmid) {
    this.props.socket.emit('remove measure', {hmid: hmid, songid: this.props.songId})
  },
  updateOptions: function (hmid) {
    if (this.state.openOptions === hmid) {
      this.setState({openOptions:''})
    } else {
      this.setState({openOptions: hmid})
    }
  },
  toggleList: function () {
    this.setState({instrumentList: !this.state.instrumentList})
  },
  closeList: function () {
    if (this.state.instrumentList) {
      this.toggleList()
    }
  }
})

var newChannelStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em',
  paddingLeft: '10px',
  borderRadius: '2px',
  header: {
    minHeight: '2em'
  },
  option: {
    cursor: 'pointer',
    zIndex: '2',
    display: 'flex',
    alignItems: 'center',
    minHeight: '2em',
    justifyContent: 'center',
    flexDirection: 'column',
    outlineWidth: '0px',
    width: '12em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 3px black'
  },
  list: {
    boxShadow: '1px 1px 3px black',
    height: '200px',
    overflow: 'auto',
    transition: 'height .5s',
    transitionTimingFunction: 'ease-out'
  },
  hiddenList: {
    boxShadow: '1px 1px 3px black',
    height: '0px',
    overflow: 'auto',
    transition: 'height .5s',
    transitionTimingFunction: 'ease-out'
  },
  instrument: {
    cursor: 'pointer',
    boxShadow: '0px 0px 1px black',
    minHeight: '1.5em',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  speaker: {
    height: '1em',
    width: '1em'
  }
}

var channelStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '10px',
  header: {
    minHeight: '2em',
    display: 'flex',
    justifyContent: 'space-between'
  },
  measure: {
    zIndex: '2',
    display: 'flex',
    minHeight: '2em',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '12em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 2px black',
    cursor: 'pointer'
  },
  container: {
    zIndex: 0
  },
  focusContainer: {
    zIndex: 5,
    boxShadow: '0px 0px 7px #1CCAD8'
  },
  options: {
    zIndex: -3,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    boxShadow: '1px 1px 3px black',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '5px',
    width: '12em',
    overflow: 'hidden',
    height: '1.5em',
    transition: 'height .5s',
    transitionTimingFunction: 'ease-out'
  },
  hiddenOptions: {
    zIndex: -3,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    boxShadow: '1px 1px 3px black',
    justifyContent: 'center',
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden',
    height: '0em',
    transition: 'height .5s',
    transitionTimingFunction: 'ease-out'
  },
  button: {
    margin: '.5em',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'white',
    borderWidth: '0px'
  },
  input: {
    flexDirection: 'column',
    margin: '.5em',
    cursor: 'pointer',
    color: 'white',
    borderWidth: '0px'
  },
  add: {
    zIndex: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30353a',
    boxShadow: '1px 1px 3px black',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '5px',
    width: '12em',
    cursor: 'pointer'
  },
  left: {
    display: 'flex',
    justifyContent:'space-between',
    cursor: 'pointer'
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: '18px'
  },
  repeatBlue: {
    margin: '3px',
    height: '15px',
    width: '15px'
  }
}
var panelStyle = {
  position: 'relative',
  width: '100%',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '1em',
  paddingBottom: '1em',
  boxShadow: '0px 0px 2px black',
  backgroundColor:'#30353a',
  overflow: 'auto'
}

export default InstrumentPanel