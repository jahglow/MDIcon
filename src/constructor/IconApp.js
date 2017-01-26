/**
 * Created by IvanP on 25.01.2017.
 */
import styles from './styles.css';
import IconStripper from './stripper';
import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test'

import * as assets from '../icon-bundle';
const {MDIcon, ...icons} = assets;

const iconsets = ['Action','Alert','AV','Communication','Content','Device','Editor','File','Hardware','Image','Maps','Navigation','Notification','Places','Social','Toggle'];

export class IconTile extends React.Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state={
      selected:false
    }
  }
  onClick(){
    this.props.iconClickAction(this.props.id,this.props.iconset,!this.state.selected);
    this.setState(prevState=>({selected:!prevState.selected}));
  }
  render(){
    return (
      <div className={`IconTile ${this.state.selected?'selected':''}`} onClick={this.onClick}>
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
        {this.props.icons.map(icon=>(<IconTile key={icon.id} name={icon.name} iconset={this.props.iconset} icon={icon.icon} id={icon.id} iconClickAction={this.props.iconClickAction} />))}
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
    this.setState({
      code:result.file,
      downloadURL: result.blobURL
    })
  }

  render(){
    const body = this.state.iconMode ? (
      <IconGrid icons={this.props.icons} iconset={this.props.iconset} iconClickAction={this.props.iconClickAction}/>
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
}

export class IconApp extends React.Component {
  constructor(props){
    super(props);
    this.iconClickAction = this.iconClickAction.bind(this);
    this.copyCodeAction = this.copyCodeAction.bind(this);
    this.state = {
      selected: {},
      outputVisible:false,
      code:''
    }
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

  /**
   * @param {String} icon - icon name which is a variable name in the file
   * @param {String} iconset - name of iconset the variable `icon` is in
   * @param {Boolean} isSelected - is this icon currently selected
   * */
  iconClickAction(icon,iconset,isSelected){
    this.setState(prevState=>{
      let sel = prevState.selected;
      if(sel[iconset]){ // iconset exists
        let iconSet = sel[iconset];
        if(isSelected){ // add icon
          iconSet.push(icon);
        } else { //remove previously added icon
          iconSet.splice(iconSet.indexOf(icon),1);
          console.log(iconSet.length, iconSet);
          sel[iconset].length==0 && delete sel[iconset]; // delete empty iconset
        }
      } else { //create iconset and assign first icon
        sel[iconset] = [icon];
      }

      let outputVisible = Object.keys(sel).length>0, code;


      if(outputVisible){
        let serialized = Object.keys(sel).map(key=>{
          let joined_values = sel[key].join(', ');
          return `import {${joined_values}} from 'MDIcon/src/icons/${key}';`
        }).join('\n');
        code = `import {MDIcon} from 'MDIcon';\n${serialized}`
      } else {
        code = ''
      }
      console.log(code);
      return {
        selected:sel,
        outputVisible,
        code
      }
    })
  }

  copyCodeAction(){
    let code = this.state.code;
    this.textarea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Oops, unable to copy');
    }
  }

  render(){
    return (
      <div className="IconApp">
        {this.description()}
        {iconsets.map(iconset=>(
          <IconSection
            key={iconset.toLowerCase()}
            iconset={iconset.toLowerCase()}
            icons={this.prepareIcons(icons[iconset.toLowerCase()])}
            iconClickAction={this.iconClickAction}
          />
        ))}
        {this.bottomSheet()}
      </div>
    )
  }

  description(){
    return (
      <div className="IconApp--description">
        <h2>Material Icons: React Import Generator</h2>
        <p>
          This is an Import generator that makes using Google Material Icons easy. Instead of going to their site and downloading an icon each time you need to include it in your project,
          you may use this tool that will return you a valid code for importing only necessary icons in your project. Basically each icon is a <code>MDIcon</code> React component,
          that you may configure with parameters:
          <ul>
            <li><code>icon</code> - imported icon definition (jsx) - this is where this tool comes handy, it lets you import and use the definitions here</li>
            <li><code>children</code> - imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute</li>
            <li><code>size</code> - <b>[Number,optional] default(<code>24</code>)</b> icon width/height (which equals height since all MD icons have square viewbox). Any of 18|24|36|48 is advised</li>
            <li><code>fill</code> - <b>[String,optional] default(<code>'rgba(0,0,0,.85)'</code>)</b>imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute</li>
          </ul>
        </p>
        <p>
          Select the necessary icons below, copy the code (via copy button) and paste it in your react document file
        </p>
        <p>
          If you want to see what it exactly looks like from inside in ES6, then press a code button next to each section. If you feel like this project is outdated (there are missing icons that are available on
          <a href="https://material.io/icons">MD icons site</a>) then feel free to fork it and press the download button next to the section you want to update. It will initiate a download for the file that you may
          replace the outdated one with at <code>/src/icons/</code>.<br />If you want to  host the same util in your fork on gh-pages with the updated icons, when you build the project make sure you include
          <code>constructor.bundle.js</code> and <code>MDIcon.css</code> into the <code>/docs/MDIcon/[version_number]/constructor</code>.
        </p>
      </div>
    )
  }
  bottomSheet(){
    return  (
      <div className={`IconApp--bottom-sheet-container ${this.state.outputVisible?'visible':''}`}>
        <div className="IconApp--bottom-sheet">
          <textarea rows="2" ref={t=>this.textarea=t} readOnly={true} value={this.state.code}></textarea>
          <div className="IconApp--copy IconSection--download-code" title="Copy import code to clipboard" onClick={this.copyCodeAction}><MDIcon fill="rgba(0,0,0,.53)" icon={icons.content.ic_content_copy} /></div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<IconApp/>,document.getElementById('root'));

