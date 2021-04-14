(()=>{var v="0.0.0";var u="http://www.w3.org/2000/svg",E=(r,e,t,s)=>{let n=(s-90)*Math.PI/180,i=r+t*Math.cos(n),a=e+t*Math.sin(n);return{x:i,y:a}},x=(r,e,t,s,n)=>{let i=E(r,e,t,n),a=E(r,e,t,s),o=n-s<=180?"0":"1",c=`M ${i.x} ${i.y}`,l=`A ${t} ${t} 0 ${o} 0 ${a.x} ${a.y}`;return`${c} ${l}`},G=()=>"ontouchstart"in window||navigator.maxTouchPoints,m=class{constructor(e){this.dragging=null;this.element=document.createElementNS(u,"svg"),this.arcGroup=document.createElementNS(u,"g"),this.lineGroup=document.createElementNS(u,"g"),this.element.append(this.arcGroup,this.lineGroup),this.updateDraggablePieOptions(e)}async updateDraggablePieOptions(e){if(e.id&&(this.element.id=e.id),e.class&&this.element.classList.add(e.class),e.datasets){await new Promise(requestAnimationFrame),this.arcGroup.innerHTML="",this.lineGroup.innerHTML="";let t=this.element.getBoundingClientRect(),s=e.datasets?.reduce((n,i)=>n+i.value,0)||0;e.datasets.forEach((n,i)=>{let a=document.createElementNS(u,"path"),o=document.createElementNS(u,"line"),c=Number(this.arcGroup.children[i-1]?.dataset.endAngle||0),l=c+n.value/s*360;a.dataset.index=o.dataset.index=String(i),a.dataset.startAngle=String(c),a.setAttribute("fill","none"),this.updateArc({arc:a,line:o,boundingClientRect:t,startAngle:c,endAngle:l,dataset:n}),this.arcGroup.appendChild(a),this.lineGroup.appendChild(o),G()?(o.addEventListener("touchstart",d=>this.dragStart(d)),document.addEventListener("touchmove",d=>this.dragMove(d)),document.addEventListener("touchend",()=>this.dragEnd())):(o.addEventListener("mousedown",d=>this.dragStart(d)),document.addEventListener("mousemove",d=>this.dragMove(d)),document.addEventListener("mouseup",()=>this.dragEnd()))})}}dragStart(e){let t=e.target,s=this.arcGroup.children[Number(t.dataset.index)];this.dragging={arc:s,line:t}}dragMove(e){if(!this.dragging)return;let t=this.element.getBoundingClientRect(),{x:s,y:n}=(()=>{let{clientX:y,clientY:S}=e instanceof MouseEvent?e:e.targetTouches[0];return{x:y-t.left-t.width/2,y:S-t.y-t.height/2}})(),i=Math.atan2(n-0,s-0),a=Number(this.dragging.arc.dataset.startAngle||0),o=i*180/Math.PI+90,c=a,l=this.arcGroup.children[Number(this.dragging.arc.dataset?.index)+1]||this.arcGroup.children[0],d=this.lineGroup.children[Number(this.dragging.line.dataset?.index)+1]||this.lineGroup.children[0],p=Number(l.dataset?.endAngle||0),b=o%360;c>o||b>p||(this.updateArc({arc:this.dragging.arc,line:this.dragging.line,boundingClientRect:t,startAngle:c,endAngle:o}),this.updateArc({arc:l,line:d,boundingClientRect:t,startAngle:b,endAngle:p}))}dragEnd(){this.dragging=null}updateArc({arc:e,line:t,boundingClientRect:s,startAngle:n,endAngle:i,dataset:a}){let o=s.width/2,c=s.height/2,l=Math.min(o,c),d=l/2;e.dataset.startAngle=String(n),e.dataset.endAngle=String(i),a?.color&&e.setAttribute("stroke",a.color),e.setAttribute("stroke-width",String(l)),e.setAttribute("d",x(o,c,d,n,i)),this.updateLine({line:t,origin:{x:o,y:c},distance:l,angle:i})}updateLine({line:e,origin:t,distance:s,angle:n}){let i=(n-90)*Math.PI/180,a=t.x+s*Math.cos(i),o=t.y+s*Math.sin(i);e.setAttribute("stroke","#333333"),e.setAttribute("stroke-width","5"),e.setAttribute("x1",String(t.x)),e.setAttribute("y1",String(t.y)),e.setAttribute("x2",String(a)),e.setAttribute("y2",String(o))}};function M(r){if(r==null)throw new Error(`Expected value to be defined, but received ${r}`)}var f=r=>{let e=document.createElement("div");e.innerHTML=r;let t=e.firstElementChild;return M(t),t},h=r=>{let t=[...document.getElementById("datasets-ol")?.querySelectorAll("li")||[]].map(s=>{let n=s.querySelector("[type=number]"),i=s.querySelector("[type=color]");return{value:n.valueAsNumber||0,color:i.value}});r.updateDraggablePieOptions({datasets:t})},g=(r,e={color:"#de4e3e",value:50})=>{let t=`
    <li>
      <input type="number" value="${e.value}">
      <input type="color" value="${e.color}">
      <button type="button">remove</button>
    </li>`,s=document.getElementById("datasets-ol"),n=f(t),i=n.querySelector("input"),a=n.querySelector("button");i.oninput=()=>{h(r)},a.onclick=()=>{s?.removeChild(n),h(r)},s?.appendChild(n),h(r)};window.onload=()=>{Object.assign(document.getElementById("version")||{},{textContent:v});let r=new m({class:"pie"}),e=document.getElementById("projector"),t=document.getElementById("add-button");e.appendChild(r.element),t.onclick=()=>g(r),g(r,{color:"#e00496",value:50}),g(r,{color:"#94e006",value:50}),g(r,{color:"#9406e0",value:50})};})();