const R2_BASE_URL = "https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/";
const AUDIO_NORMAL_BASE_URL = R2_BASE_URL + "normal/";
const AUDIO_VOCAL_LOW_BASE_URL = R2_BASE_URL + "vocal-low/";
const AUDIO_INSTRUMENTAL_BASE_URL = R2_BASE_URL + "instrumental/";
const EMPTY_LYRIC = "歌词还没放进来，但歌可以先听。";
// 只有对应 MP3 已上传到 R2 后，才把歌曲 id 加入这些集合。
const VOCAL_REDUCED_AUDIO_IDS = new Set([
  "qing-tian",
  "shou-xie-de-cong-qian",
  "ye-qu",
  "fa-ru-xue",
  "ban-dao-tie-he",
  "deng-ni-xia-ke",
  "shuo-hao-bu-ku",
  "da-ben-zhong",
  "cai-hong",
  "ting-ma-ma-de-hua"
]);
const INSTRUMENTAL_AUDIO_IDS = new Set([
  "shou-xie-de-cong-qian",
  "fa-ru-xue",
  "ban-dao-tie-he",
  "deng-ni-xia-ke",
  "da-ben-zhong",
  "cai-hong"
]);

// 新增歌曲时优先使用这个工厂函数，最终得到的数据字段会保持一致。
function createSong(id, title, mood, audio, message, options = {}) {
  const lyricsTimed = options.lyricsTimed || [];
  return {
    id,
    title,
    artist: options.artist || "周杰伦",
    mood,
    audio,
    vocalReducedAudio: options.vocalReducedAudio ??
      (VOCAL_REDUCED_AUDIO_IDS.has(id) ? AUDIO_VOCAL_LOW_BASE_URL + `${id}.mp3` : ""),
    instrumentalAudio: options.instrumentalAudio ??
      (INSTRUMENTAL_AUDIO_IDS.has(id) ? AUDIO_INSTRUMENTAL_BASE_URL + `${id}.mp3` : ""),
    message,
    // 以下内容都是占位示例，不包含版权歌词。
    lyricPreview: options.lyricPreview || [],
    lyricsText: options.lyricsText || lyricsTimed.map((item) => item.text),
    lyricsTimed,
    singTips: options.singTips || [
      "不用唱完整，喜欢哪句就唱哪句。",
      "跑调也没关系，开心比较重要。",
      "今天这首歌，先陪你几分钟。",
      "如果唱累了，就安静听一会儿。",
      "轻轻唱，不用被谁听见。"
    ],
    qqMusicUrl: options.qqMusicUrl || "",
    searchKeyword: options.searchKeyword || `${title} 周杰伦`
  };
}

// 网页只保存 R2 音频文件名，不会在页面加载时预加载整份歌单。
const songs = [
  createSong(
    "qing-tian",
    "晴天",
    ["放空", "回忆", "陪伴"],
    AUDIO_NORMAL_BASE_URL + "qing-tian.mp3",
    "适合在天气不错的时候听，也适合只是随便想起从前。",
    {
      lyricsTimed: [
        { time: 0, text: "晴天 - 周杰伦 (Jay Chou)" },
        { time: 29, text: "故事的小黄花" },
        { time: 32, text: "从出生那年就飘着" },
        { time: 36, text: "童年的荡秋千" },
        { time: 39, text: "随记忆一直晃到现在" },
        { time: 42, text: "Re So So Si Do Si La" },
        { time: 45, text: "So La Si Si Si Si La Si La So" },
        { time: 48.9, text: "吹着前奏望着天空" },
        { time: 53, text: "我想起花瓣试着掉落" },
        { time: 56, text: "为你翘课的那一天" },
        { time: 57.9, text: "花落的那一天" },
        { time: 60, text: "教室的那一间" },
        { time: 62, text: "我怎么看不见" },
        { time: 64, text: "消失的下雨天" },
        { time: 65, text: "我好想再淋一遍" },
        { time: 69, text: "没想到失去的勇气我还留着" },
        { time: 76, text: "好想再问一遍" },
        { time: 77, text: "你会等待还是离开" },
        { time: 84, text: "刮风这天我试过握着你手" },
        { time: 90, text: "但偏偏雨渐渐大到我看你不见" },
        { time: 98, text: "还要多久我才能在你身边" },
        { time: 105, text: "等到放晴的那天也许我会比较好一点" },
        { time: 112, text: "从前从前有个人爱你很久" },
        { time: 118, text: "但偏偏风渐渐把距离吹得好远" },
        { time: 126, text: "好不容易又能再多爱一天" },
        { time: 133, text: "但故事的最后你好像还是说了拜拜" },
        { time: 154, text: "为你翘课的那一天" },
        { time: 156, text: "花落的那一天" },
        { time: 158, text: "教室的那一间" },
        { time: 160, text: "我怎么看不见" },
        { time: 162, text: "消失的下雨天" },
        { time: 163, text: "我好想再淋一遍" },
        { time: 168, text: "没想到失去的勇气我还留着" },
        { time: 174, text: "好想再问一遍" },
        { time: 176, text: "你会等待还是离开" },
        { time: 182, text: "刮风这天我试过握着你手" },
        { time: 188, text: "但偏偏雨渐渐大到我看你不见" },
        { time: 196, text: "还要多久我才能在你身边" },
        { time: 203, text: "等到放晴的那天也许我会比较好一点" },
        { time: 210, text: "从前从前有个人爱你很久" },
        { time: 217, text: "偏偏风渐渐把距离吹得好远" },
        { time: 224, text: "好不容易又能再多爱一天" },
        { time: 231, text: "但故事的最后你好像还是说了拜拜" },
        { time: 238, text: "刮风这天我试过握着你手" },
        { time: 241, text: "但偏偏雨渐渐大到我看你不见" },
        { time: 245, text: "还要多久我才能够在你身边" },
        { time: 249, text: "等到放晴那天也许我会比较好一点" },
        { time: 252, text: "从前从前有个人爱你很久" },
        { time: 255, text: "但偏偏雨渐渐把距离吹得好远" },
        { time: 259, text: "好不容易又能再多爱一天" },
        { time: 262, text: "但故事的最后你好像还是说了拜" }
      ]
    }
  ),
  createSong(
    "ai-ni-wu-cha",
    "爱你无差",
    ["甜一点"],
    AUDIO_NORMAL_BASE_URL + "ai-ni-wu-cha.mp3",
    "旋律温柔但不喧闹，刚好给今天加一点暖意。",
    {
      lyricsTimed: [
        { time: 0, text: "爱你没差 - 周杰伦 (Jay Chou)" },
        { time: 27, text: "没有圆周的钟" },
        { time: 30, text: "失去旋转意义" },
        { time: 35, text: "下雨这天 好安静" },
        { time: 40, text: "远行没有目的" },
        { time: 43, text: "距离不是问题" },
        { time: 47, text: "不爱了 是你的谜底" },
        { time: 52, text: "我占据格林威治守候着你" },
        { time: 55, text: "在时间标准起点回忆过去" },
        { time: 59, text: "你却在永夜了的极地旅行" },
        { time: 62, text: "等爱在失温后渐渐死去" },
        { time: 65, text: "喔 对不起" },
        { time: 66, text: "这句话 打乱了时区" },
        { time: 68, text: "喔 你要我 在最爱的时候睡去" },
        { time: 74, text: "我越想越清醒" },
        { time: 77, text: "喔 爱你没差 那一点时差 喔" },
        { time: 84, text: "你离开这一拳给的太重" },
        { time: 90, text: "我的心找不到" },
        { time: 93, text: "换日线它在哪" },
        { time: 97, text: "我只能不停的飞" },
        { time: 100, text: "直到我将你挽回" },
        { time: 103, text: "爱你不怕 那一点时差 喔" },
        { time: 110, text: "就让我静静一个人出发" },
        { time: 116, text: "你的心总有个" },
        { time: 119, text: "经纬度会留下" },
        { time: 122, text: "我会回到你世界" },
        { time: 126, text: "跨越爱的时差" },
        { time: 155, text: "没有圆周的钟" },
        { time: 158, text: "失去旋转意义" },
        { time: 163, text: "下雨这天 好安静" },
        { time: 168, text: "远行没有目的" },
        { time: 171, text: "距离不是问题" },
        { time: 175, text: "不爱了 是你的谜底" },
        { time: 180, text: "我占据格林威治守候着你" },
        { time: 183, text: "在时间标准起点回忆过去" },
        { time: 187, text: "你却在永夜了的极地旅行" },
        { time: 190, text: "等爱在失温后渐渐死去" },
        { time: 193, text: "喔 对不起 这句话" },
        { time: 195, text: "打乱了时区" },
        { time: 196, text: "喔 你要我 在最爱的时候睡去" },
        { time: 202, text: "我越想越清醒" },
        { time: 205, text: "喔 爱你没差" },
        { time: 208, text: "那一点时差 喔" },
        { time: 212, text: "你离开这一拳给的 太重" },
        { time: 217, text: "我的心找不到" },
        { time: 221, text: "换日线它在哪" },
        { time: 225, text: "我只能不停的飞" },
        { time: 228, text: "直到我将你挽回" },
        { time: 234, text: "那一点时差 喔" },
        { time: 238, text: "就让我静静一个人出发" },
        { time: 244, text: "你的心总有个" },
        { time: 246, text: "经纬度会留下" },
        { time: 250, text: "我会回到你世界" },
        { time: 254, text: "跨越爱的时差" }
      ]
    }
  ),
  createSong(
    "shou-xie-de-cong-qian",
    "手写的从前",
    ["陪伴", "回忆"],
    AUDIO_NORMAL_BASE_URL + "shou-xie-de-cong-qian.mp3",
    "适合把旧时光轻轻翻开一页，不打扰，只看看。",
    {
      lyricsTimed: [
        { time: 0, text: "手写的从前 - 周杰伦 (Jay Chou)" },
        { time: 10, text: "这风铃跟心动很接近" },
        { time: 16, text: "这封信还在怀念旅行" },
        { time: 21, text: "路过的爱情都太年轻" },
        { time: 25, text: "你是我想要 再回去的风景" },
        { time: 31, text: "这别离被瓶装成秘密" },
        { time: 35, text: "这雏菊美得像诗句" },
        { time: 39, text: "而我在风中等你 的消息" },
        { time: 44, text: "等月光落雪地" },
        { time: 48, text: "等枫红染秋季等相遇" },
        { time: 52, text: "我重温午后的阳光" },
        { time: 57, text: "将吉他斜背在肩上" },
        { time: 62, text: "跟多年前一样 我们轻轻地唱" },
        { time: 67, text: "去任何地方" },
        { time: 74, text: "我看着你的脸 轻刷着和弦" },
        { time: 79, text: "情人节卡片 手写的永远" },
        { time: 83, text: "还记得广场公园 一起表演" },
        { time: 89, text: "校园旁糖果店 记忆里在微甜" },
        { time: 94, text: "我看着你的脸 轻刷着和弦" },
        { time: 99, text: "初恋是整遍 手写的从前" },
        { time: 104, text: "还记得那年秋天 说了再见" },
        { time: 109, text: "当恋情已走远" },
        { time: 111, text: "我将你深埋在 心里面" },
        { time: 135, text: "微风需要竹林 溪流需要蜻蜓" },
        { time: 138, text: "乡愁般的离开 需要片片浮萍" },
        { time: 140, text: "记得那年的雨季 回忆里特安静" },
        { time: 143, text: "哭过后的决定 是否还能进行" },
        { time: 146, text: "我傻傻等待 傻傻等春暖花开" },
        { time: 148, text: "等终等于等明等白 等爱情回来" },
        { time: 151, text: "青春属于表白 阳光属于窗台" },
        { time: 153, text: "而我想我属于" },
        { time: 154, text: "一个拥有你的未来" },
        { time: 156, text: "纸上的彩虹 用素描画的钟" },
        { time: 158, text: "我还在修改 回忆之中你的笑容" },
        { time: 161, text: "该怎么去形容 为思念酝酿的痛" },
        { time: 164, text: "夜空霓虹 都是我不要的繁荣" },
        { time: 166, text: "或许去趟沙滩 或许去看看夕阳" },
        { time: 168, text: "或许任何一个可以想心事的地方" },
        { time: 171, text: "情绪在咖啡馆 被调成一篇文章" },
        { time: 174, text: "彻底爱上你如诗一般透明的泪光" },
        { time: 176, text: "我看着你的脸 轻刷着和弦" },
        { time: 181, text: "情人节卡片 手写的永远" },
        { time: 186, text: "还记得广场公园 一起表演" },
        { time: 191, text: "校园旁糖果店 记忆里在微甜" },
        { time: 196, text: "我看着你的脸 轻刷着和弦" },
        { time: 201, text: "初恋是整遍 手写的从前" },
        { time: 206, text: "还记得那年秋天 说了再见" },
        { time: 211, text: "当恋情已走远" },
        { time: 213, text: "我将你深埋在 心里面" },
        { time: 218, text: "我重温午后的阳光" },
        { time: 223, text: "将吉他斜背在肩上" },
        { time: 228, text: "跟多年前一样 我们轻轻地唱" },
        { time: 233, text: "去任何地方" },
        { time: 240, text: "我看着你的脸 轻刷着和弦" },
        { time: 245, text: "情人节卡片 手写的永远" },
        { time: 250, text: "还记得广场公园 一起表演" },
        { time: 254, text: "校园旁糖果店 记忆里在微甜" },
        { time: 260, text: "我看着你的脸 轻刷着和弦" },
        { time: 265, text: "初恋是整遍 手写的从前" },
        { time: 270, text: "还记得那年秋天 说了再见" },
        { time: 275, text: "当恋情已走远" },
        { time: 277, text: "我将你深埋在 心里面" }
      ]
    }
  ),
  createSong("ye-qu", "夜曲", ["emo"], AUDIO_NORMAL_BASE_URL + "ye-qu.mp3", "有些歌不用说太多，前奏响起时安静听就好。"),
  createSong(
    "fa-ru-xue",
    "发如雪",
    ["放空"],
    AUDIO_NORMAL_BASE_URL + "fa-ru-xue.mp3",
    "画面感很足的一首，适合戴上耳机慢慢听。",
    {
      lyricsTimed: [
        { time: 0, text: "发如雪 - 周杰伦 (Jay Chou)" },
        { time: 22, text: "狼牙月 伊人憔悴" },
        { time: 26, text: "我举杯 饮尽了风雪" },
        { time: 32, text: "是谁打翻前世柜 惹尘埃是非" },
        { time: 38, text: "缘字诀 几番轮回" },
        { time: 42, text: "你锁眉 哭红颜唤不回" },
        { time: 48, text: "纵然青史已经成灰 我爱不灭" },
        { time: 56, text: "繁华如三千东流水" },
        { time: 60, text: "我只取一瓢爱了解" },
        { time: 64, text: "只恋你化身的蝶" },
        { time: 70, text: "你发如雪 凄美了离别" },
        { time: 74, text: "我焚香感动了谁" },
        { time: 79, text: "邀明月 让回忆皎洁" },
        { time: 83, text: "爱在月光下完美" },
        { time: 86, text: "你发如雪 纷飞了眼泪" },
        { time: 91, text: "我等待苍老了谁" },
        { time: 95, text: "红尘醉 微醺的岁月" },
        { time: 100, text: "我用无悔 刻永世爱你的碑" },
        { time: 104, text: "你发如雪 凄美了离别" },
        { time: 107, text: "我焚香感动了谁" },
        { time: 108, text: "邀明月 让回忆皎洁" },
        { time: 111, text: "爱在月光下完美" },
        { time: 113, text: "你发如雪 纷飞了眼泪" },
        { time: 115, text: "我等待苍老了谁" },
        { time: 117, text: "红尘醉 微醺的岁月" },
        { time: 121, text: "狼牙月 伊人憔悴" },
        { time: 125, text: "我举杯 饮尽了风雪" },
        { time: 131, text: "是谁打翻前世柜 惹尘埃是非" },
        { time: 137, text: "缘字诀 几番轮回" },
        { time: 142, text: "你锁眉 哭红颜唤不回" },
        { time: 147, text: "纵然青史已经成灰 我爱不灭" },
        { time: 155, text: "繁华如三千东流水" },
        { time: 159, text: "我只取一瓢爱了解" },
        { time: 163, text: "只恋你化身的蝶" },
        { time: 169, text: "你发如雪 凄美了离别" },
        { time: 173, text: "我焚香感动了谁" },
        { time: 178, text: "邀明月 让回忆皎洁" },
        { time: 182, text: "爱在月光下完美" },
        { time: 185, text: "你发如雪 纷飞了眼泪" },
        { time: 190, text: "我等待苍老了谁" },
        { time: 195, text: "红尘醉 微醺的岁月" },
        { time: 199, text: "我用无悔 刻永世爱你的碑" },
        { time: 203, text: "你发如雪 凄美了离别" },
        { time: 206, text: "我焚香感动了谁" },
        { time: 208, text: "邀明月 让回忆皎洁" },
        { time: 210, text: "爱在月光下完美" },
        { time: 212, text: "你发如雪 纷飞了眼泪" },
        { time: 214, text: "我等待苍老了谁" },
        { time: 216, text: "红尘醉 微醺的岁月" },
        { time: 218, text: "你发如雪 凄美了离别" },
        { time: 223, text: "我焚香感动了谁" },
        { time: 228, text: "邀明月 让回忆皎洁" },
        { time: 232, text: "爱在月光下完美" },
        { time: 235, text: "你发如雪 纷飞了眼泪" },
        { time: 240, text: "我等待苍老了谁" },
        { time: 244, text: "红尘醉 微醺的岁月" },
        { time: 249, text: "我用无悔 刻永世爱你的碑" },
        { time: 256, text: "啦儿啦儿啦" },
        { time: 258, text: "啦儿啦 啦儿啦 啦儿啦儿啊" },
        { time: 262, text: "铜镜映无邪 扎马尾" },
        { time: 266, text: "你若撒野 今生我把酒奉陪" },
        { time: 270, text: "啦儿啦 啦儿啦 啦儿啦儿啦" },
        { time: 274, text: "啦儿啦 啦儿啦 啦儿啦儿啊" },
        { time: 279, text: "铜镜映无邪 扎马尾" },
        { time: 282, text: "你若撒野 今生我把酒奉陪" }
      ]
    }
  ),
  createSong("ban-dao-tie-he", "半岛铁盒", ["回忆"], AUDIO_NORMAL_BASE_URL + "ban-dao-tie-he.mp3", "老歌还是耐听，像翻到一件保存很好的旧物。"),
  createSong(
    "deng-ni-xia-ke",
    "等你下课",
    ["甜一点", "陪伴"],
    AUDIO_NORMAL_BASE_URL + "deng-ni-xia-ke.mp3",
    "适合下午听，给忙碌留一段不被催促的空白。",
    {
      lyricsTimed: [
        { time: 0, text: "等你下课(with 杨瑞代) - 周杰伦 (Jay Chou)" },
        { time: 15, text: "Jay：你住的 巷子里" },
        { time: 18, text: "我租了一间公寓" },
        { time: 22, text: "为了想与你不期而遇" },
        { time: 28, text: "高中三年 我为什么" },
        { time: 31, text: "为什么不好好读书" },
        { time: 35, text: "没考上跟你一样的大学" },
        { time: 40, text: "我找了份工作" },
        { time: 43, text: "离你宿舍很近" },
        { time: 46, text: "当我开始学会做蛋饼" },
        { time: 50, text: "才发现你 不吃早餐" },
        { time: 55, text: "喔 你又擦肩而过" },
        { time: 60, text: "你耳机听什么" },
        { time: 63, text: "能不能告诉我" },
        { time: 66, text: "合：躺在你学校的操场看星空" },
        { time: 74, text: "教室里的灯还亮着你没走" },
        { time: 80, text: "记得 我写给你的情书" },
        { time: 87, text: "都什么年代了" },
        { time: 90, text: "到现在我还在写着" },
        { time: 94, text: "总有一天总有一年会发现" },
        { time: 100, text: "有人默默的陪在你的身边" },
        { time: 106, text: "也许 我不该在你的世界" },
        { time: 113, text: "当你收到情书" },
        { time: 116, text: "也代表我已经走远" },
        { time: 144, text: "Gary：学校旁 的广场" },
        { time: 148, text: "我在这等钟声响" },
        { time: 152, text: "等你下课一起走好吗" },
        { time: 157, text: "Jay：弹着琴 唱你爱的歌" },
        { time: 161, text: "暗恋一点都不痛苦" },
        { time: 163, text: "Gary：一点都不痛苦" },
        { time: 165, text: "Jay：痛苦的是你" },
        { time: 166, text: "合：根本没看我" },
        { time: 169, text: "Jay：我唱这么走心" },
        { time: 172, text: "Gary：这么走心" },
        { time: 173, text: "Jay：却走不进你心里" },
        { time: 175, text: "Gary：进你心里" },
        { time: 176, text: "Jay：在人来人往" },
        { time: 178, text: "合：找寻着你 守护着你" },
        { time: 181, text: "不求结局" },
        { time: 184, text: "合：喔" },
        { time: 186, text: "Gary：你又擦肩" },
        { time: 187, text: "合：而过" },
        { time: 189, text: "Jay：我唱告白气球" },
        { time: 192, text: "终于你回了头" },
        { time: 196, text: "合：躺在你学校的操场看星空" },
        { time: 204, text: "教室里的灯还亮着你没走" },
        { time: 210, text: "记得 我写给你的情书" },
        { time: 217, text: "都什么年代了" },
        { time: 220, text: "到现在我还在写着" },
        { time: 223, text: "总有一天总有一年会发现" },
        { time: 230, text: "有人默默的陪在你的身边" },
        { time: 236, text: "也许 我不该在你的世界" },
        { time: 242, text: "当你收到情书" },
        { time: 246, text: "也代表我已经走远" }
      ]
    }
  ),
  createSong("shuo-hao-bu-ku", "说好不哭", ["emo"], AUDIO_NORMAL_BASE_URL + "shuo-hao-bu-ku.mp3", "旋律很顺，适合下班路上安安静静地听。"),
  createSong("da-ben-zhong", "大笨钟", ["放空", "甜一点"], AUDIO_NORMAL_BASE_URL + "da-ben-zhong.mp3", "俏皮一点也没关系，普通的一天需要些节奏。"),
  createSong("mojito", "Mojito", ["放空", "甜一点"], AUDIO_NORMAL_BASE_URL + "mojito.mp3", "节奏轻快，适合给普通的一天换个明亮背景。"),
  createSong("cai-hong", "彩虹", ["甜一点", "陪伴", "回忆"], AUDIO_NORMAL_BASE_URL + "cai-hong.mp3", "旋律温柔，适合把今天的步子稍微放慢一点。"),
  createSong("ting-ma-ma-de-hua", "听妈妈的话", ["放空", "陪伴", "回忆"], AUDIO_NORMAL_BASE_URL + "ting-ma-ma-de-hua.mp3", "熟悉又踏实的一首，适合在有点累时听听。")
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const drawView = $("#drawView");
const catalogView = $("#catalogView");
const moodPanel = $("#moodPanel");
const loadingCard = $("#loadingCard");
const resultCard = $("#resultCard");
const resultTags = $("#resultTags");
const songTitle = $("#songTitle");
const songArtist = $("#songArtist");
const songMessage = $("#songMessage");
const record = $("#record");
const tonearm = $("#tonearm");
const listenLayer = $("#listenLayer");
const singLayer = $("#singLayer");
const audioPlayer = $("#audioPlayer");
const audioStatus = $("#audioStatus");
const singAudioStatus = $("#singAudioStatus");
const listenLyricsViewport = $("#listenLyricsViewport");
const listenLyricsList = $("#listenLyricsList");
const lyricsViewport = $("#lyricsViewport");
const lyricsList = $("#lyricsList");
const songSearch = $("#songSearch");
const songList = $("#songList");
const emptyState = $("#emptyState");
const floatingPlayer = $("#floatingPlayer");
const floatingPlayerTitle = $("#floatingPlayerTitle");
const floatingPlayerStatus = $("#floatingPlayerStatus");
const floatingPlayButton = $("#floatingPlayButton");
const floatingModeButton = $("#floatingModeButton");
const messageLayer = $("#messageLayer");
const messageForm = $("#messageForm");
const messageInput = $("#messageInput");
const messageStatus = $("#messageStatus");
const singTip = $("#singTip");
const singSourceStatus = $("#singSourceStatus");
const singSourceDescription = $("#singSourceDescription");
const singVolumeSlider = $("#singVolumeSlider");
const singVolumeValue = $("#singVolumeValue");
const recordButton = $("#recordButton");
const recordingStatus = $("#recordingStatus");
const recordingDot = $("#recordingDot");
const recordedAudio = $("#recordedAudio");
const replayRecordingButton = $("#replayRecordingButton");
const rerecordButton = $("#rerecordButton");
const saveRecordingButton = $("#saveRecordingButton");
const bottomNav = $("#bottomNav");
const audioDebugPanel = $("#audioDebugPanel");
const audioDebugContent = $("#audioDebugContent");
const lyricsHelperLayer = $("#lyricsHelperLayer");
const lyricsSongSelect = $("#lyricsSongSelect");
const lyricsInput = $("#lyricsInput");
const lyricsHelperStatus = $("#lyricsHelperStatus");
const lyricsLockStatus = $("#lyricsLockStatus");
const helperLyricsList = $("#helperLyricsList");
const lyricsHelperAudio = $("#lyricsHelperAudio");
const lyricsExportWrap = $("#lyricsExportWrap");
const lyricsExportOutput = $("#lyricsExportOutput");

let currentSong = null;
let selectedMood = "随机";
let catalogFilter = "全部";
let drawTimer = null;
let activeLyricIndex = -1;
let lyricLineElements = [];
let lyricSyncTimer = null;
let currentMode = null;
let loadedSongId = null;
let playMode = "sequence";
let playHistory = [];
let currentSource = "mood";
let wasPlayingBeforeHidden = false;
let singAccompanyMode = "vocal";
let singVolume = 0.18;
let hasSavedSingVolume = false;
let mediaRecorder = null;
let recordingStream = null;
let recordingChunks = [];
let recordingBlob = null;
let recordingUrl = "";
let audioDebugTimer = null;
let helperLyricsText = [];
let helperTimedLyrics = [];
let helperActiveIndex = -1;
let helperSyncTimer = null;
let isManualAdjustingLyrics = false;
let tappingLineIndex = 0;
let tapHistory = [];
let helperIsManualLocked = false;

const LYRIC_SYNC_INTERVAL = 200;
const MESSAGE_STORAGE_KEY = "mood-box-pending-messages";
const LYRICS_STORAGE_PREFIX = "musicBoxLyricsTimed_";
const LEGACY_LYRICS_STORAGE_PREFIX = "musicBoxLyrics_";
const PLAY_MODE_STORAGE_KEY = "musicBoxPlayMode";
const SING_VOLUME_STORAGE_KEY = "musicBoxSingVolume";

try {
  const savedPlayMode = localStorage.getItem(PLAY_MODE_STORAGE_KEY);
  if (["sequence", "random", "repeat-one"].includes(savedPlayMode)) {
    playMode = savedPlayMode;
  }
} catch (error) {
  playMode = "sequence";
}

try {
  const savedSingVolumeRaw = localStorage.getItem(SING_VOLUME_STORAGE_KEY);
  if (savedSingVolumeRaw !== null) {
    const savedSingVolume = Number(savedSingVolumeRaw);
    if (Number.isFinite(savedSingVolume) && savedSingVolume >= 0 && savedSingVolume <= 1) {
      singVolume = savedSingVolume;
      hasSavedSingVolume = true;
    }
  }
} catch (error) {
  singAccompanyMode = "vocal";
  singVolume = 0.18;
}

function renderTags(container, moods) {
  container.innerHTML = moods.map((mood) => `<span class="tag">${mood}</span>`).join("");
}

function showBottomNav() {
  if (bottomNav) bottomNav.classList.remove("is-hidden");
  document.body.classList.remove("immersive-mode");
  showFloatingPlayer();
}

function hideBottomNav() {
  if (bottomNav) bottomNav.classList.add("is-hidden");
  document.body.classList.add("immersive-mode");
  hideFloatingPlayer();
}

function showFloatingPlayer() {
  if (floatingPlayer) floatingPlayer.classList.remove("is-hidden");
}

function hideFloatingPlayer() {
  if (floatingPlayer) floatingPlayer.classList.add("is-hidden");
}

function updateBottomNavVisibility() {
  const hasOpenLayer = !listenLayer.hidden || !singLayer.hidden ||
    !messageLayer.hidden || !lyricsHelperLayer.hidden;
  const hasSongDetail = !resultCard.hidden;
  if (hasOpenLayer || hasSongDetail) hideBottomNav();
  else showBottomNav();
}

function loadSavedLyrics() {
  songs.forEach((song) => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`${LYRICS_STORAGE_PREFIX}${song.id}`) ||
        localStorage.getItem(`${LEGACY_LYRICS_STORAGE_PREFIX}${song.id}`) ||
        "null"
      );
      if (!saved || saved.songId !== song.id) return;
      if (Array.isArray(saved.lyricsText)) song.lyricsText = saved.lyricsText;
      if (Array.isArray(saved.lyricsTimed)) {
        song.lyricsTimed = saved.lyricsTimed.map((item) => ({
          time: Number(item.time),
          text: String(item.text || "")
        }));
        song.lyricsMode = saved.mode === "manual" ? "manual" : (song.lyricsMode || "");
      }
      else if (Array.isArray(saved.lyricsAutoTimed)) song.lyricsTimed = saved.lyricsAutoTimed;
    } catch (error) {
      console.warn(`读取 ${song.title} 的本地歌词失败：`, error);
    }
  });
}

function switchView(viewName, resetSelection = false) {
  closeModes();
  const showDraw = viewName === "draw";
  drawView.hidden = !showDraw;
  catalogView.hidden = showDraw;
  $$(".nav-button[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === viewName);
  });
  if (resetSelection && showDraw) showMoodChoices();
  if (resetSelection && !showDraw) {
    resultCard.hidden = true;
    loadingCard.hidden = true;
  }
  updateBottomNavVisibility();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setTheme(theme) {
  const isMaple = theme === "maple";
  document.body.classList.toggle("theme-maple", isMaple);
  document.body.classList.toggle("theme-sunny", !isMaple);
  $("#themeButtonText").textContent = isMaple ? "枫" : "晴天";
  $("#themeHint").textContent = isMaple
    ? "风慢一点，歌也慢一点。"
    : "今天适合一点点阳光。";
  document.querySelector('meta[name="theme-color"]').content = isMaple ? "#efd5c5" : "#dfeefa";
  try {
    localStorage.setItem("mood-box-theme", isMaple ? "maple" : "sunny");
  } catch (error) {
    // 本地文件或隐私模式禁用存储时，主题仍可正常切换。
  }
}

function loadTheme() {
  let savedTheme = "sunny";
  try {
    savedTheme = localStorage.getItem("mood-box-theme") || "sunny";
  } catch (error) {
    savedTheme = "sunny";
  }
  setTheme(savedTheme);
}

function resetPlaybackUi() {
  setAudioStatus("");
  activeLyricIndex = -1;
  lyricLineElements.forEach((line) => line.classList.remove("is-active"));
  updatePlayButtonText(false);
  $("#singPlayButton").textContent = "开始轻唱";
  updateFloatingPlayer();
}

function setAudioStatus(message) {
  audioStatus.textContent = message;
  singAudioStatus.textContent = message;
  updateFloatingPlayer(message);
}

function updatePlayButtonText(isPlaying) {
  const button = $("#quietListenBtn");
  if (isPlaying) {
    button.textContent = "先暂停一下";
    return;
  }

  const canContinue = loadedSongId === currentSong?.id &&
    audioPlayer.currentTime > 0 &&
    !audioPlayer.ended;
  button.textContent = canContinue ? "继续静听" : "静听这一版";
}

function setPlayMode(mode) {
  playMode = ["sequence", "random", "repeat-one"].includes(mode) ? mode : "sequence";
  $("#listenPlayMode").value = playMode;
  $("#singPlayMode").value = playMode;
  try {
    localStorage.setItem(PLAY_MODE_STORAGE_KEY, playMode);
  } catch (error) {
    // 隐私模式禁用存储时，当前页面内的播放模式仍然有效。
  }
  updateFloatingPlayer();
}

function togglePlayMode() {
  const modes = ["sequence", "random", "repeat-one"];
  const nextIndex = (modes.indexOf(playMode) + 1) % modes.length;
  setPlayMode(modes[nextIndex]);
}

function getSingAudioSrc() {
  if (!currentSong) return "";
  if (singAccompanyMode === "instrumental") return currentSong.instrumentalAudio || "";
  if (singAccompanyMode === "vocal") {
    return currentSong.vocalReducedAudio || currentSong.audio || "";
  }
  return currentSong.audio || "";
}

function getCurrentAudioSrc() {
  if (!currentSong) return "";
  return currentMode === "sing" ? getSingAudioSrc() : (currentSong.audio || "");
}

function getCurrentAudioField() {
  if (!currentSong) return "";
  if (currentMode !== "sing") return "audio";
  if (singAccompanyMode === "instrumental") return "instrumentalAudio";
  return currentSong.vocalReducedAudio ? "vocalReducedAudio" : "audio";
}

function getSingPlaybackVolume() {
  if (hasSavedSingVolume && Number.isFinite(singVolume) && singVolume > 0) {
    return singVolume;
  }
  if (singAccompanyMode === "instrumental") return 0.8;
  return currentSong?.vocalReducedAudio ? 0.75 : 0.18;
}

function applyPlaybackVolume() {
  audioPlayer.muted = false;
  audioPlayer.volume = currentMode === "sing" ? getSingPlaybackVolume() : 1;
}

function resolveAudioUrl(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return new URL(src, window.location.href).href;
}

function updateFloatingPlayer(statusMessage = "") {
  if (!floatingPlayer) return;
  const modeLabels = {
    sequence: "顺序",
    random: "随机",
    "repeat-one": "单曲"
  };
  floatingPlayerTitle.textContent = currentSong?.title || "还没有开始播放";
  floatingPlayerStatus.textContent = currentSong
    ? (statusMessage || audioStatus.textContent || (audioPlayer.paused ? "已暂停" : "正在播放"))
    : "选一首歌后就可以开始";
  floatingPlayButton.textContent = currentSong && !audioPlayer.paused ? "暂停" : "播放";
  floatingModeButton.textContent = modeLabels[playMode];
}

function updateMediaSession() {
  if (!("mediaSession" in navigator) || !currentSong) return;
  try {
    if ("MediaMetadata" in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist || "周杰伦",
        album: "心情音乐盒"
      });
    }
  } catch (error) {
    console.warn("Media Session 信息设置失败：", error);
  }
}

function updateMediaPlaybackState(state) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = state;
  } catch (error) {
    // 旧版浏览器可能支持 metadata，但不支持 playbackState。
  }
}

// 切歌时只停止并释放旧音源，不加载新歌。
function releaseAudioTrack() {
  audioPlayer.pause();
  audioPlayer.removeAttribute("src");
  loadedSongId = null;
  clearRecordedClip();
  resetPlaybackUi();
}

function showAudioDiagnostics(song, targetSrc) {
  console.log("当前歌曲：", song.title);
  console.log("当前模式：", currentMode || "normal");
  console.log("陪唱模式：", currentMode === "sing" ? singAccompanyMode : "not active");
  console.log("实际播放字段：", getCurrentAudioField());
  console.log("音频路径：", getCurrentAudioSrc());
  console.log("实际请求地址：", targetSrc);
}

function updateAudioDebugPanel() {
  if (audioDebugPanel.hidden) return;
  const audioError = audioPlayer.error;
  audioDebugContent.textContent = [
    `song: ${currentSong?.title || "(none)"}`,
    `mode: ${currentMode || "normal"}`,
    `sing mode: ${currentMode === "sing" ? singAccompanyMode : "not active"}`,
    `currentSong.audio: ${currentSong?.audio || "(empty)"}`,
    `currentSong.vocalReducedAudio: ${currentSong?.vocalReducedAudio || "(empty)"}`,
    `currentSong.instrumentalAudio: ${currentSong?.instrumentalAudio || "(empty)"}`,
    `getCurrentAudioSrc(): ${getCurrentAudioSrc() || "(empty)"}`,
    `getSingAudioSrc(): ${getSingAudioSrc() || "(empty)"}`,
    `audio field: ${getCurrentAudioField() || "(none)"}`,
    `audioPlayer.src: ${audioPlayer.currentSrc || audioPlayer.src || "(empty)"}`,
    `audio error: ${audioError ? `${audioError.code} ${audioError.message || ""}`.trim() : "none"}`,
    `networkState: ${audioPlayer.networkState}`,
    `readyState: ${audioPlayer.readyState}`,
    `paused: ${audioPlayer.paused}`,
    `currentTime: ${Number.isFinite(audioPlayer.currentTime) ? audioPlayer.currentTime.toFixed(2) : "NaN"}`,
    `duration: ${Number.isFinite(audioPlayer.duration) ? audioPlayer.duration.toFixed(2) : "NaN"}`,
    `muted: ${audioPlayer.muted}`,
    `volume: ${audioPlayer.volume}`
  ].join("\n");
}

function initializeAudioDebugPanel() {
  const enabled = new URLSearchParams(window.location.search).get("debug") === "1";
  audioDebugPanel.hidden = !enabled;
  if (!enabled) return;
  updateAudioDebugPanel();
  audioDebugTimer = window.setInterval(updateAudioDebugPanel, 500);
}

// 静听和轻唱共用这一个播放函数及全局 audioPlayer。
async function playCurrentSong() {
  if (!currentSong) {
    setAudioStatus("先选一首歌吧。");
    return;
  }

  const src = getCurrentAudioSrc();
  if (!src) {
    setAudioStatus("这首歌还没有放音频。");
    return;
  }

  const audioUrl = resolveAudioUrl(src);
  console.log("准备播放：", currentSong.title);
  console.log("音频地址：", audioUrl);

  applyPlaybackVolume();
  console.log("muted:", audioPlayer.muted);
  console.log("volume:", audioPlayer.volume);

  if (/\.flac(?:$|[?#])/i.test(src)) {
    console.warn("当前使用 FLAC，部分手机或微信浏览器可能无法正常解码，建议转换为 MP3。");
  }

  if (audioPlayer.src !== audioUrl) {
    audioPlayer.pause();
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    loadedSongId = currentSong.id;
    updateMediaSession();
    updateFloatingPlayer();
  }
  loadedSongId = currentSong.id;

  try {
    setAudioStatus("音频加载中……");
    await audioPlayer.play();
  } catch (error) {
    console.error("播放失败：", error);
    setAudioStatus("播放被拦截了，再轻点一下试试。");
    updatePlayButtonText(false);
  }
}

function restoreAudioTimeWhenReady(previousTime) {
  if (!Number.isFinite(previousTime) || previousTime <= 0) return;

  const restoreTime = () => {
    try {
      if (Number.isFinite(audioPlayer.duration) && previousTime < audioPlayer.duration) {
        audioPlayer.currentTime = previousTime;
      }
    } catch (error) {
      console.warn("恢复轻唱进度失败：", error);
    }
  };

  if (audioPlayer.readyState >= 1) {
    restoreTime();
    return;
  }
  audioPlayer.addEventListener("loadedmetadata", restoreTime, { once: true });
}

function prepareSingAudioSource(src) {
  if (!src) {
    setAudioStatus("这首歌还没有可用音频。");
    return false;
  }

  const audioUrl = resolveAudioUrl(src);
  const previousTime = Number.isFinite(audioPlayer.currentTime) ? audioPlayer.currentTime : 0;
  applyPlaybackVolume();

  if (audioPlayer.src !== audioUrl) {
    audioPlayer.pause();
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    loadedSongId = currentSong?.id || null;
    restoreAudioTimeWhenReady(previousTime);
  }

  updateMediaSession();
  updateFloatingPlayer();
  updateAudioDebugPanel();
  return true;
}

async function switchAudioSourceAndPlay(src) {
  if (!src) {
    setAudioStatus("这首歌还没有可用音频。");
    return false;
  }

  const audioUrl = resolveAudioUrl(src);
  console.log("轻唱模式准备播放 URL：", audioUrl);
  console.log("当前歌曲：", currentSong?.title);
  console.log("当前模式：", currentMode);
  console.log("陪唱模式：", singAccompanyMode);

  if (!prepareSingAudioSource(src)) return false;

  audioPlayer.muted = false;
  applyPlaybackVolume();
  console.log("muted:", audioPlayer.muted);
  console.log("volume:", audioPlayer.volume);

  try {
    setAudioStatus("音频加载中……");
    await audioPlayer.play();
    return true;
  } catch (error) {
    console.error("轻唱播放被拦截或失败：", error);
    setAudioStatus("这首歌准备好了，再轻点一下就能听。");
    $("#singPlayButton").textContent = "开始轻唱";
    updateAudioDebugPanel();
    return false;
  }
}

async function startSingPlayback() {
  if (!currentSong) {
    setAudioStatus("先选一首歌吧。");
    return;
  }

  currentMode = "sing";
  const src = getSingAudioSrc();
  if (!src) {
    setAudioStatus("这首歌还没有可用的轻唱音频。");
    return;
  }

  await switchAudioSourceAndPlay(src);
}

function showMoodChoices() {
  closeModes();
  window.clearTimeout(drawTimer);
  loadingCard.hidden = true;
  resultCard.hidden = true;
  moodPanel.hidden = false;
  showBottomNav();
}

function updateBackButton() {
  $("#resultBackButton").textContent = currentSource === "library"
    ? "← 回到音乐盒"
    : "← 换个心情";
}

function chooseRandom(candidates) {
  if (candidates.length === 1) return candidates[0];
  let choice;
  do {
    choice = candidates[Math.floor(Math.random() * candidates.length)];
  } while (currentSong && choice.id === currentSong.id);
  return choice;
}

function animateRecord() {
  record.classList.remove("is-spinning");
  tonearm.classList.remove("is-moving");
  void record.offsetWidth;
  record.classList.add("is-spinning");
  tonearm.classList.add("is-moving");
  window.setTimeout(() => tonearm.classList.remove("is-moving"), 650);
}

function rememberCurrentSong(nextSong, shouldRemember = true) {
  if (!shouldRemember || !currentSong || currentSong.id === nextSong?.id) return;
  playHistory.push(currentSong.id);
  if (playHistory.length > 30) playHistory = playHistory.slice(-30);
}

function setCurrentSong(song, sourceMood = song.mood[0], source = "mood", options = {}) {
  closeModes();
  const isSongChanged = !currentSong || currentSong.id !== song.id;
  if (isSongChanged) {
    rememberCurrentSong(song, options.recordHistory !== false);
    releaseAudioTrack();
  }
  currentSong = song;
  selectedMood = sourceMood;
  currentSource = source;
  updateMediaSession();
  updateBackButton();
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songMessage.textContent = song.message;
  renderTags(resultTags, song.mood);
  moodPanel.hidden = true;
  loadingCard.hidden = true;
  resultCard.hidden = false;
  hideBottomNav();
  resultCard.classList.remove("is-entering");
  void resultCard.offsetWidth;
  resultCard.classList.add("is-entering");
  animateRecord();
  updateFloatingPlayer();
}

// 用户从心情盒子或音乐盒选歌时，共用这一条“选歌并静听”路径。
async function selectSongAndPlay(song, source, sourceMood = song.mood[0]) {
  setCurrentSong(song, sourceMood, source);
  openListenMode();

  try {
    await playCurrentSong();
  } catch (error) {
    // playCurrentSong 已显示真实播放错误。
  }
}

function renderCurrentSongWithoutClosingMode(song, options = {}) {
  const listenWasOpen = !listenLayer.hidden;
  const singWasOpen = !singLayer.hidden;
  const sourceMood = song.mood[0];

  rememberCurrentSong(song, options.recordHistory !== false);
  releaseAudioTrack();
  currentSong = song;
  selectedMood = sourceMood;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songMessage.textContent = song.message;
  renderTags(resultTags, song.mood);

  if (listenWasOpen) openListenMode();
  if (singWasOpen) openSingMode();
  updateFloatingPlayer();
}

function getCurrentSongIndex() {
  return currentSong ? songs.findIndex((song) => song.id === currentSong.id) : -1;
}

async function playSongByIndex(index, options = {}) {
  if (!songs.length) return;
  const normalizedIndex = ((index % songs.length) + songs.length) % songs.length;
  const song = songs[normalizedIndex];
  renderCurrentSongWithoutClosingMode(song, options);
  try {
    await playCurrentSong();
  } catch (error) {
    // 微信若阻止连续播放，统一播放函数会显示再次点击提示。
  }
  updateFloatingPlayer();
}

async function playRandomSong(options = {}) {
  if (!songs.length) return;
  const candidates = currentSong && songs.length > 1
    ? songs.filter((song) => song.id !== currentSong.id)
    : songs;
  const song = chooseRandom(candidates);
  const index = songs.findIndex((item) => item.id === song.id);
  await playSongByIndex(index, options);
}

async function playNextSong() {
  if (!songs.length) return;
  if (!currentSong) {
    await playSongByIndex(0);
    return;
  }

  if (playMode === "repeat-one") {
    audioPlayer.currentTime = 0;
    await playCurrentSong();
  } else if (playMode === "random") {
    await playRandomSong();
  } else {
    await playSongByIndex(getCurrentSongIndex() + 1);
  }
  updateFloatingPlayer();
}

async function playPreviousSong() {
  if (!songs.length) return;
  if (!currentSong) {
    await playSongByIndex(songs.length - 1);
    return;
  }

  if (playMode === "repeat-one") {
    audioPlayer.currentTime = 0;
    await playCurrentSong();
  } else if (playMode === "random") {
    const previousId = playHistory.pop();
    const previousIndex = songs.findIndex((song) => song.id === previousId);
    if (previousIndex >= 0) {
      await playSongByIndex(previousIndex, { recordHistory: false });
    } else {
      await playRandomSong({ recordHistory: false });
    }
  } else {
    await playSongByIndex(getCurrentSongIndex() - 1);
  }
  updateFloatingPlayer();
}

function drawSong(mood) {
  window.clearTimeout(drawTimer);
  selectedMood = mood;
  currentSource = "mood";

  let candidates = songs;
  if (mood === "彩蛋") {
    candidates = songs.filter((song) =>
      song.mood.includes("陪伴") || song.mood.includes("甜一点")
    );
  } else if (mood !== "随机") {
    candidates = songs.filter((song) => song.mood.includes(mood));
  }

  const selectedSong = chooseRandom(candidates);
  selectSongAndPlay(selectedSong, "mood", mood);
}

function openQqMusic() {
  if (!currentSong) return;
  const target = currentSong.qqMusicUrl ||
    `https://y.qq.com/n/ryqq/search?w=${encodeURIComponent(currentSong.searchKeyword)}`;
  window.open(target, "_blank", "noopener,noreferrer");
}

function getLyricsForCurrentSong() {
  if (!currentSong) return { type: "empty", lines: [] };
  if (Array.isArray(currentSong.lyricsTimed) && currentSong.lyricsTimed.length) {
    return {
      type: "timed",
      lines: [...currentSong.lyricsTimed].sort((a, b) => Number(a.time) - Number(b.time))
    };
  }
  if (Array.isArray(currentSong.lyricsText) && currentSong.lyricsText.length) {
    return { type: "text", lines: currentSong.lyricsText };
  }
  return { type: "empty", lines: [] };
}

function getTimedLyrics(song = currentSong) {
  if (!song) return [];
  if (song.lyricsTimed.length) {
    return [...song.lyricsTimed].sort((a, b) => Number(a.time) - Number(b.time));
  }
  if (song.lyricsText.length && Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
    const lineDuration = audioPlayer.duration / song.lyricsText.length;
    return song.lyricsText.map((text, index) => ({
      time: Number((index * lineDuration).toFixed(2)),
      text
    }));
  }
  return [];
}

function renderLyrics(container, options = {}) {
  if (!container) return;
  const mode = options.mode === "listen" ? "listen" : "sing";
  const lyricData = getLyricsForCurrentSong();
  const lineClass = mode === "listen" ? "listen-lyric-line" : "sing-lyric-line";
  const texts = lyricData.type === "timed"
    ? lyricData.lines.map((item) => item.text)
    : lyricData.lines;

  container.innerHTML = lyricData.type === "empty"
    ? `<p class="${lineClass} lyric-empty">${EMPTY_LYRIC}</p>`
    : texts.map((text, index) =>
      `<p class="${lineClass}" data-lyric-index="${index}">${text}</p>`
    ).join("");

  container.dataset.lyricType = lyricData.type;
  lyricLineElements = [...container.querySelectorAll("[data-lyric-index]")];
  activeLyricIndex = -1;
  if (container.parentElement) container.parentElement.scrollTop = 0;
}

function updateActiveLyric(container, options = {}) {
  if (!container || container.dataset.lyricType === "empty") return;
  const lyricData = getLyricsForCurrentSong();
  let nextIndex = -1;

  if (lyricData.type === "timed") {
    nextIndex = getActiveLyricIndexByTime(lyricData.lines, audioPlayer.currentTime);
  } else if (
    lyricData.type === "text" &&
    lyricData.lines.length &&
    Number.isFinite(audioPlayer.duration) &&
    audioPlayer.duration > 0
  ) {
    const lineDuration = audioPlayer.duration / lyricData.lines.length;
    nextIndex = Math.min(
      lyricData.lines.length - 1,
      Math.floor(audioPlayer.currentTime / lineDuration)
    );
  }

  if (nextIndex === activeLyricIndex) return;
  if (activeLyricIndex >= 0 && lyricLineElements[activeLyricIndex]) {
    lyricLineElements[activeLyricIndex].classList.remove("is-active");
  }
  activeLyricIndex = nextIndex;
  const activeLine = lyricLineElements[activeLyricIndex];
  if (!activeLine) return;

  activeLine.classList.add("is-active");
  if (options.scroll !== false && !isManualAdjustingLyrics) {
    activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function openListenMode() {
  if (!currentSong) return;
  singLayer.hidden = true;
  currentMode = "listen";
  applyPlaybackVolume();
  $("#listenTitle").textContent = currentSong.title;
  $("#listenArtist").textContent = currentSong.artist;
  $("#listenMessage").textContent = currentSong.message;
  renderTags($("#listenTags"), currentSong.mood);

  renderLyrics(listenLyricsList, { mode: "listen", compact: true });
  listenLayer.hidden = false;
  hideBottomNav();
  document.body.style.overflow = "hidden";
}

function openCurrentSongListenView() {
  if (!currentSong) {
    setAudioStatus("先选一首歌吧。");
    return;
  }

  currentSource = "floating";
  currentMode = "listen";
  openListenMode();
  updatePlayButtonText(!audioPlayer.paused);
}

function openSingMode() {
  if (!currentSong) return;
  listenLayer.hidden = true;
  currentMode = "sing";
  singAccompanyMode = "vocal";
  applyPlaybackVolume();
  $("#singTitle").textContent = currentSong.title;
  const tips = currentSong.singTips.length ? currentSong.singTips : [
    "轻轻唱，不用被谁听见。"
  ];
  singTip.textContent = tips[Math.floor(Math.random() * tips.length)];
  $$(".sing-atmosphere-button").forEach((button, index) => {
    button.classList.toggle("is-active", index === 0);
  });
  updateSingSourceUi();
  renderLyrics(lyricsList, { mode: "sing", compact: false });
  singLayer.hidden = false;
  hideBottomNav();
  document.body.style.overflow = "hidden";

  const targetUrl = resolveAudioUrl(getSingAudioSrc());
  if (audioPlayer.getAttribute("src") && targetUrl && audioPlayer.src !== targetUrl) {
    selectSingSource(singAccompanyMode, true);
  }
}

function closeModes() {
  const wasSinging = !singLayer.hidden;
  if (wasSinging) {
    audioPlayer.pause();
    if (mediaRecorder?.state === "recording") stopRecording();
    else stopRecordingTracks();
  }
  listenLayer.hidden = true;
  singLayer.hidden = true;
  currentMode = null;
  document.body.style.overflow = "";
  updateBottomNavVisibility();
}

function updateSingSourceUi() {
  $$(".sing-source-button").forEach((button) => {
    const isUnavailableInstrumental =
      button.dataset.singSource === "instrumental" && !currentSong?.instrumentalAudio;
    button.classList.toggle("is-unavailable", isUnavailableInstrumental);
    button.setAttribute("aria-disabled", String(isUnavailableInstrumental));
    button.textContent = isUnavailableInstrumental ? "轻伴唱（暂无）" :
      (button.dataset.singSource === "instrumental" ? "轻伴唱" : "原声陪唱");
    button.classList.toggle("is-active", button.dataset.singSource === singAccompanyMode);
  });
  const displayedVolume = getSingPlaybackVolume();
  singVolumeSlider.value = String(displayedVolume);
  singVolumeValue.textContent = `${Math.round(displayedVolume * 100)}%`;
  singVolumeSlider.disabled = false;

  if (singAccompanyMode === "instrumental") {
    singSourceDescription.textContent = "这一版主要留下旋律和伴奏，声音留给你。";
    singSourceStatus.textContent = "现在是轻伴唱，旋律会多一点，声音留给你。";
  } else {
    singSourceDescription.textContent = currentSong?.vocalReducedAudio
      ? "这一版声音已经放轻，留更多空间给你唱。"
      : "暂时使用普通版低音量陪唱，留更多空间给你唱。";
    singSourceStatus.textContent = currentSong?.vocalReducedAudio
      ? "已切换到人声降低版。"
      : "没有人声降低版，已使用普通版低音量陪唱。";
  }
}

async function selectSingSource(mode, force = false) {
  if (!currentSong || (!force && mode === singAccompanyMode)) return;
  if (mode === "instrumental" && !currentSong.instrumentalAudio) {
    singSourceStatus.textContent = "这首还没有伴奏版，先用原声陪唱轻轻跟一下。";
    return;
  }

  const wasPlaying = !audioPlayer.paused;
  currentMode = "sing";
  singAccompanyMode = mode;
  updateSingSourceUi();

  const src = getSingAudioSrc();
  if (!src) {
    setAudioStatus(mode === "vocal"
      ? "这首歌还没有可用的原声陪唱。"
      : "这首歌还没有可用的轻唱音频。");
    return;
  }

  try {
    if (wasPlaying) {
      await switchAudioSourceAndPlay(src);
    } else {
      prepareSingAudioSource(src);
      setAudioStatus("这首歌准备好了，再轻点一下就能听。");
    }
  } catch (error) {
    console.error("切换陪唱音源失败：", error);
    setAudioStatus("这首歌准备好了，再轻点一下就能听。");
    updatePlayButtonText(false);
    $("#singPlayButton").textContent = "开始轻唱";
  }
}

function stopRecordingTracks() {
  if (!recordingStream) return;
  recordingStream.getTracks().forEach((track) => track.stop());
  recordingStream = null;
}

function finishRecordingUi() {
  recordButton.textContent = "录一小段";
  recordingDot.classList.remove("is-recording");
}

function clearRecordedClip() {
  recordedAudio.pause();
  recordedAudio.removeAttribute("src");
  if (recordingUrl) URL.revokeObjectURL(recordingUrl);
  recordingUrl = "";
  recordingBlob = null;
  replayRecordingButton.hidden = true;
  rerecordButton.hidden = true;
  saveRecordingButton.hidden = true;
}

function getRecordingMimeType() {
  if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== "function") return "";
  return [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function startRecording() {
  if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
    recordingStatus.textContent = "这个浏览器暂时不支持录音，轻轻唱也很好。";
    return;
  }

  try {
    clearRecordedClip();
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = getRecordingMimeType();
    mediaRecorder = mimeType
      ? new MediaRecorder(recordingStream, { mimeType })
      : new MediaRecorder(recordingStream);
    recordingChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) recordingChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const type = mediaRecorder.mimeType || mimeType || "audio/webm";
      recordingBlob = new Blob(recordingChunks, { type });
      recordingUrl = URL.createObjectURL(recordingBlob);
      recordedAudio.src = recordingUrl;
      replayRecordingButton.hidden = false;
      rerecordButton.hidden = false;
      saveRecordingButton.hidden = false;
      recordingStatus.textContent = "这一小段已经留在设备里啦。";
      finishRecordingUi();
      stopRecordingTracks();
    }, { once: true });

    mediaRecorder.addEventListener("error", () => {
      recordingStatus.textContent = "刚刚没有录下来，轻轻唱也很好。";
      finishRecordingUi();
      stopRecordingTracks();
    }, { once: true });

    mediaRecorder.start();
    recordButton.textContent = "结束录音";
    recordingDot.classList.add("is-recording");
    recordingStatus.textContent = "正在录这一小段……";
  } catch (error) {
    console.info("麦克风没有开启：", error);
    recordingStatus.textContent = error?.name === "NotAllowedError"
      ? "没关系，不录也可以唱。"
      : "这个浏览器暂时不支持录音，轻轻唱也很好。";
    finishRecordingUi();
    stopRecordingTracks();
  }
}

function stopRecording() {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.stop();
  } else {
    finishRecordingUi();
    stopRecordingTracks();
  }
}

function exitSingMode() {
  audioPlayer.pause();
  if (mediaRecorder?.state === "recording") stopRecording();
  else stopRecordingTracks();
  singLayer.hidden = true;
  currentMode = null;
  document.body.style.overflow = "";
  updateBottomNavVisibility();
}

function openCurrentSong() {
  if (!currentSong) return;
  closeMessageBox();
  switchView("draw");
  updateBackButton();
  openListenMode();
}

async function togglePlayback() {
  if (!currentSong) {
    await playSongByIndex(0);
    return;
  }
  if (!audioPlayer.paused) {
    audioPlayer.pause();
    return;
  }

  try {
    await playCurrentSong();
  } catch (error) {
    // playCurrentSong 已显示适合用户阅读的提示。
  }
}

function getActiveLyricIndexByTime(lyricsTimed, currentTime) {
  if (!lyricsTimed || lyricsTimed.length === 0) return -1;
  let activeIndex = -1;
  for (let index = 0; index < lyricsTimed.length; index += 1) {
    if (currentTime >= lyricsTimed[index].time) activeIndex = index;
    else break;
  }
  return activeIndex;
}

function syncTimedLyrics() {
  if (currentMode === "listen" && !listenLayer.hidden) {
    updateActiveLyric(listenLyricsList, { mode: "listen" });
    return;
  }
  if (currentMode === "sing" && !singLayer.hidden) {
    updateActiveLyric(lyricsList, { mode: "sing" });
  }
}

function startLyricSyncTimer() {
  if (lyricSyncTimer !== null) return;
  lyricSyncTimer = window.setInterval(syncTimedLyrics, LYRIC_SYNC_INTERVAL);
}

function renderCatalog() {
  const keyword = songSearch.value.trim().toLowerCase();
  const filtered = songs.filter((song) => {
    const matchesMood = catalogFilter === "全部" || song.mood.includes(catalogFilter);
    const matchesSearch = !keyword || song.title.toLowerCase().includes(keyword);
    return matchesMood && matchesSearch;
  });

  songList.innerHTML = filtered.map((song) => `
    <button class="song-item" type="button" data-song-id="${song.id}">
      <span class="song-item-main">
        <span class="song-item-title">${song.title}</span>
        <span class="song-item-message">${song.message}</span>
        <span class="song-item-hint">点一下就听</span>
      </span>
      <span class="tag-row">${song.mood.map((mood) => `<span class="tag">${mood}</span>`).join("")}</span>
    </button>
  `).join("");
  emptyState.hidden = filtered.length !== 0;
}

function selectedHelperSong() {
  return songs.find((song) => song.id === lyricsSongSelect.value) || songs[0];
}

function organizeLyrics(rawText) {
  const normalized = rawText
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
  if (!normalized) return [];

  let parts = normalized.split(/\n+/);
  if (parts.length === 1) {
    parts = normalized
      .replace(/([，。！？；!?;])/g, "$1\n")
      .split(/\n+/);
  }

  const lines = [];
  parts.forEach((part) => {
    const clean = part.trim();
    if (!clean) return;
    if (clean.length <= 36) {
      lines.push(clean);
      return;
    }
    const smaller = clean
      .replace(/([，。！？；!?;])/g, "$1\n")
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    lines.push(...(smaller.length > 1 ? smaller : [clean]));
  });
  return lines;
}

function parseTimeInput(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const chineseMatch = raw.match(/^(\d+)\s*分\s*(\d+(?:\.\d+)?)\s*秒?$/);
  if (chineseMatch) {
    const minutes = Number(chineseMatch[1]);
    const seconds = Number(chineseMatch[2]);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds >= 60) return null;
    return minutes * 60 + seconds;
  }

  const colonMatch = raw.match(/^(\d+):(\d+(?:\.\d+)?)$/);
  if (colonMatch) {
    const minutes = Number(colonMatch[1]);
    const seconds = Number(colonMatch[2]);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds >= 60) return null;
    return minutes * 60 + seconds;
  }

  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds;
  }
  return null;
}

function normalizeLyricTime(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100) / 100;
}

function formatSecondsToMinute(seconds) {
  const numeric = Number(seconds);
  if (!Number.isFinite(numeric) || numeric < 0) return "";
  const minutes = Math.floor(numeric / 60);
  const remainder = numeric - minutes * 60;
  let secondText = remainder.toFixed(2).replace(/0$/, "");
  if (!secondText.includes(".")) secondText += ".0";
  const [whole, fraction] = secondText.split(".");
  return `${minutes}:${whole.padStart(2, "0")}.${fraction}`;
}

function renderHelperLyrics() {
  helperLyricsList.replaceChildren();
  if (!helperLyricsText.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "整理后的歌词会出现在这里。";
    helperLyricsList.append(empty);
    return;
  }

  helperLyricsText.forEach((text, index) => {
    const row = document.createElement("div");
    row.className = "helper-lyric-row";
    row.dataset.helperIndex = index;
    row.classList.toggle("is-active", index === tappingLineIndex);

    const fields = document.createElement("div");
    fields.className = "helper-row-fields";
    const timeField = document.createElement("label");
    timeField.className = "helper-time-field";
    const time = document.createElement("input");
    time.className = "helper-time-input";
    time.type = "text";
    time.inputMode = "decimal";
    time.placeholder = "例如 1:12.5";
    time.dataset.timeIndex = index;
    time.value = helperTimedLyrics[index]?.timeInput ??
      formatSecondsToMinute(helperTimedLyrics[index]?.time);
    const timeHint = document.createElement("small");
    timeHint.textContent = "格式：分:秒，例如 1:12.5";
    const secondsPreview = document.createElement("small");
    secondsPreview.className = "helper-seconds-preview";
    const parsedTime = parseTimeInput(time.value);
    secondsPreview.textContent = parsedTime === null ? "" : `= ${parsedTime} 秒`;
    timeField.append(time, timeHint, secondsPreview);

    const lyric = document.createElement("input");
    lyric.className = "helper-text-input";
    lyric.type = "text";
    lyric.placeholder = "这一句歌词";
    lyric.dataset.textIndex = index;
    lyric.value = text;
    fields.append(timeField, lyric);

    const actions = document.createElement("span");
    actions.className = "helper-line-actions";
    const earlier = document.createElement("button");
    earlier.type = "button";
    earlier.dataset.lineShift = "-0.3";
    earlier.dataset.lineIndex = index;
    earlier.textContent = "提前 0.3 秒";
    const later = document.createElement("button");
    later.type = "button";
    later.dataset.lineShift = "0.3";
    later.dataset.lineIndex = index;
    later.textContent = "延后 0.3 秒";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-line-button";
    remove.dataset.deleteLine = index;
    remove.textContent = "删除这一句";
    const add = document.createElement("button");
    add.type = "button";
    add.dataset.addLineAfter = index;
    add.textContent = "在下面新增一句";
    actions.append(earlier, later, remove, add);

    row.append(fields, actions);
    helperLyricsList.append(row);
  });
}

function keepScrollWhileAdjusting(callback) {
  const oldListScrollTop = helperLyricsList.scrollTop;
  const helperCard = lyricsHelperLayer.querySelector(".lyrics-helper-card");
  const oldCardScrollTop = helperCard ? helperCard.scrollTop : 0;
  const oldWindowScrollY = window.scrollY;
  isManualAdjustingLyrics = true;

  callback();

  window.requestAnimationFrame(() => {
    helperLyricsList.scrollTop = oldListScrollTop;
    if (helperCard) helperCard.scrollTop = oldCardScrollTop;
    window.scrollTo({ top: oldWindowScrollY, behavior: "auto" });
    isManualAdjustingLyrics = false;
  });
}

function collectHelperTimedLyrics({ normalize = false } = {}) {
  return helperLyricsText
    .map((text, index) => {
      const parsedTime = parseTimeInput(
        helperTimedLyrics[index]?.timeInput ?? helperTimedLyrics[index]?.time
      );
      const time = normalize ? normalizeLyricTime(parsedTime) : parsedTime;
      return {
        time,
        text: String(text || "").trim(),
        sourceIndex: index
      };
    });
}

function validHelperTimedLyrics({
  sorted = false,
  normalize = false,
  includeIndex = false
} = {}) {
  const valid = collectHelperTimedLyrics({ normalize })
    .filter((item) => item.text && Number.isFinite(item.time));
  const ordered = sorted ? [...valid].sort((a, b) => a.time - b.time) : valid;
  return includeIndex
    ? ordered
    : ordered.map(({ time, text }) => ({ time, text }));
}

function updateLyricsLockStatus() {
  lyricsLockStatus.textContent = helperIsManualLocked
    ? "手动时间已锁定，保存后不会自动变化。"
    : "当前使用：手动时间节点";
}

function loadHelperSong(songId) {
  const song = songs.find((item) => item.id === songId) || songs[0];
  helperIsManualLocked = song.lyricsMode === "manual" || song.lyricsTimed.length > 0;
  helperLyricsText = song.lyricsText.length
    ? [...song.lyricsText]
    : song.lyricsTimed.map((item) => item.text);
  const usedTimedIndexes = new Set();
  helperTimedLyrics = helperLyricsText.map((text, index) => {
    let timedIndex = -1;
    if (
      song.lyricsTimed[index]?.text === text &&
      !usedTimedIndexes.has(index)
    ) {
      timedIndex = index;
    } else {
      timedIndex = song.lyricsTimed.findIndex((item, itemIndex) =>
        !usedTimedIndexes.has(itemIndex) && item.text === text
      );
    }
    if (timedIndex >= 0) usedTimedIndexes.add(timedIndex);
    const timed = timedIndex >= 0 ? song.lyricsTimed[timedIndex] : null;
    const time = Number.isFinite(timed?.time) ? timed.time : null;
    return { time, timeInput: formatSecondsToMinute(time), text };
  });
  lyricsInput.value = helperLyricsText.join("\n");
  lyricsExportWrap.hidden = true;
  helperActiveIndex = -1;
  tappingLineIndex = 0;
  tapHistory = [];
  lyricsHelperAudio.pause();
  lyricsHelperAudio.removeAttribute("src");
  renderHelperLyrics();
  updateLyricsLockStatus();
}

function openLyricsHelper() {
  lyricsSongSelect.innerHTML = songs
    .map((song) => `<option value="${song.id}">${song.title}</option>`)
    .join("");
  lyricsSongSelect.value = currentSong?.id || songs[0]?.id || "";
  loadHelperSong(lyricsSongSelect.value);
  lyricsHelperStatus.textContent = "时间不用特别精准，差一点也没关系，有氛围就很好。";
  lyricsHelperLayer.hidden = false;
  hideBottomNav();
  document.body.style.overflow = "hidden";
}

function stopHelperSyncTimer() {
  if (helperSyncTimer === null) return;
  window.clearInterval(helperSyncTimer);
  helperSyncTimer = null;
}

function closeLyricsHelper() {
  lyricsHelperAudio.pause();
  stopHelperSyncTimer();
  $("#startTappingButton").textContent = "开始播放并打点";
  lyricsHelperLayer.hidden = true;
  if (listenLayer.hidden && singLayer.hidden && messageLayer.hidden) {
    document.body.style.overflow = "";
  }
  updateBottomNavVisibility();
}

function readHelperDuration(song) {
  return new Promise((resolve, reject) => {
    if (!song?.audio) {
      reject(new Error("missing audio"));
      return;
    }
    const absoluteSrc = resolveAudioUrl(song.audio);
    const finish = () => {
      if (Number.isFinite(lyricsHelperAudio.duration) && lyricsHelperAudio.duration > 0) {
        resolve(lyricsHelperAudio.duration);
      } else {
        reject(new Error("invalid duration"));
      }
    };
    if (lyricsHelperAudio.src === absoluteSrc && lyricsHelperAudio.readyState >= 1) {
      finish();
      return;
    }
    lyricsHelperAudio.pause();
    lyricsHelperAudio.preload = "metadata";
    lyricsHelperAudio.src = absoluteSrc;
    lyricsHelperAudio.addEventListener("loadedmetadata", finish, { once: true });
    lyricsHelperAudio.addEventListener("error", () => reject(new Error("metadata error")), { once: true });
    lyricsHelperAudio.load();
  });
}

function syncHelperPreview() {
  const timedLyrics = validHelperTimedLyrics({ sorted: true, includeIndex: true });
  if (!timedLyrics.length) return;
  let nextIndex = -1;
  for (let index = 0; index < timedLyrics.length; index += 1) {
    if (lyricsHelperAudio.currentTime >= timedLyrics[index].time) nextIndex = index;
    else break;
  }
  if (nextIndex === helperActiveIndex) return;
  const oldRow = helperLyricsList.querySelector(".helper-lyric-row.is-active");
  if (oldRow) oldRow.classList.remove("is-active");
  helperActiveIndex = nextIndex;
  const sourceIndex = timedLyrics[nextIndex]?.sourceIndex;
  const row = helperLyricsList.querySelector(`[data-helper-index="${sourceIndex}"]`);
  if (row) {
    row.classList.add("is-active");
    if (!isManualAdjustingLyrics) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

async function startTappingPlayback(reset = false) {
  const song = selectedHelperSong();
  if (!helperLyricsText.length) {
    lyricsHelperStatus.textContent = "先整理歌词，再开始听着打点。";
    return;
  }
  try {
    await readHelperDuration(song);
    if (reset) lyricsHelperAudio.currentTime = 0;
    lyricsHelperAudio.muted = false;
    lyricsHelperAudio.volume = 1;
    await lyricsHelperAudio.play();
    $("#startTappingButton").textContent = "正在播放并打点";
    lyricsHelperStatus.textContent = `正在播放，听到第 ${tappingLineIndex + 1} 句时轻点“给这一句打点”。`;
  } catch (error) {
    lyricsHelperStatus.textContent = "播放没有开始，再轻点一下试试。";
  }
}

function saveHelperLyrics() {
  const song = selectedHelperSong();
  if (!song || !helperLyricsText.length) {
    lyricsHelperStatus.textContent = "先放一点歌词进来再保存。";
    return;
  }
  const timedLyrics = validHelperTimedLyrics({ normalize: true });
  song.lyricsText = [...helperLyricsText];
  song.lyricsTimed = timedLyrics;
  song.lyricsMode = "manual";
  const payload = {
    songId: song.id,
    mode: "manual",
    lyricsText: song.lyricsText,
    lyricsTimed: song.lyricsTimed,
    updatedAt: new Date().toLocaleString("zh-CN", { hour12: false })
  };
  try {
    localStorage.setItem(`${LYRICS_STORAGE_PREFIX}${song.id}`, JSON.stringify(payload));
    helperIsManualLocked = true;
    updateLyricsLockStatus();
    lyricsHelperStatus.textContent = "歌词已经放进这首歌里啦，手动时间不会自动变化。";
  } catch (error) {
    lyricsHelperStatus.textContent = "这次没能保存到浏览器，请先导出歌词代码。";
  }
  if (currentSong?.id === song.id) {
    if (!listenLayer.hidden) {
      renderLyrics(listenLyricsList, { mode: "listen", compact: true });
    } else if (!singLayer.hidden) {
      renderLyrics(lyricsList, { mode: "sing", compact: false });
    }
  }
}

function exportHelperLyrics() {
  const timedLyrics = validHelperTimedLyrics({ sorted: true, normalize: true });
  if (!timedLyrics.length) {
    lyricsHelperStatus.textContent = "还没有可导出的时间节点。";
    return;
  }
  const timedLines = timedLyrics
    .map((item) => `  { time: ${item.time}, text: ${JSON.stringify(item.text)} }`)
    .join(",\n");
  lyricsExportOutput.value = `lyricsTimed: [\n${timedLines}\n]`;
  lyricsExportWrap.hidden = false;
  lyricsHelperStatus.textContent = "时间节点歌词已经生成，可以复制回 script.js。";
}

async function autoMatchHelperLyrics() {
  const song = selectedHelperSong();
  if (!song || !helperLyricsText.length) {
    lyricsHelperStatus.textContent = "先整理歌词，再自动匹配进度。";
    return;
  }
  if (
    helperIsManualLocked &&
    !window.confirm("自动匹配会覆盖当前手动时间，确定继续吗？")
  ) {
    lyricsHelperStatus.textContent = "已经保留当前手动时间。";
    return;
  }

  try {
    const duration = await readHelperDuration(song);
    const lineDuration = duration / helperLyricsText.length;
    keepScrollWhileAdjusting(() => {
      helperTimedLyrics = helperLyricsText.map((text, index) => {
        const time = index * lineDuration;
        return {
          time,
          timeInput: formatSecondsToMinute(time),
          text
        };
      });
      helperIsManualLocked = false;
      updateLyricsLockStatus();
      renderHelperLyrics();
    });
    lyricsHelperStatus.textContent = "已经自动匹配进度，确认后再保存到这首歌。";
  } catch (error) {
    lyricsHelperStatus.textContent = "音频时长还没读出来，先点播放并打点试试。";
  }
}

function markCurrentHelperLine() {
  if (!helperLyricsText.length || tappingLineIndex >= helperLyricsText.length) {
    lyricsHelperStatus.textContent = "这一轮已经全部打点完成啦。";
    return;
  }
  if (lyricsHelperAudio.paused) {
    lyricsHelperStatus.textContent = "先开始播放，再给当前句打点。";
    return;
  }
  const index = tappingLineIndex;
  tapHistory.push({
    index,
    previousTime: helperTimedLyrics[index]?.time ?? null,
    previousTimeInput: helperTimedLyrics[index]?.timeInput ?? ""
  });
  const tappedTime = lyricsHelperAudio.currentTime;
  helperTimedLyrics[index] = {
    time: tappedTime,
    timeInput: formatSecondsToMinute(tappedTime),
    text: helperLyricsText[index]
  };
  tappingLineIndex = Math.min(index + 1, helperLyricsText.length);
  renderHelperLyrics();
  const nextRow = helperLyricsList.querySelector(`[data-helper-index="${tappingLineIndex}"]`);
  if (nextRow) nextRow.scrollIntoView({ behavior: "smooth", block: "center" });
  lyricsHelperStatus.textContent = tappingLineIndex >= helperLyricsText.length
    ? "全部歌词都打好点啦，可以保存或导出。"
    : `已记录 ${helperTimedLyrics[index].time.toFixed(2)} 秒，准备第 ${tappingLineIndex + 1} 句。`;
}

function undoLastTap() {
  const previous = tapHistory.pop();
  if (!previous) {
    lyricsHelperStatus.textContent = "还没有可以撤销的打点。";
    return;
  }
  tappingLineIndex = previous.index;
  helperTimedLyrics[previous.index] = {
    time: previous.previousTime,
    timeInput: previous.previousTimeInput,
    text: helperLyricsText[previous.index]
  };
  renderHelperLyrics();
  lyricsHelperStatus.textContent = `已撤销第 ${previous.index + 1} 句，继续听到这里再打点。`;
}

function pauseTapping() {
  lyricsHelperAudio.pause();
  stopHelperSyncTimer();
  $("#startTappingButton").textContent = "开始播放并打点";
  lyricsHelperStatus.textContent = "打点已暂停，当前位置会保留。";
}

function restartTapping() {
  if (
    helperIsManualLocked &&
    !window.confirm("从头打点会清空当前手动时间，确定继续吗？")
  ) {
    lyricsHelperStatus.textContent = "已经保留当前手动时间。";
    return;
  }
  helperTimedLyrics = helperLyricsText.map((text) => ({ time: null, timeInput: "", text }));
  helperIsManualLocked = false;
  updateLyricsLockStatus();
  tappingLineIndex = 0;
  tapHistory = [];
  helperActiveIndex = -1;
  renderHelperLyrics();
  startTappingPlayback(true);
}

$$(".nav-button[data-view]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view, true));
});

$("#themeButton").addEventListener("click", () => {
  setTheme(document.body.classList.contains("theme-maple") ? "sunny" : "maple");
});

$("#openLyricsHelperButton").addEventListener("click", openLyricsHelper);
$("#closeLyricsHelperButton").addEventListener("click", closeLyricsHelper);
$("#closeLyricsHelperIcon").addEventListener("click", closeLyricsHelper);
lyricsHelperLayer.addEventListener("click", (event) => {
  if (event.target === lyricsHelperLayer) closeLyricsHelper();
});
lyricsSongSelect.addEventListener("change", () => loadHelperSong(lyricsSongSelect.value));
$("#organizeLyricsButton").addEventListener("click", () => {
  const nextLyricsText = organizeLyrics(lyricsInput.value);
  const oldTimedLyrics = helperTimedLyrics.map((item, index) => ({
    ...item,
    text: helperLyricsText[index]
  }));
  const usedIndexes = new Set();
  const nextTimedLyrics = nextLyricsText.map((text, index) => {
    let sourceIndex = -1;
    if (oldTimedLyrics[index]?.text === text && !usedIndexes.has(index)) {
      sourceIndex = index;
    } else {
      sourceIndex = oldTimedLyrics.findIndex((item, oldIndex) =>
        !usedIndexes.has(oldIndex) && item.text === text
      );
    }
    if (sourceIndex < 0) return { time: null, timeInput: "", text };
    usedIndexes.add(sourceIndex);
    return { ...oldTimedLyrics[sourceIndex], text };
  });

  keepScrollWhileAdjusting(() => {
    helperLyricsText = nextLyricsText;
    helperTimedLyrics = nextTimedLyrics;
    tappingLineIndex = Math.min(tappingLineIndex, helperLyricsText.length);
    tapHistory = [];
    lyricsInput.value = helperLyricsText.join("\n");
    renderHelperLyrics();
  });
  lyricsHelperStatus.textContent = helperLyricsText.length
    ? `已经整理成 ${helperLyricsText.length} 句歌词，已有手动时间会尽量保留。`
    : "还没有读到歌词，可以先粘贴一点。";
});
$("#autoMatchLyricsButton").addEventListener("click", autoMatchHelperLyrics);
$("#startTappingButton").addEventListener("click", () => startTappingPlayback(false));
$("#markCurrentLineButton").addEventListener("click", markCurrentHelperLine);
$("#undoTapButton").addEventListener("click", undoLastTap);
$("#pauseTappingButton").addEventListener("click", pauseTapping);
$("#restartTappingButton").addEventListener("click", restartTapping);
$("#saveLyricsButton").addEventListener("click", () => {
  keepScrollWhileAdjusting(saveHelperLyrics);
});
$("#exportLyricsButton").addEventListener("click", () => {
  keepScrollWhileAdjusting(exportHelperLyrics);
});
$("#copyLyricsCodeButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lyricsExportOutput.value);
    lyricsHelperStatus.textContent = "时间节点歌词已经复制啦。";
  } catch (error) {
    lyricsExportOutput.focus();
    lyricsExportOutput.select();
    lyricsHelperStatus.textContent = "已经选中代码，可以手动复制。";
  }
});
helperLyricsList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  event.preventDefault();
  if (button.dataset.lineShift !== undefined) {
    const index = Number(button.dataset.lineIndex);
    const shift = Number(button.dataset.lineShift);
    const item = helperTimedLyrics[index];
    const currentTime = parseTimeInput(item?.timeInput ?? item?.time);
    if (!item || currentTime === null) {
      lyricsHelperStatus.textContent = "时间格式好像不对，可以填 1:12.5 这样的格式。";
      return;
    }
    keepScrollWhileAdjusting(() => {
      item.time = Math.max(0, currentTime + shift);
      item.timeInput = formatSecondsToMinute(item.time);
      renderHelperLyrics();
    });
    return;
  }
  if (button.dataset.deleteLine !== undefined) {
    const index = Number(button.dataset.deleteLine);
    keepScrollWhileAdjusting(() => {
      helperLyricsText.splice(index, 1);
      helperTimedLyrics.splice(index, 1);
      tappingLineIndex = Math.min(tappingLineIndex, helperLyricsText.length);
      lyricsInput.value = helperLyricsText.join("\n");
      renderHelperLyrics();
    });
    return;
  }
  if (button.dataset.addLineAfter !== undefined) {
    const index = Number(button.dataset.addLineAfter) + 1;
    keepScrollWhileAdjusting(() => {
      helperLyricsText.splice(index, 0, "");
      helperTimedLyrics.splice(index, 0, { time: null, timeInput: "", text: "" });
      lyricsInput.value = helperLyricsText.join("\n");
      renderHelperLyrics();
    });
  }
});
helperLyricsList.addEventListener("input", (event) => {
  if (event.target.matches("[data-time-index]")) {
    const index = Number(event.target.dataset.timeIndex);
    const rawValue = event.target.value;
    const value = parseTimeInput(rawValue);
    helperTimedLyrics[index] = {
      time: value,
      timeInput: rawValue,
      text: helperLyricsText[index]
    };
    const preview = event.target.closest(".helper-time-field")
      ?.querySelector(".helper-seconds-preview");
    if (preview) preview.textContent = value === null ? "" : `= ${value} 秒`;
  }
  if (event.target.matches("[data-text-index]")) {
    const index = Number(event.target.dataset.textIndex);
    helperLyricsText[index] = event.target.value;
    helperTimedLyrics[index] = {
      time: helperTimedLyrics[index]?.time ?? null,
      timeInput: helperTimedLyrics[index]?.timeInput ?? "",
      text: event.target.value
    };
    lyricsInput.value = helperLyricsText.join("\n");
  }
});
helperLyricsList.addEventListener("change", (event) => {
  if (!event.target.matches("[data-time-index]")) return;
  const value = parseTimeInput(event.target.value);
  if (event.target.value.trim() && value === null) {
    event.target.classList.add("is-invalid");
    lyricsHelperStatus.textContent = "时间格式好像不对，可以填 1:12.5 这样的格式。";
  } else {
    event.target.classList.remove("is-invalid");
  }
});
lyricsHelperAudio.addEventListener("ended", () => {
  stopHelperSyncTimer();
  $("#startTappingButton").textContent = "开始播放并打点";
  lyricsHelperStatus.textContent = "这首播放完啦，可以保存或从头打点。";
});

document.addEventListener("keydown", (event) => {
  if (lyricsHelperLayer.hidden) return;
  const tagName = event.target.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;
  if (event.code === "Space" || event.key === "Enter") {
    event.preventDefault();
    markCurrentHelperLine();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    undoLastTap();
  }
});

$$(".mood-button").forEach((button) => {
  button.addEventListener("click", () => drawSong(button.dataset.mood));
});

$("#secretButton").addEventListener("click", () => drawSong("彩蛋"));
$("#againButton").addEventListener("click", () => drawSong(selectedMood));
$("#resultBackButton").addEventListener("click", () => {
  closeModes();
  if (currentSource === "library") {
    resultCard.hidden = true;
    switchView("catalog");
  } else {
    showMoodChoices();
  }
});
$("#openListenButton").addEventListener("click", async () => {
  openListenMode();
  try {
    await playCurrentSong();
  } catch (error) {
    // playCurrentSong 已显示真实播放错误。
  }
});
$("#openSingButton").addEventListener("click", openSingMode);
$("#cardQqButton").addEventListener("click", openQqMusic);
$("#listenQqButton").addEventListener("click", openQqMusic);
$("#quietListenBtn").addEventListener("click", togglePlayback);
$("#singPlayButton").addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!audioPlayer.paused) {
    audioPlayer.pause();
    return;
  }
  await startSingPlayback();
});
$("#listenPlayMode").addEventListener("change", (event) => setPlayMode(event.target.value));
$("#singPlayMode").addEventListener("change", (event) => setPlayMode(event.target.value));

$("#listenChangeButton").addEventListener("click", () => {
  closeModes();
  drawSong(selectedMood);
});

$("#restartButton").addEventListener("click", async () => {
  const wasLoaded = loadedSongId === currentSong?.id && audioPlayer.getAttribute("src");
  if (wasLoaded) audioPlayer.currentTime = 0;
  activeLyricIndex = -1;
  lyricLineElements.forEach((line) => line.classList.remove("is-active"));
  syncTimedLyrics();
  try {
    await playCurrentSong();
  } catch (error) {
    // playCurrentSong 已显示真实播放错误。
  }
});

$$(".sing-atmosphere-button").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".sing-atmosphere-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    singTip.textContent = button.dataset.singTip;
  });
});

$$(".sing-source-button").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await selectSingSource(button.dataset.singSource);
  });
});

singVolumeSlider.addEventListener("input", () => {
  const nextVolume = Number(singVolumeSlider.value);
  if (!Number.isFinite(nextVolume)) return;
  singVolume = Math.min(1, Math.max(0, nextVolume));
  hasSavedSingVolume = true;
  singVolumeValue.textContent = `${Math.round(singVolume * 100)}%`;
  try {
    localStorage.setItem(SING_VOLUME_STORAGE_KEY, String(singVolume));
  } catch (error) {
    // 存储不可用时，当前页面内的音量调节仍然有效。
  }
  if (currentMode === "sing") {
    audioPlayer.volume = singVolume;
  }
});

recordButton.addEventListener("click", () => {
  if (mediaRecorder?.state === "recording") stopRecording();
  else startRecording();
});

replayRecordingButton.addEventListener("click", async () => {
  if (!recordingUrl) return;
  try {
    audioPlayer.pause();
    recordedAudio.currentTime = 0;
    await recordedAudio.play();
    recordingStatus.textContent = "正在回放刚刚这一小段。";
  } catch (error) {
    recordingStatus.textContent = "回放没有开始，再轻点一下试试。";
  }
});

rerecordButton.addEventListener("click", startRecording);

saveRecordingButton.addEventListener("click", () => {
  if (!recordingBlob || !recordingUrl || !currentSong) return;
  const type = recordingBlob.type;
  const extension = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
  const link = document.createElement("a");
  link.href = recordingUrl;
  link.download = `${currentSong.id}-sing-recording.${extension}`;
  document.body.append(link);
  link.click();
  link.remove();
  recordingStatus.textContent = "已经交给浏览器保存啦。";
});

$$("[data-close-sing]").forEach((button) => {
  button.addEventListener("click", exitSingMode);
});

$$("[data-close-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModes();
  });
});

$("#filterRow").addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (!button) return;
  catalogFilter = button.dataset.filter;
  $$(".filter-button").forEach((item) => item.classList.toggle("is-active", item === button));
  renderCatalog();
});

songSearch.addEventListener("input", renderCatalog);

songList.addEventListener("click", (event) => {
  const item = event.target.closest(".song-item");
  if (!item) return;
  const song = songs.find((entry) => entry.id === item.dataset.songId);
  if (!song) return;
  switchView("draw");
  selectSongAndPlay(song, "library", song.mood[0]);
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

audioPlayer.addEventListener("loadstart", () => {
  setAudioStatus("音频加载中……");
  updateAudioDebugPanel();
});

audioPlayer.addEventListener("pause", () => {
  if (!audioPlayer.ended && loadedSongId) setAudioStatus("已暂停");
  updatePlayButtonText(false);
  $("#singPlayButton").textContent = "开始轻唱";
  updateMediaPlaybackState("paused");
  updateFloatingPlayer();
});

audioPlayer.addEventListener("ended", async () => {
  setAudioStatus("这首听完啦");
  updatePlayButtonText(false);
  $("#singPlayButton").textContent = "开始轻唱";
  updateMediaPlaybackState("none");
  updateFloatingPlayer();
  await playNextSong();
});

audioPlayer.addEventListener("waiting", () => {
  setAudioStatus("音频加载中……");
  $("#quietListenBtn").textContent = "正在加载音频……";
  $("#singPlayButton").textContent = "正在加载音频……";
  updateFloatingPlayer();
});

audioPlayer.addEventListener("canplay", () => {
  setAudioStatus("可以播放啦");
  if (audioPlayer.paused) updatePlayButtonText(false);
  updateFloatingPlayer();
});

audioPlayer.addEventListener("loadedmetadata", () => {
  syncTimedLyrics();
});

audioPlayer.addEventListener("playing", () => {
  setAudioStatus("正在播放");
  updatePlayButtonText(true);
  $("#singPlayButton").textContent = "先停一下";
  updateMediaPlaybackState("playing");
  updateFloatingPlayer();
  updateAudioDebugPanel();
});

audioPlayer.addEventListener("error", () => {
  if (!audioPlayer.getAttribute("src")) return;
  console.error("当前歌曲：", currentSong?.title || "(none)");
  console.error("audio URL:", resolveAudioUrl(getCurrentAudioSrc()));
  console.error("audio error:", audioPlayer.error);
  setAudioStatus("音频加载失败，请检查 R2 文件路径、公开权限或 CORS 设置。");
  $("#quietListenBtn").textContent = "重新加载音频";
  $("#singPlayButton").textContent = "重新加载音频";
  loadedSongId = null;
  updateFloatingPlayer();
  updateAudioDebugPanel();
});

// 点击遮罩空白处也可以关闭模式，不会误触卡片内部。
listenLayer.addEventListener("click", (event) => {
  if (event.target === listenLayer) closeModes();
});
singLayer.addEventListener("click", (event) => {
  if (event.target === singLayer) exitSingMode();
});

floatingPlayer.addEventListener("click", openCurrentSongListenView);
floatingPlayButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePlayback();
});
$("#floatingPreviousButton").addEventListener("click", (event) => {
  event.stopPropagation();
  playPreviousSong();
});
$("#floatingNextButton").addEventListener("click", (event) => {
  event.stopPropagation();
  playNextSong();
});
floatingModeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePlayMode();
});

function savePendingMessage(note) {
  try {
    const stored = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || "[]");
    const pendingMessages = Array.isArray(stored) ? stored : [];
    localStorage.setItem(
      MESSAGE_STORAGE_KEY,
      JSON.stringify([note, ...pendingMessages].slice(0, 10))
    );
    return true;
  } catch (error) {
    console.warn("留言备用保存失败：", error);
    return false;
  }
}

function openMessageBox() {
  messageStatus.textContent = "";
  messageLayer.hidden = false;
  hideBottomNav();
  document.body.style.overflow = "hidden";
  window.setTimeout(() => messageInput.focus(), 80);
}

function closeMessageBox() {
  messageLayer.hidden = true;
  if (listenLayer.hidden && singLayer.hidden) document.body.style.overflow = "";
  updateBottomNavVisibility();
}

async function submitMessageToNetlify(note) {
  if (window.location.protocol === "file:") {
    throw new Error("Netlify Forms 仅在部署后可用");
  }

  const body = new URLSearchParams({
    "form-name": "message-box",
    message: note.message,
    song: note.song,
    mood: note.mood,
    theme: note.theme,
    time: note.time
  }).toString();

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) throw new Error(`Netlify Forms 提交失败：${response.status}`);
}

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) {
    messageStatus.textContent = "可以先写一点点再保存。";
    return;
  }

  const note = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    song: currentSong?.title || "",
    mood: selectedMood || "",
    theme: document.body.classList.contains("theme-maple") ? "枫" : "晴天",
    time: new Date().toISOString()
  };

  $("#messageSong").value = note.song;
  $("#messageMood").value = note.mood;
  $("#messageTheme").value = note.theme;
  $("#messageTime").value = note.time;

  try {
    await submitMessageToNetlify(note);
    messageInput.value = "";
    messageStatus.textContent = "已经悄悄收好啦";
  } catch (error) {
    console.info("Netlify Forms 暂时提交失败：", error);
    const savedLocally = savePendingMessage(note);
    if (savedLocally) {
      messageInput.value = "";
      messageStatus.textContent = "网络暂时没接上，已经先存在这里啦。";
    } else {
      messageStatus.textContent = "这次没有保存成功，请稍后再试。";
    }
  }
});

$("#openMessageButton").addEventListener("click", openMessageBox);
$("#closeMessageButton").addEventListener("click", closeMessageBox);
$("#closeMessageIcon").addEventListener("click", closeMessageBox);
messageLayer.addEventListener("click", (event) => {
  if (event.target === messageLayer) closeMessageBox();
});

function setMediaSessionHandlers() {
  if (!("mediaSession" in navigator)) return;
  const handlers = {
    play: () => playCurrentSong().catch(() => {}),
    pause: () => audioPlayer.pause(),
    nexttrack: () => playNextSong(),
    previoustrack: () => playPreviousSong()
  };

  Object.entries(handlers).forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      // 某些浏览器只支持部分 Media Session 操作。
    }
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    wasPlayingBeforeHidden = !audioPlayer.paused;
    return;
  }
  if (wasPlayingBeforeHidden && audioPlayer.paused && loadedSongId) {
    setAudioStatus("如果音乐停了，轻点一下继续听。");
    updateFloatingPlayer();
  }
  wasPlayingBeforeHidden = false;
});

loadSavedLyrics();
loadTheme();
renderCatalog();
setPlayMode(playMode);
startLyricSyncTimer();
setMediaSessionHandlers();
updateBottomNavVisibility();
initializeAudioDebugPanel();

window.addEventListener("beforeunload", () => {
  stopRecordingTracks();
  if (recordingUrl) URL.revokeObjectURL(recordingUrl);
  if (audioDebugTimer !== null) window.clearInterval(audioDebugTimer);
  stopHelperSyncTimer();
  if (lyricSyncTimer !== null) {
    window.clearInterval(lyricSyncTimer);
    lyricSyncTimer = null;
  }
});
