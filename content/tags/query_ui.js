'use strict'
//Vue
var Child = Vue.extend({
  template: '#child',
  props:[
    'cond',
    'cquery'
  ],
  data: function(){
    return {
      showlist: false,
      showclose: false,
      showtaginput: 0,
      showcandidates: false,
      newtag: '',
      htags:null,
      //cond: "exact",
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
    /*else{
      //this.cquery[0] = `${this.cquery[0]}CRE`;
      //console.log(JSON.stringify(this.cquery));
    }*/
      

    this.cond = this.cquery[0];

    //console.log(this.cond);
    //console.log(JSON.stringify(this.cquery));
    //console.log(this.$parent.query);
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
        //return ["HI","HEY", "HOY"];
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
      this.newtag = can;
      setTimeout(()=>document.getElementById("htagin").focus(), 10);
    },
    inteli: function(e){
      //console.log("HI",e, this.newtag);

      if (e.key == "Enter" || e.key == "Escape")
        this.showcandidates = false;
      else 
        this.showcandidates = true;

      if ($Container.candidates == null || e.key == "Backspace"){
        $Container.candidates = $Container.tags.filter((el,i)=>{return el.includes(this.newtag)});
      }else
        $Container.candidates = $Container.candidates.filter((el,i)=>{return el.includes(this.newtag)});
        
      //console.log(this.candidates);
    },
    addcond: function(){
      this.cquery.push(["exact", ""]);
      $Container.querytxt = JSON.stringify($Container.query);
    },
    removecond: function(ind){
      var index = 0;
      console.log(
        index = this.$parent.cquery.indexOf(this.$parent.cquery.filter((el,i)=>el === this.cquery)[0])
      );

      if (index < 0) throw new RangeError(`Invalid index ${index} of Cond ${this.cquery}`);
      else
        this.$parent.cquery.splice(index, 1);

      $Container.querytxt = JSON.stringify($Container.query);
    },
    addhtag: function(ind){
      var newtag = this.newtag;
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
      console.log(i1, i2);
      var tmpthag = this.htags[i1];
      console.log(tmpthag);
      tmpthag.splice(i2, 1);
      console.log(tmpthag);
      var left = tmpthag;
      console.log(left);
      this.cquery[i1+1] = left.join('/');
      this.cquery.push(null);this.cquery.pop();
      $Container.querytxt = JSON.stringify($Container.query);
    },
    clickedcond: function(e){
      this.cquery[0] = e.value;
      var terminal = ['exact', 'descendant'];

      // ex,ds ->  &|^
      if (  terminal.includes(this.cond) && !terminal.includes(this.cquery[0])) {
        var tmp = [];
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


      //console.log(JSON.stringify(this.cquery));
      console.log(JSON.stringify($Container.query));
      $Container.querytxt = JSON.stringify($Container.query);

      this.cond = e.value;

      this.showlist = false;
    }
  }
});
Vue.component('child', Child);


var $Container = new Vue({
  el: '.container',
  data:{
    title:        '',
    htags_holder: [ { type: 'child' } ],
    htags:        [],
    kinditems:[
      {text: 'article', value: 'article'}
    ],
    mathselected: 'none',
    mathitems:[
      {text: 'none',  value: 'none'},
      {text: 'ON',    value: 'on'  },
      {text: 'AMS',   value: 'AMS' }
    ],
    showauth:       true,
    query: ["or",["descendant","ロ技研/部会ログ"],["descendant","ロ技研/ガイドライン"]],
    querytxt: '',
    tags: null,
    candidates: null
  },
  computed:{
    /*querytxt: function(){
      return JSON.stringify(this.query);
    }*/
  },
  created: function(){
  },
  methods:{
    addhtagss: function(){
      console.log("HI");
      this.htags_holder.push({ type: 'child'});
    },
    switchauth: function(){
      this.toggled = !this.toggled;
      this.showauth = !this.showauth;
    },
    debug: function(){
      console.log(this.querytxt = JSON.stringify(this.query));
    }
  },
  transitions: {
    auth: {
      beforeEnter: function(e){
        console.log("beforeEnter");
      },
      afterEnter: function(e){
        console.log("afterEnter");
      },
      enter: function(e){
        console.log('enter');
      },
      afterLeave: function(e){
        console.log("afterleave");
      }
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
  console.log($Container.tags);
});
