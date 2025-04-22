/* ----------------------------------------------------------
   Attendance App – v2  (timestamps + 30‑day percentages)
-----------------------------------------------------------*/
import {
  collection, addDoc, serverTimestamp,
  query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

/* === COMPLETE STUDENT LIST (108) === */
const students = [
  { roll:"23Q91A05W5", name:"ABUZAR KHAN" },
  { roll:"23Q91A05W6", name:"ADUWALA RAHUL" },
  { roll:"23Q91A05W7", name:"ALAKUNTLA SHIREESHA" },
  { roll:"23Q91A05W8", name:"ANSHU SINGH" },
  { roll:"23Q91A05W9", name:"BADDAM SATHWIKA" },
  { roll:"23Q91A05X0", name:"BAGGI RISHIKA" },
  { roll:"23Q91A05X1", name:"BALDE VAMSHI" },
  { roll:"23Q91A05X2", name:"BANDA SHRAVYA" },
  { roll:"23Q91A05X3", name:"BARLA ABHINASH KUMAR REDDY" },
  { roll:"23Q91A05X4", name:"BHUKYA RAM" },
  { roll:"23Q91A05X5", name:"BOKKALA ASHRITHA" },
  { roll:"23Q91A05X6", name:"C SOUMYA SREE" },
  { roll:"23Q91A05X7", name:"CHITTAMPALLY SAITEJA" },
  { roll:"23Q91A05X8", name:"DABBU MANISHA" },
  { roll:"23Q91A05X9", name:"DANASARI DEEPIKA" },
  { roll:"23Q91A05Y0", name:"DESHMUKH SHIVANI" },
  { roll:"23Q91A05Y1", name:"DHARAVATH SANJAY" },
  { roll:"23Q91A05Y3", name:"ENAVANKA SANJAY RAM" },
  { roll:"23Q91A05Y4", name:"GANDHI SRINIVAS" },
  { roll:"23Q91A05Y5", name:"GUNTA VINITHA" },
  { roll:"23Q91A05Y6", name:"J SARITHA" },
  { roll:"23Q91A05Y7", name:"JARUPULA SWAMI" },
  { roll:"23Q91A05Y8", name:"KALLI GOPI SANJAY REDDY" },
  { roll:"23Q91A05Y9", name:"KANKALA MADHUHA" },
  { roll:"23Q91A05Z0", name:"KHOKLE USHATAI" },
  { roll:"23Q91A05Z1", name:"KODIDALA CHARAN KUMAR" },
  { roll:"23Q91A05Z2", name:"KOTARI BHARGAVI" },
  { roll:"23Q91A05Z4", name:"M HEMANTH KUMAR" },
  { roll:"23Q91A05Z5", name:"M MANYAM KONDA" },
  { roll:"23Q91A05Z6", name:"M SANTHOSH KUMAR" },
  { roll:"23Q91A05Z7", name:"M SRIVANI" },
  { roll:"23Q91A05Z8", name:"MADAPATHI AARTHI" },
  { roll:"23Q91A05Z9", name:"MALLEPALLY MANO TEJA" },
  { roll:"23Q91A05AA", name:"MALLOJI SAI TEJA" },
  { roll:"23Q91A05AB", name:"MALOTHU SAI NAIK" },
  { roll:"23Q91A05AC", name:"MAMILLA DARSHAN" },
  { roll:"23Q91A05AD", name:"MARPADAGA ASHRITH" },
  { roll:"23Q91A05AE", name:"MIRIYALA NAGA CHARAN" },
  { roll:"23Q91A05AF", name:"MOHAMMED ABDUL RAHEEM" },
  { roll:"23Q91A05AG", name:"MOHAMMED SUFIYAN" },
  { roll:"23Q91A05AH", name:"MYAKAMALLA AJAY" },
  { roll:"23Q91A05AJ", name:"NEHA DEVI SHARMA" },
  { roll:"23Q91A05AK", name:"NUNNA LOCHAN KUMAR" },
  { roll:"23Q91A05AL", name:"PASULA KAVYA" },
  { roll:"23Q91A05AM", name:"PINGILI PRAVEEN KUMAR" },
  { roll:"23Q91A05AN", name:"PITTALA VAISHNAVI" },
  { roll:"23Q91A05AP", name:"PUTTICHINABAYANNOLLA RAMCHARAN" },
  { roll:"23Q91A05AQ", name:"RAJESHWAR ROHITH" },
  { roll:"23Q91A05AR", name:"RITVIK RAJAYA" },
  { roll:"23Q91A05AT", name:"SARAMPATI PRIYA DARSHINI" },
  { roll:"23Q91A05AU", name:"SINGAMANENI LAXMI KANTH" },
  { roll:"23Q91A05AV", name:"SOMANABOINA JAGADEESH" },
  { roll:"23Q91A05AW", name:"T JATHIN REDDY" },
  { roll:"23Q91A05AX", name:"THONTI MAMATHA" },
  { roll:"23Q91A05AY", name:"THOTA SANDEEP" },
  { roll:"23Q91A05BB", name:"VARANASI SAIKIRAN" },
  { roll:"23Q91A05BC", name:"VASAMPELLI DIVYA" },
  { roll:"23Q91A05BD", name:"WAQAR FATIMA" },
  { roll:"24Q95A0530", name:"KOTTE RANADHEER KUMAR" },
  { roll:"24Q95A0531", name:"KUNTENAGARI ROHAN" },
  { roll:"24Q95A0532", name:"MOHAMMAD ABBAS" },
  { roll:"24Q95A0533", name:"NANAVENI SAI VAMSHI" },
  { roll:"24Q95A0535", name:"POTTURU LAHARI" }
];

/* === render checklist === */
const list=document.getElementById("student-list");
students.forEach(s=>{
  const row=document.createElement("div");row.className="student-item";
  const cb=document.createElement("input");cb.type="checkbox";cb.id=`st-${s.roll}`;
  const lab=document.createElement("label");lab.htmlFor=cb.id;
  lab.textContent=`${s.roll} – ${s.name}`;
  row.append(cb,lab);list.appendChild(row);
});

/* === helpers === */
const last30=async()=>{
  const thirty=new Date(Date.now()-30*24*60*60*1000);
  const snap=await getDocs(
    query(collection(window.db,"attendance"),where("timestamp",">=",thirty))
  );
  return snap.docs.map(d=>d.data());
};
const refreshPct=async()=>{
  const recs=await last30();const total=recs.length||1;const cnt={};
  recs.forEach(r=>r.present.forEach(x=>cnt[x]=(cnt[x]||0)+1));
  students.forEach(s=>s.percent=((cnt[s.roll]||0)/total*100).toFixed(1));
};
await refreshPct();

/* === submit/save === */
document.getElementById("submit-btn").addEventListener("click",async()=>{
  const present=[],absent=[];
  students.forEach(s=>{
    const cb=document.getElementById(`st-${s.roll}`);
    (cb.checked?absent:present).push(s.roll);cb.checked=false;
  });
  const now=new Date();
  await addDoc(collection(window.db,"attendance"),{
    date:now.toISOString().slice(0,10),time:now.toLocaleTimeString(),
    present,absent,timestamp:serverTimestamp()
  });
  alert("Attendance saved!");
  await refreshPct();showSummary(present,absent);loadLog();
});

/* === summary & share === */
function showSummary(present,absent){
  let pct="\n📊 Percentages (30 days):\n";
  students.forEach(s=>pct+=`${s.roll}: ${s.percent}%\n`);
  document.getElementById("summary").innerText=`
📅 ${new Date().toLocaleDateString()}
✅ Present (${present.length}): ${present.join(", ")}
❌ Absent  (${absent.length}): ${absent.join(", ")}
${pct}`.trim();
}
window.copyToClipboard=()=>navigator.clipboard
  .writeText(document.getElementById("summary").innerText).then(()=>alert("Copied!"));
window.shareToWhatsApp=()=>window.open(
  `https://wa.me/?text=${encodeURIComponent(document.getElementById("summary").innerText)}`,"_blank"
);

/* === log display === */
async function loadLog(){
  const recs=await last30();
  document.getElementById("log").innerText=
    recs.map(r=>`${r.date} ${r.time}: P${r.present.length} A${r.absent.length}`).join("\n")||
    "No records yet.";
}
loadLog();
