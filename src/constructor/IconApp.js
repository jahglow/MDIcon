/**
 * Created by IvanP on 25.01.2017.
 */
import styles from './styles.css';
import IconStripper from './stripper';
import React from 'react';
import ReactDOM from 'react-dom';


import * as assets from '../icon-bundle';
const {MDIcon, ...icons} = assets;

const iconsets = ['Action','Alert','AV','Communication','Content','Device','Editor','File','Hardware','Image','Maps','Navigation','Notification','Places','Social','Toggle'];

export class IconTile extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="IconTile" onClick={this.props.iconClickAction}>
        <div className="IconTile--icon"><MDIcon icon={this.props.icon} size="48" fill="rgba(0,0,0,.53)"/></div>
        <div className="IconTile--name" title={this.props.name}>{this.props.name}</div>
      </div>
    )
  }
}

export class IconGrid extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="IconGrid">
        {this.props.icons.map(icon=>(<IconTile key={icon.id} name={icon.name} icon={icon.icon} iconClickAction={this.props.iconClickAction} />))}
      </div>
    )
  }
}

export class IconSection extends React.Component {
  constructor(props){
    super(props);
    this.codeIcon = icons.action.ic_code;
    this.viewIcon = icons.action.ic_view_module;
    this.downloadIcon = icons.file.ic_file_download;
    this.switchViewAction = this.switchViewAction.bind(this);
    this.downloadAction = this.downloadAction.bind(this);
    this.fileReady = this.fileReady.bind(this);
    let iconstripper = new IconStripper(this.props.iconset,this.fileReady);
    this.state = {
      iconMode:true,
      code:'',
      downloadURL:'#',
      height: 'auto'
    }
  }
  fileReady(result){
    console.log(result);
    this.setState({
      code:result.file,
      downloadURL: result.blobURL
    })
  }

  render(){
    const body = this.state.iconMode ? (
      <IconGrid icons={this.props.icons} iconClickAction={this.props.iconClickAction}/>
    ) : (
      <div className="IconSection--code" style={{height:this.state.height}}>
        <pre>
          <code className="javascript">{this.state.code}</code>
        </pre>
      </div>
    );
    //TODO: compare length of existing module and the loaded module
    return (
      <div className="IconSection">
        <div className="IconSection--header">
          <div className="IconSection--header-title">{iconsets.filter(iconset=>this.props.iconset==iconset.toLowerCase())[0]}</div>
          <div className="IconSection--header-buttons">
            <div className="IconSection--download-code"
                 title={`Download relevant ${this.props.iconset}.js`}>
              <a href={this.state.downloadURL} download={`${this.props.iconset}.js`}><MDIcon fill="rgba(0,0,0,.53)" icon={this.state.code.length>0 ? this.downloadIcon : null} /></a>
            </div>
            <div className="IconSection--view"
                 onClick={this.switchViewAction}
                 title={`View ${this.state.iconMode? 'code' : 'icons'}`}>
              <MDIcon fill="rgba(0,0,0,.53)" icon={ this.state.iconMode ? ( this.state.code.length>0 ? this.codeIcon : null ) : this.viewIcon } />
            </div>
          </div>
        </div>
        <div className="IconSection--body" ref={viewport=>this.viewport = viewport}>{body}</div>
      </div>
    )
  }
  switchViewAction(e){
    this.setState((prevState)=>({
      iconMode: !prevState.iconMode,
      height: prevState.iconMode? this.viewport.offsetHeight : 'auto'
    }))
  }
  downloadAction(e){

  }
}

export class IconApp extends React.Component {
  constructor(props){
    super(props);
    this.downloadAction = ()=>{};
    this.switchViewAction = ()=>{};
    this.iconClickAction = ()=>{};
  }
  /**
   * @param {Object} iconset
   * */
  prepareIcons(iconset){
    return Object.keys(iconset).map(iconName=>({
      id: iconName,
      name: iconName.substring(3).replace(/_/gi,' '),
      icon: iconset[iconName]
    }))
  }
  render(){
    return (
      <div className="IconApp">
        {iconsets.map(iconset=>(
          <IconSection
          key={iconset.toLowerCase()}
          iconset={iconset.toLowerCase()}
          icons={this.prepareIcons(icons[iconset.toLowerCase()])}
          downloadAction={this.downloadAction}
          switchViewAction={this.switchViewAction}
          iconClickAction={this.iconClickAction}
        />
        ))}
      </div>
    )
  }
}

ReactDOM.render(<IconApp/>,document.getElementById('root'));

