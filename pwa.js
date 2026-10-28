(() => {
  // The separately generated HTML file already embeds everything it needs.
  if (location.protocol === 'file:') return;
  const supported = 'serviceWorker' in navigator && window.isSecureContext;
  const language = () => document.getElementById('language')?.value || (document.documentElement.lang.startsWith('zh')?'zh':'en');
  const say = (zh,en) => language()==='zh'?zh:en;
  const busy = () => !!window.arrowFlowIsTraining?.();
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  let registration=null,ready=false,preparing=supported,failed=false,installPrompt=null,requestedUpdate=false,reloading=false,version='',checking=false,notice='';
  const entry=document.createElement('button');entry.type='button';entry.className='pwa-entry';
  entry.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span></span>';
  const host=document.querySelector('.home-links')||document.querySelector('footer.wrap>div');
  if(!host)return;
  host.append(entry);
  const dialog=document.createElement('dialog');dialog.className='pwa-dialog';dialog.setAttribute('aria-labelledby','pwa-title');
  dialog.innerHTML='<header><div><span class="pwa-kicker">ARROW FLOW / OFFLINE</span><h2 id="pwa-title"></h2></div><button type="button" class="pwa-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="pwa-body"><div class="pwa-status-row"><span class="pwa-status-dot"></span><span class="pwa-status-text" role="status"></span></div><p id="pwa-status-detail"></p><div class="pwa-actions"><button type="button" class="pwa-action" id="pwa-check"></button></div><div class="pwa-update-block" hidden><h3 id="pwa-update-title"></h3><p id="pwa-update-note"></p><button type="button" class="pwa-action primary" id="pwa-update"></button></div><div class="pwa-install-block"><h3 id="pwa-install-title"></h3><ol class="pwa-install-steps" id="pwa-primary-steps"></ol><details class="pwa-safari-help" id="pwa-safari-help" hidden><summary><span id="pwa-safari-label"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg></summary><ol class="pwa-install-steps" id="pwa-safari-steps"></ol></details><button type="button" class="pwa-action primary" id="pwa-install" hidden></button></div><p class="pwa-small" id="pwa-footnote"></p><p class="pwa-small" id="pwa-notice" role="status" hidden></p></div>';
  document.body.append(dialog);
  const $=id=>document.getElementById(id);
  function safariSteps(){
    return [
      {icon:'safari',text:say('在 Safari 中打开训练页。','Open the training page in Safari.')},
      {icon:'share',text:say('轻点“分享”图标：方框中向上的箭头。','Tap Share: the square with an upward arrow.')},
      {icon:'home',text:say('在分享菜单中选择“添加到主屏幕”；可能需要向下滚动。','Choose “Add to Home Screen” in the share menu; you may need to scroll down.')},
      {icon:'check',text:say('如出现“作为 Web App 打开”，保持开启，然后轻点“添加”。','If “Open as Web App” appears, leave it on, then tap Add.')}
    ];
  }
  function drawSteps(list,steps){
    const icons={
      safari:'<circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-3 6-6 3 3-6zM12 3v2M21 12h-2M12 21v-2M3 12h2"/>',
      share:'<path d="M8 8H5v13h14V8h-3M12 15V2m-4 4 4-4 4 4"/>',
      home:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M12 7.5v9M7.5 12h9"/>',
      check:'<path d="m5 12 4.5 4.5L19 7"/>'
    };
    list.replaceChildren();
    for(const step of steps){
      const li=document.createElement('li');
      if(typeof step==='string'){li.textContent=step;}
      else{
        const content=document.createElement('span');content.className='pwa-step-content';
        const drawing=document.createElementNS('http://www.w3.org/2000/svg','svg');
        for(const [name,value] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'}))drawing.setAttribute(name,value);
        drawing.dataset.installIcon=step.icon;drawing.innerHTML=icons[step.icon];
        const text=document.createElement('span');text.textContent=step.text;content.append(drawing,text);li.append(content);
      }
      list.append(li);
    }
  }
  function render(){
    const waiting=!!registration?.waiting;
    const label=!supported?say('安装与离线','Install & offline'):waiting?say('有可用更新','Update available'):ready?(navigator.onLine?say('离线已就绪','Offline ready'):say('正在离线使用','Using offline')):preparing?say('正在准备离线','Preparing offline'):say('安装与离线','Install & offline');
    entry.querySelector('span').textContent=label;entry.setAttribute('aria-label',label+' · '+say('查看安装与离线状态','View installation and offline status'));
    $('pwa-title').textContent=say('安装与离线','Install & offline');
    dialog.querySelector('.pwa-close').setAttribute('aria-label',say('关闭','Close'));
    dialog.querySelector('.pwa-status-dot').classList.toggle('ready',ready);
    dialog.querySelector('.pwa-status-text').textContent=!supported?say('此窗口无法准备离线缓存','Offline caching unavailable in this window'):ready?(navigator.onLine?say('离线资源已准备好','Ready to use offline'):say('离线模式可用','Available offline')):preparing?say('正在保存离线资源…','Saving offline resources…'):failed?say('离线资源尚未准备好','Offline resources not ready'):say('等待离线资源准备','Waiting for offline preparation');
    $('pwa-status-detail').textContent=ready?say('训练、提示音、字体和本页说明已保存。断网后也可以打开并完成练习。','Training, cue sounds, fonts and the guide are saved. You can open and complete a session without a connection.'):supported?say('首次准备需要网络。保持此页打开，直到显示“离线资源已准备好”。','An internet connection is needed the first time. Keep this page open until it says “Ready to use offline”.'):say('请使用 Safari、Chrome 或 Edge 的普通浏览窗口，通过 HTTPS 打开线上版本。单独的离线 HTML 文件无需安装。','Open the hosted HTTPS version in a regular Safari, Chrome or Edge window. The separate offline HTML file needs no installation.');
    $('pwa-check').textContent=checking?say('正在检查…','Checking…'):ready?say('检查更新与离线资源','Check updates & offline files'):say('重新准备离线资源','Prepare offline files');
    $('pwa-check').disabled=!supported||checking;
    dialog.querySelector('.pwa-update-block').hidden=!waiting;
    $('pwa-update-title').textContent=say('新版已准备好','A new version is ready');
    $('pwa-update-note').textContent=busy()?say('先完成或结束当前练习，再应用更新。','Finish or end your current session before updating.'):say('更新会重新打开此页，并保留已保存的设置。其他窗口不会自动刷新。','Updating reopens this page and keeps saved settings. Other windows will not reload automatically.');
    $('pwa-update').textContent=busy()?say('练习结束后可更新','Available after the session'):say('更新并重新打开','Update & reopen');
    $('pwa-update').disabled=busy()||requestedUpdate;
    $('pwa-install-title').textContent=standalone()?say('已作为独立应用打开','Opened as a standalone app'):say('添加到主屏幕','Add to your Home Screen');
    const steps=standalone()?[say('以后从主屏幕图标打开，即可进入训练。','Use the Home Screen icon to return directly to training.')]:ios?safariSteps():installPrompt?[say('点击下方按钮，并按浏览器提示安装。','Use the button below and follow the browser’s installation prompt.')]:[say('打开训练页，在浏览器菜单中选择“安装应用”或“添加到主屏幕”（名称因浏览器而异）。','Open the training page, then use “Install app” or “Add to Home Screen” in your browser menu; wording varies.')];
    drawSteps($('pwa-primary-steps'),steps);
    $('pwa-safari-help').hidden=standalone()||ios;
    $('pwa-safari-label').textContent=say('Safari 安装步骤 · iPhone / iPad','Safari steps · iPhone / iPad');
    drawSteps($('pwa-safari-steps'),safariSteps());
    $('pwa-install').hidden=standalone()||!installPrompt;$('pwa-install').textContent=say('安装 Arrow Flow','Install Arrow Flow');
    $('pwa-footnote').textContent=say('首次联网准备后才可离线使用。清除网站数据或系统回收缓存后，需要重新准备；主屏幕应用可能需要单独首次联网。设置保存在当前浏览器或主屏幕应用中，外部研究论文仍需网络。','Prepare once online before using offline. Clearing site data or system cache eviction requires preparation again; a Home Screen app may need its own first online launch. Settings are saved in the current browser or Home Screen app. External research articles require internet access.')+(version?' · '+version.slice(0,8):'');
    $('pwa-notice').hidden=!notice;$('pwa-notice').textContent=notice;
  }
  function ask(worker,type,timeout=5000){
    return new Promise((resolve,reject)=>{
      if(!worker)return reject(new Error('No worker'));
      const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();reject(new Error('Worker timeout'));},timeout);
      channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data);};
      worker.postMessage({type},[channel.port2]);
    });
  }
  async function checkCache(){
    try{const status=await ask(navigator.serviceWorker.controller||registration?.active,'OFFLINE_STATUS');ready=status.ready;version=status.version||'';preparing=false;failed=!ready;}
    catch{if(!preparing){ready=false;failed=true;}}
    render();
  }
  function watchInstalling(worker){
    if(!worker)return;
    worker.addEventListener('statechange',()=>{
      if(worker.state==='installed'){if(registration?.waiting&&navigator.serviceWorker.controller){preparing=false;render();}else checkCache();}
      if(worker.state==='activated')checkCache();
      if(worker.state==='redundant'){preparing=false;failed=!ready;render();}
    });
  }
  async function register(){
    if(!supported)return;
    try{
      registration=await navigator.serviceWorker.register(new URL('./sw.js',location.href),{scope:'./',updateViaCache:'none'});
      registration.addEventListener('updatefound',()=>watchInstalling(registration.installing));
      watchInstalling(registration.installing);
      if(registration.active){preparing=false;await checkCache();}else render();
    }catch{preparing=false;failed=true;render();}
  }
  entry.addEventListener('click',()=>{render();dialog.showModal();if(supported)checkCache();});
  dialog.querySelector('.pwa-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  $('pwa-check').addEventListener('click',async()=>{
    if(checking)return;checking=true;notice='';render();
    try{
      if(!registration)await register();
      await registration?.update();
      await checkCache();
      if(!ready&&registration?.active){const result=await ask(registration.active,'REPAIR_OFFLINE',25000);if(!result.ready)throw new Error('Repair failed');await checkCache();}
      notice=ready?say('离线资源检查通过。若有新版，下载完成后会出现更新按钮。','Offline files checked. If a new version is available, an update button appears after download.'):say('请保持联网，等待资源准备完成。','Stay online while resources finish preparing.');
    }catch{notice=ready?say('已有离线资源可用，当前无法检查网络更新。','Saved offline files remain available. Network updates could not be checked.'):say('尚未完成准备，请联网后重试。','Preparation is incomplete. Connect to the internet and try again.');preparing=false;failed=!ready;}
    finally{checking=false;render();}
  });
  $('pwa-update').addEventListener('click',()=>{
    if(busy()||!registration?.waiting)return;
    requestedUpdate=true;render();registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});
    setTimeout(()=>{if(!reloading){requestedUpdate=false;notice=say('更新尚未完成，请重试。','Update has not completed. Please try again.');render();}},12000);
  });
  if(supported)navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(requestedUpdate&&!busy()&&!reloading){reloading=true;location.reload();return;}
    // First install or another tab's update: keep the current training document intact.
    preparing=false;checkCache();
  });
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;render();});
  $('pwa-install').addEventListener('click',async()=>{const prompt=installPrompt;if(!prompt)return;try{await prompt.prompt();await prompt.userChoice;}finally{installPrompt=null;render();}});
  window.addEventListener('appinstalled',()=>{installPrompt=null;render();});
  window.addEventListener('online',()=>{render();if(!busy())registration?.update().catch(()=>{});});
  window.addEventListener('offline',render);
  document.addEventListener('languagechange',render);document.addEventListener('landinglanguagechange',render);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkCache();if(!busy())registration?.update().catch(()=>{});}});
  const stage=document.getElementById('stage');let lastBusy=busy();
  if(stage)new MutationObserver(()=>{const active=busy();if(active!==lastBusy){lastBusy=active;render();}}).observe(stage,{attributes:true,attributeFilter:['class']});
  matchMedia('(display-mode: standalone)').addEventListener?.('change',render);
  render();register();
})();
