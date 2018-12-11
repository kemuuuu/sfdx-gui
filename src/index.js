import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ProjectCreater from './project_creater'

const { clipboard } = require('electron')

export default class App extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const styles = {
      body: {
        background: '#7AC084'
      }
    }
    const taStyle = {
      width: '100%',
      height: '300px',
      backgroundColor: '#F4F4F4'
    }
    return(
      <div className='window'>
        <div className='window-content' style={styles.body}>
          <ProjectCreater />
          {/* <div className='pane-group'>
            <div className='page-sm sidebar'>
              <div>
                <ul className='list-group'>
                  <li className='list-group-item'>
                    <label>
                      あ
                    </label>
                  </li>
                  <li className='list-group-item'>
                    <label>
                      い
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className='pane'>
              <div className='padded-more'>
                <ProjectCreater />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)