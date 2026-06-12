# 心情点歌小盒子

一个适合手机竖屏和微信内打开的静态音乐小网页。可以从心情盒子按心情抽歌，也可以从音乐盒直接选歌，并使用静听、轻唱、小纸条和晴天/枫双主题。

## 页面入口

- `心情盒子`：按当前心情随机抽取一首歌。
- `音乐盒`：直接从歌单中搜索或选择歌曲，点击整张歌曲卡片会先进入歌曲详情页并尝试播放。
- 歌曲卡片会根据来源显示“← 换个心情”或“← 回到音乐盒”，无需刷新页面即可返回。
- `静听`是主功能，播放 Cloudflare R2 中公开访问的 MP3 音频。
- `轻唱`是副功能，用于打开完整歌词并跟随高亮。
- `小纸条`：写下一句轻松的话，优先提交到 Netlify Forms，失败时才在当前浏览器暂存。
- `歌词小助手`：在音乐盒中粘贴普通歌词，自动分行、估算时间轴、预览并保存。
- 微信浏览器若拦截播放，会提示“这首歌准备好了，再轻点一下就能听。”，此时再点击一次“静听这一版”即可。

### 歌曲详情与歌词页

- 音乐盒点歌后先显示歌名、推荐语及静听、轻唱、QQ 音乐入口，不会立刻打开歌词页。
- 点击页面上方原有的大音乐盘 / 唱片机区域会进入当前模式的歌词页，并保留当前播放时间，不会重新加载或从头播放。
- 项目只使用原有的大唱片机作为歌词入口，不会在歌曲详情里新增第二个音乐盘。
- 静听和轻唱歌词页都有播放进度条。
- 点击或拖动进度条可以跳转到对应时间，歌词高亮会立即同步。
- 返回歌曲详情页、音乐盒或主界面不会中断正在播放的音乐。

## 底部导航显示

固定底部栏只在首页、心情选择界面和音乐盒列表显示。进入歌曲详情、静听、轻唱、歌词高亮或留言小纸条等沉浸式界面时会自动隐藏，避免遮挡歌词和操作按钮。

关闭弹层时，页面会根据底层内容恢复状态：回到歌曲详情仍保持隐藏，返回心情选择或音乐盒列表后才重新显示。相关控制函数是 `showBottomNav()`、`hideBottomNav()` 和 `updateBottomNavVisibility()`。

下方悬浮播放器遵循同样的规则：

- 首页、心情选择和音乐盒列表中显示。
- 歌曲详情、静听、轻唱、留言框和歌词小助手中自动隐藏。
- 没有选歌时显示“还没有开始播放”。
- 支持播放/暂停、上一首、下一首，以及顺序、随机、单曲三种播放模式。
- 播放模式保存在 `localStorage` 的 `musicBoxPlayMode` 中，下次打开会继续使用。

项目不需要后端、数据库、登录或第三方盗版音乐接口。

## 项目结构

```text
sfl/
├─ index.html          页面结构
├─ style.css           手机样式、动画和双主题
├─ script.js           歌曲数据及全部交互
├─ README.md           使用说明
└─ tools/
│  ├─ convert-normal-flac-to-mp3.bat
│  ├─ convert_flac_to_mp3.bat
│  └─ convert_flac_to_mp3.ps1
```

四个项目文件应放在同一层。项目代码放在 GitHub 并由 Cloudflare Pages 部署，正式播放的 MP3 只放在 Cloudflare R2，不提交到 GitHub。

## 歌曲数据结构

歌曲都在 `script.js` 顶部的 `songs` 数组中，通过 `createSong()` 创建：

```js
createSong(
  "new-song",
  "新歌名",
  ["想放空一下", "想被安静陪着"],
  AUDIO_NORMAL_BASE_URL + "new-song.mp3",
  "这里写一句克制、轻松的推荐语。",
  {
    artist: "周杰伦",
    lyricPreview: [
      "歌词预览第一行",
      "歌词预览第二行",
      "歌词预览第三行"
    ],
    lyricsText: [
      "普通歌词第一行",
      "普通歌词第二行"
    ],
    lyricsTimed: [
      { time: 0, text: "时间轴歌词第一行" },
      { time: 5.8, text: "时间轴歌词第二行" }
    ],
    vocalReducedAudio: AUDIO_VOCAL_LOW_BASE_URL + "new-song.mp3",
    instrumentalAudio: AUDIO_INSTRUMENTAL_BASE_URL + "new-song.mp3",
    singTips: [
      "不用唱完整，喜欢哪句就唱哪句。",
      "慢慢唱，不用赶。",
      "如果唱累了，就安静听一会儿。"
    ],
    qqMusicUrl: "",
    searchKeyword: "新歌名 周杰伦"
  }
)
```

每首歌最终都包含：

- `id`：唯一标识，不能和其他歌曲重复。
- `title`：歌名。
- `artist`：歌手，默认是周杰伦。
- `mood`：心情分类数组，只使用项目固定的五个分类名。
- `audio`：Cloudflare R2 公开音频地址。
- `vocalReducedAudio`：人声降低版 R2 地址，用于原声陪唱。
- `instrumentalAudio`：R2 伴奏地址，用于轻伴唱。
- `message`：每首歌独有的推荐语。
- `lyricPreview`：静听界面的 3-5 行预览。
- `lyricsText`：没有时间轴时展示的普通歌词。
- `lyricsTimed`：手动时间节点歌词，`time` 是该句开始提亮的秒数。
- `singTips`：进入轻唱模式时随机显示的温柔提示。
- `qqMusicUrl`：QQ 音乐歌曲页链接，可以为空。
- `searchKeyword`：QQ 音乐搜索关键词。

请只填写你有权使用的歌词内容。项目默认内容都是占位示例，没有填入完整版权歌词。

## 使用 FFmpeg 压缩 FLAC

网页不要直接引用 50MB 左右的 FLAC。原始文件和网页文件分开放置：

```text
assets/audio_original/  原始 FLAC
assets/audio/           本地转换后的 MP3 暂存目录
```

完成转换后，将 `assets/audio/` 中的 MP3 上传到 Cloudflare R2 对应目录。`assets/audio/`、`assets/audio_original/`、MP3、FLAC 和 WAV 均被 `.gitignore` 忽略，网页正式播放时不会请求项目里的本地音频文件。

### 1. 安装并检查 FFmpeg

先安装 FFmpeg，并确保 `ffmpeg.exe` 已加入系统 `PATH`。打开 PowerShell 或命令提示符测试：

```powershell
ffmpeg -version
```

能够显示版本信息后再运行转换脚本。

### 2. 放入原始音频

把所有 `.flac` 文件放进：

```text
assets/audio_original/
```

### 3. 运行转换脚本

旧的 PowerShell 版本：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\convert_flac_to_mp3.ps1
```

这个 PowerShell 脚本会：

- 读取 `assets/audio_original/` 中的所有 FLAC。
- 转换为 MP3 128kbps、44100Hz。
- 保留原文件名，仅把扩展名改成 `.mp3`。
- 输出到 `assets/audio/`。
- 已存在的同名 MP3 会被覆盖。

推荐使用 MP3 128kbps 或 192kbps，单首尽量控制在 3-8MB。下面的一键 BAT 脚本固定输出 192kbps；旧 PowerShell 脚本固定输出 128kbps。

### 普通静听版 FLAC 转 MP3

如果普通静听版暂存在 `assets/normal/`，请先把其中的 FLAC 转成 MP3，再上传到 Cloudflare R2 的 `audio/normal/`。

#### 最简单的一键转换

1. 先安装 FFmpeg。Windows 可以在终端运行：

   ```powershell
   winget install -e --id Gyan.FFmpeg
   ```

2. 安装完成后重新打开终端，检查 FFmpeg：

   ```powershell
   ffmpeg -version
   ```

3. 把需要转换的 FLAC 文件放入：

   ```text
   assets/normal/
   ```

4. 双击运行：

   ```text
   tools/convert_flac_to_mp3.bat
   ```

5. 脚本会在 `assets/normal/` 中生成同名 MP3，只把扩展名从 `.flac` 改为 `.mp3`。转换规格为 192kbps、44100Hz，原 FLAC 不会删除。

6. 把生成的 MP3 上传到 Cloudflare R2：

   ```text
   audio/normal/
   ```

这个脚本会：

- 读取 `assets/normal/` 中的所有 `.flac` 文件。
- 转换为 192kbps、44100Hz 的 MP3。
- 把 MP3 输出到同一个 `assets/normal/` 文件夹。
- 保留原文件名主体，例如 `qing-tian.flac` 会生成 `qing-tian.mp3`。
- 保留原始 FLAC，不会删除源文件。
- 转换完成后显示结果提示。
- 上传 R2 前，请确保文件名是英文小写、数字和短横线，不含中文、空格或括号。

## Cloudflare R2 音频

网页部署在 Cloudflare Pages，音频统一放在 Cloudflare R2。基础路径在 `script.js` 顶部统一管理：

```js
const R2_BASE_URL = "https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/";
const AUDIO_NORMAL_BASE_URL = R2_BASE_URL + "normal/";
const AUDIO_VOCAL_LOW_BASE_URL = R2_BASE_URL + "vocal-low/";
const AUDIO_INSTRUMENTAL_BASE_URL = R2_BASE_URL + "instrumental/";
```

新增或替换歌曲：

1. 把自己录制或有权使用的音频转换成 MP3。
2. 将 MP3 上传到 R2 的 `audio/` 目录。
3. 复制准确文件名。
4. 在歌曲数据中填写：

```js
audio: AUDIO_NORMAL_BASE_URL + "qing-tian.mp3"
```

单首音频建议压缩到 **3-8MB**，推荐使用 **MP3 128kbps 或 192kbps**。微信浏览器播放 50MB 左右的大文件很容易等待过久或中断。

### 手机音频格式建议

- 手机网页推荐使用 MP3，不建议直接使用 FLAC。
- 推荐 MP3 128kbps 或 192kbps，单首尽量控制在 3-8MB。
- 文件名建议使用英文小写、数字和连字符，不要使用中文、空格、括号或其他特殊符号。
- 文件名统一使用英文小写、数字和短横线，例如 `qing-tian.mp3`。
- 不要使用 Windows 本地路径、反斜杠或电脑盘符。
- `script.js` 中的文件名必须和 R2 上完全一致，包括大小写与扩展名。

当前歌单使用 12 首 128kbps、44100Hz MP3，单首约 2.8-4.9MB。原始 FLAC 仍保留作备份，但网页不会再请求这些 FLAC。

微信不允许网页自动播放音频是正常现象，必须由用户点击播放按钮。

页面使用 `preload="none"`，加载页面或仅打开音乐盒时不会播放。点击音乐盒中的具体歌曲或心情按钮后，会进入静听并尝试播放；也可以手动点击“静听这一版”“开始轻唱”或“从头来过”。

### R2 播放排查

先直接在手机浏览器打开：

```text
https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/normal/da-ben-zhong.mp3
```

- 如果链接打不开，说明 R2 文件没有公开、文件名错误或目录路径错误。
- 如果链接能播放但网页不能播放，再检查网页播放逻辑和浏览器控制台。

在浏览器开发者工具的 Console 中点击歌曲卡片或“静听这一版”，会显示：

```text
准备播放歌曲：晴天
歌曲音频地址：https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/normal/qing-tian.mp3
实际播放地址：https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/normal/qing-tian.mp3
```

复制“实际请求地址”到新标签页打开：

- 能直接打开或下载音频，说明路径有效。
- 显示 404，说明音频没有上传，或文件名与 `script.js` 不一致。
- 控制台还会打印 `播放失败`、`音频错误` 和 `失败路径`，方便继续判断浏览器格式支持或网络问题。

### 手机调试面板

在部署地址后添加 `?debug=1`：

```text
https://你的-pages-域名.pages.dev/?debug=1
```

页面会显示当前歌曲、实际音频地址、`paused`、播放时间、时长、`readyState`、`networkState`、错误代码、静音状态和音量。正常访问不带该参数时不会显示调试面板。

### 音频自检

音频自检只在 debug 模式显示：

```text
https://你的项目.pages.dev/?debug=1
```

1. 打开上面的地址。
2. 点击调试面板右上角的“音频自检”。
3. 点击“开始检查”。
4. 表格会逐首检查 `normal`、`vocal-low` 和 `instrumental` 三个字段中实际填写的 URL。

状态含义：

- `✅ 可用`：R2 地址可以访问。
- `❌ 缺失`：地址已经填写，但文件不存在、文件名不一致、权限或跨域检查失败。
- `⚠️ 未填写`：歌曲数据中没有配置这个版本，不会自动猜测文件名。

如果某个版本显示 `❌`，请直接点击表格中的完整 URL，并去 R2 检查对应文件夹和文件名。三个文件夹中同一首歌最好使用完全一致的 `song-id.mp3` 文件名。伴奏无法播放时，应优先检查歌曲的 `instrumentalAudio` 字段，以及 R2 的 `audio/instrumental/` 目录。

自检先发送 `HEAD` 请求；如果服务不接受 `HEAD`，会使用只请求少量内容的 `GET Range` 方式兜底。如果 R2 的跨域规则阻止 `fetch`，页面会再用一个独立的临时音频元素读取元数据。这个探测不会使用或打断全局 `audioPlayer`，也不会主动完整下载每首音频。

状态判断说明：

- 只有全局播放器触发 `playing` 事件后，页面才显示“正在播放”。
- `play()` 被浏览器拦截时显示“这首歌准备好了，再轻点一下就能听。”
- R2 路径或公开访问失败时显示“音频加载失败，请检查 R2 文件路径或文件是否公开。”

## 播放模式

静听、轻唱和下方悬浮播放器共用同一播放模式：

- `顺序播放`：歌曲结束后播放歌单中的下一首，最后一首结束后回到第一首。
- `随机播放`：歌曲结束后随机选择另一首，并尽量避开当前歌曲；点击上一首时会优先返回最多 30 条播放历史中的上一首。
- `单曲循环`：歌曲结束后重新播放当前歌曲。
- 静听和轻唱都遵循同一套播放模式。轻唱播放结束后会自动进入下一首，并继续保持原声陪唱或轻伴唱。
- 轻伴唱模式会跳过没有 `instrumentalAudio` 的歌曲；如果整张歌单都没有下一首可用伴奏，会提示并切回原声陪唱。

悬浮播放器的模式按钮会按“顺序 → 随机 → 单曲 → 顺序”循环切换。单曲模式下点击上一首或下一首，也会从头播放当前歌曲。

悬浮播放器只在首页、心情盒子选择区和音乐盒列表等主界面显示。点击播放器空白区域或当前歌名，会进入当前播放上下文的歌词界面，并保留播放进度和播放状态；点击上一首、播放/暂停、下一首或播放模式按钮只执行对应控制，不会进入歌词界面。轻唱状态下使用悬浮播放器切歌时，也会继续使用当前陪唱方式。

微信浏览器可能阻止没有直接点击动作触发的自动播放。如果自动下一首被阻止，当前歌曲和模式会保留，页面提示“下一首准备好了，轻点继续播放”，可使用当前页面或悬浮播放器的播放按钮继续。

## 轻唱模式

轻唱是静听之外的辅助功能，做成了一个轻量的小练歌房：

- 播放时继续使用现有时间轴歌词，每 200ms 检查进度，只有歌词索引改变时才更新高亮和居中滚动。
- 可以选择“原声陪唱”或“轻伴唱”，两种模式仍共用全局 `audioPlayer`。
- 可以选择“慢慢唱”“只唱喜欢的几句”等轻松提示。
- 可以从头播放或暂停。关闭轻唱界面只会返回主界面，音乐会继续播放。
- 不做评分、音准识别或比较功能。
- 返回首页、音乐盒或心情盒子不会清空音源，也不会重置当前歌曲、播放上下文或陪唱方式。
- 关闭静听或轻唱界面不等于停止播放；需要停止时，请使用暂停按钮。

### 原声陪唱

- 优先播放当前歌曲的 `vocalReducedAudio`，也就是提前处理好的人声降低版。
- 有人声降低版时默认音量为 75%。
- 如果 `vocalReducedAudio` 为空，会回退播放普通版 `audio`，默认音量自动降到 18%。
- “陪唱音量”滑杆支持 0-100% 实时调节，步进为 5%。
- 用户设置会保存到 `localStorage` 的 `musicBoxSingVolume`，下次进入轻唱时继续使用。
- 如果旧设置意外保存为 0%，点击“开始轻唱”时会恢复到当前音源的默认可听音量，避免界面显示播放但实际无声。
- 原声陪唱适合跟着熟悉的旋律和节奏唱。
- 返回静听模式后，播放器会恢复正常的 100% 音量。

### 轻伴唱

- 只播放歌曲的 `instrumentalAudio`，默认使用 80% 音量。
- 轻伴唱按钮只根据 `instrumentalAudio` 是否为非空字符串判断是否可用，不会参考 normal 或 vocal-low 字段。
- 没有伴奏版时，“轻伴唱”按钮会显示为“轻伴唱（暂无）”并置灰。
- 点击暂无伴奏的按钮时，页面会提示先用原声陪唱轻轻跟一下。
- 不会回退到普通版伪装成伴奏，也不会尝试弱人声或在线去人声。
- 切换音源时会尽量保留当前播放进度；如果微信阻止继续播放，再点击一次“开始轻唱”即可。
- “开始轻唱”会按当前选择读取音源：原声陪唱使用 `vocalReducedAudio`（缺少时回退 `audio`），轻伴唱使用 `instrumentalAudio`，不会固定播放普通静听版。
- 进入轻唱模式时默认选择原声陪唱。
- 真正没有人声的轻伴唱需要提前制作伴奏版并上传 R2。
- 当前歌曲数据已为爱你无差和 Mojito 明确填写 normal、vocal-low、instrumental 三类地址。代码只使用指定文件名，不会自动改写拼音或留空。

「爱你无差」统一使用 id `ai-ni-wu-cha`，三个 R2 文件名均为 `ai-ni-wu-cha.mp3`。

`Mojito` 保持英文歌名和 id `mojito`，三个 R2 文件名均为 `mojito.mp3`。

### 三种音频与 R2 文件名

每首歌可以配置三种音频：

1. `audio`：普通版，用于静听、音乐盒点播和悬浮播放器。
2. `vocalReducedAudio`：人声降低版，用于轻唱模式的原声陪唱。
3. `instrumentalAudio`：伴奏版，用于轻唱模式的轻伴唱。

Codex 不会自动听音频判断内容，只根据字段和 R2 文件夹区分用途。

普通静听版 `normal` 已统一转换为 MP3，网页歌曲数据只使用 `.mp3`，不再引用 FLAC。三类音频都应使用相同的英文 `song-id.mp3` 文件名。

Cloudflare R2 使用三个固定前缀，三类音频保持同一个文件名：

```text
普通版：audio/normal/song-id.mp3
人声降低版：audio/vocal-low/song-id.mp3
伴奏版：audio/instrumental/song-id.mp3
```

例如大笨钟：

```text
audio/normal/da-ben-zhong.mp3
audio/vocal-low/da-ben-zhong.mp3
audio/instrumental/da-ben-zhong.mp3
```

新增歌曲时，把普通版上传到 `audio/normal/`，人声降低版上传到 `audio/vocal-low/`，伴奏版上传到 `audio/instrumental/`。三类文件使用同一个 `song-id.mp3` 文件名。网页只引用 R2 地址，本地音频目录和所有 MP3 都不会提交到 Git。

只有文件实际上传并可公开访问后，才填写对应字段。当前尚未上传的可选版本保持空字符串，避免页面请求不存在的 R2 地址。

如果 R2 中还是中文、空格、括号或序号文件名，需要先重命名或重新上传。例如下面这些旧名称：

```text
周杰伦 - 手写的从前.flac
周杰伦 - 手写的从前.mp3
7_周杰伦 - 手写的从前_(Instrumental).mp3
```

三类目录中都应统一改用英文 MP3 文件名：

```text
audio/normal/shou-xie-de-cong-qian.mp3
audio/vocal-low/shou-xie-de-cong-qian.mp3
audio/instrumental/shou-xie-de-cong-qian.mp3
```

网页不使用 FLAC，也不会自动转换或猜测音频用途。文件名或目录不一致时，代码路径就无法匹配 R2 文件。

歌曲配置示例：

```js
audio: AUDIO_NORMAL_BASE_URL + "da-ben-zhong.mp3",
vocalReducedAudio: AUDIO_VOCAL_LOW_BASE_URL + "da-ben-zhong.mp3",
instrumentalAudio: AUDIO_INSTRUMENTAL_BASE_URL + "da-ben-zhong.mp3"
```

如果某首歌暂时没有人声降低版，请明确填写 `vocalReducedAudio: ""`；如果没有伴奏版，请填写 `instrumentalAudio: ""`。原声陪唱缺少处理版时会回退到普通版并自动降低音量，轻伴唱缺少伴奏版时按钮会显示暂无。

项目不会自动听音频判断类型，而是只通过字段和 R2 文件夹区分用途：

- `audio` 对应 `audio/normal/`
- `vocalReducedAudio` 对应 `audio/vocal-low/`
- `instrumentalAudio` 对应 `audio/instrumental/`

本项目不再提供沉浸环绕，也不做网页实时去人声；人声降低版和伴奏版都需要提前处理并上传到 R2。

手机可以分别直接打开下面的 R2 音频链接测试：

```text
https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/normal/da-ben-zhong.mp3
https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/vocal-low/da-ben-zhong.mp3
https://pub-e03989c8338345c4a57d568c8be819c0.r2.dev/audio/instrumental/da-ben-zhong.mp3
```

如果单独链接有声音，说明 R2 音频文件正常；如果网页没有声音，应继续检查网页播放链路。

访问 `https://你的域名.pages.dev/?debug=1` 时，调试面板会显示当前歌曲、`listen / sing` 模式、`vocal / instrumental` 陪唱模式、实际播放字段、实际 URL、`audioPlayer.error`、`networkState`、`readyState` 和音量。

### 本地录一小段

- 点击“录一小段”后，浏览器才会申请麦克风权限。
- 录音使用浏览器 `MediaRecorder` API。
- 结束后可以在当前页面回放、重新录制或保存到设备。
- 常见保存格式是 WebM；部分浏览器可能保存为 M4A 或 OGG。
- 录音只生成在当前设备内，不会自动上传，也不会提交到 Netlify Forms。
- 退出轻唱时，如果正在录音，页面会停止录音并释放麦克风。
- 部分微信内置浏览器或旧版手机浏览器可能不支持录音，页面会显示温和提示，不影响正常跟唱。

## 后台播放说明

普通网页无法 100% 保证像 QQ 音乐 App 一样稳定地在后台或锁屏状态持续播放。微信内置浏览器、iOS Safari、安卓浏览器和手机省电策略都可能暂停网页音频。

本项目已做以下尽量优化：

- 全项目只使用一个 `audioPlayer`，静听、轻唱、音乐盒和心情盒子共用。
- 切换页面、主题、歌词面板或打开小纸条时不会主动暂停、清空或重载音频。
- 仅在真正切换歌曲时更换音频地址；播放中不会反复调用 `load()`。
- 支持 Media Session API 的浏览器会显示歌名、歌手，并接入系统播放、暂停、上一首和下一首控制。
- 页面底部的悬浮播放器可在主界面暂停、继续、切换歌曲或调整播放模式；进入沉浸式界面后会自动隐藏。

如果切到后台后被系统暂停，回到页面会提示“如果音乐停了，轻点一下继续听。”。页面不会擅自自动恢复，点击悬浮播放器或“继续静听”即可。

想要完全稳定的后台播放，通常需要原生 App 或音乐 App 能力，普通网页无法完全保证。

## 留言小纸条

顶部点击“小纸条”可以打开“给今天留一句话”：

- 保存时优先提交到 Netlify Forms。
- 提交成功后显示“已经悄悄收好啦”。
- 只有网络或 Netlify 提交失败时，才会把内容暂存在浏览器 `localStorage`。
- 网页内不显示留言列表，也不提供回复功能；站点管理员统一在 Netlify 后台查看。
- 打开、关闭或保存小纸条都不会暂停正在播放的音乐。
- 不建议在留言框中填写账号、联系方式或其他敏感隐私。
- 这个功能更适合写一句轻松的日常小话。

留言框的标题、说明和按钮在 `index.html` 的 `#messageLayer` 中修改；提示文案在 `script.js` 的留言提交事件中修改。

如需清空提交失败后暂存在当前浏览器里的留言，可以在浏览器控制台执行：

```js
localStorage.removeItem("mood-box-pending-messages")
```

### Netlify Forms

留言表单名称是 `message-box`。保存留言后，项目使用 Netlify Forms 支持的 URL 编码方式提交到站点根路径。部署成功后可在 Netlify 后台查看：

```text
Site → Forms → message-box
```

直接双击打开本地 `index.html` 时，Netlify Forms 不会真正提交，这是正常现象，此时留言会进入本地备用保存。Netlify 首次部署或更新后，请确认后台已经识别到 `message-box` 表单。

## 填写 QQ 音乐链接

找到歌曲的可选配置：

```js
qqMusicUrl: "https://y.qq.com/你的合法歌曲页面链接"
```

- 有链接时，按钮会直接打开该页面。
- 留空 `""` 时，网页会根据 `searchKeyword` 打开 QQ 音乐搜索页。
- 搜索关键词会自动经过 `encodeURIComponent` 处理。
- 项目不会解析音乐真实地址、下载歌曲或绕过会员限制。

## 填写普通歌词

`lyricsText` 用于没有时间节点歌词时的静听和轻唱模式：

```js
lyricsText: [
  "第一句",
  "第二句",
  "第三句"
]
```

每个数组元素对应一行。`lyricsTimed` 为空时，静听和轻唱模式会根据歌曲总时长平均估算每行的高亮时间。

## 填写时间轴歌词

`lyricsTimed` 用于跟随当前歌曲音频自动高亮：

```js
lyricsTimed: [
  { time: 0, text: "第一句" },
  { time: 5.8, text: "第二句" },
  { time: 12.3, text: "第三句" }
]
```

- `time` 单位是秒。
- 必须按时间从小到大排列。
- 播放时，静听和轻唱模式的当前行都会自动高亮并滚动到歌词区域中间。
- 时间需要根据你自己的录音版本校准。

静听模式的歌词区域较紧凑，高亮更柔和；轻唱模式会使用更明显的字号和亮度，方便跟唱。两种模式共用同一套歌词优先级：

1. 有 `lyricsTimed` 时，按手动时间节点精准高亮。
2. 只有 `lyricsText` 时，按歌曲总时长自动估算。
3. 两者都没有时，显示“歌词还没放进来，但歌可以先听。”

## 歌词小助手

歌词小助手现在使用“手动时间节点”，不需要 LRC 文件，也不做逐字高亮。

### lyricsTimed 格式

```js
lyricsTimed: [
  { time: 0, text: "第一句歌词" },
  { time: 5.8, text: "第二句歌词" },
  { time: 12.3, text: "第三句歌词" }
]
```

- `time` 单位是秒，表示该句开始提亮的时间。
- `text` 是这一整句歌词。
- 时间应按从小到大排列。

手动时间节点是最稳定的歌词方式。歌词小助手中输入的时间会作为锁定时间保存：

- 输入支持纯秒数或分:秒，例如 `5.8`、`0:05.8`、`1:12.5`。
- `1:12.5` 内部保存为 `72.5` 秒，重新打开时只改变显示格式，不改变秒数。
- 保存时只把有效时间统一到最多两位小数，不会按歌曲时长重新平均分配。
- 已有手动时间时，系统不会用 `lyricsText` 或音频时长自动覆盖。
- 编辑界面保持原来的歌词行顺序；播放和导出只使用排序后的副本，不会改动编辑数组。
- 静听和轻唱都会优先使用 `lyricsTimed`。

### 手动输入时间

1. 在音乐盒顶部打开“歌词小助手”。
2. 选择歌曲并粘贴普通歌词。
3. 点击“整理歌词”生成逐句编辑卡片。
4. 每一行都可以填写开始时间和歌词内容。
5. 可以提前或延后 0.3 秒、删除该句，或者在下面新增一句。
6. 手动调整、删除和新增时会保留当前滚动位置。

歌词小助手会显示“当前使用：手动时间节点”。保存后状态会变成“手动时间已锁定，保存后不会自动变化。”

时间支持以下写法：

- 纯秒数：`5.8`、`72.5`
- 分:秒：`0:05.8`、`1:12.5`、`2:03.0`
- 中文格式：`1分12秒`、`1分12.5秒`

推荐使用“分:秒”，看起来更直观。例如：

```text
1:12.5 = 1 分 12.5 秒
```

保存和导出时仍会转换为秒数：

```js
{ time: 72.5, text: "这一句歌词" }
```

输入框下方会显示转换后的秒数预览。格式错误时会提示“时间格式好像不对，可以填 1:12.5 这样的格式。”

### 听着打点

1. 点击“开始播放并打点”。
2. 听到当前待处理歌词时，点击“给这一句打点”。
3. 工具会记录当前预览音频的时间，并自动切到下一句。
4. 可以使用“撤销上一句”“暂停打点”和“从头打点”。

电脑键盘快捷键：

- `空格`：给当前句打点。
- `Enter`：给当前句打点。
- `Backspace`：撤销上一句。

快捷键在时间或歌词输入框中不会触发，避免影响正常编辑。

如果歌曲已经保存了手动时间，点击“从头打点”会先确认，避免误清空已经调好的节点。

### 自动匹配进度

“自动匹配进度”只在用户明确点击时运行。它会根据音频时长平均生成一份时间节点：

- 如果当前歌曲已有锁定的手动时间，页面会提示“自动匹配会覆盖当前手动时间，确定继续吗？”。
- 只有确认后才会生成自动时间。
- 取消后原来的手动时间保持不变。
- 自动匹配结果不会立即写入歌曲，仍需点击“保存到这首歌”。

### 保存与导出

点击“保存到这首歌”会同时更新歌曲的 `lyricsText`、`lyricsTimed`，并保存到：

```text
musicBoxLyricsTimed_歌曲ID
```

保存内容包含 `songId`、`mode: "manual"`、`lyricsText`、`lyricsTimed` 和 `updatedAt`。下次打开同一浏览器会自动恢复。读取到 `mode: "manual"` 后不会重新估算或覆盖时间。

“导出时间节点歌词”只过滤空歌词和无效时间，把时间统一到最多两位小数，并对副本按时间排序。它不会重新计算或修改当前编辑顺序。复制生成的 `lyricsTimed`，放进 `script.js` 对应歌曲的可选配置中即可。

`localStorage` 不会跨手机或浏览器同步，因此最终稳定版本建议把导出的代码写回 `script.js`。

静听和轻唱模式都会优先使用 `lyricsTimed` 精准提亮；如果只有 `lyricsText`，会根据已读取的歌曲总时长平均估算；两者都没有时显示“歌词还没放进来，但歌可以先听。”

歌词小助手的时间输入支持“分:秒”，例如 `1:12.5`。保存或导出后会自动转换成 `{ time: 72.5, text: "这一句歌词" }`。

本工具不使用 LRC、AI、语音识别、外部接口、后端或数据库。请只填写你有权使用的歌词内容。

## 新增歌曲

在 `songs` 数组末尾添加一个新的 `createSong(...)`，确保：

1. `id` 唯一。
2. 三类 MP3 使用相同的英文小写 `id.mp3` 文件名，并分别上传到 R2 的 `audio/normal/`、`audio/vocal-low/`、`audio/instrumental/`。
3. `mood` 只能使用项目固定的五个分类名。
4. 每首歌填写一条独特的 `message`。
5. 前台使用中文 `title`，R2 文件名使用英文 `id.mp3`。
6. 不使用中文文件名、空格、括号或 FLAC，也不引用本地 `assets` 音频路径。
7. 歌词内容是你有权使用的内容。

添加后，歌曲会自动出现在音乐盒、搜索结果和对应心情盒子抽歌池中。

## 修改心情分类

心情盒子固定为五个分类，不新增其他分类：

- `想放空一下`
- `有点 emo`
- `想听甜一点`
- `想被安静陪着`
- `想回到从前`

一首歌可以属于多个分类：

```js
["想放空一下", "想被安静陪着", "想回到从前"]
```

修改歌曲的 `mood` 数组后，抽歌池和目录筛选会自动更新。“随机抽一首”始终从完整的 `songs` 数组中抽取，不维护单独分类。

项目代码提交到 GitHub，音频只放在 Cloudflare R2。请不要把 MP3、FLAC 或 WAV 上传到 GitHub。

## 切换和修改主题

页面内点击顶部主题按钮，可切换：

- `theme-sunny`：晴天主题。
- `theme-maple`：枫主题。

选择会写入 `localStorage`，下次打开继续使用上次主题，默认是晴天。

颜色变量位于 `style.css` 顶部：

```css
:root {
  /* 晴天主题颜色 */
}

body.theme-maple {
  /* 枫主题颜色 */
}
```

修改变量即可统一调整背景、卡片、按钮和装饰颜色。主题提示语在 `script.js` 的 `setTheme()` 中修改。

### 修改主题背景动画

动态背景结构位于 `index.html` 的 `.theme-bg`：

- `.sunny-bg-elements`：晴天主题的太阳、5 朵云、1 架纸飞机、窗光和 12 个光粒子。
- `.maple-bg-elements`：枫主题的 18 片分层落叶、8 个暖光点和 2 张纸条。

动画全部写在 `style.css`，没有使用 JavaScript 逐帧更新：

- 晴天：`sunnySunBreath`、`sunnyCloudDrift`、`sunnyPlaneFly`、`sunnyParticleFloat`、`sunnyLightBreath`
- 枫：`mapleLeafFall`、`mapleLeafSwing`、`mapleParticleGlow`、`mapleNoteFloat`

常用修改方式：

1. 调整 `animation-duration` 可以改变速度，数值越大越慢。云朵目前分别使用约 28-50 秒，枫叶使用约 14-27 秒。
2. 调整元素的 `opacity` 可以改变背景存在感。
3. 调整 `.cloud-*`、`.leaf-*` 的 `top/left/right` 可以改变分布。
4. 增减云朵时，在 `index.html` 添加或删除 `.sunny-cloud`，并在 `style.css` 为对应 `.cloud-*` 设置位置与速度。
5. 增减枫叶时，在 `index.html` 添加或删除 `.maple-leaf`，并在 `style.css` 为对应 `.leaf-*` 设置大小、透明度和动画延迟。
6. 不建议继续增加大量元素；当前总背景元素控制在 50 个以内。
7. 系统开启“减少动态效果”时，`.theme-bg` 内的背景动画会全部关闭。

## 部署到 Netlify

1. 登录 Netlify。
2. 进入手动部署区域。
3. 把整个 `sfl` 文件夹拖入上传区域。
4. 等待完成后获得 `https://` 地址。
5. 用手机微信打开并测试音频和按钮。

也可以连接 GitHub 仓库，提交代码后自动更新。

## 部署到 Cloudflare Pages

当前推荐部署方式是 Cloudflare Pages：

1. 把项目上传到 GitHub 仓库。
2. 在 Cloudflare Dashboard 中打开 `Workers & Pages`。
3. 创建 Pages 项目并连接仓库。
4. 本项目是纯静态网页，不需要构建命令。
5. 部署后使用生成的 `https://...pages.dev` 地址测试。

网页代码由 Cloudflare Pages 提供，歌曲 MP3 由 Cloudflare R2 提供。更新音频时不需要把 MP3 放进网页仓库，只需要上传到 R2 并保证文件名与 `script.js` 完全一致。

## 部署到 Vercel

1. 把项目上传到 GitHub 仓库。
2. 登录 Vercel，选择 `Add New` → `Project`。
3. 导入该仓库。
4. 本项目不需要构建命令，直接部署。
5. 完成后使用生成的 `https://` 地址。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，把项目上传到仓库根目录。
2. 打开 `Settings` → `Pages`。
3. 在发布来源中选择项目分支和根目录。
4. 保存并等待 GitHub 生成网页地址。

音频已放在 Cloudflare R2，不需要提交到 Pages、Vercel 或 GitHub Pages 的网页仓库。正式分享前仍建议压缩成体积较小的 MP3。

## 发给微信好友

部署完成后发送公网 `https://` 地址。不要发送 `file:///.../index.html`，因为本地文件地址只能在自己的电脑上访问。

第一次分享前建议检查：

1. 微信里页面没有横向滚动。
2. 所有 R2 音频链接都能手动播放。
3. QQ 音乐链接或搜索页可以正常打开。
4. 晴天和枫主题都能切换。
5. 轻唱模式的时间轴与自己的录音一致。
