class IconStripper {
  constructor(iconset,callback){
    this.iconset = {};
    this.requestSource(iconset)
      .then(response=>this.parseResponse(response,iconset))
      .then(result=>callback(iconset,result))
  }

  parseResponse(response,iconset){
    let mediator = document.createElement('div');
    response= response.toString();//console.log(response);
    let pattern = /<symbol(.*)id="(.*?)"(.*?)>({\r*|\n*|.*?)<\/symbol>/gi, matched;
    let result = {};
    while((matched = pattern.exec(response))!=null){
      result[matched[2]] = matched[4];
    }
    let file = this.stripper(result),
        blobURL = this.blobFile(file.str);
    this.iconset = {file, blobURL};
    return this.iconset

  }

  blobFile(str){
    let blob = new Blob([str],{type:'application/javascript'});
    return window.URL.createObjectURL(blob);
  }

  requestSource(iconCategory){
    let url = `https://rawgit.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-${iconCategory.toLowerCase()}-symbol.html`;
    return this.constructor.promiseRequest(url);
  }

  static promiseRequest(URL){
    return new Promise((resolve,reject)=>{
      let xhr = new XMLHttpRequest();
      xhr.open('GET', URL, true);
      xhr.onload = ()=>{xhr.status == 200?resolve(xhr.responseText):reject(Error(`${xhr.status}: ${xhr.statusText}`));};
      xhr.onerror = ()=>{reject(Error("Network Error"));};
      xhr.send();
    });
  }

  stripper(icons){
    let str = [],
        obj = {};

    Object.keys(icons).forEach(icon=>{
      let id = (/(.+?)_24/gi).exec(icon)[1];
      let rawIcon = icons[icon];
      let goodPath = rawIcon//.replace(/><\/{path|circle}>/gi,' />')           // replace `</path>` with `/>`
                                     .replace(/fill-opacity/gi,'fillOpacity') // replace dashed-attributes with camelCase
                                     .replace(/fill="(.+?)"/gi,'');           // remove explicit fills\
      goodPath = goodPath.match(/[/*]/g).length==1?goodPath:'<g>'+goodPath+'</g>';
      str.push(`export const ${id} = ${goodPath};`);
      obj[id] = goodPath;
      //str+=`export const ${id} = ${goodPath.match(/[/*]/g).length==1?goodPath:'<g>'+goodPath+'</g>'}; \n`;
    });
    return {str:str.join('\n'),obj}
  }
}

export default IconStripper;
