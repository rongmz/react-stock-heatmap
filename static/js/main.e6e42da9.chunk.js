(this["webpackJsonp@rongmz/react-stock-heatmap-example"]=this["webpackJsonp@rongmz/react-stock-heatmap-example"]||[]).push([[0],{64:function(t,e,n){t.exports=n(74)},65:function(t,e,n){},73:function(t,e,n){},74:function(t,e,n){"use strict";n.r(e);n(65);var a,i,r=n(2),o=n.n(r),d=n(54),u=n.n(d),s=n(9),l=n.n(s),c=n(55),f=n(5),w=n(42),h=n(43),g=n(60),x=n(59),m=n(58),v=n(8),p=n(12),C=n(40),b=n(13),y=n(57),k=n(56),S=0,D=0,A=0,T=0,M=0,P=0,L="object"===typeof performance&&performance.now?performance:Date,E="object"===typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function O(){return M||(E(W),M=L.now()+P)}function W(){M=0}function B(){this._call=this._time=this._next=null}function _(t,e,n){var a=new B;return a.restart(t,e,n),a}function z(){O(),++S;for(var t,e=a;e;)(t=M-e._time)>=0&&e._call.call(null,t),e=e._next;--S}function I(){M=(T=L.now())+P,S=D=0;try{z()}finally{S=0,function(){var t,e,n=a,r=1/0;for(;n;)n._call?(r>n._time&&(r=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:a=e);i=t,H(r)}(),M=0}}function R(){var t=L.now(),e=t-T;e>1e3&&(P-=e,T=t)}function H(t){S||(D&&(D=clearTimeout(D)),t-M>24?(t<1/0&&(D=setTimeout(I,t-L.now()-P)),A&&(A=clearInterval(A))):(A||(T=L.now(),A=setInterval(R,1e3)),S=1,E(I)))}B.prototype=_.prototype={constructor:B,restart:function(t,e,n){if("function"!==typeof t)throw new TypeError("callback is not a function");n=(null==n?O():+n)+(null==e?0:+e),this._next||i===this||(i?i._next=this:a=this,i=this),this._call=t,this._time=n,H()},stop:function(){this._call&&(this._call=null,this._time=1/0,H())}};var q={__proto__:null,now:O,timer:_,timerFlush:z,timeout:function(t,e,n){var a=new B;return e=null==e?0:+e,a.restart((function(n){a.stop(),t(n+e)}),e,n),a},interval:function(t,e,n){var a=new B,i=e;return null==e?(a.restart(t,e,n),a):(a._restart=a.restart,a.restart=function(t,e,n){e=+e,n=null==n?O():+n,a._restart((function r(o){o+=i,a._restart(r,i+=e,n),t(o)}),e,n)},a.restart(t,e,n),a)}};function j(t){return((t*=2)<=1?t*t:--t*(2-t)+1)/2}function Z(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}var F=function t(e){function n(t){return Math.pow(t,e)}return e=+e,n.exponent=t,n}(3),X=function t(e){function n(t){return 1-Math.pow(1-t,e)}return e=+e,n.exponent=t,n}(3),G=function t(e){function n(t){return((t*=2)<=1?Math.pow(t,e):2-Math.pow(2-t,e))/2}return e=+e,n.exponent=t,n}(3),Q=Math.PI,U=Q/2;function V(t){return(1-Math.cos(Q*t))/2}function Y(t){return 1.0009775171065494*(Math.pow(2,-10*t)-.0009765625)}function N(t){return((t*=2)<=1?Y(1-t):2-Y(t-1))/2}function J(t){return((t*=2)<=1?1-Math.sqrt(1-t*t):Math.sqrt(1-(t-=2)*t)+1)/2}var K=7.5625;function $(t){return(t=+t)<4/11?K*t*t:t<8/11?K*(t-=6/11)*t+3/4:t<10/11?K*(t-=9/11)*t+15/16:K*(t-=21/22)*t+63/64}var tt=function t(e){function n(t){return(t=+t)*t*(e*(t-1)+t)}return e=+e,n.overshoot=t,n}(1.70158),et=function t(e){function n(t){return--t*t*((t+1)*e+t)+1}return e=+e,n.overshoot=t,n}(1.70158),nt=function t(e){function n(t){return((t*=2)<1?t*t*((e+1)*t-e):(t-=2)*t*((e+1)*t+e)+2)/2}return e=+e,n.overshoot=t,n}(1.70158),at=2*Math.PI,it=function t(e,n){var a=Math.asin(1/(e=Math.max(1,e)))*(n/=at);function i(t){return e*Y(- --t)*Math.sin((a-t)/n)}return i.amplitude=function(e){return t(e,n*at)},i.period=function(n){return t(e,n)},i}(1,.3),rt=function t(e,n){var a=Math.asin(1/(e=Math.max(1,e)))*(n/=at);function i(t){return 1-e*Y(t=+t)*Math.sin((t+a)/n)}return i.amplitude=function(e){return t(e,n*at)},i.period=function(n){return t(e,n)},i}(1,.3),ot={__proto__:null,easeLinear:function(t){return+t},easeQuad:j,easeQuadIn:function(t){return t*t},easeQuadOut:function(t){return t*(2-t)},easeQuadInOut:j,easeCubic:Z,easeCubicIn:function(t){return t*t*t},easeCubicOut:function(t){return--t*t*t+1},easeCubicInOut:Z,easePoly:G,easePolyIn:F,easePolyOut:X,easePolyInOut:G,easeSin:V,easeSinIn:function(t){return 1===+t?1:1-Math.cos(t*U)},easeSinOut:function(t){return Math.sin(t*U)},easeSinInOut:V,easeExp:N,easeExpIn:function(t){return Y(1-+t)},easeExpOut:function(t){return 1-Y(t)},easeExpInOut:N,easeCircle:J,easeCircleIn:function(t){return 1-Math.sqrt(1-t*t)},easeCircleOut:function(t){return Math.sqrt(1- --t*t)},easeCircleInOut:J,easeBounce:$,easeBounceIn:function(t){return 1-$(1-t)},easeBounceOut:$,easeBounceInOut:function(t){return((t*=2)<=1?1-$(1-t):$(t-1)+1)/2},easeBack:nt,easeBackIn:tt,easeBackOut:et,easeBackInOut:nt,easeElastic:rt,easeElasticIn:it,easeElasticOut:rt,easeElasticInOut:function t(e,n){var a=Math.asin(1/(e=Math.max(1,e)))*(n/=at);function i(t){return((t=2*t-1)<0?e*Y(-t)*Math.sin((a-t)/n):2-e*Y(t)*Math.sin((a+t)/n))/2}return i.amplitude=function(e){return t(e,n*at)},i.period=function(n){return t(e,n)},i}(1,.3)},dt=function(t){var e=new Set(t.map((function(t){var e=t.marketDepth;if(e){var n=e.buys.map((function(t){return+t.rate})),a=e.sells.map((function(t){return+t.rate}));return n.concat(a,[+e.lastTradedPrice])}return[]})).reduce((function(t,e){return t.concat(e)}),[]));return Array.from(e)},ut=function(t){var e=t.marketDepth;if(e){var n=e.buys.map((function(t){return+t.qty})),a=e.sells.map((function(t){return+t.qty}));return n.concat(a)}return[]},st=function(t){var e=ut(t).sort((function(t,e){return t-e}));return e.length>0?e[e.length-1]:1},lt=function(t){var e=t.map((function(t){return t.marketDepth?+t.marketDepth.lastTradedQty:0})).sort((function(t,e){return t-e}));return e.length>0?e[e.length-1]:1},ct=function(t){if(t>59){if(t>3599){var e=t/3600;return"".concat(e.toFixed(2)," hour").concat(e>1?"s":"")}var n=t/60;return"".concat(n.toFixed(2)," minute").concat(n>1?"s":"")}return"".concat(t," second").concat(t>1?"s":"")},ft=Object.assign(Object.assign(Object.assign({},m,v,p),C,b,y),k,ot,q),wt=function(t){Object(g.a)(n,t);var e=Object(x.a)(n);function n(){var t;Object(w.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(t=e.call.apply(e,[this].concat(i))).canvasRef=o.a.createRef(),t.drawingContext=null,t.data=[],t.windowedData=[],t.windowLength=40,t.windowPosition=0,t.autoScroll=!0,t.defaults={borderPadding:[5,5,0,0],bidAskWidth:100,axisYWidth:50,axisXHeight:50,buyColor:"#388e3c",textOnBuyColor:"#ffffff",sellColor:"#d32f2f",textOnSellColor:"#ffffff",textOnBackground:"#000000",tradeColor:"#7434eb",axisTickSize:6,axisColor:"#000000",xAxisTextPadding:6,yAxisTextPadding:6,bidAskGraphPaddingLeft:10,bidAskTransitionDuration:500,hmWidth:function(){return t.props.width-t.defaults.borderPadding[1]-t.defaults.borderPadding[3]-t.defaults.bidAskWidth-t.defaults.axisYWidth},hmHeight:function(){return t.props.height-t.defaults.borderPadding[0]-t.defaults.borderPadding[2]-t.defaults.axisXHeight},clearColor:"#ffffff"},t.isMouseDown=!1,t.mouseDownX=0,t.attachMouseListeners=function(){null!==t.canvasRef.current&&(t.canvasRef.current.addEventListener("mousedown",t.eventMouseDown),t.canvasRef.current.addEventListener("mousemove",t.eventMouseMove),t.canvasRef.current.addEventListener("mouseup",t.eventMouseUp),t.canvasRef.current.addEventListener("wheel",t.eventZoomWheel))},t.detachMouseListeners=function(){null!==t.canvasRef.current&&(t.canvasRef.current.removeEventListener("mousedown",t.eventMouseDown),t.canvasRef.current.removeEventListener("mousemove",t.eventMouseMove),t.canvasRef.current.removeEventListener("mouseup",t.eventMouseUp),t.canvasRef.current.removeEventListener("wheel",t.eventZoomWheel))},t.eventMouseDown=function(e){t.isMouseDown=!0,t.mouseDownX=e.x},t.eventMouseMove=function(e){if(t.isMouseDown){var n=e.x-t.mouseDownX,a=Math.floor(Math.abs(n)/t.xScale.bandwidth());a>0&&(t.mouseDownX=e.x),t.moveDataWindow(t.windowPosition+a*(n>=0?-1:1))}},t.eventMouseUp=function(e){t.isMouseDown=!1,t.mouseDownX=0},t.eventZoomWheel=function(e){var n,a=0;switch(e.deltaY<0?"zoom-in":"zoom-out"){case"zoom-in":a=Math.max(t.windowLength-1,3);break;case"zoom-out":a=Math.min(t.windowLength+1,t.data.length-1)}n=t.windowLength-a,t.windowLength=a,t.moveDataWindow(t.windowPosition+n)},t.xScale=null,t.bidAskScale=null,t.yScale=null,t.yDomainValues=null,t.bidAskAnimTimer=null,t.bidAskBarAnimConfig={},t.updateHeatmapDimensions=function(){var e=t.props,n=e.width,a=e.height;n>0&&a>0&&t.windowedData.length>0&&(t.xScale=ft.scaleBand().range([0,t.defaults.hmWidth()]).domain(t.windowedData.map((function(t){return t.ts}))),t.yDomainValues=dt(t.windowedData).sort((function(t,e){return t-e})),t.yScale=ft.scaleBand().range([t.defaults.hmHeight(),0]).domain(t.yDomainValues),t.bidAskScale=ft.scaleLinear().range([0,t.defaults.bidAskWidth]).domain([0,ft.max(ut(t.windowedData[t.windowedData.length-1]))]))},t.updateHeatmap=function(){null!==t.drawingContext&&(t.updateHeatmapDimensions(),t.clearCanvas(t.defaults.borderPadding[3],t.defaults.borderPadding[0],t.defaults.hmWidth(),t.defaults.hmHeight(),t.defaults.clearColor),t.drawMainGraph(),t.drawXAxis(),t.drawYAxisAndBidAskGraph(),t.drawBuy2SellRatio())},t.drawBuy2SellRatio=function(){if(t.windowedData.length>0){var e=t.windowedData[t.windowedData.length-1],n=t.defaults.borderPadding[3]+t.defaults.hmWidth()+t.defaults.axisTickSize,a=t.defaults.borderPadding[0]+t.defaults.hmHeight()+t.defaults.axisTickSize,i=t.props.width-n,r=t.props.height-a;t.clearCanvas(n,a,i,r,t.defaults.clearColor);var o=(r-15)/2;t.drawingContext.save(),t.drawingContext.textAlign="center",t.drawingContext.textBaseline="middle",t.drawingContext.font="bold ".concat(o,"px sans-serif"),t.drawingContext.fillText((e.marketDepth.buyOrderVolume/e.marketDepth.sellOrderVolume).toFixed(2),n+i/2,a+o/2),t.drawingContext.fillText("Buy/Sell",n+i/2,a+1.5*o+5),t.drawingContext.restore()}},t.drawXAxis=function(){var e;t.clearCanvas(t.defaults.borderPadding[3],t.defaults.borderPadding[0]+t.defaults.hmHeight(),t.defaults.hmWidth(),t.defaults.axisXHeight,t.defaults.clearColor),t.drawingContext.save(),t.drawingContext.beginPath(),t.drawingContext.translate(t.defaults.borderPadding[3],t.defaults.borderPadding[0]+t.defaults.hmHeight()),t.drawingContext.moveTo(0,0),t.drawingContext.lineTo(t.defaults.hmWidth(),0),t.drawingContext.textAlign="center",t.drawingContext.textBaseline="top";var n=t.drawingContext.measureText("77:77:77").width+20,a=parseInt(n/((null===(e=t.xScale)||void 0===e?void 0:e.bandwidth())||1))||1;t.windowedData.map((function(e,n){var i=t.xScale(e.ts);t.drawingContext.moveTo(i,0),t.drawingContext.lineTo(i,t.defaults.axisTickSize),n%a===0&&t.drawingContext.fillText(e.ts,i,t.defaults.axisTickSize+t.defaults.xAxisTextPadding)})),t.drawingContext.textAlign="left",t.drawingContext.fillText("Zoom Level:  ".concat(ct(t.windowLength)),20,t.defaults.axisTickSize+t.defaults.xAxisTextPadding+20);var i=t.drawingContext.measureText("Zoom Level:  ".concat(ct(t.windowLength))).width;t.windowedData.length>0&&t.drawingContext.fillText("LTP:  ".concat(t.windowedData[t.windowedData.length-1].marketDepth.lastTradedPrice,"     LTQ:  ").concat(t.windowedData[t.windowedData.length-1].marketDepth.lastTradedQty),20+i+20,t.defaults.axisTickSize+t.defaults.xAxisTextPadding+20),t.drawingContext.lineWidth=1.2,t.drawingContext.strokeStyle=t.defaults.axisColor,t.drawingContext.stroke(),t.drawingContext.restore()},t.drawYAxisAndBidAskGraph=function(){if(null!==t.yDomainValues){t.clearCanvas(t.defaults.borderPadding[3]+t.defaults.hmWidth(),t.defaults.borderPadding[0],t.defaults.axisYWidth,t.defaults.hmHeight()+t.defaults.axisTickSize,t.defaults.clearColor),t.drawingContext.save(),t.drawingContext.beginPath(),t.drawingContext.translate(t.defaults.borderPadding[3]+t.defaults.hmWidth(),t.defaults.borderPadding[0]),t.drawingContext.moveTo(0,0),t.drawingContext.lineTo(0,t.defaults.hmHeight()+t.defaults.axisTickSize),t.drawingContext.textAlign="start",t.drawingContext.textBaseline="top";var e=0;t.yDomainValues.map((function(n){var a=t.yScale(n);t.drawingContext.moveTo(0,a),t.drawingContext.lineTo(t.defaults.axisTickSize,a),t.drawingContext.fillText(n.toFixed(2),t.defaults.axisTickSize+t.defaults.yAxisTextPadding,a+2,t.defaults.axisYWidth-t.defaults.axisTickSize+t.defaults.yAxisTextPadding);var i=t.drawingContext.measureText(n.toFixed(2)).width;e=e>=i?e:i})),t.drawingContext.lineWidth=1.2,t.drawingContext.strokeStyle=t.defaults.axisColor,t.drawingContext.stroke(),t.drawingContext.restore();var n=t.defaults.borderPadding[3]+t.defaults.hmWidth()+e+t.defaults.axisTickSize+t.defaults.yAxisTextPadding+t.defaults.bidAskGraphPaddingLeft,a=t.defaults.borderPadding[0];t.drawBidAskGraph(n,a)}},t.drawBidAskGraph=function(e,n){t.windowedData.length>0&&(null!==t.bidAskAnimTimer&&(t.bidAskAnimTimer.stop(),t.bidAskAnimTimer=null),t.bidAskAnimTimer=ft.timer((function(a){var i=Math.min(1,ft.easeCubic(a/t.defaults.bidAskTransitionDuration));t.clearCanvas(e,n,t.defaults.bidAskWidth,t.defaults.hmHeight()+t.defaults.axisTickSize,t.defaults.clearColor);var r=t.yScale.bandwidth()-2,o=t.windowedData[t.windowedData.length-1],d=st(o);t.drawingContext.save(),t.drawingContext.translate(e,n),t.drawingContext.lineWidth=0,t.drawingContext.textBaseline="middle";var u=function(e,n,a){e.map((function(e){t.drawingContext.fillStyle=n;var o=t.defaults.bidAskWidth*(+e.qty/d);t.bidAskBarAnimConfig[e.rate]=ft.interpolateNumber(t.bidAskBarAnimConfig[e.rate]||0,o)(i),t.drawingContext.fillRect(0,t.yScale(e.rate),t.bidAskBarAnimConfig[e.rate],r);var u=t.drawingContext.measureText(e.qty).width;t.defaults.bidAskWidth-t.bidAskBarAnimConfig[e.rate]-2>=u?(t.drawingContext.textAlign="start",t.drawingContext.fillStyle=t.defaults.textOnBackground,t.drawingContext.fillText(e.qty,t.bidAskBarAnimConfig[e.rate]+2,t.yScale(e.rate)+r/2+1)):(t.drawingContext.textAlign="end",t.drawingContext.fillStyle=a,t.drawingContext.fillText(e.qty,t.bidAskBarAnimConfig[e.rate]-2,t.yScale(e.rate)+r/2+1))}))};u(o.marketDepth.buys,t.defaults.buyColor,t.defaults.textOnBuyColor),u(o.marketDepth.sells,t.defaults.sellColor,t.defaults.textOnSellColor),t.drawingContext.restore(),1===i&&t.bidAskAnimTimer.stop()})))},t.drawMainGraph=function(){if(t.drawingContext.save(),t.xScale&&t.yScale&&t.bidAskScale&&null!==t.drawingContext){var e=lt(t.windowedData),n=.5*t.xScale.bandwidth();t.yScale.bandwidth();t.drawingContext.translate(t.defaults.borderPadding[3],t.defaults.borderPadding[0]),t.windowedData.map((function(a){var i=a.marketDepth,r=a.ts,o=st(a);if(i.buys&&i.buys.length>0){var d=ft.color(t.defaults.buyColor).rgb();i.buys.map((function(e){d.opacity=e.qty/o,t.drawingContext.fillStyle=d.toString(),t.drawingContext.fillRect(t.xScale(r),t.yScale(e.rate),t.xScale.bandwidth(),t.yScale.bandwidth())}))}if(i.sells&&i.sells.length>0){var u=ft.color(t.defaults.sellColor).rgb();i.sells.map((function(e){u.opacity=e.qty/o,t.drawingContext.fillStyle=u.toString(),t.drawingContext.fillRect(t.xScale(r),t.yScale(e.rate),t.xScale.bandwidth(),t.yScale.bandwidth())}))}var s=ft.color(t.defaults.tradeColor).rgb();s.opacity=1,t.drawingContext.lineWidth=1,t.drawingContext.fillStyle=s.toString();var l=n*(+i.lastTradedQty/e);t.drawingContext.beginPath(),t.drawingContext.arc(t.xScale(r),t.yScale(+i.lastTradedPrice),l,0,2*Math.PI),t.drawingContext.fill()})),t.drawingContext.beginPath(),ft.line().x((function(e){return t.xScale(e.ts)})).y((function(e){return t.yScale(+e.marketDepth.lastTradedPrice)})).curve(ft.curveLinear).context(t.drawingContext)(t.windowedData),t.drawingContext.lineWidth=1,t.drawingContext.strokeStyle=t.defaults.tradeColor,t.drawingContext.stroke()}t.drawingContext.restore()},t.clearCanvas=function(e,n,a,i,r){null!==t.drawingContext&&(t.drawingContext.save(),t.drawingContext.fillStyle=r||t.defaults.clearColor,t.drawingContext.fillRect(e,n,a,i),t.drawingContext.restore())},t.setData=function(e){e&&e.length>0&&(t.data=e,t.updateWindowedData())},t.addData=function(e){"object"===typeof e&&(t.data.push(e),t.updateWindowedData())},t.updateWindowedData=function(){t.moveDataWindow(t.data.length-t.windowLength-1)},t.moveDataWindow=function(e){e!==t.windowPosition&&e>-1&&e<t.data.length-t.windowLength&&(t.windowedData=t.data.slice(e,e+t.windowLength),t.windowPosition=e,t.windowPosition===t.data.length-t.windowLength-1&&(t.autoScroll=!0),t.updateHeatmap())},t.setZoomLevel=function(e){var n=Math.min(Math.max(e,3),t.data.length-1),a=t.windowLength-n;t.windowLength=n,t.moveDataWindow(t.windowPosition+a)},t}return Object(h.a)(n,[{key:"shouldComponentUpdate",value:function(t,e){var n=this.props.width!==t.width||this.props.height!==t.height;return n&&this.detachMouseListeners(),n}},{key:"componentDidMount",value:function(){null!==this.canvasRef.current&&(this.drawingContext=this.canvasRef.current.getContext("2d"),this.updateHeatmap(),this.attachMouseListeners())}},{key:"componentDidUpdate",value:function(){null!==this.canvasRef.current&&(this.drawingContext=this.canvasRef.current.getContext("2d"),this.updateHeatmap(),this.attachMouseListeners())}},{key:"componentWillUnmount",value:function(){this.detachMouseListeners()}},{key:"render",value:function(){var t=this.props,e=t.width,n=t.height;return o.a.createElement("canvas",{ref:this.canvasRef,width:e||300,height:n||150,style:{display:"block",width:"100%",height:"100%",cursor:"crosshair"}})}}]),n}(o.a.Component),ht=(n(73),function(){var t=o.a.useState(!0),e=Object(f.a)(t,2),n=e[0],a=e[1],i=o.a.useRef(null),r=o.a.useRef(null),d=o.a.useState([0,0]),u=Object(f.a)(d,2),s=u[0],w=u[1];return o.a.useEffect((function(){a(!0),fetch("http://localhost:3000/20200814_1h").then(function(){var t=Object(c.a)(l.a.mark((function t(e){var n,o,d,u,s,c,f,w,h,g,x,m,v,p,C;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=e.body,o=e.headers,d=n.getReader(),u=+o.get("Content-Length"),s=0,c=[];case 5:return t.next=8,d.read();case 8:if(f=t.sent,w=f.done,h=f.value,!w){t.next=13;break}return t.abrupt("break",18);case 13:c.push(h),s+=h.length,null!==i.current&&(i.current.innerHTML=" Downloading ".concat((100*s/u).toFixed(1),"% ...")),t.next=5;break;case 18:for(g=new Uint8Array(s),x=0,m=0,v=c;m<v.length;m++)p=v[m],g.set(p,x),x+=p.length;C=new TextDecoder("utf-8").decode(g),null!==r.current&&r.current.setData(C.split("\n").filter((function(t){return""!==t.trim()})).map((function(t){return JSON.parse(t)}))),a(!1);case 24:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}),[]),o.a.useEffect((function(){var t=function(){w([window.innerWidth,window.innerHeight])};return t(),window.addEventListener("resize",t),function(){return window.removeEventListener("resize",t)}}),[]),o.a.createElement(o.a.Fragment,null,n&&o.a.createElement("div",{className:"loadingIndicator"},o.a.createElement("div",{className:"loadingSpinner"},o.a.createElement("div",{className:"loader"},"Loading...")),o.a.createElement("div",{ref:i}," Downloading 0% ...")),o.a.createElement(wt,{ref:r,width:s[0],height:s[1]}),o.a.createElement("div",{className:"btnContainer"},o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(60)}},"zoom 1 minute"),o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(120)}},"zoom 2 minutes"),o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(180)}},"zoom 3 minutes"),o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(240)}},"zoom 4 minutes"),o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(300)}},"zoom 5 minutes"),o.a.createElement("button",{onClick:function(){null!==r.current&&r.current.setZoomLevel(600)}},"zoom 10 minutes")))});u.a.render(o.a.createElement(ht,null),document.getElementById("root"))}},[[64,1,2]]]);
//# sourceMappingURL=main.e6e42da9.chunk.js.map