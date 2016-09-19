'use strict'
//Vue
var debug = console;
var Child = Vue.extend({
  template: '#child',
  props:[
    'cond',
    'cquery'
  ],
  data: function(){
    return {
      showlist:       false,
      showclose:      false,
      showtaginput:   -1,
      showcandidates: false,
      newtag:         '',
      htags:          null,
      cond:           "descendant",
      conds:{
        exact:      { text: "Exac",   value: "exact",     color: "#ECEAEF"},
        descendant: { text: "Desc",   value: "descendant",color: "#ECEAEF"},
        and:        { text: "AND",    value: "and",       color: "#FF8081"},
        or:         { text: "OR",     value: "or",        color: "#80A7FF"},
        xor:        { text: "XOR",    value: "xor",       color: "#80FF9D"},
        difference: { text: "DIFF",   value: "difference",color: "#FADD74"},
      },
    };
  },
  created: function(){
  
    if (this.cquery == null)
      this.cquery = this.$parent.query;

    this.cond = this.cquery[0];

  },
  computed:{
      selectwidth: function(){
        return `width:${this.cond.length*0.6}em`;
      },
      condtex: function(){
        return conds;
      },
      rest: function(){
        return this.cquery.slice(1);
      },
      htags: function(){
        return this.rest.map((htag)=> htag.split('/') );
      },
      candidates: function(){
        return $Container.candidates.reduce((o,e,i)=>{o[i]=e; return o;},{});
      }
  },
  methods:{
    showcloseand: function(a){
      return this.showclose && a;
    },
    showcandidatesand: function(a){
      return this.showcandidates && a;
    },
    selectcand: function(can){
      this.showcandidates = false;
      this.newtag         = can;
      const inp = document.getElementById("htagin");
      if (inp !== null)
        setTimeout(()=>inp.focus(), 10);
    },
    enterhtag: function(showinput, e) {
      //debug.log( e.target.style, e , e.target.clientWidth);
      e.target.style.width = `${e.target.clientWidth}px`;

      this.showtaginput = showinput;
    },
    leavehtag: function(e) {
      this.showtaginput    = -1;
      e.target.style.width = "";
    },
    inteli: function(e){

      if (e.key == "Enter" || e.key == "Escape")
        this.showcandidates = false;
      else 
        this.showcandidates = true;

      if ($Container.candidates == null || e.key == "Backspace"){
        $Container.candidates = $Container.tags.filter((el,i)=>{return el.includes(this.newtag)});
      }else
        $Container.candidates = $Container.candidates.filter((el,i)=>{return el.includes(this.newtag)});
        
    },
    addcond: function(){
      this.cquery.push(["exact", ""]);
      $Container.querytxt = JSON.stringify($Container.query);
    },
    removecond: function(ind){
      let index = 0;
      index = this.$parent.cquery.indexOf(this.$parent.cquery.filter((el,i)=>el === this.cquery)[0])

      if (index < 0) throw new RangeError(`Invalid index ${index} of Cond ${this.cquery}`);
      else
        this.$parent.cquery.splice(index, 1);

      $Container.querytxt = JSON.stringify($Container.query);
    },
    addhtag: function(ind){
      const newtag  = this.newtag;
      this.newtag = "";

      this.cquery.push("");

      if (newtag != ""){
        this.cquery[ind+1] += (this.cquery[ind+1] == "" ? "" : "/") + newtag;
        this.cquery.pop();
      }

      $Container.querytxt = JSON.stringify($Container.query);
      setTimeout(()=>document.getElementById("htagin").focus(), 10);
    },
    removehtag: function(ind){
      this.cquery.splice(ind+1, 1);
      $Container.querytxt = JSON.stringify($Container.query);
    },
    removetag: function(i1, i2){
      let tmphtag = this.htags[i1];
      tmphtag.splice(i2, 1);

      this.cquery[i1+1] = tmphtag.join('/');
      this.cquery.push(null);this.cquery.pop();

      $Container.querytxt = JSON.stringify($Container.query);
    },
    clickedcond: function(e){
      this.cquery[0] = e.value;
      const terminal   = ['exact', 'descendant'];

      // ex,ds ->  &|^
      if (  terminal.includes(this.cond) && !terminal.includes(this.cquery[0])) {
        let tmp = [];
        while( this.cquery.length > 1) tmp.unshift(this.cquery.pop());
        tmp.unshift("exact");
        this.cquery.push(tmp);
      }
      // ex,ds -> ex, ds
      else if ( terminal.includes(this.cond) && terminal.includes(this.cquery[0]) ){
      }
      // &|^ -> ex, ds
      else if ( !terminal.includes(this.cond) && terminal.includes(this.cquery[0]) ) { 
        while( this.cquery.length > 2 ) this.cquery.pop();
      }
      // &|^ -> &|^
      else{
      }


      debug.log(JSON.stringify($Container.query));
      
      $Container.querytxt = JSON.stringify($Container.query);
      this.cond           = e.value;
      this.showlist       = false;
    }
  }
});
Vue.component('child', Child);


var $Container = new Vue({
  el: '.container',
  data:{
    query: ["or",["descendant","ロ技研/部会ログ"],["descendant","ロ技研/ガイドライン"]],
    querytxt: '',
    tags: null,
    candidates: null
  },
  methods:{
    debug: function(){
      debug.log(this.querytxt = JSON.stringify(this.query));
    }
  }
});

$.getJSON("index.json", function(json){
  let collect = (j, O)=>{ 
    return Object.keys(j).reduce((o,e,i)=>{ 
      o.push(e);
      if (Object.keys(j[e] ).length == 0 ) {
        return o;
      } else
        return collect(j[e], o);
    }
  , O)};
  $Container.tags =  collect(json, []);
  debug.log($Container.tags);
  $Container.debug();
});
