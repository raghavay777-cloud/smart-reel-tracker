console.log("🔥 Smart Reel Tracker Active");

document.body.style.outline = "3px solid red";

let lastVideoSrc = "";
let watchStart = 0;
let reelLock = false; // ⭐ prevents multiple counts

function getPlatform() {
    if (location.hostname.includes("instagram")) return "reels";
    if (location.href.includes("youtube.com/shorts")) return "shorts";
    return null;
}

function getToday(){
    return new Date().toISOString().split("T")[0];
}

function update(type,seconds){

    chrome.storage.local.get(null,data=>{

        const today = getToday();

        let lastDate = data.lastDate || today;

        let dailyReels = data.dailyReels || 0;
        let dailyShorts = data.dailyShorts || 0;
        let dailyTime = data.dailyTime || 0;

        let totalReels = data.totalReels || 0;
        let totalShorts = data.totalShorts || 0;

        if(lastDate !== today){
            dailyReels = 0;
            dailyShorts = 0;
            dailyTime = 0;
            lastDate = today;
        }

        if(type === "reels"){
            dailyReels++;
            totalReels++;
        }

        if(type === "shorts"){
            dailyShorts++;
            totalShorts++;
        }

        dailyTime += seconds;

        chrome.storage.local.set({
            lastDate,
            dailyReels,
            dailyShorts,
            dailyTime,
            totalReels,
            totalShorts
        });

        console.log("✅ COUNT UPDATED:",dailyReels,dailyShorts);
    });
}

// ⭐ MAIN DETECTOR WITH LOCK SYSTEM
function detectVideo(){

    const platform = getPlatform();
    if(!platform) return;

    const videos = document.querySelectorAll("video");

    videos.forEach(video=>{

        const src = video.currentSrc || video.src;

        // 🔥 Prevent duplicate increments
        if(src && src !== lastVideoSrc && !reelLock){

            reelLock = true; // lock counting

            console.log("🎬 NEW VIDEO:",platform);

            const now = Date.now();

            if(watchStart !== 0){
                const seconds = Math.floor((now-watchStart)/1000);
                update(platform,seconds);
            }

            lastVideoSrc = src;
            watchStart = now;

            // unlock after 3 seconds (prevents multi counts)
            setTimeout(()=>{
                reelLock = false;
            },3000);
        }
    });
}

// ⭐ Instagram DOM observer
const observer = new MutationObserver(()=>{
    detectVideo();
});

observer.observe(document.body,{
    childList:true,
    subtree:true
});

// fallback check
setInterval(detectVideo,2000);
