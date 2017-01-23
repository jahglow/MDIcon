/**
 * Created by IvanP on 23.01.2017.
 */

class IconStripper {
  constructor(iconCategories = ['Action','Alert','AV','Communication','Content','Device','Editor','File','Hardware','Image','Maps','Navigation','Notification','Places','Social','Toggle']){
    this.iconset = {};
    iconCategories.forEach(iconset=>{
      this.requestSource(iconset).then(response=>this.parseResponse(response,iconset))
    });
  }
  parseResponse(response,iconset){
    this.iconset[iconset]={};
    let mediator = document.createElement('div');
    mediator.innerHTML = response;
    this.iconset[iconset].icons=mediator.querySelector('svg');
    this.iconset[iconset].file=this.stripper(this.iconset[iconset].icons);
    mediator.innerHTML = '';
    mediator.appendChild(this.generateOutput(iconset));

    document.body.appendChild(mediator);
    hljs.highlightBlock(mediator);
  }

  generateOutput(key){
    let heading = document.createElement('h4');
    heading.className = 'heading';
    heading.textContent = key;
    let pre = document.createElement('pre');
    let code = document.createElement('code');
    code.classList.add('javascript');
    code.textContent = this.iconset[key].file;
    pre.appendChild(code);

    let df = document.createDocumentFragment();
    df.appendChild(heading);
    df.appendChild(pre);

    return df
  }


  requestSource(iconCategory){
    let url = `https://rawgit.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-${iconCategory.toLowerCase()}-symbol.html`;
    return this.constructor.promiseRequest(url);
  }

  /**
   * Creates an XHR wrapped in a Promise
   * @param {!String} URL - url to send a `GET` request to
   * @return {Promise} Returns a then-able promise with `XMLHttpRequest.responseText`
   * */
  static promiseRequest(URL){
    return new Promise((resolve,reject)=>{
      let xhr = new XMLHttpRequest();
      xhr.open('GET', URL, true);
      xhr.onload = ()=>{xhr.status == 200?resolve(xhr.responseText):reject(Error(`${xhr.status}: ${xhr.statusText}`));};
      xhr.onerror = ()=>{reject(Error("Network Error"));};
      xhr.send();
    });
  }

  stripper(SVGElement){
    let str = `import React from 'react'; \n \n`;
    [...SVGElement.children].forEach(symbol=>{
      let id = (/(.+?)_24/gi).exec(symbol.id)[1];
      let goodPath = symbol.innerHTML.replace(/><\/(.+?)>/gi,' />');
      str+=`export const ${id} = ${symbol.children.length==1?goodPath:'<g>'+goodPath+'</g>'}; \n`;
    });
    return str + '\n';
  }
}
