var InstrumentPanel = React.createClass({
  render: function() {
    var channels = []
    for (var channel in this.props.channels) {
      channels[this.props.channels[channel].position] = this.drawChannels(this.props.channels[channel], channel)
    }
    return (
      <div style={panelStyle}>
        {channels}
        <div style={newChannelStyle}>
          <div style={newChannelStyle.header}> 
            <span> new channel </span>
          </div>
          <div style={newChannelStyle.option}>
            <span> add new drum channel</span>
          </div>
          <div style={newChannelStyle.option}>
            <span> add new instrument channel</span>
          </div>
        </div>
      </div>
    )
  },
  getInitialState: function() {
    return {
      openOptions: ''
    }
  },
  drawChannels: function(channel, id) {
    var measures = []
    for (var measure in this.props.measures) {
      if (this.props.measures[measure].channelid === id){
        measures[this.props.measures[measure].position] = this.drawMeasures(this.props.measures[measure], measure)
      }
    }
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
  },
  drawMeasures: function(measure, id) {
    return (
      <div key={id} style={this.props.focusId === id ? channelStyle.focusContainer : null}>
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
  addChannel: function() {

  },
  addMeasure: function(channelid, position) {
    var anothertestMeasure = []
    for (var i = 0; i < 8*4; i++)
      anothertestMeasure.push([])

    var newMeasure = {
      name: this.props.channels[channelid].name + position,
      position: position,
      sampletype: this.props.channels[channelid].sampletype,
      channelid: channelid,
      id: this.props.channels[channelid].name + position,
      notes: anothertestMeasure
    }

    this.props.addMeasure(newMeasure)
  },
  removeMeasure: function(hmid) {
    //TODO: make socket call to delete measure
    console.log('remove ' + hmid)
  },
  updateOptions: function(hmid) {
    if (this.state.openOptions === hmid) {
      this.setState({openOptions:''})
    } else {
      this.setState({openOptions: hmid})
    }
  }
})

var newChannelStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em',
  paddingLeft: '10px',
  header: {
    minHeight: '2em'
  },
  option: {
    zIndex: '2',
    display: 'flex',
    alignItems: '',
    minHeight: '4em',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '10em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 3px black'
  }
}

var channelStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '10px',
  header: {
    minHeight: '2em'
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
  focusContainer: {
    zIndex: 5,
    boxShadow: '0px 0px 7px #1CCAD8'
  },
  options: {
    zIndex: 1,
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
    zIndex: 1,
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
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30353a',
    boxShadow: '1px 1px 3px black',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '5px',
    width: '10em'
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
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '1em',
  paddingBottom: '1em',
  boxShadow: '0px 0px 2px black',
  backgroundColor:'#30353a'
}

export default InstrumentPanel