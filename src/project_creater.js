import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { Button, 
         Label,
         FormControl,
         ControlLabel } from 'react-bootstrap'


export default class ProjectCreater extends Component {

  constructor() {
    super();
    this.state = {
      path: '',
      name: '',
      sObjs: '',
      selected: '',
    }
  }

  pathChange(e) {
    this.setState({path: e.target.value});
  }

  nameChange(e) {
    this.setState({name: e.target.value});
  }

  // chkChange(e) {
  //   if (e.target.checked === 'checked') {
  //     let newSelecteds = this.state.selecteds.slice()
  //     newSelecteds.push(e.target.name)
  //     this.setState({selecteds: newSelecteds})
  //   } else {
  //     let newSelecteds = this.state.selecteds.slice().filter(s => s !== e.target.name)
  //     this.setState({selecteds: newSelecteds})
  //   }
  // }

  radioChange(e) {
    this.setState({selected: e.target.value})
  }

  folderButtonClicked(e) {
    const pr = new Promise((resolve, reject) => {
      const success = ipcRenderer.sendSync('create-folder', this.state)
      resolve()
    })
    pr.then(() => {new Notification('Created a project successfully!!')})
  }

  authButtonClicked(e) {
    const pr = new Promise((resolve, reject) => {
      const res = ipcRenderer.sendSync('auth-org', this.state)
      resolve(res);
    })
    pr.then((res) => {new Notification(res)})
  }

  sobjButtonClicked(e) {
    const pr = new Promise((resolve, reject) => {
      let result = ipcRenderer.sendSync('sobj-list', this.state)
      resolve(result)
    });
    pr.then((res) => {
      this.setState({sObjs: res})
    })
  }

  settingButtonClicked() {
    const pr = new Promise((resolve, reject) => {
      let result = ipcRenderer.sendSync('fetch-set', this.state)
      resolve(result)
    });
    pr.then((res) => {
      new Notification('Success')
    })
  }

  // Sobj Checkbox
  createSobjCheckList() {
    const res = JSON.parse(this.state.sObjs)
    const ls = res.result.map(
      (r,i) => {
        return(
          <div>
            {/* <input 
              onChange={e => this.chkChange(e)} 
              style={{padding: '5px'}} 
              id={i} 
              type='checkbox' 
              name={r} 
              value={`obj_${i}`}/>{r} */}
            <input 
              onChange={e => this.radioChange(e)} 
              style={{padding: '5px'}} 
              id={i} 
              type='radio' 
              name='sobjs' 
              value={r}/>{r}
          </div>
        )
      }
    )
    return ls;
  }

  render() {

    let sObjsHtml;

    const styles = {
      body: {
        paddingLeft: '20px',
        position: 'relative',
      },
      title: {
        margin: 'auto',
        color: 'white',
        paddingLeft: '10px'
      },
      box1: {
        padding: '10px'
      },
      form: {
        padding: '10px'
      },
      box2: {
        borderRadius: '12px',
        background: 'white',
        height: '200px',
        overflow: 'auto',
        marginTop: '20px',
      },
      box2_innner: {
        padding: '10px'
      }
    }

    if (this.state.sObjs !== '') sObjsHtml = this.createSobjCheckList();

    return(
      <div style={styles.body}>
        <h1 style={styles.title}>SFDX-GUI</h1>
        <div class="card" style={styles.box1}>
          <div class="card-header">
            <h3><Label>Step1: Create Project</Label></h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">Create a folder to save configuration files</h5>
              <div style={styles.form}>
                <ControlLabel>Enter path to folder to create project</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.path}
                  placeholder="Path"
                  onChange={e => this.pathChange(e)}
                />
                <ControlLabel>Enter project name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  placeholder="Project name"
                  onChange={e => this.nameChange(e)}
                />
              </div>
            <Button 
              style={{paddingTop: '5px'}} 
              bsStyle="primary"
              onClick={e => this.folderButtonClicked(e)}>フォルダをつくるっすよ!!</Button>
          </div>
        </div>
        <div class="card" style={styles.box1}>
          <div class="card-header">
            <h3><Label>Step2: Authenticate organization</Label></h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">Authenticate the organization that gets the settings</h5>
            <p class="card-text">Please click this button to authenticate your organization</p>
            <Button 
              bsStyle="primary" 
              onClick={e => this.authButtonClicked(e)}>組織を認証するっすよ!!</Button>
          </div>
        </div>
        <div class="card" style={styles.box1}>
          <div class="card-header">
            <h3><Label>Step3: Get sObject List</Label></h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">Get list of sObject</h5>
            <p class="card-text">Please click this button to Get list of sObject</p>
            <Button 
              bsStyle="primary"
              onClick={e => this.sobjButtonClicked(e)}>sObjectのリストを取得するっすよ!!</Button>
          </div>
          <div style={styles.box2}>
            <div style={styles.box2_innner}>
              {sObjsHtml}
            </div>
          </div>
        </div>
        <div class="card" style={styles.box1}>
          <div class="card-header">
            <h3><Label>Step4: Get sObject settings</Label></h3>
          </div>
          <div class="card-body">
            <h5 class="card-title">Get the setting file of the selected object</h5>
            <p class="card-text">Please click this button to Get the setting file</p>
            <Button 
              bsStyle="primary"
              onClick={e => this.settingButtonClicked(e)}>sObjectの設定ファイルを取得するっすよ!!</Button>
          </div>
        </div>
      </div>
    )
  }
}