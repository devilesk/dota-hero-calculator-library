define(["require","exports","module","herocalc_knockout","underscore"],function(e,t,n){"use strict";var o=e("herocalc_knockout"),r=e("underscore"),i=[],a=0,u=500,c=r.debounce(function(){if(i.length){i=r.sortBy(i,"totalDuration").reverse(),r.each(i,function(e){e.entries=r.sortBy(e.entries,"duration").reverse()});var e=r.max(i,function(e){return e.totalDuration}),t=r.reduce(i,function(e,t){return e+t.totalDuration},0),n=[{min:0,max:50,style:"background-color: green; color: white;"},{min:51,max:150,style:"background-color: orange; color: white;"},{min:151,max:99999,style:"background-color: red; color: white;"}],o=function(e){return r.find(n,function(t){return e>=t.min&&e<=t.max}).style};console.log("%cKnockout Binding Report","background-color: yellow; font-size: 2em;"),console.log("Report Date:",(new Date).toISOString(),"(+"+((new Date).getTime()-u-a)+"ms)"),console.log("%cTotal: "+t+"ms",o(t)),console.log("%cTop: "+e.handler+" ("+e.totalDuration+"ms)",o(e.totalDuration)),console.table(i),i=[],a=(new Date).getTime()}},u),l=function(e){return function(t,n,o,a,u,l){var s=(new Date).getTime(),d=t(n,o,a,u,l),g=(new Date).getTime()-s,m=r.findWhere(i,{handler:e});return m||(m={handler:e,totalDuration:0,entries:[]},i.push(m)),m.totalDuration+=g,m.entries.push({element:n,binding:n.attributes&&n.attributes["data-bind"]||n.nodeValue||"",duration:g}),c(),d}};r.each(o.bindingHandlers,function(e,t){e.init&&(e.init=r.wrap(e.init,l(t+".init"))),e.update&&(e.update=r.wrap(e.update,l(t+".update")))})});