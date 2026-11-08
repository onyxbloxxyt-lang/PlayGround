const samples = [
  {id:'ember-fox',name:'Emberfox',type:'Creature',rarity:'Rare',emoji:'🦊',description:'A curious little fox with a tail that flickers like a campfire.',creator:'mossyboots',likes:248,color:'linear-gradient(135deg,#60452c,#a8663d)',style:'Cute & cozy'},
  {id:'moonblade',name:'Moonblade',type:'Item',rarity:'Legendary',emoji:'🗡️',description:'A silver blade forged from moonlight. It hums after dark.',creator:'pixelpanda',likes:192,color:'linear-gradient(135deg,#34466b,#6379a0)',style:'Dark fantasy'},
  {id:'mushroom-meadow',name:'Mushroom Meadow',type:'World',rarity:'Common',emoji:'🍄',description:'A peaceful new biome filled with giant mushrooms and tiny homes.',creator:'fernfriend',likes:167,color:'linear-gradient(135deg,#354d38,#607d4c)',style:'Pixel-perfect'},
  {id:'cloud-whale',name:'Cloudwhale',type:'Creature',rarity:'Legendary',emoji:'🐋',description:'A gentle sky giant that carries tiny gardens across the clouds.',creator:'cloudberry',likes:153,color:'linear-gradient(135deg,#3b6170,#5796a0)',style:'Bright & colorful'},
  {id:'sprout-boots',name:'Sprout Boots',type:'Item',rarity:'Rare',emoji:'🥾',description:'Every step plants a little patch of grass and clover.',creator:'blockbloom',likes:121,color:'linear-gradient(135deg,#4c5a35,#879254)',style:'Cute & cozy'},
  {id:'sunken-library',name:'Sunken Library',type:'World',rarity:'Rare',emoji:'📚',description:'Explore a forgotten underwater archive full of secrets.',creator:'deepblue',likes:98,color:'linear-gradient(135deg,#244957,#307880)',style:'Dark fantasy'},
  {id:'crystal-drake',name:'Crystal Drake',type:'Creature',rarity:'Epic',emoji:'🐉',description:'A cave guardian with shimmering scales and a very big heart.',creator:'gemstone',likes:86,color:'linear-gradient(135deg,#55407a,#a06ab0)',style:'Pixel-perfect'},
  {id:'starlight-lantern',name:'Starlight Lantern',type:'Item',rarity:'Rare',emoji:'🏮',description:'A pocket-sized night sky to brighten your next adventure.',creator:'nightjar',likes:77,color:'linear-gradient(135deg,#635336,#b38a4a)',style:'Bright & colorful'},
  {id:'mossy-hollow',name:'Mossy Hollow',type:'World',rarity:'Common',emoji:'🌿',description:'A cozy forest valley with winding trails and hidden nooks.',creator:'mossyboots',likes:64,color:'linear-gradient(135deg,#334b37,#628052)',style:'Cute & cozy'}
];
let creations = JSON.parse(localStorage.getItem('blocksmith-creations') || '[]');
let saved = JSON.parse(localStorage.getItem('blocksmith-saved') || '[]');
let selectedType = 'creature';
let selectedRarity = 'Common';
let currentAddon = null;
let activeFilter = 'All';
let toastTimer;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const allAddons = () => [...creations, ...samples];
const typeLabels = {creature:'Creature',item:'Item',world:'World'};
const icons = {creature:'🦊',item:'✦',world:'🌱'};
const colors = {creature:'linear-gradient(135deg,#394a30,#7c9150)',item:'linear-gradient(135deg,#55472d,#aa854b)',world:'linear-gradient(135deg,#31564c,#62916c)'};

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function esc(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderCards(target,items){
  const box=$(target); if(!items.length){box.innerHTML='';return}
  box.innerHTML=items.map((a,i)=>`<article class="addon-card" data-id="${esc(a.id)}" tabindex="0" aria-label="${esc(a.name)} by ${esc(a.creator)}"><div class="card-art" style="background:${a.color||colors.creature}"><span class="art-tag">${esc(a.type.toUpperCase())}</span><button class="heart-button ${saved.includes(a.id)?'saved':''}" data-heart="${esc(a.id)}" aria-label="${saved.includes(a.id)?'Unsave':'Save'} ${esc(a.name)}">${saved.includes(a.id)?'♥':'♡'}</button><span class="art-emoji">${a.emoji||'✦'}</span></div><div class="card-info"><div class="card-title-row"><strong>${esc(a.name)}</strong><span class="like-count">♥ ${Number(a.likes)||0}</span></div><p class="card-description">${esc(a.description)}</p><div class="card-meta"><span class="creator"><span class="creator-avatar">${esc((a.creator||'B')[0].toUpperCase())}</span>@${esc(a.creator||'builder')}</span><span>${esc(a.rarity||'Common')}</span></div></div></article>`).join('');
}
function updateCards(){
  renderCards('#featured-grid',allAddons().slice(0,3));
  let items=allAddons();const q=($('#search-input')?.value||'').trim().toLowerCase();
  if(activeFilter!=='All')items=items.filter(a=>a.type.toLowerCase()===activeFilter.toLowerCase());
  if(q)items=items.filter(a=>`${a.name} ${a.description} ${a.creator} ${a.type}`.toLowerCase().includes(q));
  if($('#sort-select')?.value==='newest')items=[...items].reverse();else items.sort((a,b)=>(b.likes||0)-(a.likes||0));
  renderCards('#explore-grid',items);
  const favorites=allAddons().filter(a=>saved.includes(a.id));renderCards('#saved-grid',favorites);
  $('#saved-empty').style.display=favorites.length?'none':'block';$('#saved-grid').style.display=favorites.length?'grid':'none';
  $('.saved-count').textContent=saved.length;
  $('#recent-list').innerHTML=creations.length?creations.slice(0,5).map(a=>`<div class="recent-item"><span class="recent-thumb">${a.emoji||'✦'}</span>${esc(a.name)}</div>`).join(''):'<div class="empty-recent">Your creations will<br>show up here.</div>';
}
function showView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#${name}-view`).classList.add('active');$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#top-title').textContent={create:'Create',explore:'Explore',saved:'Saved'}[name];window.scrollTo({top:0,behavior:'smooth'});if(name==='explore')updateCards()}
$$('.nav-link').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
$$('.type-card').forEach(b=>b.addEventListener('click',()=>{$$('.type-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedType=b.dataset.type;$('#idea').placeholder=({creature:'A tiny mossy fox that glows at night and leaves flowers wherever it walks...',item:'A sky-blue pickaxe that sings softly when it finds diamonds...',world:'A peaceful floating island with waterfalls and a village in the clouds...'})[selectedType]}));
$$('.rarity').forEach(b=>b.addEventListener('click',()=>{$$('.rarity').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedRarity=b.dataset.rarity}));
$$('.suggestion').forEach(b=>b.addEventListener('click',()=>{$('#idea').value=b.dataset.prompt;$('#idea').dispatchEvent(new Event('input'));$('#idea').focus()}));
$('#idea').addEventListener('input',e=>$('#char-count').textContent=e.target.value.length);
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;updateCards()}));
$('#search-input').addEventListener('input',updateCards);$('#sort-select').addEventListener('change',updateCards);
document.addEventListener('click',e=>{const heart=e.target.closest('[data-heart]');if(heart){e.stopPropagation();const id=heart.dataset.heart;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem('blocksmith-saved',JSON.stringify(saved));updateCards();toast(saved.includes(id)?'Saved to your collection':'Removed from saved');return}const card=e.target.closest('.addon-card');if(card)showCard(card.dataset.id)});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.addon-card')){e.preventDefault();showCard(e.target.dataset.id)}if(e.key==='Escape'){$$('.modal-backdrop').forEach(m=>m.classList.remove('show'))}});
function showCard(id){const a=allAddons().find(x=>x.id===id);if(a)toast(`${a.name} · ${a.type} by @${a.creator}`)}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,28)||'new_addon'}
function makeName(prompt,type){let raw=prompt.trim().replace(/[.!?].*$/,'').split(/\s+/).slice(0,4).join(' ');if(!raw)return ({creature:'New Creature',item:'New Item',world:'New World'})[type];return raw.charAt(0).toUpperCase()+raw.slice(1)}
function identifyIcon(prompt){const p=prompt.toLowerCase();if(/dragon|drake/.test(p))return '🐉';if(/fox/.test(p))return '🦊';if(/wolf/.test(p))return '🐺';if(/cat/.test(p))return '🐈';if(/sword|blade/.test(p))return '🗡️';if(/boot/.test(p))return '🥾';if(/book|library/.test(p))return '📚';if(/mushroom/.test(p))return '🍄';if(/whale/.test(p))return '🐋';if(/lantern/.test(p))return '🏮';return icons[selectedType]}
function createAddon(){const prompt=$('#idea').value.trim();if(!prompt){$('#idea').focus();toast('Add a little detail to your idea first');return}const name=makeName(prompt,selectedType);currentAddon={id:`mine-${Date.now()}`,name,type:typeLabels[selectedType],rarity:selectedRarity,emoji:identifyIcon(prompt),description:prompt,creator:'you',likes:0,color:colors[selectedType],style:$('#style').value,prompt};$('#result-name').textContent=name;$('#result-description').textContent=`Your ${selectedType} add-on is ready to join the adventure. We made a Bedrock starter pack from your idea.`;$('#result-type').textContent=`${typeLabels[selectedType].toUpperCase()} · ${selectedRarity.toUpperCase()}`;$('#result-style').textContent=`${$('#style').value} style`;$('#result-art').textContent=currentAddon.emoji;$('#result-art').style.background=colors[selectedType];$('#modal-backdrop').classList.add('show')}
$('#build-button').addEventListener('click',createAddon);
$('#modal-close').addEventListener('click',()=>$('#modal-backdrop').classList.remove('show'));
$('#modal-backdrop').addEventListener('click',e=>{if(e.target.id==='modal-backdrop')e.currentTarget.classList.remove('show')});
$('#share-button').addEventListener('click',()=>{if(!currentAddon)return;creations=[currentAddon,...creations.filter(x=>x.id!==currentAddon.id)];localStorage.setItem('blocksmith-creations',JSON.stringify(creations));updateCards();$('#modal-backdrop').classList.remove('show');toast('Your add-on is now on the community shelf!')});
$('#help-btn').addEventListener('click',()=>$('#help-backdrop').classList.add('show'));$('#help-close').addEventListener('click',()=>$('#help-backdrop').classList.remove('show'));$('#help-backdrop').addEventListener('click',e=>{if(e.target.id==='help-backdrop')e.currentTarget.classList.remove('show')});

// A tiny store-only ZIP writer keeps generated packs self-contained and dependency-free.
const encoder=new TextEncoder();
function crc32(bytes){let c=-1;for(let i=0;i<bytes.length;i++){c^=bytes[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^-1)>>>0}
function u16(n){return[n&255,(n>>>8)&255]}function u32(n){return[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function zip(files){let locals=[],centrals=[],offset=0;for(const [path,content] of Object.entries(files)){const name=encoder.encode(path),data=typeof content==='string'?encoder.encode(content):content,crc=crc32(data);const local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...name,...data]);locals.push(local);const central=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]);centrals.push(central);offset+=local.length}const centralLength=centrals.reduce((n,x)=>n+x.length,0),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralLength),...u32(offset),...u16(0)]);return new Blob([...locals,...centrals,end],{type:'application/zip'})}
function uuid(){return crypto.randomUUID?crypto.randomUUID():`${Date.now().toString(16)}-4${Math.random().toString(16).slice(2,5)}-a${Math.random().toString(16).slice(2,5)}-${Math.random().toString(16).slice(2,14)}`}
function makePack(addon){const id=slug(addon.name),identifier=`blocksmith:${id}`,bpHeader=uuid(),bpModule=uuid(),rpHeader=uuid(),rpModule=uuid();let behavior={};
  if(addon.type==='Creature')behavior[`entities/${id}.json`]={format_version:'1.20.50',['minecraft:entity']:{description:{identifier,is_spawnable:true,is_summonable:true,is_experimental:false,properties:{}},components:{'minecraft:type_family':{family:[id,'mob']},'minecraft:nameable':{},'minecraft:health':{value:20,max:20},'minecraft:collision_box':{width:0.8,height:1.2},'minecraft:movement':{value:0.25},'minecraft:navigation.walk':{can_path_over_water:true,avoid_water:false},'minecraft:movement.basic':{},'minecraft:jump.static':{},'minecraft:physics':{},'minecraft:pushable':{is_pushable:true,is_pushable_by_piston:true},'minecraft:behavior.float':{priority:0},'minecraft:behavior.random_stroll':{priority:6,speed_multiplier:1},'minecraft:behavior.look_at_player':{priority:7,look_distance:6,probability:0.02},'minecraft:behavior.random_look_around':{priority:8}}}};
  if(addon.type==='Item')behavior[`items/${id}.json`]={format_version:'1.20.50',['minecraft:item']:{description:{identifier,menu_category:{category:'equipment'}},components:{'minecraft:display_name':{value:addon.name},'minecraft:icon':{texture:'diamond_sword'},'minecraft:max_stack_size':1,'minecraft:hand_equipped':true,'minecraft:damage':addon.rarity==='Legendary'?12:addon.rarity==='Rare'?9:6,'minecraft:allow_off_hand':true}}};
  if(addon.type==='World')behavior[`blocks/${id}.json`]={format_version:'1.20.50',['minecraft:block']:{description:{identifier,menu_category:{category:'nature'}},components:{'minecraft:destructible_by_mining':{seconds_to_destroy:1},'minecraft:destructible_by_explosion':{explosion_resistance:1},'minecraft:friction':0.6,'minecraft:map_color':'#78935a','minecraft:light_emission':addon.rarity==='Legendary'?8:2}}};
  const bp={format_version:2,header:{name:addon.name+' Behavior Pack',description:`A Blocksmith ${addon.type.toLowerCase()} add-on · ${addon.prompt}`,uuid:bpHeader,version:[1,0,0],min_engine_version:[1,20,50]},modules:[{type:'data',uuid:bpModule,version:[1,0,0]}]};const rp={format_version:2,header:{name:addon.name+' Resource Pack',description:`Resource pack companion for ${addon.name}.`,uuid:rpHeader,version:[1,0,0],min_engine_version:[1,20,50]},modules:[{type:'resources',uuid:rpModule,version:[1,0,0]}]};
  const deps=[{uuid:rpHeader,version:[1,0,0]}];bp.dependencies=deps;
  const readme=`${addon.name}\nGenerated with Blocksmith AI Add-on Studio\n\nIdea: ${addon.prompt}\nType: ${addon.type}\nRarity: ${addon.rarity}\nStyle: ${addon.style}\n\nImport this .mcaddon file into Minecraft Bedrock Edition. This starter pack provides an editable add-on definition; custom art and advanced behaviors can be added in the pack files.`;
  // Minecraft .mcaddon is a ZIP of the behavior and resource pack folders.
  const structured={};
  structured[`${id}_behavior/manifest.json`]=JSON.stringify(bp,null,2);
  structured[`${id}_resources/manifest.json`]=JSON.stringify(rp,null,2);
  structured[`${id}_behavior/README.txt`]=readme;
  for(const [path,obj] of Object.entries(behavior))structured[`${id}_behavior/${path}`]=JSON.stringify(obj,null,2);
  return zip(structured)
}
$('#download-button').addEventListener('click',()=>{if(!currentAddon)return;const blob=makePack(currentAddon),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${slug(currentAddon.name)}.mcaddon`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);toast('Your .mcaddon download is ready!')});
updateCards();