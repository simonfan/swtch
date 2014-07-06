//     swtch
//     (c) simonfan
//     swtch is licensed under the MIT terms.

define("__swtch/evaluate",["require","exports","module","lodash"],function(t,e){function n(){return i.find(this.cases,function(t){return"default"===t.condition})}var i=t("lodash");e.first=function(t){var e=i.find(this.cases,function(e){return this.match(e.condition,t)},this);return e=e||n.call(this)},e.all=function(t){var e=i.filter(this.cases,function(e){return this.match(e.condition,t)},this);if(0===e.length){var s=n.call(this);s&&e.push(s)}return e}}),define("__swtch/exec",["require","exports","module","lodash"],function(t,e){var n=t("lodash");e.execFirst=function(t){var e=this.first(t);return e?this.execCase(e,t):void 0},e.exec=function(t){var e=this.all(t);return n.map(e,function(e){return this.execCase(e,t)},this)},e.execCase=function(t){return t.value.call(t.context)}}),define("swtch",["require","exports","module","lodash","subject","./__swtch/evaluate","./__swtch/exec"],function(t,e,n){var i=t("lodash"),s=t("subject"),r=n.exports=s({initialize:function(t){this.cases=[],i.each(t,function(t){this.when(t.condition,t.value)},this)},match:function(t,e){return i.isRegExp(t)?t.test(e):i.isFunction(t)?t(e):t===e},when:function(){var t;return t=1===arguments.length&&i.isObject(arguments[0])?arguments[0]:{condition:arguments[0],value:arguments[1],context:arguments[2]},this.cases.push(t),this},d_fault:function(t,e){return this.when("default",t,e),this}});r.assignProto(t("./__swtch/evaluate")).assignProto(t("./__swtch/exec"))});