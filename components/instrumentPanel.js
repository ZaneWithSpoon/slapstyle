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
      <div 
      key={id} 
      onClick={() => this.props.updateFocus(id)}
      style={this.props.focusId === id ? channelStyle.focusMeasure : channelStyle.measure}>
        <div style={channelStyle.topRow}>
          <span style={channelStyle.name}>{measure.name}</span>
          <input type="checkbox" defaultChecked={true}></input>
        </div>
        <div style={channelStyle.bottomRow}>
          <span>&#9662;</span>
        </div>
      </div>
    )
  },
  addChannel: function() {

  },
  addMeasure: function(channelid, position) {
    console.log(position)
    var anothertestMeasure = []
    for (var i = 0; i < 8*4; i++)
      anothertestMeasure.push([])

    var newMeasure = {
      name: this.props.channels[channelid].name + position,
      position: position,
      sampletype: 'drums',
      channelid: channelid,
      id: this.props.channels[channelid].name + position,
      notes: anothertestMeasure
    }

    this.props.addMeasure(newMeasure)
  }
})

var newChannelStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em',
  paddingLeft: '10px',
  header: {
    height: '2em'
  },
  option: {
    zIndex: '2',
    display: 'flex',
    alignItems: '',
    height: '4em',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '10em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 2px black'
  }
}

var channelStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '10px',
  header: {
    height: '2em'
  },
  measure: {
    zIndex: '2',
    display: 'flex',
    alignItems: '',
    minHeight: '4em',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '10em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '1px 1px 2px black'
  },
  focusMeasure: {
    zIndex: '3',
    display: 'flex',
    alignItems: '',
    height: '4em',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '10em',
    padding: '5px',
    backgroundColor: '#23272A',
    boxShadow: '0px 0px 7px #1CCAD8'
  },
  add: {
    zIndex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30353a',
    boxShadow: '1px 1px 2px black',
    justifyContent: 'center',
    padding: '5px',
    width: '10em'
  },
  topRow: {
    display: 'flex',
    justifyContent:'space-between'
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  name: {
    fontSize: '18px'
  }
}
var panelStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexGrow: '1',
  overflow: 'auto',
  paddingTop: '1em',
  boxShadow: '0px 0px 2px black',
  backgroundColor:'#30353a'
}

export default InstrumentPanel