// -------------------------
// 🔧 Firebase 初始化
// -------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAcXDaA7b6xA4wyXEUZjoKTtUtB6_cD80U",
  authDomain: "wavelength-remote.firebaseapp.com",
  databaseURL: "https://wavelength-remote-default-rtdb.firebaseio.com",
  projectId: "wavelength-remote",
  storageBucket: "wavelength-remote.firebasestorage.app",
  messagingSenderId: "635005582938",
  appId: "1:635005582938:web:116ddd29a87817bc46a263"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// -------------------------
// 🧠 状态变量
// -------------------------
let currentRoomId = null;
let playerRole = null; // 'host' 或 'guest'
let targetStart = 0, targetEnd = 0;
let topic = {};
let guessPercent = null;
let currentTurn = 'host'; // host 先出题

const chineseWordBank = [
  "火锅", "宇宙", "爱情", "梦境", "沙发", "冰箱", "奶奶", "猫咪", "老师", "机器人",
  "超市", "山洞", "鬼魂", "星星", "火车", "桥", "密码", "纸张", "火焰", "草地",
  "钢铁", "隐形人", "书包", "电脑", "帽子", "温泉", "炸鸡", "笑声", "监控器", "独角兽",
  "医院", "海洋", "牙齿", "台风", "唱歌", "滑板", "墙壁", "日记", "镜子", "钢笔",
  "早餐", "图书馆", "蛋糕", "瀑布", "熔岩", "战士", "夜晚", "迷宫", "面具", "钟表",
  "电梯", "钥匙", "龙", "月亮", "舞蹈", "影子", "手电筒", "山脉", "爆米花", "龙卷风",
  "考试", "游乐园", "奇迹", "雪人", "雨伞", "桌子", "未来", "深海", "火星", "潜水艇",
  "光线", "时间", "沙子", "声音", "森林", "隧道", "眼镜", "帽子", "记忆", "梦游",
  "颜色", "电池", "表情", "信号", "油画", "小丑", "幻觉", "摇滚", "铃铛", "乐器",
  "洞穴", "剧本", "雕像", "种子", "磁铁", "香气", "速度", "谜语", "传送门", "怪兽"
];

const hintList = [
  { left: "常说的话", right: "不常说的话" },
  { left: "便宜", right: "昂贵" },
  { left: "古老的", right: "现代的" },
  { left: "可爱的", right: "吓人的" },
  { left: "儿童喜欢", right: "成人喜欢" },

  { left: "现实中的", right: "幻想中的" },
  { left: "粗糙", right: "光滑" },
  { left: "单调", right: "丰富" },
  { left: "清凉", right: "炽热" },
  { left: "直线", right: "曲线" },

  { left: "流行的", right: "小众的" },
  { left: "迅速", right: "缓慢" },
  { left: "无害", right: "危险" },
  { left: "抽象", right: "具体" },
  { left: "安静", right: "吵闹" },

  { left: "理性", right: "感性" },
  { left: "自然的", right: "人为的" },
  { left: "传统的", right: "创新的" },
  { left: "需要努力", right: "轻而易举" },
  { left: "在地的", right: "全球的" },
  { left: "有趣的", right: "无聊的" },
  { left: "简单", right: "复杂" },
  { left: "有用", right: "无用" },
  { left: "好吃", right: "难吃" },
  {left: "不可能的", right: "必然的" },

  { left: "冷", right: "热" },
  { left: "明亮", right: "昏暗" },
  { left: "快", right: "慢" },
  { left: "高", right: "矮" },
  { left: "重", right: "轻" },
  { left: "硬", right: "软" },
  { left: "复杂", right: "简单" },
  { left: "强", right: "弱" },
  { left: "安静", right: "嘈杂" },
  { left: "开心", right: "难过" },
  { left: "自然", right: "人工" },
  { left: "清晰", right: "模糊" },
  { left: "传统", right: "现代" },
  { left: "浪漫", right: "现实" },
  { left: "乐观", right: "悲观" },
  { left: "主观", right: "客观" },
  { left: "情绪化", right: "理性" },
  { left: "甜", right: "苦" },
  { left: "多", right: "少" },
  { left: "近", right: "远" },
  { left: "真实", right: "虚构" },
  { left: "圆滑", right: "棱角分明" },
  { left: "集中", right: "分散" },
  { left: "保守", right: "开放" },
  { left: "高调", right: "低调" },
  { left: "粗糙", right: "光滑" },
  { left: "贵", right: "便宜" },
  { left: "在地的", right: "全球的" },
  { left: "单一", right: "多样" },
  { left: "硬核", right: "轻松" },
  { left: "地心引力", right: "太空漂浮" },
  { left: "童话", right: "纪实" },
  { left: "沉默", right: "表达" },
  { left: "独处", right: "社交" },
  { left: "微观", right: "宏观" },
  { left: "突发", right: "持续" },
  { left: "爆炸", right: "蒸发" },
  { left: "休眠", right: "爆发" },
  { left: "历史", right: "未来" },
  { left: "生物", right: "机械" },
  { left: "无声", right: "震耳欲聋" },
  { left: "干预", right: "自然生长" },
  { left: "土味", right: "高级感" },
  { left: "一次性", right: "永久" },
  { left: "现实", right: "超现实" },
  { left: "无意义", right: "深意" },
  { left: "对称", right: "不对称" },

  { left: "冷", right: "热" },
  { left: "明亮", right: "昏暗" },
  { left: "快", right: "慢" },
  { left: "高", right: "矮" },
  { left: "重", right: "轻" },
  { left: "硬", right: "软" },
  { left: "复杂", right: "简单" },
  { left: "强", right: "弱" },
  { left: "安静", right: "嘈杂" },
  { left: "开心", right: "难过" },
  { left: "自然", right: "人工" },
  { left: "清晰", right: "模糊" },
  { left: "传统", right: "现代" },
  { left: "浪漫", right: "现实" },
  { left: "乐观", right: "悲观" },
  { left: "主观", right: "客观" },
  { left: "情绪化", right: "理性" },
  { left: "甜", right: "苦" },
  { left: "多", right: "少" },
  { left: "近", right: "远" },
  { left: "真实", right: "虚构" },
  { left: "圆滑", right: "棱角分明" },
  { left: "集中", right: "分散" },
  { left: "保守", right: "开放" },
  { left: "高调", right: "低调" },
  { left: "粗糙", right: "光滑" },
  { left: "贵", right: "便宜" },
  { left: "在地的", right: "全球的" },
  { left: "单一", right: "多样" },
  { left: "硬核", right: "轻松" }

];

// -------------------------
// 🖌️ 画图函数
// -------------------------
const arcCanvas = document.getElementById("arcCanvas");
const ctx = arcCanvas.getContext("2d");

function drawArc(showTarget = false, showGuess = false) {
  ctx.clearRect(0, 0, arcCanvas.width, arcCanvas.height);
  const cx = arcCanvas.width / 2, cy = arcCanvas.height - 20, r = 180;

  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;
  ctx.stroke();

  if (showTarget) {
    const zoneSize = Math.floor((targetEnd - targetStart) / 3);
    const zones = [
      { start: targetStart, end: targetStart + zoneSize, color: "rgba(144,238,144,0.6)" },
      { start: targetStart + zoneSize, end: targetEnd - zoneSize, color: "rgba(34,139,34,0.7)" },
      { start: targetEnd - zoneSize, end: targetEnd, color: "rgba(144,238,144,0.6)" }
    ];
    for (let zone of zones) {
      const startAngle = Math.PI + Math.PI * (zone.start / 100);
      const endAngle = Math.PI + Math.PI * (zone.end / 100);
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 20;
      ctx.stroke();
    }
  }

  if (showGuess) {
    const percent = guessPercent ?? parseInt(document.getElementById("guessSlider").value);
    const angle = Math.PI + Math.PI * (percent / 100);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

// -------------------------
// 🏠 房主函数
// -------------------------
function createRoom() {
  currentRoomId = Math.floor(100 + Math.random() * 900).toString();
  playerRole = 'host';
  database.ref('rooms/' + currentRoomId).set({
    host: true,
    gameState: 'waiting'
  });
  document.getElementById('connection-status').textContent = '✅ 房间已创建：' + currentRoomId;
  startListening();
  document.getElementById("game-step").innerText = "等待玩家加入...";

  // 在房主创建房间后注册监听
  window.addEventListener("beforeunload", function () {
  // 只有房主有权删除房间
  if (playerRole === "host" && currentRoomId) {
    database.ref('rooms/' + currentRoomId).remove();
  }
  });

}

function hostStartGame() {
  topic = hintList[Math.floor(Math.random() * hintList.length)];
  targetStart = Math.floor(Math.random() * 60);
  targetEnd = targetStart + 30;
  database.ref('rooms/' + currentRoomId).update({
    gameState: 'hintPhase',
    target: {
      start: targetStart,
      end: targetEnd,
      left: topic.left,
      right: topic.right
    },
    currentTurn: currentTurn,
    phaseStartTime: Date.now() // 出题阶段开始时间
  });
  document.getElementById("left-label").innerText = topic.left;
  document.getElementById("right-label").innerText = topic.right;
  document.getElementById("hint-input").style.display = "block";
  drawArc(true);
  document.getElementById("startGameBtn").style.display = "none";
  document.getElementById("game-step").innerText = "请输入提示词...";
}

function confirmHint(countdown = false) {
  clearInterval(countdownInterval);
  document.getElementById("countdown").style.display = "none";

  if (countdown) {
    const word = chineseWordBank[Math.floor(Math.random() * chineseWordBank.length)];
    document.getElementById("hintBox").value = word;
    alert("⏰ 时间到！你没能及时出题！系统随机生成了提示词：" + word);
  }
  const hint = document.getElementById("hintBox").value.trim();
  if (!hint) return alert("请输入提示词！");
  database.ref('rooms/' + currentRoomId).update({
    currentHint: hint,
    gameState: 'guessPhase',
    showTarget: false,
    phaseStartTime: Date.now() // 出题阶段开始时间
  });
  document.getElementById("hint-input").style.display = "none";
  document.getElementById("game-step").innerText = "等待对方猜测...";
}

// -------------------------
// 👤 玩家函数
// -------------------------
function joinRoom() {
  currentRoomId = document.getElementById('roomId').value.trim();
  if (!currentRoomId) return alert('请输入房间号');
  playerRole = 'guest';
  database.ref('rooms/' + currentRoomId).update({ guest: true });
  document.getElementById('connection-status').textContent = '✅ 已加入房间';
  startListening();
}

function submitGuess(countdown = false) {
  clearInterval(countdownInterval);
  document.getElementById("countdown").style.display = "none";

  if (countdown) {
    document.getElementById("guessSlider").value = Math.floor(Math.random() * 100);
    alert("⏰ 时间到！你没能及时猜测！系统随机生成了猜测值：" + document.getElementById("guessSlider").value);
  }
  const guess = parseInt(document.getElementById("guessSlider").value);
  guessPercent = guess;

  const zoneSize = Math.floor((targetEnd - targetStart) / 3);
  const perfectStart = targetStart + zoneSize;
  const perfectEnd = targetEnd - zoneSize;

  let result = "";
  if (guess >= perfectStart && guess <= perfectEnd) {
    result = "💯 完美命中！太神啦！";

    // 🎉 视觉礼炮特效
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

// 🔊 播放音效
    const celebrateSound = document.getElementById("celebrateSound");
    celebrateSound.currentTime = 0;
    celebrateSound.play();




  } else if (guess >= targetStart && guess <= targetEnd) {
    result = "✅ 猜中了范围！不错！";
  } else {
    result = `😢 没猜中！正确范围是 ${targetStart} ~ ${targetEnd}`;
  }

  document.getElementById("guess-section").style.display = "none";
  document.getElementById("game-step").innerText = "";
      
  database.ref('rooms/' + currentRoomId).update({
    guessResult: {
      value: guess,
      start: targetStart,
      end: targetEnd,
      feedback: result
    },
    gameState: 'resultPhase',
    showTarget: true,
    showGuess: true,
    liveGuess: null,
    updatedAt: Date.now(), // ✅ 强制变化，触发监听器
  });
}

function nextRound() {
  resetUI();
  currentTurn = (currentTurn === 'host') ? 'guest' : 'host';
  database.ref('rooms/' + currentRoomId).update({
    gameState: 'waiting',
    showTarget: false,
    showGuess: false,
    currentHint: "",
    guessResult: null,
    liveGuess: null,
    currentTurn: currentTurn,
  });
}

function resetUI() {
  // 清除提示词和结果
  document.getElementById("hintBox").value = "";
  document.getElementById("hint").innerText = "（等待提示）";
  document.getElementById("result").innerText = "";
  
  // 隐藏输入/猜测区域
  document.getElementById("hint-input").style.display = "none";
  document.getElementById("guess-section").style.display = "none";

  // 隐藏下一轮按钮
  document.getElementById("nextRoundBtn").style.display = "none";

  // 重置进度提示
  document.getElementById("game-step").innerText = "等待开始新一轮...";

  // 清除红点
  guessPercent = null;

  // 重绘画布（无目标、无指针）
  drawArc(false, false);

}

// 倒计时函数
let countdownInterval;

function startCountdown(startTime, durationInSeconds) {
  clearInterval(countdownInterval);
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";

  countdownInterval = setInterval(() => {
    const now = Date.now();
    const secondsPassed = Math.floor((now - startTime) / 1000);
    const secondsLeft = Math.max(0, durationInSeconds - secondsPassed);
    countdownEl.textContent = `⏳ 剩余时间：${secondsLeft} 秒`;

    if (secondsLeft <= 0) {
      clearInterval(countdownInterval);
      handleTimeout();
    }
  }, 500);
}

function handleTimeout() {
  if (document.getElementById("hint-input").style.display !== "none") {
    // alert("⏰ 时间到！你没能及时出题！");
    confirmHint(true); // 自动提交空提示或提示框已有内容
  } 
  else if (document.getElementById("guess-section").style.display !== "none") {
    // alert("⏰ 时间到！你没能及时猜测！");
    submitGuess(true); // 自动提交当前滑动值
  }
}

// -------------------------
// 🔄 数据监听
// -------------------------
function startListening() {
  const roomRef = database.ref('rooms/' + currentRoomId);
  roomRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    if (!data.target && data.guest && playerRole === 'host') {
      document.getElementById("game-step").innerText = "玩家已加入，点击开始游戏！";
      document.getElementById("startGameBtn").style.display = "block";
    }

    if (data.gameState === 'hintPhase' && data.target) {
      targetStart = data.target.start;
      targetEnd = data.target.end;
      topic = { left: data.target.left, right: data.target.right };
      document.getElementById("left-label").innerText = topic.left;
      document.getElementById("right-label").innerText = topic.right;
      
    }

    if (data.liveGuess !== undefined && data.liveGuess !== null) {
      guessPercent = data.liveGuess;
    }
    drawArc(data.showTarget, data.showGuess || data.liveGuess !== undefined);

    if (data.gameState === 'hintPhase') {
      if (playerRole === data.currentTurn) {
        document.getElementById("hint-input").style.display = "block";
        drawArc(true);
        // 倒计时逻辑
        startCountdown(data.phaseStartTime, 10);
      } else {
        document.getElementById("game-step").innerText = "🕐 等待对方输入提示词...";
        document.getElementById("guess-section").style.display = "none";
      }
    }

    if (data.gameState === 'guessPhase') {
      if (playerRole !== data.currentTurn) {
        document.getElementById("hint").innerText = data.currentHint;
        document.getElementById("guess-section").style.display = "block";
        document.getElementById("game-step").innerText = "拖动以调整猜测区域";
        // 倒计时逻辑
        startCountdown(data.phaseStartTime, 10);
      } else {
        document.getElementById("game-step").innerText = "等待对方猜测...";
      }
    }

    if (data.gameState === 'resultPhase') {
      document.getElementById("result").innerText = data.guessResult.feedback;
      if (currentTurn !== playerRole) {
        document.getElementById("nextRoundBtn").style.display = "block";
      } else {
        document.getElementById("game-step").innerText = "";
      }
    }

    if (data.gameState === 'waiting') {
      if(data.currentTurn){
        currentTurn = data.currentTurn; // 更新当前的turn
      }
      if (currentTurn !== playerRole && data.target) {
        resetUI();
        document.getElementById("game-step").innerText = "🕐 等待对方输入提示词...";
      }
      if (currentTurn === playerRole && data.target) {
        hostStartGame();
      }
    }
  });
}

// -------------------------
// 🎯 弧线点击设置猜测 & 实时同步
// -------------------------
arcCanvas.addEventListener("mousedown", (e) => {
  if (document.getElementById("guess-section").style.display === "none") return;
  const rect = arcCanvas.getBoundingClientRect();
  const cx = arcCanvas.width / 2, cy = arcCanvas.height - 20;
  const dx = e.clientX - rect.left - cx;
  const dy = e.clientY - rect.top - cy;
  const angle = Math.atan2(dy, dx);
  if (angle >= Math.PI && angle <= 2 * Math.PI) {
    guessPercent = (angle - Math.PI) / Math.PI * 100;
    drawArc(false, true);
    database.ref('rooms/' + currentRoomId).update({ liveGuess: guessPercent });
  }
});

document.getElementById("guessSlider").addEventListener("input", () => {
  if (document.getElementById("guess-section").style.display !== "none") {
    guessPercent = parseInt(document.getElementById("guessSlider").value);
    drawArc(false, true);
    database.ref('rooms/' + currentRoomId).update({ liveGuess: guessPercent });
  }
});
