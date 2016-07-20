//TODO: make instrument panel always hit bottom of page
var InstrumentPanel = React.createClass({
  render: function () {
    console.log(this.props.channels)
    var channels = []
    for (var channel in this.props.channels) {
      channels[this.props.channels[channel].position] = this.drawChannels(this.props.channels[channel], channel)
    }
    return (
      <div style={panelStyle}>
        {channels}
        <div style={newChannelStyle}>
          <div style={newChannelStyle.header}></div>
          <div>
            <div style={newChannelStyle.option} tabIndex='-1' onClick={this.toggleList} onBlur={this.closeList}>
              <span>add more instruments</span>
            </div>
            <div id='instrumentList' 
              style={this.state.instrumentList ? newChannelStyle.list: newChannelStyle.hiddenList} >

              {this.props.instruments.map(function (name) {
                return (
                  <div style={newChannelStyle.instrument} onClick={() => this.addChannel(name)}>
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
      openOptions: ''
    }
  },
  drawChannels: function (channel, id) {
    //TODO: figure out ho to add channel options (hamburger menu?)
    //TODO: make add measure 'paper' pull down on hover
    var measures = []
    for (var measure in this.props.measures) {
      if (this.props.measures[measure].channelid === id){
        measures[this.props.measures[measure].position] = this.drawMeasures(this.props.measures[measure], measure)
      }
    }
    if (measures.length === 0) {
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
    //TODO: make measures clickable everywhere except checkbox & triangle
    //TODO: make checkboxes circles with repeat symbols
    //TODO: rename measures option next to delete
    return (
      <div key={id} style={this.props.focusId === id ? channelStyle.focusContainer : channelStyle.container}>
        <div style={channelStyle.measure}>
          <div style={channelStyle.left} onClick={() => this.props.updateFocus(id)}>
            <span style={channelStyle.name}>{measure.name}</span>
          </div>
          <div style={channelStyle.right}>
            <input style={{cursor: 'pointer'}} type="checkbox" defaultChecked={true} onClick={() => console.log('checkbox')}></input>
            <span style={{cursor: 'pointer'}} onClick={() => this.updateOptions(id)}>&#9662;</span>
          </div>
        </div>
        <div style={this.state.openOptions === id ? channelStyle.options : channelStyle.hiddenOptions}>
          <button style={channelStyle.button} onClick={() => this.removeMeasure(id)}>delete</button>
        </div>
      </div>
    )
  },
  addChannel: function (instrument) {
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
    width: '10em',
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
    padding: '5px'
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
    minHeight: '4em',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '10em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 2px black'
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
    width: '10em',
    overflow: 'hidden',
    height: '2em',
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
    margin: '1em',
    backgroundColor: 'transparent',
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
    width: '10em',
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
    justifyContent: 'space-between'
  },
  name: {
    fontSize: '18px'
  }
}
var panelStyle = {
  zIndex: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '1em',
  paddingBottom: '1em',
  boxShadow: '0px 0px 2px black',
  backgroundColor:'#30353a'
}

export default InstrumentPanel