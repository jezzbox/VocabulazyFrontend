(this["webpackJsonpvocabulazy-app"]=this["webpackJsonpvocabulazy-app"]||[]).push([[0],{11:function(e,t,n){},14:function(e,t,n){"use strict";n.r(t);var r=n(1),a=n.n(r),c=n(5),s=n.n(c),u=(n(11),n(2)),i=n.n(u),o=n(4),h=n(6),p=n(0),j=function(e){var t=e.title;return Object(p.jsx)("header",{className:"header",children:Object(p.jsx)("h1",{children:t})})};j.defaultProps={title:"Task Tracker"};var b=j,f=function(e){var t=e.phrase;return Object(p.jsxs)("div",{children:[Object(p.jsx)("h3",{children:t.phraseId}),Object(p.jsx)("p",{children:t.phrase})]})},l=function(e){var t=e.phrases;return Object(p.jsx)(p.Fragment,{children:t.map((function(e){return Object(p.jsx)(f,{phrase:e},e.phraseID)}))})};var d=function(){var e=Object(r.useState)([]),t=Object(h.a)(e,2),n=t[0],a=t[1];Object(r.useEffect)((function(){(function(){var e=Object(o.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c();case 2:t=e.sent,a(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]);var c=function(){var e=Object(o.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://localhost:44386/api/Vocabulazy/phrases?verb=hablar");case 2:return t=e.sent,e.next=5,t.json();case 5:return n=e.sent,e.abrupt("return",n);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(p.jsxs)("div",{className:"container",children:[Object(p.jsx)(b,{}),Object(p.jsx)(l,{phrases:n})]})},v=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,15)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,s=t.getTTFB;n(e),r(e),a(e),c(e),s(e)}))};s.a.render(Object(p.jsx)(a.a.StrictMode,{children:Object(p.jsx)(d,{})}),document.getElementById("root")),v()}},[[14,1,2]]]);
//# sourceMappingURL=main.332451b7.chunk.js.map