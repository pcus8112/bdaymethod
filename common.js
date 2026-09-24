const PAYHIP_PRODUCT_URL = "";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const doomsdayDates = {1:3,2:28,3:14,4:4,5:9,6:6,7:11,8:8,9:5,10:10,11:7,12:12};
const pad = value => String(value).padStart(2,"0");
function isLeap(year){return year%4===0&&(year%100!==0||year%400===0)}
function anchor(year){const century=Math.floor(year/100)*100;return ((Math.floor(century/100)%4)*5+2)%7}
function doomsday(year){const a=year%100;return (anchor(year)+a+Math.floor(a/4))%7}
function dateWeekday(year,month,day){const base=doomsday(year);const reference=(month===1&&isLeap(year))?4:(month===2&&isLeap(year))?29:doomsdayDates[month];const value=(base+(day-reference))%7;return value<0?value+7:value}
function showCalculator(){const day=Number(document.querySelector("#day").value),month=Number(document.querySelector("#month").value),year=Number(document.querySelector("#year").value),message=document.querySelector("#calculator-message"),result=document.querySelector("#result");message.textContent="";result.innerHTML="";if(!day||!year){message.textContent="Please enter a day and year.";return}const max=new Date(year,month,0).getDate();if(day<1||day>max){message.textContent="That date does not exist. Check the day, month, and leap year.";return}const weekday=weekdays[dateWeekday(year,month,day)];result.innerHTML=`<strong>${weekday}</strong><span>${pad(month)}/${pad(day)}/${year} · US format</span>`}
function renderPattern(){const year=Number(document.querySelector("#pattern-year").value),weekday=weekdays[doomsday(year)],result=document.querySelector("#pattern-result");document.querySelector("#anchor-weekday").textContent=weekday;result.innerHTML=["04/04","06/06","08/08","10/10","12/12"].map(date=>`<div class="date-chip"><strong>${date}</strong><small>${weekday}</small></div>`).join("")}
function makeChallenge(){const year=Number(document.querySelector("#pattern-year").value),correct=weekdays[doomsday(year)],choices=[correct,"Monday","Wednesday","Saturday"].filter((v,i,a)=>a.indexOf(v)===i).sort();document.querySelector("#choices").innerHTML=choices.map(day=>`<button class="choice" data-choice="${day}">${day}</button>`).join("");document.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>{document.querySelector("#challenge-feedback").textContent=button.dataset.choice===correct?"Correct. June 6 is another anchor date.":`Keep looking: in ${year}, April 4 and June 6 share the weekday ${correct}.`}))}
function refreshPattern(){renderPattern();makeChallenge()}
document.querySelector("#calculate").addEventListener("click",showCalculator);
document.querySelector("#pattern-year").addEventListener("change",refreshPattern);
document.querySelector("#unlock-button").addEventListener("click",()=>document.querySelector("#payhip-button").focus());
document.querySelector("#payhip-button").addEventListener("click",()=>{if(PAYHIP_PRODUCT_URL)window.location.href=PAYHIP_PRODUCT_URL;else alert("The Payhip product link will be connected before publication.")});
document.querySelectorAll(".language").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.lang!=="en")alert("This language version will be connected in the next stage.");else document.querySelectorAll(".language").forEach(b=>{b.classList.toggle("active",b===button);b.setAttribute("aria-current",b===button?"true":"false")})}));
refreshPattern();
