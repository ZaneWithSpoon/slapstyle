/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'

//creating empty measure for rendering editor view
var division = 4
var testMeasure = []
for (var i = 0; i < division; i++)
  testMeasure.push([])
for (var i = 0; i < division; i+=8)
  testMeasure[i].push('kick')

var Main = React.createClass({
  render: function() {
    return (
      <site>
        <Overlay 
          visible={this.state.isModal} 
          toggleOverlay={this.toggleOverlay} 
          responseGoogle={this.responseGoogle}
          responseFacebook={this.responseFacebook} />
        <Header 
          toggleOverlay={this.toggleOverlay} 
          isLoggedIn={this.state.isLoggedIn} />
        <Toolbar />
        <Editor 
          range={this.state.range}
          measure={this.state.testMeasure} 
          division={this.state.division} />
        <InstrumentPanel />
      </site>
    )
  },
  getInitialState: function() {
    return {
      'isLoggedIn': false,
      'isModal': false,
      'testMeasure': testMeasure,
      'division': division,
      'range': ['kick', 'snare', 'tom', 'hat']
    }
  },
  toggleOverlay: function() {
    this.setState({ isModal: (this.state.isModal) ? false : true})
  },
  responseFacebook: function(response) {
    if(response.status !== 'unknown') {
      this.toggleOverlay()
      this.setState({isLoggedIn: true})
    }
    console.log(response)
  },
  responseGoogle: function(response) {
    if(response.status !== 'unknown') {
      this.toggleOverlay()
      this.setState({isLoggedIn: true})
    }
    console.log(response)
  }
})

export default Main