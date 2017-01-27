/**
 * Created by IvanP on 25.01.2017.
 */
import styles from './styles.css';
import IconStripper from './stripper';
import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test'

import * as icons from '../icon-bundle';
import {MDIcon} from '../MDIcon';

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

    this.state = {
      iconMode:true,
      height: 'auto'
    }
  }

  render(){
    const body = this.state.iconMode ? (
      <IconGrid icons={this.props.icons} iconset={this.props.iconset} iconClickAction={this.props.iconClickAction}/>
    ) : (
      <div className="IconSection--code" style={{height:this.state.height}}>
        <pre>
          <code className="javascript">{this.props.code}</code>
        </pre>
      </div>
    );
    //TODO: compare length of existing module and the loaded module
    return (
      <div className="IconSection">
        <div className="IconSection--header">
          <div className="IconSection--header-title">{iconsets.filter(iconset=>this.props.iconset==iconset.toLowerCase())[0]}</div>
          <div className="IconSection--header-buttons">
            <div
                 title={`Download relevant ${this.props.iconset}.js`}>
              <a className="IconApp--action-icon" href={this.props.downloadURL} download={`${this.props.iconset}.js`}><MDIcon fill="rgba(0,0,0,.53)" icon={this.props.code.length>0 ? this.downloadIcon : null} /></a>
            </div>
            <div className="IconApp--action-icon"
                 onClick={this.switchViewAction}
                 title={`View ${this.state.iconMode? 'code' : 'icons'}`}>
              <MDIcon fill="rgba(0,0,0,.53)" icon={ this.state.iconMode ? ( this.props.code.length>0 ? this.codeIcon : null ) : this.viewIcon } />
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

IconSection.defaultProps={
  downloadURL:'#',
  code:''
};



export class IconApp extends React.Component {
  constructor(props){
    super(props);
    this.iconClickAction = this.iconClickAction.bind(this);
    this.copyCodeAction = this.copyCodeAction.bind(this);
    this.downloadIconsAction = this.downloadIconsAction.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.fileReady = this.fileReady.bind(this);
    // generate updated code for iconsets
    this.iconsets = {};
    // define default state for iconsets
    let stateIconsets = {};
    let _iconsets = {};
    iconsets.forEach(iconset=>{
      stateIconsets[iconset.toLowerCase()] = {downloadURL:'',code:''};
    });

    this.state = {
      selected: {},
      outputVisible:false,
      iconsets:stateIconsets,
      root:'./src'
    };
    iconsets.forEach(iconset=>{
      new IconStripper(iconset.toLowerCase(),this.fileReady);
    });
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
   * What happens when the `root` input changes
   * */
  handleChange(event) {
    let value = event.target.value;
    this.setState(prevState=>{return{
      root: value,
      code: this.serializeCode(prevState.selected,value)
    }});
  }

  /**
   * When icons are downloaded
   * */
  fileReady(iconset,result){
    this.setState(prevState=>{
      let iSets = prevState.iconsets;
      iSets[iconset]={
        code:result.file.str,
        downloadURL: result.blobURL
      };
      this.iconsets[iconset]=result.file.obj;
      return {iconsets:iSets}
    })
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
      } else if(iconset){ //create iconset and assign first icon
        sel[iconset] = [icon];
      }

      let outputVisible = Object.keys(sel).length>0, code;

      code = this.serializeCode(sel, prevState.root);

      return {
        selected:sel,
        outputVisible,
        code
      }
    })
  }

  serializeCode(source,root){
    let code = '';
    if(Object.keys(source).length>0){
      let serialized = Object.keys(source).map(key=>source[key].join(', ')).join(', ');
      code = `import MDIcon from 'MDIcon';\nimport {${serialized}} from '${root}/icons'`
    }
    return code
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

  downloadIconsAction(){
    let link = document.createElement('a');
    link.download = 'icons.js';
    let selected = this.state.selected;
    console.log(selected);
    if(Object.keys(selected).length != 0){
      let str = this.serializeIcons(selected),
          blob = new Blob([str],{type:'application/javascript'});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    } else {
      alert('You haven\'t selected any icons, there\'s nothing to download in the icon package');
    }
  }

  /**
   * turn selected icons into a file
   * */
  serializeIcons(iSets){
    let arr=[];
    Object.keys(iSets).forEach(iconset=>{
      iSets[iconset].forEach(icon=>arr.push(
        `export const ${icon} = ${this.iconsets[iconset][icon]};`
      ))
    });
    return arr.join('\n');
  }

  render(){
    return (
      <div className="IconApp">
        {this.description()}
        {iconsets.map(iconset=>{
          iconset = iconset.toLowerCase();
          return (
          <IconSection
            key={iconset}
            iconset={iconset}
            icons={this.prepareIcons(icons[iconset])}
            iconClickAction={this.iconClickAction}
            downloadURL={this.state.iconsets[iconset].downloadURL}
            code={this.state.iconsets[iconset].code}
          />
        )
        })}
        {this.bottomSheet()}
      </div>
    )
  }

  description(){
    return (
      <div className="IconApp--description">
        <h2>Material Icons: React Import Generator</h2>
        <p>
          This is an Import Generator that makes using Google Material Icons easy. Instead of going to <a href="https://material.io/icons">their site</a> and downloading one icon at a time every time you need to include it in your project,
          use this tool that will return you a valid code for importing only necessary icons in your project as well as a bundle with the icons you select. This can be achieved in four simple steps:
        </p>
        <ol>
          <li>Select all icons you need for your project</li>
          <li>In the bottom sheet specify the path from root where you'll place the icons bundle. Note that the path is relative to the document where you'll use the icons.</li>
          <li>Click the <code>download</code> icon to download the bundle. Place it according to the path you've specified in step 2.</li>
          <li>Click the <code>copy</code> icon to copy the import code. Paste it into your file where you'll use the icons. We've already destructured the import for you</li>
        </ol>
        <p>
          Basically each icon in the bundle is an <code>MDIcon</code> React component, that you may configure with parameters:
        </p>
        <ul>
          <li><code>icon</code> - imported icon definition (jsx) - this is where this tool comes handy, it lets you import and use the definitions here</li>
          <li><code>children</code> - imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute</li>
          <li><code>size</code> - <b>[Number,optional] default(<code>24</code>)</b> icon width/height (which equals height since all MD icons have square viewbox). Any of 18|24|36|48 is advised</li>
          <li><code>fill</code> - <b>[String,optional] default(<code>'rgba(0,0,0,.85)'</code>)</b>imported icon definition (jsx) if you prefer using children and a closing tag in JSX rather than an icon attribute</li>
        </ul>
        <p>
          Select the necessary icons below, copy the code (via copy button) and paste it in your react document file
        </p>
        <p>
          If you want to see what it exactly looks like from inside in ES6, then press a code button next to each section. If you feel like this project is outdated (there are missing icons that are available on
          <a href="https://material.io/icons"> MD icons site</a>) then feel free to fork it and press the download button next to the section you want to update. It will initiate a download for the file that you may
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
          <div className="IconApp--code">
            <label>Specify the path where you'll place icons file</label>
            <input type="text" id="inp" value={this.state.root} onChange={this.handleChange} />
            <textarea rows="2" ref={t=>this.textarea=t} readOnly={true} value={this.state.code} />
          </div>
          <div className="IconApp--actions">
            <div className="IconApp--action-icon IconApp--copy" title="Download icons bundle" onClick={this.downloadIconsAction}><MDIcon fill="rgba(0,0,0,.53)" icon={icons.file.ic_file_download} /></div>
            <div className="IconApp--action-icon IconApp--copy" title="Copy import code to clipboard" onClick={this.copyCodeAction}><MDIcon fill="rgba(0,0,0,.53)" icon={icons.content.ic_content_copy} /></div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<IconApp/>,document.getElementById('root'));

