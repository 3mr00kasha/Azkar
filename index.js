let prayerData;
fetch("https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5").then((res) => {
    let data = res.json()
    return data
}).then((res) => {
    // console.log(res.data.timings)
    prayerData=res.data.timings
    document.getElementById("months").innerHTML = res.data.date.gregorian.month.en
    document.getElementById("date").innerHTML = res.data.date.gregorian.date
    document.getElementById("fajr").innerHTML = res.data.timings.Fajr
    document.getElementById("Sunrise").innerHTML = res.data.timings.Sunrise
    document.getElementById("Dhuhr").innerHTML =
        res.data.timings.Dhuhr[0] +
        res.data.timings.Dhuhr[1] - 12 +
        res.data.timings.Dhuhr[2] +
        res.data.timings.Dhuhr[3] +
        res.data.timings.Dhuhr[4]
    document.getElementById("Asr").innerHTML =
        res.data.timings.Asr[0] +
    res.data.timings.Asr[1] - 12 +
    res.data.timings.Asr[2] +
    res.data.timings.Asr[3] +
    res.data.timings.Asr[4]
    document.getElementById("Maghrib").innerHTML =
        res.data.timings.Maghrib[0] +
    res.data.timings.Maghrib[1] - 12 +
    res.data.timings.Maghrib[2] +
    res.data.timings.Maghrib[3] +
    res.data.timings.Maghrib[4]
    document.getElementById("Isha").innerHTML =
        res.data.timings.Isha[0] +
    res.data.timings.Isha[1] - 12 +
    res.data.timings.Isha[2] +
    res.data.timings.Isha[3] +
        res.data.timings.Isha[4]
    
    
}).catch((ca) => { console.log(Error(ca)) })
let time_now;
setInterval(() => {
    time_now = new Date()
    let hour = time_now.getHours();
    let minute = time_now.getMinutes();
    let second = time_now.getSeconds();
    if (hour >= 12) {
        document.getElementById("clock").innerHTML=`${hour -12} : ${minute} : ${second} PM`
    } else {
        document.getElementById("clock").innerHTML=`${hour} : ${minute} : ${second} AM`
    }
    const nowInMinutes = hour * 60 + minute;


    let nextPrayer = null;
    let minDiff = Infinity;

for (let [name, timeStr] of Object.entries(prayerData)) {
    const [hourStr, minuteStr] = timeStr.split(":");
    const prayerHour = Number(hourStr);
    const prayerMinute = Number(minuteStr);
    const prayerInMinutes = prayerHour * 60 + prayerMinute;

    if (prayerInMinutes > nowInMinutes && prayerInMinutes - nowInMinutes < minDiff) {
    minDiff = prayerInMinutes - nowInMinutes;
    nextPrayer = name;
    }
}

    if (nextPrayer) {
        document.getElementById(`${nextPrayer}`).style.backgroundColor="cadetblue"
    const hoursLeft = Math.floor(minDiff / 60);
        const minutesLeft = minDiff % 60;
        if (nextPrayer === "Sunrise") {
            nextPrayer = "الشروق"
        }
        else if (nextPrayer === "Dhuhr") {
            nextPrayer = "الظهر"
        }
        else if (nextPrayer === "Asr") {
            nextPrayer = "العصر"
        }
        else if (nextPrayer === "Maghrib") {
            nextPrayer = "المغرب"
        }
        else if (nextPrayer === "Isha") {
            nextPrayer = "العشاء"
        }
        if (hoursLeft === 0) {
            document.getElementById("next").innerHTML = `الصلاة القادمة ${nextPrayer} بعد ${minutesLeft} دقيقة`

        } else {
            document.getElementById("next").innerHTML = `الصلاة القادمة ${nextPrayer} بعد  ${hoursLeft} ساعة و ${minutesLeft} دقيقة`;
        }
        
} else {
        document.getElementById("next").innerHTML = "No more prayers for today";
}
}, 1000);

let nex_btn = document.getElementById("next_zekr");
let cou = document.getElementById("counter");

fetch("Azkar.json").then((res) => {
    return res.json();
}).then((data) => {
    let i = 0;

    function loadZekr(index) {
        document.getElementById("zekr_div").innerHTML = data.sabah[index].zekr;
        cou.innerHTML = data.sabah[index].val;
        document.getElementById("zekr_div").style.backgroundColor = "#203a43";
        document.getElementById("zekr_div").style.color = "#ffffffff";
    }

    loadZekr(i);

    cou.onclick = () => {
        if (parseInt(cou.innerHTML) > 0) {
            cou.innerHTML -= 1;

            if (parseInt(cou.innerHTML) === 0) {
                document.getElementById("zekr_div").style.backgroundColor = "#00ff3cff";
                document.getElementById("zekr_div").style.color = "#000000ff";
            }
        }
    };

    nex_btn.onclick = async function handleNext() {
        if (parseInt(cou.innerHTML) > 0) {
        await Swal.fire({
        title: 'خطأ',
        text: 'أكمِل الذكر قبل الانتقال',
        icon: 'error',
        confirmButtonText: 'اشطاا '  
        });
            return;
        }

        i++;
        if (i < data.sabah.length) {
            loadZekr(i);
        } else {
            document.getElementById("zekr_div").innerHTML = "انتهت الأذكار";
            document.getElementById("zekr_div").style.backgroundColor = "#203a43";
            document.getElementById("zekr_div").style.color = "white";
            nex_btn.innerText = "أعد البداية";
            cou.innerText = "انتهيت";


            nex_btn.onclick = () => {
                i = 0;
                loadZekr(i);
                nex_btn.innerText = "التالي";
                cou.innerText = data.sabah[i].val;

                cou.onclick = () => {
                    if (parseInt(cou.innerHTML) > 0) {
                        cou.innerHTML -= 1;
                        if (parseInt(cou.innerHTML) === 0) {
                            document.getElementById("zekr_div").style.backgroundColor = "#00ff3cff";
                            document.getElementById("zekr_div").style.color = "#000000ff";
                        }
                    }
                };

                nex_btn.onclick = handleNext;
            };
        }
    };
});


