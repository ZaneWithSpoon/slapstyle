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
          signIn={this.signIn} />
        <Header 
          toggleOverlay={this.toggleOverlay} 
          isLoggedIn={this.state.isLoggedIn} 
          user={this.state.user} />
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
      user: {},
      isLoggedIn: false,
      isModal: false,
      testMeasure: testMeasure,
      division: division,
      range: ['kick', 'snare', 'tom', 'hat']
    }
  },
  toggleOverlay: function() {
    this.setState({ isModal: (this.state.isModal) ? false : true})
  },
  signIn: function(user) {
    console.log(user)
    this.setState({
      user: user, 
      isLoggedIn: true, 
      isModal: false
    })
  }
})

export default Main