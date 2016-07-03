define(["require","exports","module","herocalc_knockout","jquery","bootstrap","jquery-ui.custom","chartjs","chartjs-scatter","components","./herocalc_core"],function(e,t,o){"use strict";var a=e("herocalc_knockout"),r=e("jquery");e("bootstrap"),e("jquery-ui.custom"),e("chartjs"),e("chartjs-scatter"),e("components"),a.components.register("hero-pane",{require:"components/hero-pane"}),a.components.register("unit-pane",{require:"components/unit-pane"}),a.components.register("clone-pane",{require:"components/clone-pane"}),a.components.register("illusion-pane",{require:"components/illusion-pane"}),a.components.register("buff-settings",{require:"components/buff-settings"}),a.components.register("item-buff",{require:"components/item-buff"}),a.components.register("item-debuff",{require:"components/item-debuff"}),a.components.register("buff-section",{require:"components/buff-section"}),a.components.register("damage-details",{require:"components/damage-details"}),a.components.register("damage-amp",{require:"components/damage-amp"}),a.components.register("ability",{require:"components/ability"}),a.components.register("shop",{require:"components/shop"}),a.components.register("stat",{require:"components/stats/stat"}),a.components.register("stats0",{require:"components/stats/stats0"}),a.components.register("stats1",{require:"components/stats/stats1"}),a.components.register("stats2",{require:"components/stats/stats2"}),a.components.register("stats3",{require:"components/stats/stats3"}),a.components.register("stats-additional",{require:"components/stats/stats-additional"});var s=e("./herocalc_core").HEROCALCULATOR;s.prototype.PlayerColors=["#2E6AE6","#5DE6AD","#AD00AD","#DCD90A","#E66200","#E67AB0","#92A440","#5CC5E0","#00771F","#956000"],s.prototype.Tab=function(e,t,o,r,s,i){var n=this;return n.id=e,n.href=t,n.color=s,n.data=o,n.data.id=a.observable(n.href),n.text=r,n.template=i,n},s.prototype.TabGroup=function(e,t,o){var r=this;return r.hero=e,r.unit=t,r.clone=o,r.illusions=a.observableArray([]),r},s.prototype.HeroCalculatorViewModel=function(){var e=this;e.heroes=[];for(var t=0;10>t;t++)e.heroes.push(new s.prototype.HeroCalculatorModel(t));for(var t=0;5>t;t++){for(var o=[],i=5;10>i;i++)o.push(e.heroes[i]);e.heroes[t].enemies.push.apply(e.heroes[t].enemies,o)}for(var t=5;10>t;t++){for(var o=[],i=0;5>i;i++)o.push(e.heroes[i]);e.heroes[t].enemies.push.apply(e.heroes[t].enemies,o)}for(var t=0;10>t;t++){for(var o=[],i=0;10>i;i++)t!==i&&o.push(e.heroes[i]);e.heroes[t].otherHeroes.push.apply(e.heroes[t].otherHeroes,o)}for(var t=0;10>t;t++)e.heroes[t].clone=a.observable(new s.prototype.CloneViewModel(0,e.heroes[t])),e.heroes[t].unit=a.observable(new s.prototype.UnitViewModel(0,e.heroes[t])),e.heroes[t].selectedCompare(e.heroes[t].availableCompare()[5>t?4+t:t-5]),e.heroes[t].selectedEnemy(e.heroes[t].availableEnemies()[t%5]),e.heroes[t].unit().enemy(e.heroes[t].enemy()),e.heroes[t].unit().selectedUnit(e.heroes[t].unit().availableUnits()[0]),e.heroes[t].illusions.subscribe(function(t){for(var o=0;o<t.length;o++)if("added"==t[o].status){var a=this.index<2?"#5cb85c":"#d9534f",r=s.prototype.uniqueId();e.tabs()[this.index].illusions.push(new s.prototype.Tab("illusionTab"+this.index+"-"+r,"illusionPane"+this.index+"-"+r,e.heroes[this.index].illusions()[e.tabs()[this.index].illusions().length](),"Illusion "+r,a,"illusion-pane"))}},{vm:this,index:t},"arrayChange");e.heroes[0].bound(!0),e.tabs=a.observableArray([]);for(var n=[],t=0;10>t;t++){var l=s.prototype.PlayerColors[t],p=new s.prototype.TabGroup(new s.prototype.Tab("heroTab"+t,"heroPane"+t,e.heroes[t],"Hero "+t,l,"hero-pane"),new s.prototype.Tab("unitTab"+t,"unitPane"+t,e.heroes[t].unit(),"Unit "+t,l,"unit-pane"),new s.prototype.Tab("cloneTab"+t,"clonePane"+t,e.heroes[t].clone(),"Meepo Clone "+t,l,"clone-pane"));n.push(p)}e.tabs.push.apply(e.tabs,n),e.selectedItem=a.observable(),e.layout=a.observable("1"),e.displayShop=a.observable(!0),e.displayShopItemTooltip=a.observable(!0),e.allItems=a.observableArray([{name:"Str, Agi, Int, MS, Turn, Sight",value:"stats0"},{name:"Armor, Health, Mana, Regen, EHP",value:"stats1"},{name:"Phys Res, Magic Res, Lifesteal, Evasion, Bash, Miss",value:"stats2"},{name:"Damage, IAS, BAT, Attack",value:"stats3"}]),e.selectedItems=a.observableArray([]),e.moveUp=function(){var t=e.allItems.indexOf(e.selectedItems()[0]),o=e.allItems.indexOf(e.selectedItems()[e.selectedItems().length-1]);if(t>0){var a=e.allItems.splice(t-1,1);e.allItems.splice(o,0,a[0])}},e.moveDown=function(){var t=e.allItems.indexOf(e.selectedItems()[0]),o=e.allItems.indexOf(e.selectedItems()[e.selectedItems().length-1]);if(o<e.allItems().length-1){var a=e.allItems.splice(o+1,1);e.allItems.splice(t,0,a[0])}},e.selectedTabId=a.observable("heroTab0"),e.getSelectedTab=function(t){var o=t.replace("heroTab","").replace("cloneTab","").replace("unitTab","").replace("illusionTab","").split("-"),a=o[0],r=e.tabs()[a];return r},e.selectedTab=a.computed(function(){var t=e.getSelectedTab(e.selectedTabId());return-1!=e.selectedTabId().indexOf("hero")?t.hero:-1!=e.selectedTabId().indexOf("unit")?t.unit:-1!=e.selectedTabId().indexOf("clone")?t.clone:-1!=e.selectedTabId().indexOf("illusion")?t.illusions().find(function(t){return t.id==e.selectedTabId()}):e.tabs()[0].hero}),e.selectedTabs=a.observableArray(["heroTab0","heroTab1"]),e.boundSettings=a.observable(!1),e.clickTab=function(t,o,a){e.selectedTabId(o.target.id),e.selectedTabs()[1]!=o.target.id&&(e.selectedTabs.shift(),e.selectedTabs.push(o.target.id)),e.selectedTab().data.hasOwnProperty("bound")&&(e.selectedTab().data.bound(!0),setTimeout(function(){e.selectedTab().data.buildExplorer.graphData.valueHasMutated()},0)),"settingsTab"===o.target.id&&e.boundSettings(!0)},e.isSecondTab=function(t){return e.selectedTabs().indexOf(t)>-1&&e.selectedTabId()!=t},e.showSideTabId=function(t){return e.selectedTabs().indexOf(t)>-1&&e.sideView()},e.removeTab=function(t,o,a,s){o.id==e.selectedTabId()&&(e.clickTab(null,{target:{id:"heroTab0"}}),r("#heroTab0").tab("show")),e.tabs()[s].illusions.remove(function(e){return e==o}),e.heroes[s].illusions.remove(function(e){return e()==o.data})},e.sideView=a.observable(!1),e.sideView.subscribe(function(t){if(t){e.shopPopout()||e.displayShop(!1);for(var o=0;o<e.selectedTabs().length;o++){var a=e.getSelectedTab(e.selectedTabs()[o]);a&&a.hero.data.hasOwnProperty("bound")&&a.hero.data.bound(!0)}e.layout("0")}});var u=r(window);e.windowWidth=a.observable(u.width()),e.windowHeight=a.observable(u.height()),u.resize(function(){e.windowWidth(u.width()),e.windowHeight(u.height())}),e.shopDock=a.observable(!1),e.shopDock.subscribe(function(e){}),e.shopDockTrigger=a.computed(function(){e.windowWidth(),e.shopDock()}),e.shopPopout=a.observable(!1),e.shopPopout.subscribe(function(t){t?(e.displayShop(!0),r("#shop-dialog").dialog({minWidth:380,minHeight:0,closeText:"",open:function(t,o){r(t.target.offsetParent).find(".ui-dialog-titlebar").find("button").addClass("close glyphicon glyphicon-remove shop-button btn btn-default btn-xs pull-right").removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close close").css("margin-right","0px").parent().append(r("#shop-minimize")).append(r("#shop-maximize")),r(t.target.offsetParent).find(".ui-dialog-titlebar").dblclick(function(){e.displayShop(!e.displayShop())})},close:function(t,o){e.shopPopout(!1)}})):(r("#shop-container").prepend(r("#shop-minimize")).prepend(r("#shop-maximize")),r("#shop-dialog").dialog("destroy"))}),e.changeSelectedItem=function(t,o){e.itemInputValue(1),e.selectedItem(o.target.id)},e.getItemTooltipData=a.computed(function(){return s.prototype.getItemTooltipData(e.selectedItem())},this),e.getItemInputLabel=a.computed(function(){return-1!=s.prototype.stackableItems.indexOf(e.selectedItem())?"Stack Size":-1!=s.prototype.levelitems.indexOf(e.selectedItem())?"Upgrade Level":"bloodstone"==e.selectedItem()?"Charges":""},this),e.itemInputValue=a.observable(1),e.saveLink=a.observable(),e.save=function(){for(var t={version:"1.3.0",heroes:[]},o=0;10>o;o++){for(var s=e.heroes[o],i={hero:s.selectedHero().heroName,level:s.selectedHeroLevel(),items:[],abilities:[],skillPointHistory:s.skillPointHistory(),buffs:[],itemBuffs:[],debuffs:[],itemDebuffs:[],graphData:[],enemyIndex:s.enemy().index(),heroCompareIndex:s.heroCompare().index()},n=0;n<s.inventory.items().length;n++)i.items.push(a.toJS(s.inventory.items()[n]));for(var n=0;n<s.ability().abilities().length;n++)i.abilities.push({level:s.ability().abilities()[n].level(),isActive:s.ability().abilities()[n].isActive()});for(var n=0;n<s.buffs.buffs().length;n++)i.buffs.push({name:s.buffs.buffs()[n].name,level:s.buffs.buffs()[n].data.level(),isActive:s.buffs.buffs()[n].data.isActive()});for(var n=0;n<s.debuffs.buffs().length;n++)i.debuffs.push({name:s.debuffs.buffs()[n].name,level:s.debuffs.buffs()[n].data.level(),isActive:s.debuffs.buffs()[n].data.isActive()});for(var n=0;n<s.buffs.itemBuffs.items().length;n++)i.itemBuffs.push(a.toJS(s.buffs.itemBuffs.items()[n]));for(var n=0;n<s.debuffs.itemBuffs.items().length;n++)i.itemDebuffs.push(a.toJS(s.debuffs.itemBuffs.items()[n]));i.graphData=a.toJS(s.buildExplorer.graphData),t.heroes.push(i)}var l=JSON.stringify(t);r.ajax({type:"POST",url:"save.php",data:{data:l},dataType:"json",success:function(t){e.saveLink("http://devilesk.com/dota2/apps/hero-calculator?id="+t.file)},failure:function(e){alert("Save request failed.")}})},e.load=function(t){for(var o=0;o<t.heroes.length;o++){var r=e.heroes[o];if(r.selectedHero(s.prototype.findWhere(r.availableHeroes(),{heroName:t.heroes[o].hero})),r.selectedHeroLevel(t.heroes[o].level),r.inventory.items.removeAll(),r.inventory.activeItems.removeAll(),t.heroes[o].hasOwnProperty("heroCompareIndex")){var i=r.availableCompare().filter(function(e){return e.hero.index()==t.heroes[o].heroCompareIndex});i.length&&(r.selectedCompare(i[0]),r.heroCompare(i[0].hero))}if(t.heroes[o].hasOwnProperty("enemyIndex")){var i=r.availableEnemies().filter(function(e){return e.hero.index()==t.heroes[o].enemyIndex});i.length&&(r.selectedEnemy(i[0]),r.enemy(i[0].hero))}for(var n=0;n<t.heroes[o].items.length;n++){var l=t.heroes[o].items[n],p={item:l.item,state:a.observable(l.state),size:l.size,enabled:a.observable(l.enabled)};r.inventory.items.push(p)}for(var n=0;n<t.heroes[o].abilities.length;n++)r.ability().abilities()[n].level(t.heroes[o].abilities[n].level),r.ability().abilities()[n].isActive(t.heroes[o].abilities[n].isActive);r.skillPointHistory(t.heroes[o].skillPointHistory);for(var n=0;n<t.heroes[o].buffs.length;n++){r.buffs.selectedBuff(s.prototype.findWhere(r.buffs.availableBuffs(),{buffName:t.heroes[o].buffs[n].name})),r.buffs.addBuff(r,{});var u=s.prototype.findWhere(r.buffs.buffs(),{name:t.heroes[o].buffs[n].name});u.data.level(t.heroes[o].buffs[n].level),u.data.isActive(t.heroes[o].buffs[n].isActive)}for(var n=0;n<t.heroes[o].debuffs.length;n++){r.debuffs.selectedBuff(s.prototype.findWhere(r.debuffs.availableDebuffs(),{buffName:t.heroes[o].debuffs[n].name})),r.debuffs.addBuff(r,{});var u=s.prototype.findWhere(r.debuffs.buffs(),{name:t.heroes[o].debuffs[n].name});u.data.level(t.heroes[o].debuffs[n].level),u.data.isActive(t.heroes[o].debuffs[n].isActive)}if(t.heroes[o].itemBuffs)for(var n=0;n<t.heroes[o].itemBuffs.length;n++){var l=t.heroes[o].itemBuffs[n],p={item:l.item,state:a.observable(l.state),size:l.size,enabled:a.observable(l.enabled)};r.buffs.itemBuffs.items.push(p)}if(t.heroes[o].itemDebuffs)for(var n=0;n<t.heroes[o].itemDebuffs.length;n++){var l=t.heroes[o].itemDebuffs[n],p={item:l.item,state:a.observable(l.state),size:l.size,enabled:a.observable(l.enabled)};r.debuffs.itemBuffs.items.push(p)}t.heroes[o].graphData&&r.buildExplorer.loadGraphData(t.heroes[o].graphData)}},e.sendReport=function(){r("#BugReportFormText").val()?(r.post("report.php",{name:r("#BugReportFormName").val(),email:r("#BugReportFormEmail").val(),body:r("#BugReportFormText").val()}).done(function(e){"Success"==e?(alert("Report successfully sent. Thanks!"),r("#BugReportFormText").val("")):alert("Failed to send report. Try again later or email admin@devilesk.com")}),r("#myModal").modal("hide")):alert("Message is required.")},e.getProperty=function(e,t){for(var o=e,a=0;a<t.length;a++)o=o[t[a]];return o},e.getDiffTextWrapper=function(t,o){return e.getDiffText(e.getDiffMagnitude(t,o))},e.getDiffMagnitude=function(t,o){var a=o.split(".");return e.getProperty(t.damageTotalInfo(),a).toFixed(2)-e.getProperty(t.heroCompare().damageTotalInfo(),a).toFixed(2)},e.getDiffText=function(e){return e>0?"+"+parseFloat(e.toFixed(2)):0>e?"&minus;"+parseFloat(-1*e.toFixed(2)).toString():""},e.highlightedTabInternal=a.observable(""),e.highlightedTab=a.computed(function(){return e.highlightedTabInternal()}).extend({throttle:100}),e.highlightTab=function(t){e.highlightedTabInternal(t)},e.unhighlightTab=function(t){e.highlightedTabInternal("")}},s.prototype.heroCalculator={},s.prototype.theme=a.observable(r("#theme-select").val()),s.prototype.init=function(e,t,o){r.when(r.get("templates.html",function(e){r("body").append('<div style="display:none">'+e+"</div>")}),r.getJSON(e,function(e){s.prototype.heroData=e,s.prototype.heroData.npc_dota_hero_chen.abilities[2].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_nevermore.abilities[1].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_nevermore.abilities[2].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_morphling.abilities[3].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_ogre_magi.abilities[3].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_techies.abilities[4].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE"),s.prototype.heroData.npc_dota_hero_beastmaster.abilities[2].behavior.push("DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE");var t=s.prototype.heroData.npc_dota_hero_lone_druid.abilities[3].behavior.indexOf("DOTA_ABILITY_BEHAVIOR_HIDDEN");s.prototype.heroData.npc_dota_hero_lone_druid.abilities[3].behavior.splice(t,1),t=s.prototype.heroData.npc_dota_hero_abaddon.abilities[2].behavior.indexOf("DOTA_ABILITY_BEHAVIOR_PASSIVE"),s.prototype.heroData.npc_dota_hero_abaddon.abilities[2].behavior.splice(t,1),t=s.prototype.heroData.npc_dota_hero_riki.abilities[2].behavior.indexOf("DOTA_ABILITY_BEHAVIOR_PASSIVE"),s.prototype.heroData.npc_dota_hero_riki.abilities[2].behavior.splice(t,1);for(var o in s.prototype.heroData)s.prototype.HeroOptions.push(new s.prototype.HeroOption(o.replace("npc_dota_hero_",""),s.prototype.heroData[o].displayname))}),r.getJSON(t,function(e){s.prototype.itemData=e}),r.getJSON(o,function(e){s.prototype.unitData=e})).done(function(e,t,o,a){s.prototype.run()})},s.prototype.run=function(){s.prototype.heroCalculator=new s.prototype.HeroCalculatorViewModel,a.applyBindings(s.prototype.heroCalculator),r("#theme-select").change(function(){s.prototype.theme(r(this).val())}),r("#spinner").hide(),r(".initial-hidden").css("display","inline-block"),r("#popHero0").addClass("active"),r("#heroPane0").addClass("active"),r('[data-toggle="tooltip"]').tooltip();var e=s.prototype.getParameterByName("id");e&&r.get("save/"+e+".json",function(e){s.prototype.heroCalculator.load(e)})},s.prototype.inventoryClipBoard={items:[],activeItems:[]},s.prototype.getParameterByName=function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),o=t.exec(location.search);return null==o?"":decodeURIComponent(o[1].replace(/\+/g," "))}});