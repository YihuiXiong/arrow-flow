// Illustrative, deterministic examples; this is separate from the training runtime.
(() => {
  const $ = id => document.getElementById(id);
  const lang = () => document.documentElement.lang === 'zh' ? 'zh' : 'en';
  const say = (en, zh) => lang() === 'zh' ? zh : en;
  const ns = 'http://www.w3.org/2000/svg';
  const positions = [[100,65],[50,190],[330,65],[370,190],[210,30]];
  const examples = {
    direction: [
      {angle:0, x:330,y:65, en:'Move to your front right',zh:'向自己的右前方移动'},
      {angle:225,x:65,y:190,en:'Move to your left',zh:'向自己的左侧移动'},
      {angle:45,x:355,y:190,en:'Move to your right',zh:'向自己的右侧移动'},
      {angle:315,x:210,y:45,en:'Move forward',zh:'向前移动'}
    ],
    target: [
      {number:3,color:'#16816b',en:'Touch target 3, then recover',zh:'到 3 号触碰，再回位',colorEn:'Green',colorZh:'绿色'},
      {number:1,color:'#245fbd',en:'Shadow a stroke at target 1',zh:'到 1 号做无球挥拍',colorEn:'Blue',colorZh:'蓝色'},
      {number:2,color:'#16816b',en:'Touch target 2, then recover',zh:'到 2 号触碰，再回位',colorEn:'Green',colorZh:'绿色'},
      {number:3,color:'#245fbd',en:'Shadow a stroke at target 3',zh:'到 3 号做无球挥拍',colorEn:'Blue',colorZh:'蓝色'}
    ],
    repeat: [
      {number:2,color:'#16816b',en:'Go to target 2',zh:'前往 2 号目标'},
      {number:4,color:'#245fbd',en:'Go to target 4',zh:'前往 4 号目标'},
      {number:4,color:'#d83842',hold:true,en:'Stay at base. Shadow one stroke.',zh:'留在起点，做一次无球挥拍。'},
      {number:1,color:'#16816b',en:'Go to target 1',zh:'前往 1 号目标'}
    ]
  };
  let drill = 'direction', step = 0, timer = null, timing = 'fixed';
  const player = $('demo-player');
  const route = $('demo-route');
  const playButton = $('demo-play');
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playButton.setAttribute('aria-pressed','false');
    playButton.querySelector('span').textContent = say('Play demo','播放演示');
    playButton.querySelector('svg path').setAttribute('d','m9 5 10 7-10 7z');
  }
  function svgNode(tag, attrs) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key,value]) => el.setAttribute(key,value));
    return el;
  }
  function render(announce = false) {
    const cue = examples[drill][step];
    const directional = drill === 'direction';
    const hold = !!cue.hold;
    const [x,y] = directional ? [cue.x,cue.y] : hold ? [210,190] : positions[cue.number-1];
    $('walk-arrow').toggleAttribute('hidden',!directional);
    $('walk-number').toggleAttribute('hidden',directional);
    $('walk-arrow').style.transform = `rotate(${cue.angle || 0}deg)`;
    $('walk-number').textContent = cue.number || '';
    $('drill-cue').style.background = directional ? '#c2ee78' : cue.color;
    $('drill-cue').style.color = directional ? '#17221b' : '#fff';
    $('demo-step').textContent = say('EXAMPLE','示例') + ` ${String(step+1).padStart(2,'0')} / 04`;
    $('demo-action').textContent = cue[lang()];
    const explanations = {
      direction: say('Read the arrow from your own perspective. Complete a familiar step or shadow stroke, then return to base.','以自己的视角读方向。完成熟悉的步法或无球挥拍，再回到起点。'),
      target: say(`${cue.colorEn} chooses the action. The number chooses the target. Recover before the next cue.`,`${cue.colorZh}决定动作，数字决定目标。完成动作并回位，再等下一条提示。`),
      repeat: hold ? say('4 follows 4. The repeat rule overrides the usual move. Ignore background color for this drill.','4 后面又是 4：重复规则优先，这次不去目标处。这个玩法只比较数字，忽略背景颜色。') : say('This number differs from the last one, or starts the set. Follow the normal target rule, then recover.','这条数字与上一条不同，或是本组第一条，按普通规则到目标处完成动作后回位。')
    };
    $('demo-explanation').textContent = explanations[drill];
    const rules = {
      direction: say('RULE · Arrow = direction. The floor plan is an example; adapt distances to your space.','规则 · 箭头决定方向。场地图仅为示例，距离可按空间调整。'),
      target: say('RULE · Number = target. Green = touch. Blue = shadow a stroke. The same number can ask for a different action.','规则 · 数字决定目标；绿色 = 触碰，蓝色 = 无球挥拍。同一个数字，也可能要求不同动作。'),
      repeat: say('RULE · Same number as the previous cue = stay and shadow. Reset memory each set. A third consecutive match triggers again.','规则 · 与上一条数字相同 = 留在起点挥拍。换组后重新记忆，第三次仍相同时也触发。')
    };
    $('demo-rule').textContent = rules[drill];
    $('base-label').textContent = say('BASE','起点');
    $('floor-title').textContent = say('Example movement layout','移动布局示例');
    $('floor-description').textContent = hold ? say('Stay at the center base for the repeated number.','数字重复时留在中央起点。') : say('Move from the center base to the highlighted target, then return.','从中央起点移向高亮目标，再回位。');
    const targets = $('floor-targets'); targets.replaceChildren();
    const locations = directional ? [[330,65],[65,190],[355,190],[210,45]] : positions;
    locations.forEach(([tx,ty],index) => {
      const active = !hold && x === tx && y === ty;
      const group = svgNode('g',{class:active?'floor-target active':'floor-target'});
      group.append(svgNode('circle',{cx:tx,cy:ty,r:directional?14:18}));
      if (!directional) { const text=svgNode('text',{x:tx,y:ty+5,'text-anchor':'middle'});text.textContent=index+1;group.append(text); }
      targets.append(group);
    });
    route.setAttribute('d',`M210 190 L${x} ${y}`);
    route.style.opacity = hold ? '0' : '1';
    player.style.setProperty('--move-x',`${x-210}px`);
    player.style.setProperty('--move-y',`${y-190}px`);
    player.classList.remove('moving','holding');
    // Restart only the example animation; reduced-motion CSS leaves a static marker.
    void player.getBoundingClientRect();
    player.classList.add(hold ? 'holding' : 'moving');
    $('demo-sequence').replaceChildren();
    examples[drill].forEach((item,index) => {
      const button = document.createElement('button');button.type='button';
      button.setAttribute('aria-label',say(`View example ${index+1}`,`查看示例 ${index+1}`));
      button.setAttribute('aria-current',index===step?'step':'false');
      if (directional) {
        const icon=svgNode('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','aria-hidden':'true'});
        icon.style.transform=`rotate(${item.angle}deg)`;
        icon.append(svgNode('path',{d:'M6 18 18 6M6 6h12v12'}));button.append(icon);
      } else button.textContent=item.number;
      button.addEventListener('click',()=>{stop();step=index;render(true);});
      $('demo-sequence').append(button);
    });
    if (announce) $('walk-status').textContent=cue[lang()]+'. '+explanations[drill];
    playButton.querySelector('span').textContent=timer?say('Pause demo','暂停演示'):say('Play demo','播放演示');
    $('timing-description').textContent = timing === 'fixed'
      ? say('Each blank wait is the same length. This diagram shows spacing, not a live timer.','每次空白等待的长度相同。这里展示的是间隔关系，不是运行中的计时器。')
      : say('Blank waits vary within your chosen range. This example uses a short, long and medium wait.','空白等待在你设定的范围内变化。此示例依次展示短、长和中等等待。');
    $('demo-next').setAttribute('aria-label',say('Show the next example cue','查看下一条示例提示'));
    document.querySelector('.drill-tabs').setAttribute('aria-label',say('Drill examples','玩法演示'));
    document.querySelector('.timing-switch').setAttribute('aria-label',say('Interval illustration','间隔示意'));
    $('demo-sequence').setAttribute('aria-label',say('Example cue sequence','提示序列示例'));
  }
  document.querySelectorAll('[data-drill]').forEach(button=>button.addEventListener('click',()=>{
    stop();drill=button.dataset.drill;step=0;
    document.querySelectorAll('[data-drill]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    render(true);
  }));
  $('demo-next').addEventListener('click',()=>{stop();step=(step+1)%4;render(true);});
  playButton.addEventListener('click',()=>{
    if(timer){stop();return;}
    timer=setInterval(()=>{step=(step+1)%4;render();},3200);
    playButton.setAttribute('aria-pressed','true');
    playButton.querySelector('svg path').setAttribute('d','M8 5v14M16 5v14');
    render();
  });
  document.querySelectorAll('[data-timing]').forEach(button=>button.addEventListener('click',()=>{
    timing=button.dataset.timing;
    document.querySelectorAll('[data-timing]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    $('timing-track').classList.toggle('random-timing',timing==='random');render();
  }));
  document.addEventListener('landinglanguagechange',()=>{$('walk-status').textContent='';render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();},{threshold:0}).observe(document.querySelector('.walkthrough'));
  render();
})();
