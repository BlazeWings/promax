/* app.js — 完整版
   功能：
   - IndexedDB 存储（words store）
   - SM-2 改进 SRS（difficultyFactor）
   - Web Speech API 发音
   - Kimi API wrapper（你提供的 Base + Key）
   - CSV 导入
   - 复习队列 + 困难箱（Leitner 风格）
   - Tampermonkey 划词保存（postMessage）接收
   - Chart.js 趋势图（简单占位）
*/

/* 配置：请在生产中不要把 key 放前端，此处仅演示 */
const CONFIG = {
  KIMI_BASE: 'https://api.moonshot.cn/v1',
  API_KEY: 'sk-QyGX8xsz9qqSTcVQeCQNIWEmha3rnf2cldKS1rteEMLDoYwI',
  MODEL: 'moonshot-v1-8k'
};

/* ---------------- IndexedDB 简单包装 ---------------- */
const DB = (function(){
  const DB_NAME = 'ai_english_db_v1';
  const STORE = 'words';
  let db = null;
  function open(){
    return new Promise((res, rej) => {
      if(db) return res(db);
      const r = indexedDB.open(DB_NAME,1);
      r.onupgradeneeded = e => {
        const idb = e.target.result;
        const s = idb.createObjectStore(STORE,{keyPath:'word'});
        s.createIndex('nextReview','nextReview',{unique:false});
      };
      r.onsuccess = e => { db = e.target.result; res(db); };
      r.onerror = e => rej(e.target.error);
    });
  }
  async function put(item){ const d = await open(); return new Promise((res,rej)=>{ const tx=d.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(item); tx.oncomplete=()=>res(true); tx.onerror=(ev)=>rej(ev); }); }
  async function getAll(){ const d=await open(); return new Promise((res,rej)=>{ const tx=d.transaction(STORE,'readonly'); const req=tx.objectStore(STORE).getAll(); req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error); }); }
  async function get(word){ const d=await open(); return new Promise((res,rej)=>{ const tx=d.transaction(STORE,'readonly'); const req=tx.objectStore(STORE).get(word); req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error); }); }
  async function remove(word){ const d=await open(); return new Promise((res,rej)=>{ const tx=d.transaction(STORE,'readwrite'); const req=tx.objectStore(STORE).delete(word); tx.oncomplete=()=>res(true); tx.onerror=()=>rej(false); }); }
  return {put,getAll,get,remove};
})();

/* ---------------- SRS: SM-2 变体 ---------------- */
/* 计算 nextReview（ISO 字符串）：以天为单位 */
function calculateNextReviewSM2(reviewCount, difficultyFactor=1.0){
  if(reviewCount <= 0) return daysFromNow(1);
  const base = Math.pow(2.5, Math.max(0, reviewCount-1));
  // 使用浮点 base * difficultyFactor 作为天数（至少 1 天）
  const days = Math.max(1, Math.round(base * difficultyFactor));
  return daysFromNow(days);
}
function daysFromNow(n){
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

/* ---------------- CSV 解析（简化） ---------------- */
/* 预期行格式：单词,音标,释义,例句,分类,难度 */
function parseCSV(text){
  const rows = text.split(/\r?\n/).map(r=>r.trim()).filter(r=>r);
  return rows.map(r=>{
    // 分割时允许句子中包含逗号的简单处理：这里只做最基本的 split(',')
    const cols = r.split(',').map(c=>c.trim());
    return {
      word: cols[0]||'',
      pronunciation: cols[1]||'',
      meaning: cols[2]||'',
      example: cols[3]||'',
      category: cols[4]||'daily',
      difficulty: (cols[5]||'medium')
    };
  });
}

/* ---------------- Web Speech API ---------------- */
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.95;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

/* ---------------- Kimi API wrapper ---------------- */
async function callKimi(messages, max_tokens=1200){
  const url = CONFIG.KIMI_BASE + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + CONFIG.API_KEY
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      messages,
      temperature: 0.7,
      max_tokens
    })
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error('Kimi API error ' + res.status + ' / ' + txt);
  }
  const d = await res.json();
  return d.choices?.[0]?.message?.content || JSON.stringify(d);
}

/* ---------------- 应用主类 ---------------- */
class App {
  constructor(){
    this.dailyWords = []; // 当前组单词（对象数组）
    this.reviewQueue = [];
    this.stats = {learned:0,today:0};
    this.goal = Number(localStorage.getItem('dailyGoal')||10);
    this.trendData = []; // 用于 Chart.js
    this.init();
  }

  async init(){
    window.app = this; // 全局暴露
    this.loadUI();
    await this.refreshWordList();
    this.updateStatsUI();
    this.initChart();
    this.setupMessageListener(); // Tampermonkey postMessage 接收
  }

  loadUI(){
    document.getElementById('goal-input').value = this.goal;
  }

  /* ---------------- 单词库 ---------------- */
  async refreshWordList(){
    const items = await DB.getAll();
    const listEl = document.getElementById('word-list');
    listEl.innerHTML = items.length ? items.map(it=>`
      <div class="word-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${it.word}</strong> <span class="small">${it.pronunciation||''}</span>
            <div class="small">${it.meaning||''} · ${it.category||''} · ${it.difficulty||''}</div>
            <div class="small">下次复习：${it.nextReview ? new Date(it.nextReview).toLocaleString() : '—'}</div>
          </div>
          <div style="text-align:right">
            <div class="small">复习次数：${it.reviewCount||0}</div>
            <button class="btn" onclick="app.speakWord('${it.word}')">🔊 发音</button>
            <button class="btn secondary" onclick="app.deleteWord('${it.word}')">删除</button>
          </div>
        </div>
      </div>
    `).join('') : '<div class="small">单词库为空</div>';
    // 更新统计
    document.getElementById('stat-learned').textContent = items.length;
    // 更新待复习计数
    const now = new Date();
    const due = items.filter(it=> new Date(it.nextReview || 0) <= now).length;
    document.getElementById('stat-due').textContent = due;
  }

  async deleteWord(word){
    if(!confirm(`确认删除 ${word} 吗？`)) return;
    await DB.remove(word);
    await this.refreshWordList();
  }

  filterLibrary(){
    const q = document.getElementById('search-box').value.trim().toLowerCase();
    DB.getAll().then(items=>{
      const filtered = items.filter(it=>
        it.word.toLowerCase().includes(q) ||
        (it.meaning||'').toLowerCase().includes(q)
      );
      const listEl = document.getElementById('word-list');
      listEl.innerHTML = filtered.length ? filtered.map(it=>`
        <div class="word-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>${it.word}</strong> <span class="small">${it.pronunciation||''}</span>
              <div class="small">${it.meaning||''}</div>
            </div>
            <div style="text-align:right">
              <button class="btn" onclick="app.speakWord('${it.word}')">🔊</button>
            </div>
          </div>
        </div>
      `).join('') : '<div class="small">无匹配结果</div>';
    });
  }

  /* ---------------- CSV 导入 ---------------- */
  async importCSV(){
    const f = document.getElementById('csv-file').files[0];
    if(!f) return alert('请选择 CSV 文件');
    const txt = await f.text();
    const rows = parseCSV(txt);
    let count=0;
    for(const r of rows){
      const payload = {
        word: r.word,
        pronunciation: r.pronunciation || '',
        meaning: r.meaning || '',
        example: r.example || '',
        category: r.category || 'daily',
        difficulty: r.difficulty || 'medium',
        reviewCount: 0,
        difficultyFactor: 1.0,
        nextReview: new Date().toISOString()
      };
      await DB.put(payload);
      count++;
    }
    document.getElementById('import-result').textContent = `已导入 ${count} 条`;
    await this.refreshWordList();
  }

  /* ---------------- 分组学习 ---------------- */
  async generateDailyWords(){
    document.getElementById('daily-info').textContent = '生成中…';
    try {
      // 尝试用 Kimi 给出推荐（容错）
      const learned = (await DB.getAll()).map(x=>x.word).slice(-200);
      const sys = {role:'system', content:'你是英语学习推荐助手。返回 JSON 数组格式：{"words":["word1","word2",..."]'}};
      const user = {role:'user', content:`为用户推荐 10 个英语单词，避免已学过的单词。已学单词：${learned.join(',')}. 请直接返回 JSON，字段名为 words（数组）。`};
      const res = await callKimi([sys, user], 600);
      let words = [];
      try{
        const json = JSON.parse(res);
        if(Array.isArray(json.words)) words = json.words.slice(0,10);
      }catch(e){
        // 回退：随机取 DB 中未掌握单词
        const pool = (await DB.getAll()).filter(x=>!x.mastered);
        words = pool.slice(0,10).map(x=>x.word);
      }

      // 填充 dailyWords（查询 DB 以获取 metadata）
      this.dailyWords = [];
      for(const w of words){
        const meta = await DB.get(w) || {word:w, pronunciation:'', meaning:'', example:'', category:'daily', difficulty:'medium', reviewCount:0, difficultyFactor:1.0};
        this.dailyWords.push(meta);
      }
      this.renderDaily();
    } catch(e){
      console.warn('generateDailyWords error', e);
      // 回退：从 DB 里取前 10 个
      const pool = await DB.getAll();
      this.dailyWords = pool.slice(0,10);
      this.renderDaily();
    }
  }

  nextGroup(){
    // 简单切换：把 dailyWords 后移（如果有更多），否则提示
    // 这里为示例：重新生成
    this.generateDailyWords();
  }

  renderDaily(){
    const el = document.getElementById('daily-cards');
    el.innerHTML = this.dailyWords.map((w,i)=>`
      <div class="word-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${w.word}</strong> <span class="small">${w.pronunciation||''}</span>
            <div class="small">${w.meaning||''}</div>
          </div>
          <div style="text-align:right">
            <button class="btn" onclick="app.learn('${w.word}')">我认识 / 记住</button>
            <button class="btn secondary" onclick="app.speakWord('${w.word}')">🔊</button>
          </div>
        </div>
      </div>
    `).join('');
    document.getElementById('daily-info').textContent = `本组 ${this.dailyWords.length} 个`;
  }

  async learn(word){
    const item = await DB.get(word);
    const payload = item || {
      word, pronunciation:'', meaning:'', example:'', category:'daily', difficulty:'medium'
    };
    payload.learnedAt = new Date().toISOString();
    payload.reviewCount = payload.reviewCount || 0;
    payload.difficultyFactor = payload.difficultyFactor || 1.0;
    payload.nextReview = calculateNextReviewSM2(0, payload.difficultyFactor);
    await DB.put(payload);

    // 更新统计（简单计数）
    this.stats.learned++;
    this.stats.today++;
    this.updateStatsUI();
    await this.refreshWordList();
    alert(`已加入本地单词库：${word}`);
  }

  speakWord(w){ speak(w); }

  /* ---------------- AI 功能：词典 / 小说 / 对话 ---------------- */
  async quickDictionary(){
    const w = document.getElementById('dict-input').value.trim();
    if(!w) return alert('请输入单词');
    const out = document.getElementById('dict-result');
    out.style.display = 'block';
    out.textContent = '查询中...';
    try{
      const prompt = `请用中文解释单词 ${w}，包括词性、常见用法、1 个例句（英文 + 中文翻译），并列出同义词和反义词。请简洁格式化输出。`;
      const res = await callKimi([{role:'user',content:prompt}], 600);
      out.textContent = res;
    } catch(e){
      out.textContent = '查询失败：' + e.message;
    }
  }

  async generateStory(){
    const todays = this.dailyWords.map(w=>w.word).slice(0,10);
    if(todays.length===0) return alert('今天还没有单词');
    const out = document.getElementById('story');
    out.style.display = 'block';
    out.textContent = '生成中...';
    const prompt = `你是一名英语教育专家。请根据以下单词列表创作一段约200字的趣味短文，必须包含所有单词并在括号内标注中文释义。适合 CEFR B1-B2。单词列表：${todays.join(',')}`;
    try{
      const res = await callKimi([{role:'user',content:prompt}], 800);
      out.textContent = res;
    } catch(e){
      out.textContent = '生成失败：' + e.message;
    }
  }

  async generateDialogue(){
    const todays = this.dailyWords.map(w=>w.word).slice(0,10);
    if(todays.length===0) return alert('今天还没有单词');
    const out = document.getElementById('dialogue');
    out.style.display = 'block';
    out.textContent = '生成中...';
    const prompt = `你是一名英语陪练伙伴。用户已学习的单词：${todays.join(',')}. 请发起一段简短友好的对话，至少使用其中 5 个单词，并在对话之后给出一句学习建议。`;
    try{
      const res = await callKimi([{role:'user',content:prompt}], 600);
      out.textContent = res;
    } catch(e){
      out.textContent = '生成失败：' + e.message;
    }
  }

  /* ---------------- 智能复习 ---------------- */
  async startReviewSession(){
    const all = await DB.getAll();
    const now = new Date();
    this.reviewQueue = all.filter(it => new Date(it.nextReview || 0) <= now).slice(0,20);
    document.getElementById('review-queue').textContent = `待复习：${this.reviewQueue.length} 个`;
    if(this.reviewQueue.length>0) this.showReviewCard(0);
    else alert('暂无待复习单词');
  }

  showReviewCard(idx){
    const card = document.getElementById('review-card');
    if(!this.reviewQueue[idx]) return card.style.display='none';
    const w = this.reviewQueue[idx];
    card.style.display = 'block';
    card.innerHTML = `
      <div><strong>${w.word}</strong> <div class="small">${w.meaning||''}</div>
      <div style="margin-top:10px">
        <button class="btn" onclick="app.handleReview('${w.word}', true)">✔ 我答对了</button>
        <button class="btn secondary" onclick="app.handleReview('${w.word}', false)">✖ 我答错了</button>
        <button class="btn" onclick="app.speakWord('${w.word}')">🔊 发音</button>
      </div></div>
    `;
  }

  async handleReview(word, correct){
    const w = await DB.get(word);
    if(!w) return;
    if(correct){
      w.reviewCount = (w.reviewCount||0) + 1;
      w.difficultyFactor = (w.difficultyFactor || 1.0) * 0.95; // 稍降低难度
      w.nextReview = calculateNextReviewSM2(w.reviewCount, w.difficultyFactor);
      if(w.reviewCount >= 3) w.mastered = true;
    } else {
      // 错误 -> 困难箱（24 小时内复习）
      w.reviewCount = (w.reviewCount||0) + 1;
      w.difficultyFactor = (w.difficultyFactor || 1.0) * 1.15;
      const next = new Date(); next.setDate(next.getDate()+1);
      w.nextReview = next.toISOString();
      w.difficultBox = true;
      w.consecutiveCorrect = 0;
    }
    await DB.put(w);
    // 继续下一轮（刷新队列）
    await this.startReviewSession();
    await this.refreshWordList();
    this.updateStatsUI();
  }

  async showDifficultBox(){
    const all = await DB.getAll();
    const difficult = all.filter(x=>x.difficultBox);
    if(difficult.length===0) return alert('困难箱为空');
    const words = difficult.map(x=>x.word).join(', ');
    alert('困难箱单词（需优先复习）：\n' + words);
  }

  /* ---------------- 统计 / 图表 ---------------- */
  updateStatsUI(){
    document.getElementById('stat-today').textContent = this.stats.today;
    document.getElementById('stat-learned').textContent = this.stats.learned;
    // 更新趋势图数据（示例：推一个每日累计）
    this.trendData.push({date: new Date().toLocaleDateString(), value: this.stats.learned});
    this.updateChart();
  }

  initChart(){
    const ctx = document.getElementById('trendChart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.trendData.map(d=>d.date),
        datasets: [{
          label: '掌握单词数',
          data: this.trendData.map(d=>d.value),
          fill: false,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins:{legend:{display:false}} }
    });
  }

  updateChart(){
    if(!this.chart) return;
    this.chart.data.labels = this.trendData.map(d=>d.date);
    this.chart.data.datasets[0].data = this.trendData.map(d=>d.value);
    this.chart.update();
  }

  saveGoal(){
    const g = Number(document.getElementById('goal-input').value || 10);
    this.goal = g;
    localStorage.setItem('dailyGoal', g);
    alert('已保存每日目标：' + g);
  }

  /* ---------------- Tampermonkey 划词保存：postMessage ---------------- */
  setupMessageListener(){
    window.addEventListener('message', async (ev) => {
      if(!ev.data) return;
      try{
        if(ev.data.type === 'SAVE_WORD_TO_AI_EN' && ev.data.word){
          const word = String(ev.data.word).trim();
          if(!word) return;
          // 快速保存：只保存 word 字段，其他可后续补全
          const existing = await DB.get(word);
          const payload = existing || {
            word,
            pronunciation: '',
            meaning: '',
            example: '',
            category: 'imported',
            difficulty: 'medium',
            reviewCount: 0,
            difficultyFactor: 1.0,
            nextReview: new Date().toISOString()
          };
          // 如果已有则更新 nextReview 保证近期复习
          payload.nextReview = new Date().toISOString();
          await DB.put(payload);
          await this.refreshWordList();
          // 可使用 Notification 或页面内提示
          try{
            if(Notification && Notification.permission === 'granted'){
              new Notification('已保存单词', {body: word});
            } else if(Notification && Notification.permission !== 'denied'){
              Notification.requestPermission().then(p=>{
                if(p === 'granted') new Notification('已保存单词', {body: word});
              });
            }
          }catch(e){}
          console.log('Saved via postMessage:', word);
        }
      }catch(e){ console.error('postMessage handler error', e) }
    }, false);
  }
}

/* ---------------- 启动 ---------------- */
const app = new App();

/* ---------------- 小工具 / UI 切换 ---------------- */
function show(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}
