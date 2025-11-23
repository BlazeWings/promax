// 配置
const CONFIG = {
    API_KEY: 'sk-QyGX8xsz9qqSTcVQeCQNIWEmha3rnf2cldKS1rteEMLDoYwI',
    API_URL: 'https://api.moonshot.cn/v1/chat/completions',
    MODEL: 'moonshot-v1-8k'
};

// 增强单词库（含难度和分类）
const WORD_DATABASE = [
    // 日常用语 (Easy)
    { word: 'welcome', pronunciation: '/ˈwelkəm/', meaning: '欢迎', example: 'Welcome to our AI English Learning Center!', difficulty: 'easy', category: 'daily', tags: ['greeting'] },
    { word: 'hello', pronunciation: '/həˈləʊ/', meaning: '你好', example: 'Hello, how are you today?', difficulty: 'easy', category: 'daily', tags: ['greeting'] },
    { word: 'friend', pronunciation: '/frend/', meaning: '朋友', example: 'My friend is very kind.', difficulty: 'easy', category: 'daily', tags: ['people'] },
    { word: 'family', pronunciation: '/ˈfæməli/', meaning: '家庭', example: 'I love my family very much.', difficulty: 'easy', category: 'daily', tags: ['people'] },
    { word: 'food', pronunciation: '/fuːd/', meaning: '食物', example: 'This food is delicious!', difficulty: 'easy', category: 'daily', tags: ['life'] },
    
    // 日常用语 (Medium)
    { word: 'challenge', pronunciation: '/ˈtʃælɪndʒ/', meaning: '挑战', example: 'Learning English is a challenge, but you can do it!', difficulty: 'medium', category: 'daily', tags: ['concept'] },
    { word: 'opportunity', pronunciation: '/ˌɒpəˈtjuːnəti/', meaning: '机会', example: 'Every conversation is an opportunity to learn.', difficulty: 'medium', category: 'daily', tags: ['concept'] },
    { word: 'improve', pronunciation: '/ɪmˈpruːv/', meaning: '提高；改善', example: 'Your English will improve quickly with AI help.', difficulty: 'medium', category: 'daily', tags: ['verb'] },
    { word: 'practice', pronunciation: '/ˈpræktɪs/', meaning: '练习；实践', example: 'Practice makes perfect.', difficulty: 'medium', category: 'daily', tags: ['verb'] },
    { word: 'conversation', pronunciation: '/ˌkɒnvəˈseɪʃn/', meaning: '对话；交谈', example: 'Let\'s have a conversation in English.', difficulty: 'medium', category: 'daily', tags: ['communication'] },
    
    // 商务英语
    { word: 'meeting', pronunciation: '/ˈmiːtɪŋ/', meaning: '会议', example: 'We have a meeting at 2 PM.', difficulty: 'easy', category: 'business', tags: ['work'] },
    { word: 'deadline', pronunciation: '/ˈdedlaɪn/', meaning: '截止日期', example: 'The deadline for this project is Friday.', difficulty: 'medium', category: 'business', tags: ['work'] },
    { word: 'negotiate', pronunciation: '/nɪˈɡəʊʃieɪt/', meaning: '谈判；协商', example: 'We need to negotiate the contract terms.', difficulty: 'hard', category: 'business', tags: ['work'] },
    { word: 'presentation', pronunciation: '/ˌpreznˈteɪʃn/', meaning: '演示；报告', example: 'She gave an excellent presentation.', difficulty: 'medium', category: 'business', tags: ['work'] },
    
    // 旅游英语
    { word: 'reservation', pronunciation: '/ˌrezəˈveɪʃn/', meaning: '预订', example: 'I have a reservation for tonight.', difficulty: 'medium', category: 'travel', tags: ['travel'] },
    { word: 'passport', pronunciation: '/ˈpɑːspɔːt/', meaning: '护照', example: 'Please show your passport.', difficulty: 'easy', category: 'travel', tags: ['travel'] },
    { word: 'itinerary', pronunciation: '/aɪˈtɪnərəri/', meaning: '行程表', example: 'Our itinerary includes three cities.', difficulty: 'hard', category: 'travel', tags: ['travel'] },
    { word: 'sightseeing', pronunciation: '/ˈsaɪtsiːɪŋ/', meaning: '观光', example: 'We went sightseeing in Paris.', difficulty: 'medium', category: 'travel', tags: ['travel'] },
    
    // 学术英语
    { word: 'research', pronunciation: '/rɪˈsɜːtʃ/', meaning: '研究', example: 'She is conducting important research.', difficulty: 'medium', category: 'academic', tags: ['study'] },
    { word: 'hypothesis', pronunciation: '/haɪˈpɒθəsɪs/', meaning: '假设', example: 'Our hypothesis needs to be tested.', difficulty: 'hard', category: 'academic', tags: ['study'] },
    { word: 'analyze', pronunciation: '/ˈænəlaɪz/', meaning: '分析', example: 'We need to analyze the data carefully.', difficulty: 'medium', category: 'academic', tags: ['study'] },
    { word: 'conference', pronunciation: '/ˈkɒnfərəns/', meaning: '学术会议', example: 'He presented at an international conference.', difficulty: 'medium', category: 'academic', tags: ['study'] },
    
    // 科技英语
    { word: 'algorithm', pronunciation: '/ˈælɡərɪðəm/', meaning: '算法', example: 'This algorithm is very efficient.', difficulty: 'hard', category: 'technology', tags: ['tech'] },
    { word: 'innovation', pronunciation: '/ˌɪnəˈveɪʃn/', meaning: '创新', example: 'Innovation drives progress.', difficulty: 'medium', category: 'technology', tags: ['tech'] },
    { word: 'digital', pronunciation: '/ˈdɪdʒɪtl/', meaning: '数字的', example: 'We live in a digital age.', difficulty: 'easy', category: 'technology', tags: ['tech'] },
    { word: 'artificial', pronunciation: '/ˌɑːtɪˈfɪʃl/', meaning: '人工的', example: 'Artificial intelligence is developing rapidly.', difficulty: 'medium', category: 'technology', tags: ['tech'] },
    
    // 高级词汇
    { word: 'achieve', pronunciation: '/əˈtʃiːv/', meaning: '实现；达到', example: 'You can achieve your goals with practice.', difficulty: 'medium', category: 'daily', tags: ['verb'] },
    { word: 'understand', pronunciation: '/ˌʌndəˈstænd/', meaning: '理解', example: 'I can understand you better now.', difficulty: 'easy', category: 'daily', tags: ['verb'] },
    { word: 'remember', pronunciation: '/rɪˈmembə(r)/', meaning: '记住', example: 'Remember to review your words daily.', difficulty: 'easy', category: 'daily', tags: ['verb'] },
    { word: 'progress', pronunciation: '/ˈprəʊɡres/', meaning: '进步；进展', example: 'You are making great progress!', difficulty: 'medium', category: 'daily', tags: ['concept'] },
    { word: 'confident', pronunciation: '/ˈkɒnfɪdənt/', meaning: '自信的', example: 'Be confident when you speak English.', difficulty: 'medium', category: 'daily', tags: ['adjective'] },
    { word: 'vocabulary', pronunciation: '/vəˈkæbjələri/', meaning: '词汇；词汇量', example: 'Building vocabulary is essential.', difficulty: 'hard', category: 'daily', tags: ['concept'] },
    { word: 'pronunciation', pronunciation: '/prəˌnʌnsiˈeɪʃn/', meaning: '发音', example: 'Good pronunciation helps communication.', difficulty: 'hard', category: 'daily', tags: ['concept'] },
    { word: 'grammar', pronunciation: '/ˈɡræmə(r)/', meaning: '语法', example: 'Grammar rules help structure sentences.', difficulty: 'medium', category: 'daily', tags: ['concept'] },
    { word: 'fluent', pronunciation: '/ˈfluːənt/', meaning: '流利的', example: 'She speaks fluent English.', difficulty: 'hard', category: 'daily', tags: ['adjective'] }
];

// 分组配置
const GROUP_SIZE = 10;

// SM-2算法参数
const SRS_CONFIG = {
    difficultyMultiplier: {
        easy: 1.0,
        medium: 1.5,
        hard: 2.0
    },
    easeFactorChange: {
        correct: 1.1,
        wrong: 0.85
    },
    initialEaseFactor: 1.0
};

// 主应用类
class EnglishLearningApp {
    constructor() {
        this.currentWordIndex = 0;
        this.filteredWords = [...WORD_DATABASE];
        this.currentFilter = { category: 'all', difficulty: 'all' };
        this.currentReviewIndex = 0;
        this.dailyWords = [];
        this.currentGroup = [];
        this.groupIndex = 0;
        this.voicesLoaded = false;
        this.currentQuiz = null;
        this.chart = null;
        
        // 加载用户数据
        this.userData = this.loadData('userData') || {
            learnedWords: [],
            reviewSchedule: {},
            studyStreak: 0,
            lastStudyDate: null,
            masteredWords: [],
            categoryProgress: {
                daily: 0,
                business: 0,
                travel: 0,
                academic: 0,
                technology: 0
            },
            settings: {
                dailyGoal: 20,
                reminderTime: '20:00',
                autoSpeak: true,
                voiceSpeed: 0.85,
                voiceAccent: 'US' // US or UK
            }
        };
        
        this.chatHistory = this.loadData('chatHistory') || [];
        
        // 初始化语音
        this.initSpeech();
        this.init();
    }

    // 新增：初始化分组进度
    initGroupProgress() {
        const container = document.getElementById('group-progress');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < GROUP_SIZE; i++) {
            const circle = document.createElement('div');
            circle.className = 'progress-circle';
            circle.id = `progress-${i}`;
            container.appendChild(circle);
        }
        this.updateGroupProgress();
    }

    // 新增：更新分组进度显示
    updateGroupProgress() {
        for (let i = 0; i < GROUP_SIZE; i++) {
            const circle = document.getElementById(`progress-${i}`);
            if (!circle) continue;
            
            circle.classList.remove('completed', 'current');
            
            if (i < this.groupIndex) {
                circle.classList.add('completed');
            } else if (i === this.groupIndex) {
                circle.classList.add('current');
            }
        }
    }

    // 修改：初始化时加载设置
    init() {
        this.updateStudyStreak();
        this.generateDailyWords();
        this.displayCurrentWord();
        this.updateProgressDisplay();
        this.updateReviewList();
        this.loadChatHistory();
        this.initChart();
        
        // 加载用户设置
        this.loadUserSettings();
        
        // 检查复习提醒
        this.checkReviewReminder();
        
        console.log('✅ 应用初始化完成');
    }

    // 新增：加载用户设置
    loadUserSettings() {
        const speedSlider = document.getElementById('voice-speed');
        const speedDisplay = document.getElementById('speed-display');
        const autoSpeak = document.getElementById('auto-speak');
        const dailyGoal = document.getElementById('daily-goal');
        const reminderTime = document.getElementById('reminder-time');
        
        if (speedSlider) {
            speedSlider.value = this.userData.settings.voiceSpeed;
            speedSlider.oninput = (e) => {
                this.userData.settings.voiceSpeed = parseFloat(e.target.value);
                if (speedDisplay) speedDisplay.textContent = `${e.target.value}x`;
                this.saveData('userData', this.userData);
            };
        }
        
        if (speedDisplay) {
            speedDisplay.textContent = `${this.userData.settings.voiceSpeed}x`;
        }
        
        if (autoSpeak) {
            autoSpeak.checked = this.userData.settings.autoSpeak;
        }
        
        if (dailyGoal) {
            dailyGoal.value = this.userData.settings.dailyGoal;
        }
        
        if (reminderTime) {
            reminderTime.value = this.userData.settings.reminderTime;
        }
        
        // 设置语音口音
        const accentRadios = document.querySelectorAll('input[name="voice-accent"]');
        accentRadios.forEach(radio => {
            radio.checked = radio.value === this.userData.settings.voiceAccent;
        });
    }

    // 修改：语音API增强，支持英音/美音
    initSpeech() {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                this.voices = window.speechSynthesis.getVoices();
                this.voicesLoaded = true;
                console.log('语音库已加载:', this.voices.length, '个语音');
            };
            
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        } else {
            console.warn('❌ 浏览器不支持Web Speech API');
            this.showNotification('您的浏览器不支持语音功能', 'error');
        }
    }

    // 修改：增强发音功能，支持口音和语速
    speakWord(wordText) {
        if (!this.voicesLoaded || !('speechSynthesis' in window)) {
            this.showNotification('语音功能未就绪', 'error');
            return;
        }
        
        try {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(wordText);
            utterance.rate = this.userData.settings.voiceSpeed;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // 选择口音
            const accent = this.userData.settings.voiceAccent;
            const targetLang = accent === 'UK' ? 'en-GB' : 'en-US';
            
            const englishVoice = this.voices.find(voice => 
                voice.lang && voice.lang.toLowerCase().includes(targetLang.toLowerCase())
            ) || this.voices.find(voice => 
                voice.lang && voice.lang.toLowerCase().includes('en')
            );
            
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
            
            utterance.onerror = (event) => {
                console.error('❌ 朗读错误:', event);
                this.showNotification('语音播放失败', 'error');
            };
            
            window.speechSynthesis.speak(utterance);
            this.showNotification(`🔊 ${wordText}`, 'info', 1500);
            
        } catch (error) {
            console.error('语音播放错误:', error);
            this.showNotification('语音播放失败', 'error');
        }
    }

    // 修改：生成每日单词组（严格10个）
    async generateDailyWords() {
        const loadingEl = document.getElementById('daily-loading');
        const errorEl = document.getElementById('daily-error');
        const gridEl = document.getElementById('daily-words-grid');
        const suggestionEl = document.getElementById('ai-word-suggestion');
        const countEl = document.getElementById('daily-words-count');
        
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        gridEl.innerHTML = '';

        try {
            const learnedWords = this.userData.learnedWords.map(w => w.word);
            const categoryProgress = this.userData.categoryProgress;
            const dailyGoal = this.userData.settings.dailyGoal;
            
            const prompt = `作为AI英语学习助手，请严格推荐${Math.min(dailyGoal, GROUP_SIZE)}个英语单词，格式如下：

1. 用户已学单词数量：${learnedWords.length}
2. 各分类进度：${JSON.stringify(categoryProgress)}
3. 需要避开的已学单词：${learnedWords.join(', ')}

请严格返回${Math.min(dailyGoal, GROUP_SIZE)}个单词的JSON数组，格式：
[
  {"word": "单词", "reason": "推荐理由"},
  ...
]`;

            const response = await this.callKimiAPI([
                { role: 'system', content: '你是一个专业的AI英语学习助手，只返回JSON格式数据，不要任何额外说明。' },
                { role: 'user', content: prompt }
            ]);

            // 解析响应
            let recommendedWords;
            try {
                const jsonMatch = response.match(/\[([\s\S]*?)\]/);
                if (jsonMatch) {
                    recommendedWords = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('无法解析AI响应');
                }
            } catch (e) {
                console.warn('AI推荐解析失败，使用备用算法:', e);
                recommendedWords = this.fallbackDailyWordRecommendation();
            }

            // 匹配数据库并限制为GROUP_SIZE个
            this.dailyWords = recommendedWords.slice(0, GROUP_SIZE).map(item => {
                const wordData = WORD_DATABASE.find(w => 
                    w.word.toLowerCase() === item.word.toLowerCase()
                );
                return {
                    ...(wordData || { 
                        word: item.word, 
                        pronunciation: '/ˈ/', 
                        meaning: '待查询', 
                        example: 'Example needed',
                        difficulty: 'medium',
                        category: 'daily'
                    }),
                    reason: item.reason
                };
            });

            this.currentGroup = [...this.dailyWords];
            this.groupIndex = 0;
            
            this.displayDailyWords();
            this.initGroupProgress();
            this.updateGroupProgress();
            
            suggestionEl.innerHTML = `
                <h4>🤖 AI个性化建议</h4>
                <p>今日推荐：${this.dailyWords.length}个单词</p>
                <small style="color: #666;">${new Date().toLocaleDateString('zh-CN')}</small>
            `;
            suggestionEl.style.display = 'block';
            
            countEl.textContent = `今日单词组 (${this.dailyWords.length}个)`;
            loadingEl.style.display = 'none';
            
            // 自动朗读第一个单词
            if (this.userData.settings.autoSpeak && this.dailyWords.length > 0) {
                setTimeout(() => this.speakWord(this.dailyWords[0].word), 500);
            }
            
        } catch (error) {
            console.error('Generate daily words error:', error);
            errorEl.textContent = `生成失败：${error.message}`;
            errorEl.style.display = 'block';
            loadingEl.style.display = 'none';
            
            this.dailyWords = this.fallbackDailyWordRecommendation();
            this.displayDailyWords();
        }
    }

    // 修改：备用推荐算法
    fallbackDailyWordRecommendation() {
        const learnedWords = this.userData.learnedWords.map(w => w.word);
        const availableWords = WORD_DATABASE.filter(w => !learnedWords.includes(w.word));
        
        return availableWords.slice(0, GROUP_SIZE).map(w => ({
            word: w.word,
            reason: `${this.getCategoryText(w.category)}分类，${this.getDifficultyText(w.difficulty)}难度`
        }));
    }

    // 新增：标记整组完成
    markGroupAsLearned() {
        if (this.currentGroup.length === 0) {
            this.showNotification('请先生成单词组', 'warning');
            return;
        }
        
        let learnedCount = 0;
        this.currentGroup.forEach(word => {
            if (!this.isWordLearned(word.word)) {
                this.markWordAsLearned(word, 'group');
                learnedCount++;
            }
        });
        
        this.showNotification(`✅ 本组${learnedCount}个单词已加入单词库！`, 'success');
        this.generateDailyWords();
    }

    // 新增：重置当前组
    resetCurrentGroup() {
        this.groupIndex = 0;
        this.updateGroupProgress();
        this.displayCurrentWord();
        this.showNotification('🔄 已重置本组进度', 'info');
    }

    // 新增：AI小说生成
    async generateStory() {
        const storyContainer = document.getElementById('story-container');
        const loadingEl = document.getElementById('story-loading');
        const errorEl = document.getElementById('story-error');
        
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        
        try {
            // 获取今日所学单词
            const todayWords = this.dailyWords.length > 0 ? this.dailyWords : this.userData.learnedWords.slice(-10);
            const wordList = todayWords.map(w => w.word).join(', ');
            
            const prompt = `你是一名英语教育专家。请根据以下单词列表创作一段200字左右的趣味短文：
            
单词列表：${wordList}

要求：
1. 必须包含所有提供的单词（用英文原文，括号内标注中文释义）
2. 情节连贯有故事性，适合英语学习者阅读
3. 人物对话自然，使用日常口语表达
4. 难度适中，符合CEFR B1-B2水平
5. 主要单词需要加粗显示`;

            const response = await this.callKimiAPI([
                { role: 'system', content: '你是英语教育专家，创作有趣且适合学习的故事。' },
                { role: 'user', content: prompt }
            ]);

            // 处理响应，高亮单词
            let highlightedText = response;
            todayWords.forEach(word => {
                const regex = new RegExp(`\\b(${word.word})\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, 
                    `<span class="highlight-word" onclick="app.speakWord('${word.word}')" title="${word.meaning}">${word.word}</span>`
                );
            });
            
            storyContainer.innerHTML = `
                <h3>📖 AI生成故事</h3>
                <p>点击下方高亮单词可查看释义和发音</p>
                <div style="margin-top: 15px; font-size: 18px; line-height: 1.8;">
                    ${highlightedText}
                </div>
            `;
            storyContainer.style.display = 'block';
            loadingEl.style.display = 'none';
            
            // 自动朗读故事
            this.speakStory(response);
            
        } catch (error) {
            errorEl.textContent = `故事生成失败：${error.message}`;
            errorEl.style.display = 'block';
            loadingEl.style.display = 'none';
        }
    }

    // 新增：朗读故事（分段）
    speakStory(story) {
        if (!this.userData.settings.autoSpeak) return;
        
        const sentences = story.split(/[.!?]+/).filter(s => s.trim());
        let index = 0;
        
        const speakNext = () => {
            if (index < sentences.length) {
                this.speakWord(sentences[index].trim());
                index++;
                setTimeout(speakNext, 3000); // 每3秒读一句
            }
        };
        
        speakNext();
    }

    // 新增：生成选择题干扰项
    async generateQuiz(word) {
        const prompt = `为单词"${word.word}"生成3个干扰选项，用于英语测试题。
要求：
- 选项为中文释义
- 1个正确答案
- 3个干扰项需与正确答案在词义、词性或拼写上相似，具有迷惑性
- 返回JSON格式：{"correct":"正确释义","distractors":["干扰1","干扰2","干扰3"]}`;

        try {
            const response = await this.callKimiAPI([
                { role: 'system', content: '你生成JSON格式的测试题选项，只返回JSON，不要额外说明。' },
                { role: 'user', content: prompt }
            ]);
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('解析失败');
        } catch (error) {
            console.error('生成干扰项失败:', error);
            return this.fallbackQuiz(word);
        }
    }

    // 新增：备用干扰项生成
    fallbackQuiz(word) {
        const distractors = [
            word.meaning.split('；')[0] + '（相似）',
            '相关但不同的意思',
            '拼写相近的词义'
        ];
        
        return {
            correct: word.meaning,
            distractors: distractors.slice(0, 3)
        };
    }

    // 新增：开始复习测试
    async startReviewSession() {
        const now = new Date();
        const dueWords = Object.values(this.userData.reviewSchedule)
            .filter(word => new Date(word.nextReview) <= now);
        
        if (dueWords.length === 0) {
            this.showNotification('暂无需要复习的单词', 'info');
            return;
        }
        
        this.currentReviewIndex = 0;
        this.reviewQueue = dueWords;
        this.showReviewQuiz();
    }

    // 新增：显示复习题目
    async showReviewQuiz() {
        const word = this.reviewQueue[this.currentReviewIndex];
        if (!word) {
            this.completeReviewSession();
            return;
        }
        
        const modeContainer = document.getElementById('review-mode-container');
        const listContainer = document.getElementById('review-words-list');
        const reviewCard = document.getElementById('review-card');
        
        listContainer.style.display = 'none';
        modeContainer.style.display = 'block';
        
        document.getElementById('review-word').textContent = word.word;
        document.getElementById('review-pronunciation').textContent = word.pronunciation;
        
        // 生成选项
        const quiz = await this.generateQuiz(word);
        const options = [quiz.correct, ...quiz.distractors];
        this.shuffleArray(options);
        
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = options.map((option, index) => `
            <div class="quiz-option" onclick="selectQuizOption(${index})" data-index="${index}">
                ${option}
            </div>
        `).join('');
        
        this.currentQuiz = {
            word: word.word,
            correctAnswer: quiz.correct,
            options: options,
            selectedIndex: null
        };
        
        // 自动朗读
        if (this.userData.settings.autoSpeak) {
            this.speakWord(word.word);
        }
    }

    // 新增：选择答案
    selectQuizOption(index) {
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector(`[data-index="${index}"]`).classList.add('selected');
        this.currentQuiz.selectedIndex = index;
    }

    // 新增：提交答案
    submitQuiz() {
        if (this.currentQuiz.selectedIndex === null) {
            this.showNotification('请先选择一个答案', 'warning');
            return;
        }
        
        const selectedOption = this.currentQuiz.options[this.currentQuiz.selectedIndex];
        const isCorrect = selectedOption === this.currentQuiz.correctAnswer;
        
        // 显示正确答案
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
            opt.classList.remove('correct', 'wrong');
            if (opt.textContent === this.currentQuiz.correctAnswer) {
                opt.classList.add('correct');
            } else if (i === this.currentQuiz.selectedIndex && !isCorrect) {
                opt.classList.add('wrong');
            }
        });
        
        // 处理结果
        setTimeout(() => {
            if (isCorrect) {
                this.showNotification('✅ 正确！', 'success');
                this.updateSRS(this.currentQuiz.word, 'easy');
            } else {
                this.showNotification('❌ 错误，加强复习！', 'error');
                this.updateSRS(this.currentQuiz.word, 'hard');
                // 加强复习：24小时内再次复习
                this.scheduleIntensiveReview(this.currentQuiz.word);
            }
            
            this.currentReviewIndex++;
            if (this.currentReviewIndex < this.reviewQueue.length) {
                setTimeout(() => this.showReviewQuiz(), 1000);
            } else {
                this.completeReviewSession();
            }
        }, 1500);
    }

    // 新增：加强复习调度
    scheduleIntensiveReview(wordText) {
        const word = this.userData.reviewSchedule[wordText];
        if (word) {
            const nextReview = new Date();
            nextReview.setHours(nextReview.getHours() + 24); // 24小时后
            word.nextReview = nextReview.toISOString();
            word.intensiveReview = true;
            this.saveData('userData', this.userData);
        }
    }

    // 新增：完成复习会话
    completeReviewSession() {
        document.getElementById('review-mode-container').style.display = 'none';
        document.getElementById('review-words-list').style.display = 'block';
        this.updateReviewList();
        this.showNotification('🎉 复习完成！', 'success');
    }

    // 新增：获取提示
    hintForQuiz() {
        if (!this.currentQuiz) return;
        
        const word = this.userData.reviewSchedule[this.currentQuiz.word];
        if (word) {
            this.showNotification(`💡 提示：${word.example}`, 'info', 5000);
        }
    }

    // 修改：更新SRS（SM-2算法）
    updateSRS(wordText, rating) {
        const scheduledWord = this.userData.reviewSchedule[wordText];
        const learnedWord = this.userData.learnedWords.find(w => w.word === wordText);
        
        if (!scheduledWord || !learnedWord) return;
        
        // 更新复习次数
        scheduledWord.reviewCount = (scheduledWord.reviewCount || 0) + 1;
        learnedWord.reviewCount = scheduledWord.reviewCount;
        
        // 获取难度系数
        const difficulty = scheduledWord.difficulty || 'medium';
        const baseMultiplier = SRS_CONFIG.difficultyMultiplier[difficulty];
        
        // 调整难度因子
        if (rating === 'easy') {
            scheduledWord.difficultyFactor = (scheduledWord.difficultyFactor || SRS_CONFIG.initialEaseFactor) * SRS_CONFIG.easeFactorChange.correct;
        } else if (rating === 'hard') {
            scheduledWord.difficultyFactor = (scheduledWord.difficultyFactor || SRS_CONFIG.initialEaseFactor) * SRS_CONFIG.easeFactorChange.wrong;
        }
        
        // SM-2算法计算下次复习时间
        let intervalDays;
        if (scheduledWord.reviewCount === 1) {
            intervalDays = 1;
        } else if (scheduledWord.reviewCount === 2) {
            intervalDays = 3;
        } else {
            intervalDays = Math.round(Math.pow(2.5, scheduledWord.reviewCount - 1) * scheduledWord.difficultyFactor);
        }
        
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + intervalDays);
        scheduledWord.nextReview = nextReview.toISOString();
        learnedWord.nextReview = scheduledWord.nextReview;
        
        // 检查是否掌握
        if (scheduledWord.reviewCount >= 5 && rating === 'easy') {
            if (!this.userData.masteredWords.includes(wordText)) {
                this.userData.masteredWords.push(wordText);
                this.showNotification(`🎉 "${wordText}" 已掌握！`, 'success');
            }
        }
        
        this.saveData('userData', this.userData);
        this.updateReviewList();
        this.updateProgressDisplay();
    }

    // 新增：初始化图表
    initChart() {
        const ctx = document.getElementById('progress-chart');
        if (!ctx) return;
        
        // 准备数据
        const last7Days = [];
        const learnedCounts = [];
        const reviewCounts = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
            
            const dayLearned = this.userData.learnedWords.filter(w => {
                const learnedDate = new Date(w.learnedAt);
                return learnedDate.toDateString() === date.toDateString();
            }).length;
            learnedCounts.push(dayLearned);
            
            const dayReviewed = Object.values(this.userData.reviewSchedule).filter(w => {
                const reviewedDate = new Date(w.lastReviewed || 0);
                return reviewedDate.toDateString() === date.toDateString();
            }).length;
            reviewCounts.push(dayReviewed);
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: '新学单词',
                    data: learnedCounts,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4
                }, {
                    label: '复习单词',
                    data: reviewCounts,
                    borderColor: '#06d6a0',
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '7天学习趋势'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // 新增：导入CSV
    importCSV(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        Papa.parse(file, {
            header: false,
            complete: (results) => {
                try {
                    const newWords = results.data.slice(1) // 跳过标题行
                        .filter(row => row.length >= 6)
                        .map(row => ({
                            word: row[0].trim(),
                            pronunciation: row[1].trim(),
                            meaning: row[2].trim(),
                            example: row[3].trim(),
                            category: row[4].trim(),
                            difficulty: row[5].trim()
                        }))
                        .filter(word => word.word && word.meaning);
                    
                    // 添加到数据库
                    WORD_DATABASE.push(...newWords);
                    
                    this.showNotification(`📥 成功导入 ${newWords.length} 个单词！`, 'success');
                    this.displayCurrentWord();
                } catch (error) {
                    this.showNotification('❌ CSV格式错误，请检查文件', 'error');
                }
            },
            error: (error) => {
                this.showNotification('❌ 文件读取失败', 'error');
            }
        });
    }

    // 新增：更新每日目标
    updateDailyGoal() {
        const goal = document.getElementById('daily-goal').value;
        this.userData.settings.dailyGoal = parseInt(goal);
        this.saveData('userData', this.userData);
        this.showNotification(`✅ 每日目标已更新为${goal}个单词`, 'success');
    }

    // 新增：工具函数 - 打乱数组
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ... [保留原有方法：displayCurrentWord, markAsLearned, needMorePractice, queryDictionary, sendMessage, loadChatHistory, updateStudyStreak, checkReviewReminder, updateProgressDisplay, updateLearnedWordsList, getReviewStatus, filterByCategory, filterByDifficulty, getLearnedWordsList, exportData, clearData, showNotification, showSection, callKimiAPI, saveData, loadData, switchTab] ...

    // Tab切换
    switchTab(tabName, event) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');
    }

    // 语音切换
    toggleVoiceAccent(accent) {
        this.userData.settings.voiceAccent = accent;
        this.saveData('userData', this.userData);
    }

    toggleAutoSpeak() {
        const checkbox = document.getElementById('auto-speak');
        this.userData.settings.autoSpeak = checkbox.checked;
        this.saveData('userData', this.userData);
    }

    updateReminderTime() {
        const timeInput = document.getElementById('reminder-time');
        this.userData.settings.reminderTime = timeInput.value;
        this.saveData('userData', this.userData);
        this.showNotification(`⏰ 提醒时间已设置为${timeInput.value}`, 'info');
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new EnglishLearningApp();
    console.log('🎯 AI英语学习应用已启动，支持分组学习、SM-2算法和小说生成');
});

// 全局函数
function showSection(sectionName, event) {
    app.showSection(sectionName, event);
}

function switchTab(tabName, event) {
    app.switchTab(tabName, event);
}

function nextWord() {
    app.nextWord();
}

function markAsLearned() {
    app.markAsLearned();
}

function needMorePractice() {
    app.needMorePractice();
}

function queryDictionary() {
    app.queryDictionary();
}

function sendMessage() {
    app.sendMessage();
}

function exportData() {
    app.exportData();
}

function clearData() {
    app.clearData();
}

function filterByCategory() {
    app.filterByCategory();
}

function filterByDifficulty() {
    app.filterByDifficulty();
}

function generateDailyWords() {
    app.generateDailyWords();
}

function toggleDailyWord(index) {
    app.toggleDailyWord(index);
}

function speakCurrentWord() {
    app.speakCurrentWord();
}

function startReviewSession() {
    app.startReviewSession();
}

function markAsEasy() {
    app.markAsEasy();
}

function markAsHard() {
    app.markAsHard();
}

function reviewWord(word) {
    app.reviewWord(word);
}

function selectQuizOption(index) {
    app.selectQuizOption(index);
}

function submitQuiz() {
    app.submitQuiz();
}

function hintForQuiz() {
    app.hintForQuiz();
}

function importCSV(event) {
    app.importCSV(event);
}

function updateDailyGoal() {
    app.updateDailyGoal();
}

function updateReminderTime() {
    app.updateReminderTime();
}

function toggleAutoSpeak() {
    app.toggleAutoSpeak();
}

function generateStory() {
    app.generateStory();
}

function markGroupAsLearned() {
    app.markGroupAsLearned();
}

function resetCurrentGroup() {
    app.resetCurrentGroup();
}

// 语音口音切换
document.addEventListener('DOMContentLoaded', function() {
    const accentRadios = document.querySelectorAll('input[name="voice-accent"]');
    accentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            app.toggleVoiceAccent(e.target.value);
        });
    });
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
