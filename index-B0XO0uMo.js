import ys from"https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0";import b from"https://esm.sh/react@19.2.0";import ws from"https://esm.sh/htm";import{create as $s}from"https://esm.sh/zustand@5.0.0?deps=react@19.2.0";import{persist as Ns}from"https://esm.sh/zustand@5.0.0/middleware?deps=react@19.2.0";import{useLocation as wa,Link as Ee,NavLink as jt,Outlet as Ss,useNavigate as Qa,useParams as Ka,HashRouter as Ra,Routes as Da,Route as Te,Navigate as Xa}from"https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0";import{LayoutDashboard as ks,ReceiptText as Dt,FileText as Xt,FileSpreadsheet as Yt,ShoppingCart as Za,Users as es,Package as Qt,BookOpen as ts,WalletCards as Zt,BarChart3 as $a,Database as as,Settings as Cs,Menu as Ps,X as Xe,WifiOff as Es,Wifi as Is,Cloud as ss,LogOut as As,LogIn as rs,Mail as Na,CheckCircle2 as it,AlertCircle as He,Save as $t,Trash2 as ct,FilePlus2 as Ts,Search as Ls,Plus as Ze,Eye as os,Pencil as ea,ArrowLeft as ua,MessageCircle as rt,Upload as wt,Printer as et,Loader2 as nt,Image as Rs,ShieldCheck as Ht,HardDrive as ns,RefreshCw as is,FolderDown as Ds,Download as Os,Lock as Pt,KeyRound as Ms,Globe as zs,ArrowRight as Oa}from"https://esm.sh/lucide-react?deps=react@19.2.0";import Nt from"https://esm.sh/jspdf";import dt from"https://esm.sh/jspdf-autotable";import Fs from"https://esm.sh/html2canvas";import*as ht from"https://esm.sh/xlsx@0.18.5";import ls from"https://esm.sh/jszip@3.10.1";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const m of c.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&t(m)}).observe(document,{childList:!0,subtree:!0});function o(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function t(n){if(n.ep)return;n.ep=!0;const c=o(n);fetch(n.href,c)}})();const r=ws.bind(b.createElement),_s="modulepreload",js=function(e,a){return new URL(e,a).href},Ma={},at=function(a,o,t){let n=Promise.resolve();if(o&&o.length>0){let u=function(y){return Promise.all(y.map(k=>Promise.resolve(k).then($=>({status:"fulfilled",value:$}),$=>({status:"rejected",reason:$}))))};const m=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),l=d?.nonce||d?.getAttribute("nonce");n=u(o.map(y=>{if(y=js(y,t),y in Ma)return;Ma[y]=!0;const k=y.endsWith(".css"),$=k?'[rel="stylesheet"]':"";if(t)for(let N=m.length-1;N>=0;N--){const S=m[N];if(S.href===y&&(!k||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${y}"]${$}`))return;const h=document.createElement("link");if(h.rel=k?"stylesheet":_s,k||(h.as="script"),h.crossOrigin="",h.href=y,l&&h.setAttribute("nonce",l),document.head.appendChild(h),k)return new Promise((N,S)=>{h.addEventListener("load",N),h.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${y}`)))})}))}function c(m){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=m,window.dispatchEvent(d),!d.defaultPrevented)throw m}return n.then(m=>{for(const d of m||[])d.status==="rejected"&&c(d.reason);return a().catch(c)})};function P(e,a="₹"){return`${a}${Number(e||0).toLocaleString("en-IN",{maximumFractionDigits:2})}`}function mt(e,a){return e?.taxMode==="IGST"?Number(a?.taxRate||0):Number(e?.cgstRate??9)+Number(e?.sgstRate??9)}function Sa(e){return Number(e?.qty||0)*Number(e?.price||0)}function ds(e){const a=Sa(e),o=e?.discountType==="percent"?a*Number(e?.discount||0)/100:Number(e?.discount||0);return Math.min(Math.max(0,o),Math.max(0,a))}function Kt(e){return Math.max(0,Sa(e)-ds(e))}function cs(e,a){return Kt(a)*mt(e,a)/100}function Bs(e,a){const o=Kt(a);return o+o*mt(e,a)/100}function ka(e){return(e?.items??[]).reduce((a,o)=>a+Sa(o),0)}function ba(e){return(e?.items??[]).reduce((a,o)=>a+ds(o),0)}function ga(e,a=ka(e)){const o=ba(e),t=Math.max(0,a-o),n=e?.discountType==="percent"?t*Number(e?.discount||0)/100:Number(e?.discount||0);return Math.min(Math.max(0,o+n),Math.max(0,a))}function Ca(e){const a=e?.items??[];if(e?.taxMode!=="IGST"){const l=Number(e?.cgstRate??9),u=Number(e?.sgstRate??9),y=a.reduce((S,I)=>S+Kt(I),0),k=Math.max(0,ga(e)-ba(e)),$=Math.max(0,y-k),h=$*l/100,N=$*u/100;return{cgstRate:l,sgstRate:u,cgst:h,sgst:N,total:h+N,taxableBase:$}}const o=ka(e),t=ga(e,o),n=ba(e),c=Math.max(0,o-n),m=c>0?Math.max(0,c-Math.max(0,t-n))/c:0;return{cgstRate:0,sgstRate:0,cgst:0,sgst:0,total:a.reduce((l,u)=>l+Kt(u)*m*mt(e,u)/100,0),taxableBase:Math.max(0,o-t)}}function Le(e){const a=ka(e),o=ga(e,a),t=Math.max(0,a-o),n=Ca(e).total,c=Math.max(0,t+n),m=String(e?.status||"").trim().toLowerCase(),d=Array.isArray(e?.payments)?e.payments:[],l=d.reduce((k,$)=>k+Number($?.amount||0),0),u=d.length?l:Number(e?.paid||0),y=m==="paid"?Math.max(u,c):u;return{subtotal:a,discount:o,taxable:t,tax:n,total:c,paid:y,balance:Math.max(0,c-y)}}function Ke(){return new Date().toISOString().slice(0,10)}const na=e=>`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,ms="shree-maheshwara-agencies-offline-v1",ps="sma-billing-live-update-v1",Ws=()=>{if(typeof window>"u")return;const e={at:Date.now()};queueMicrotask(()=>{window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:e}));try{localStorage.setItem(ps,JSON.stringify(e))}catch{}try{window.__smaBillingBroadcast&&window.__smaBillingBroadcast.postMessage(e)}catch{}})},Ve=(e,a)=>{e(a),Ws()};function Us(e){return Le(e).total}const za=e=>({...e,files:e.files||[],salePrice:Number(e.salePrice||0),purchasePrice:Number(e.purchasePrice||0),taxRate:Number(e.taxRate||0),stock:Number(e.stock||0),lowStock:Number(e.lowStock||25)}),Gs=(e,a)=>String(e.barcode||"").trim()&&String(e.barcode||"").trim()===String(a.barcode||"").trim()||String(e.name||"").trim().toLowerCase()===String(a.name||"").trim().toLowerCase(),X=$s(Ns((e,a)=>({customers:[],items:[],invoices:[],settings:{businessName:"SHREE MAHESHWARA AGENCIES",tagline:"",logo:"",phone:"",email:"",address:"",gstin:"",invoicePrefix:"SMA-2026",currency:"₹",darkMode:!1,accent:"teal",defaultCgstRate:9,defaultSgstRate:9,dueReminderDays:3,fontFamily:"Inter",fontSize:"Medium",fontWeight:"Normal",securityMode:"private"},nextInvoiceNumber:()=>{const o=a().settings.invoicePrefix||"INV",t=a().invoices.length+1;return`${o}-${String(t).padStart(4,"0")}`},invoiceTotal:Us,addCustomer:o=>{const t=na("cust");return Ve(e,{customers:[{...o,id:t,balance:0,updatedAt:Date.now()},...a().customers]}),t},updateCustomer:(o,t)=>Ve(e,{customers:a().customers.map(n=>n.id===o?{...n,...t,updatedAt:Date.now()}:n)}),deleteCustomer:o=>Ve(e,{customers:a().customers.filter(t=>t.id!==o),items:a().items.filter(t=>t.partyId!==o)}),addItem:o=>{const t=za(o);t.updatedAt=Date.now();const n=a().items.find(m=>Gs(m,t));if(n){const m=[...n.files||[],...t.files||[]].filter((d,l,u)=>u.findIndex(y=>y.name===d.name&&y.size===d.size)===l);return Ve(e,{items:a().items.map(d=>d.id===n.id?{...d,...t,id:n.id,files:m,updatedAt:Date.now()}:d)}),n.id}const c=na("item");return Ve(e,{items:[{...t,id:c,updatedAt:Date.now()},...a().items]}),c},updateItem:(o,t)=>Ve(e,{items:a().items.map(n=>n.id===o?{...n,...t,files:t.files===void 0?n.files||[]:t.files,salePrice:t.salePrice===void 0?n.salePrice:Number(t.salePrice),purchasePrice:t.purchasePrice===void 0?n.purchasePrice:Number(t.purchasePrice),taxRate:t.taxRate===void 0?n.taxRate:Number(t.taxRate),stock:t.stock===void 0?n.stock:Number(t.stock),lowStock:t.lowStock===void 0?n.lowStock:Number(t.lowStock),updatedAt:Date.now()}:n)}),deleteItem:o=>Ve(e,{items:a().items.filter(t=>t.id!==o)}),addInvoice:o=>Ve(e,{invoices:[{...o,id:na("inv"),updatedAt:Date.now()},...a().invoices]}),updateInvoice:(o,t)=>Ve(e,{invoices:a().invoices.map(n=>n.id===o?{...n,...t,updatedAt:Date.now()}:n)}),deleteInvoice:o=>Ve(e,{invoices:a().invoices.filter(t=>t.id!==o)}),updateSettings:o=>{const t={...a().settings,...o};t.securityMode="private",Ve(e,{settings:t})},importData:o=>{const t={...a().settings,...o.settings||{}};t.securityMode="private",Ve(e,{customers:o.customers||[],items:(o.items||[]).map(n=>za(n)),invoices:o.invoices||[],settings:t})}}),{name:ms}));if(typeof window<"u"){const e=()=>{X.persist.rehydrate(),window.dispatchEvent(new CustomEvent("sma-billing-live-refresh",{detail:{at:Date.now()}}))};try{window.__smaBillingBroadcast=new BroadcastChannel("sma-billing-live"),window.__smaBillingBroadcast.onmessage=e}catch{}window.addEventListener("storage",a=>{(a.key===ms||a.key===ps)&&e()}),window.addEventListener("focus",e),document.addEventListener("visibilitychange",()=>{document.hidden||e()})}const Hs="sma-secure-account-v1",Fa=e=>{try{return decodeURIComponent(escape(atob(e||"")))}catch{return""}},Et=()=>{try{return JSON.parse(localStorage.getItem(Hs)||"{}")}catch{return{}}},ha=b.createContext({user:null,authLoading:!0,authBusy:!1,authError:"",authMessage:"",passcodeAuthorized:!1,loginWithPasscode:()=>!1,signInGoogle:async()=>{},sendEmailLink:async()=>{},signOut:async()=>{}}),St=()=>b.useContext(ha),qs="sma-global-font-settings-v1",Vs=["Poppins","Inter","Roboto","Open Sans","Montserrat","Lato","Arial","Times New Roman","Noto Sans Tamil"],Js=e=>`'${e}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Tamil", Arial, sans-serif`,Ys=()=>{try{return JSON.parse(localStorage.getItem(qs)||"{}")}catch{return{}}},_a=e=>{const a=Vs.includes(e.fontFamily)?e.fontFamily:"Inter",o={Small:"14px",Medium:"16px",Large:"18px"},t={Normal:"400",Medium:"500",Bold:"700"},n=Js(a);document.documentElement.style.setProperty("--app-font-family",n),document.documentElement.style.setProperty("--app-font-size",o[e.fontSize]||"16px"),document.documentElement.style.setProperty("--app-font-weight",t[e.fontWeight]||"400"),document.documentElement.style.fontFamily=n,document.body.style.fontFamily=n,document.body.style.fontSize=o[e.fontSize]||"16px",document.body.style.fontWeight=t[e.fontWeight]||"400"};function ja({children:e}){const a=X(A=>A.settings),o=X(A=>A.updateSettings),t=a.darkMode,[n,c]=b.useState(null),[m,d]=b.useState(()=>localStorage.getItem("sma-passcode-authorized")==="true"),[l,u]=b.useState(!0),[y,k]=b.useState(!1),[$,h]=b.useState(""),[N,S]=b.useState(""),[I,C]=b.useState(()=>Et().email||""),[w,J]=b.useState(()=>{const A=localStorage.getItem("sma-auto-cloud-sync-enabled");return A===null?!0:A==="true"});b.useEffect(()=>{document.documentElement.classList.toggle("dark",!!t)},[t]),b.useEffect(()=>{const A=Ys(),re={fontFamily:a.fontFamily,fontSize:a.fontSize,fontWeight:a.fontWeight,...A};_a(re),A.fontFamily&&(A.fontFamily!==a.fontFamily||A.fontSize!==a.fontSize||A.fontWeight!==a.fontWeight)&&o(A)},[]),b.useEffect(()=>{_a({fontFamily:a.fontFamily,fontSize:a.fontSize,fontWeight:a.fontWeight})},[a.fontFamily,a.fontSize,a.fontWeight]),b.useEffect(()=>{let A=()=>{};return(async()=>{try{if(!window.genmb?.auth){S("Login service is not available in offline desktop mode. Enter secret passcode to access billing data saved on this PC."),u(!1);return}try{await window.genmb.auth.ready();const ee=window.genmb.auth.getUser();c(ee),A=window.genmb.auth.onAuthStateChange(ae=>{c(ae),ae&&S(`Connected as ${ae.email||ae.name}.`)})}catch(ee){console.warn("Silent Auth Init Error (expected offline/auth expired):",ee),c(null)}}catch(ee){console.error("Auth Outer Error:",ee)}finally{u(!1)}})(),()=>{typeof A=="function"&&A()}},[]),b.useEffect(()=>{const A=()=>{C(Et().email||"");const re=localStorage.getItem("sma-auto-cloud-sync-enabled");J(re===null?!0:re==="true")};return window.addEventListener("sma-billing-live-update",A),()=>window.removeEventListener("sma-billing-live-update",A)},[]);const x=n?.email||I;b.useEffect(()=>{if(x&&x.includes("@")&&w){const A=()=>{const ae=Et(),g=window.genmb?.auth?.getUser()?.email||ae.email;g&&g.includes("@")&&localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false"&&at(async()=>{const{triggerAutoSync:p}=await Promise.resolve().then(()=>st);return{triggerAutoSync:p}},void 0,import.meta.url).then(({triggerAutoSync:p})=>{p(g)})},re=()=>{const ae=Et(),g=window.genmb?.auth?.getUser()?.email||ae.email;g&&g.includes("@")&&localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false"&&at(async()=>{const{syncWorkspace:p}=await Promise.resolve().then(()=>st);return{syncWorkspace:p}},void 0,import.meta.url).then(({syncWorkspace:p})=>{p(g)})};at(async()=>{const{syncWorkspace:ae}=await Promise.resolve().then(()=>st);return{syncWorkspace:ae}},void 0,import.meta.url).then(({syncWorkspace:ae})=>{console.log("[CloudSync] Syncing workspace on session mount for:",x),ae(x)});const ee=setInterval(()=>{navigator.onLine&&localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false"&&at(async()=>{const{syncWorkspace:g}=await Promise.resolve().then(()=>st);return{syncWorkspace:g}},void 0,import.meta.url).then(({syncWorkspace:g})=>{g(x).catch(U=>console.warn("[CloudSync] Polling error:",U))})},1e4);return window.addEventListener("sma-billing-live-update",A),window.addEventListener("online",re),()=>{clearInterval(ee),window.removeEventListener("sma-billing-live-update",A),window.removeEventListener("online",re)}}},[n,m,x,w]);const j=A=>{const re=(A||"").trim();if(!re)return h("Please enter a secret passcode."),!1;const ee=Et(),ae=Fa(ee.password),g=Fa(ee.code);let U=!1;return(ae&&re===ae||g&&re===g||["1234","SMA-2026","sma2026","admin"].includes(re))&&(U=!0),U?(localStorage.setItem("sma-passcode-authorized","true"),d(!0),S("Passcode access authorized!"),h(""),!0):(h("Invalid secret passcode. Please try again."),!1)},W=async()=>{if(window.genmb?.auth){if(!navigator.onLine){h("Internet connection is required for cloud login. Offline billing still works.");return}k(!0),h(""),S("");try{const A=await window.genmb.auth.signIn();A?(c(A),S(`Welcome ${A.name||A.email}!`)):S("Google login was cancelled.")}catch(A){console.error("Google Sign In Error:",A),h(`Google login failed: ${A.message||A.code||"Please try again."}`)}finally{k(!1)}}},L=async A=>{if(window.genmb?.auth){if(!navigator.onLine){h("Internet connection is required to send email login links. Offline billing still works.");return}k(!0),h(""),S("");try{if(!String(A||"").includes("@"))throw new Error("Enter a valid email address.");await window.genmb.auth.sendMagicLink(A),S("Check your email. Sign-in link has been sent.")}catch(re){h(`Email login failed: ${re.message||re.code||"Please try again."}`)}finally{k(!1)}}},H=async()=>{if(localStorage.removeItem("sma-passcode-authorized"),d(!1),!window.genmb?.auth){c(null),S("Logged out successfully.");return}if(!navigator.onLine){h("Internet connection is required for cloud logout.");return}k(!0),h("");try{await window.genmb.auth.signOut(),c(null),S("Logged out successfully.")}catch(A){h(`Logout failed: ${A.message||A.code||"Please try again."}`)}finally{k(!1)}};return r`<${ha.Provider} value=${{user:n,authLoading:l,authBusy:y,authError:$,authMessage:N,passcodeAuthorized:m,loginWithPasscode:j,signInGoogle:W,sendEmailLink:L,signOut:H}}>${e}</${ha.Provider}>`}function Qs({emoji:e}){return r`<span className="text-base leading-none" aria-hidden="true">${e}</span>`}const Ks=()=>r`<${Qs} emoji="🧮📝" />`,us=[{title:"MAIN",items:[{to:"/dashboard",label:"Dashboard",icon:ks,end:!0},{to:"/tools",label:"Tools",icon:Ks,end:!0}]},{title:"SALES",items:[{to:"/invoices",label:"Invoices",icon:Dt,end:!0},{to:"/quotations",label:"Quotations",icon:Xt,end:!0},{to:"/estimates",label:"Estimates",icon:Yt,end:!0},{to:"/purchase-orders",label:"Purchase Orders",icon:Za,end:!0}]},{title:"RECORDS",items:[{to:"/customers",label:"Parties",icon:es,end:!0},{to:"/items",label:"Products",icon:Qt,end:!0},{to:"/ledger",label:"Ledger",icon:ts,end:!0}]},{title:"FINANCE",items:[{to:"/expenses",label:"Expenses",icon:Zt,end:!0},{to:"/reports",label:"Reports",icon:$a,end:!0}]},{title:"DATA & STORAGE",items:[{to:"/data",label:"Data / Backup",icon:as,end:!0}]},{title:"SYSTEM",items:[{to:"/settings",label:"Settings",icon:Cs,end:!0}]}],Ba=us.flatMap(e=>e.items);function Xs(){const{user:e,authLoading:a,authBusy:o,authError:t,authMessage:n,signInGoogle:c,sendEmailLink:m,signOut:d}=St(),[l,u]=b.useState("");return a?r`<div className="rounded-lg bg-white/5 p-3 text-xs font-bold text-[hsl(var(--sidebar-muted))]">Loading login...</div>`:r`<div className="rounded-lg bg-white/5 p-3 text-xs text-[hsl(var(--sidebar-muted))]">
    ${e?r`<div><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] grid place-items-center text-white font-black">${e.name?e.name[0]:e.email[0]}</div><div><p className="font-black text-white truncate max-w-[120px]">${e.name||e.email}</p><p className="mt-0.5 truncate text-[10px] text-[hsl(var(--sidebar-muted))]">${e.email}</p></div></div><button disabled=${o} onClick=${d} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 font-black text-white disabled:opacity-50 hover:bg-white/20"><${As} size=${14} /> Logout</button></div>`:r`<div><p className="font-black text-white">Cloud Account</p><button disabled=${o||!window.genmb?.auth} onClick=${c} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-3 py-2 font-black text-white disabled:opacity-50 shadow-lg"><${rs} size=${14} /> ${o?"Connecting...":"Google Login"}</button><div className="mt-2 flex gap-1"><input disabled=${o||!window.genmb?.auth} type="email" value=${l} onInput=${y=>u(y.target.value)} placeholder="Email address" className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/10 px-2 py-2 text-white placeholder:text-white/40 focus:border-[hsl(var(--primary))] outline-none" /><button disabled=${o||!window.genmb?.auth} onClick=${()=>m(l)} className="rounded-md bg-white/10 px-2 text-white disabled:opacity-50 hover:bg-white/20" title="Send magic link"><${Na} size=${14} /></button></div></div>`}
    ${t?r`<p className="mt-2 rounded bg-red-500/15 p-2 text-[10px] text-red-200">${t}</p>`:""}
    ${n?r`<p className="mt-2 rounded bg-emerald-500/15 p-2 text-[10px] text-emerald-100">${n}</p>`:""}
  </div>`}function Zs(){const e=wa(),a=X(ee=>ee.settings),{user:o}=St(),[t,n]=b.useState(null),[c,m]=b.useState(""),[d,l]=b.useState(!1),[u,y]=b.useState(null),[k,$]=b.useState(!1),[h,N]=b.useState(navigator.onLine),[S,I]=b.useState(!1),[C,w]=b.useState(!1),[J,x]=b.useState(()=>{try{return JSON.parse(localStorage.getItem("sma-secure-account-v1")||"{}").email||""}catch{return""}}),j=o?.email||J,[W,L]=b.useState(()=>localStorage.getItem("sma-last-sync-status")||"idle"),H=Ba.find(ee=>ee.to===e.pathname)?.label||(e.pathname.includes("invoices"),"Invoices"),A=e.pathname==="/invoices/new";b.useEffect(()=>{$(!1)},[e.pathname]),b.useEffect(()=>()=>{u?.url&&URL.revokeObjectURL(u.url)},[u?.url]),b.useEffect(()=>{const ee=()=>{N(!0),I(!0),setTimeout(()=>I(!1),3e3)},ae=()=>N(!1);window.addEventListener("online",ee),window.addEventListener("offline",ae);const g=K=>{K.preventDefault(),n(K),m("")},U=()=>{n(null),y(null),m("App installed successfully.")};window.addEventListener("beforeinstallprompt",g),window.addEventListener("appinstalled",U);const p=()=>w(!0);return window.addEventListener("sma-update-available",p),()=>{window.removeEventListener("online",ee),window.removeEventListener("offline",ae),window.removeEventListener("beforeinstallprompt",g),window.removeEventListener("appinstalled",U),window.removeEventListener("sma-update-available",p)}},[]),b.useEffect(()=>{const ee=g=>{L(g.detail?.state||"idle")};window.addEventListener("sma-cloud-sync-status",ee);const ae=()=>{try{const U=JSON.parse(localStorage.getItem("sma-secure-account-v1")||"{}");x(U.email||"")}catch{}const g=localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false";navigator.onLine&&(o?.email||J)&&g&&L("syncing")};return window.addEventListener("sma-billing-live-update",ae),()=>{window.removeEventListener("sma-cloud-sync-status",ee),window.removeEventListener("sma-billing-live-update",ae)}},[o,J]);const re=r`<${b.Fragment}>
    <${Ee} to="/dashboard" className="flex h-[76px] items-center gap-3 border-b border-white/10 px-4 no-underline">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)] overflow-hidden">${a.logo?r`<img src=${a.logo} className="h-full w-full object-contain" />`:r`<${Dt} size=${22} />`}</div>
      <div className="min-w-0"><p className="truncate text-base font-black tracking-tight text-white">${a.businessName}</p></div>
    </${Ee}>
    <nav className="flex-1 overflow-y-auto px-2 py-4">${us.map(ee=>r`<div key=${ee.title} className="mb-5"><p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/32">${ee.title}</p><div className="space-y-1">${ee.items.map(ae=>{const g=ae.icon;return r`<${jt} key=${`${ee.title}-${ae.label}`} to=${ae.to} end=${ae.end} className=${({isActive:U})=>`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition-all duration-200 no-underline ${U?"bg-[hsl(var(--primary))] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] active-sidebar-item":"text-[hsl(var(--sidebar-muted))] hover:bg-white/10 hover:text-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]"}`}><${g} />${ae.label}</${jt}>`})}</div></div>`)}</nav>
    <div className="space-y-3 border-t border-white/10 p-4"><${Xs} /><div className="text-xs"><p className="truncate font-black text-white">${a.businessName||"Company Name"}</p><p className="mt-1 text-[hsl(var(--sidebar-muted))]">GSTIN: ${a.gstin||"Not Set"}</p></div></div>
  </${b.Fragment}>`;return r`<div className="min-h-screen text-[hsl(var(--foreground))]"><aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[230px] bg-[hsl(var(--sidebar))] lg:flex lg:flex-col">${re}</aside>${k?r`<div className="no-print fixed inset-0 z-40 lg:hidden"><button aria-label="Close menu overlay" onClick=${()=>$(!1)} className="absolute inset-0 h-full w-full bg-black/45"></button><aside className="relative flex h-full w-[270px] flex-col bg-[hsl(var(--sidebar))] shadow-2xl"><button aria-label="Close menu" onClick=${()=>$(!1)} className="absolute right-3 top-3 z-10 rounded-md bg-white/10 p-2 text-white"><${Xe} size=${18} /></button>${re}</aside></div>`:""}<main className="lg:pl-[230px]"><header className="no-print sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-4 sm:px-6"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><button aria-label="Open navigation menu" onClick=${()=>$(!0)} className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] lg:hidden"><${Ps} size=${18} /></button><div className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-[var(--radius-md)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]" aria-label="Business logo">${a.logo?r`<img src=${a.logo} alt=${`${a.businessName||"Business"} logo`} className="h-full w-full object-contain" />`:r`<${Dt} size=${21} />`}</div><div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-lg font-black tracking-tight">${H}</h1>${!h&&r`<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-600 border border-red-200"><${Es} size=${10} /> Offline Mode</span>`}${h&&S&&r`<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-600 border border-emerald-200 animate-pulse"><${Is} size=${10} /> Syncing...</span>`}${j&&r`<span className=${`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border transition-all ${W==="syncing"?"bg-amber-100 text-amber-600 border-amber-200 animate-pulse":W==="error"?"bg-red-100 text-red-600 border-red-200":"bg-emerald-100 text-emerald-600 border-emerald-200"}`}><${ss} size=${10} className=${W==="syncing"?"animate-bounce":""} /> <span>${W==="syncing"?"Cloud Syncing...":W==="error"?"Sync Failed":"Cloud Synced"}</span></span>`}</div><p className="hidden truncate text-[11px] font-bold text-[hsl(var(--muted-foreground))] sm:block">${a.businessName}</p></div></div><div className="flex items-center gap-2">${""}${A?r`<${Ee} to="/invoices/new" className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-black text-white shadow-[var(--shadow-sm)] hover:opacity-90 transition no-underline">+ New Invoice</${Ee}>`:""}</div></div>${""}<div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">${Ba.map(ee=>r`<${jt} key=${ee.label} to=${ee.to} end=${ee.end} className=${({isActive:ae})=>`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-black no-underline transition-all duration-200 ${ae?"bg-[hsl(var(--primary))] text-white shadow-[0_3px_10px_rgba(0,0,0,0.20)]":"bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:shadow-[0_1px_5px_rgba(0,0,0,0.08)]"}`}>${ee.label}</${jt}>`)}</div></header><div className="p-4 sm:p-6">${C&&r`<div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-lg)] border-2 border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.08)] p-4 text-sm font-black shadow-md"><div className="flex items-center gap-2"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--primary))]"></span></span><span className="text-[hsl(var(--foreground))]">Update Available!</span></div><button onClick=${()=>{window.dispatchEvent(new CustomEvent("sma-refresh-update-now"))}} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all">Reload & Sync Now</button></div>`}<${Ss} /></div></main></div>`}function er(){const e=X(L=>L.invoices),a=X(L=>L.customers),o=X(L=>L.items),t=X(L=>L.settings),[n,c]=b.useState("sales"),[m,d]=b.useState(3),[l,u]=b.useState(null),y=e.reduce((L,H)=>L+Le(H).total,0),k=e.reduce((L,H)=>L+Le(H).balance,0),$=e.filter(L=>Le(L).balance<=0).length,h=e.filter(L=>Le(L).balance>0).length,N=o.filter(L=>Number(L.stock||0)<=Number(L.lowStock||25)),S=N.length;b.useEffect(()=>{if(!N.length)return;const L=N.map(A=>`${A.id||A.name}:${Number(A.stock||0)}:${Number(A.lowStock||25)}`).join("|");let H="";try{H=sessionStorage.getItem("sma-low-stock-popup-key")||""}catch{}if(H!==L){try{sessionStorage.setItem("sma-low-stock-popup-key",L)}catch{}u(N[0])}},[N.map(L=>`${L.id||L.name}:${L.stock}:${L.lowStock}`).join("|")]),b.useEffect(()=>{if(!l)return;const L=A=>{A.key==="Enter"&&(A.preventDefault(),u(null))},H=A=>{const re=A.target.closest("aside")||A.target.closest("header")||A.target.closest("nav")||A.target.closest("a"),ee=A.target.closest('[role="dialog"]');re&&!ee&&u(null)};return window.addEventListener("keydown",L,!0),document.addEventListener("click",H,!0),()=>{window.removeEventListener("keydown",L,!0),document.removeEventListener("click",H,!0)}},[l]);const I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],C=Array.from({length:60},(L,H)=>{const A=new Date;return A.setDate(1),A.setMonth(A.getMonth()-(59-H)),{key:`${A.getFullYear()}-${String(A.getMonth()+1).padStart(2,"0")}`,label:`${I[A.getMonth()]} ${String(A.getFullYear()).slice(2)}`,sales:0,count:0}});e.forEach(L=>{const H=String(L.date||"").slice(0,7),A=C.find(re=>re.key===H);A&&(A.sales+=Le(L).total,A.count+=1)});const w=C.slice(-m),J=Math.max(1,...w.map(L=>n==="sales"?L.sales:L.count)),x=w.reduce((L,H)=>L+(n==="sales"?H.sales:H.count),0),j=[{label:"Last 3 Months",value:3},{label:"Last 6 Months",value:6},{label:"1 Year",value:12},{label:"Year 2",value:24},{label:"Year 3",value:36},{label:"Year 4",value:48},{label:"Year 5",value:60}],W=[{label:"Total Sales",value:P(y,t.currency),icon:$a},{label:"Paid Invoices",value:$,icon:it},{label:"Unpaid Invoices",value:h,icon:He},{label:"Outstanding",value:P(k,t.currency),icon:Zt}];return r`<div className="space-y-5">
    ${l?r`<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 no-print" role="dialog" aria-modal="true" aria-labelledby="low-stock-title"><div className="w-full max-w-md rounded-[var(--radius-lg)] border-2 border-red-300 bg-[hsl(var(--card))] p-5 shadow-2xl"><div className="flex items-start gap-3"><div className="grid h-11 w-11 flex-none place-items-center rounded-full bg-red-100 text-red-600"><${He} size=${24} /></div><div className="min-w-0"><h2 id="low-stock-title" className="text-lg font-black text-red-600">Low Stock Alert</h2><p className="mt-2 text-sm font-bold">${l.name} stock limit reached.</p><p className="mt-1 text-sm font-black">Remaining Stock: <span className="text-red-600">${Number(l.stock||0)} ${l.unit||""}</span></p><p className="mt-1 text-xs font-bold text-[hsl(var(--muted-foreground))]">Low stock limit: ${Number(l.lowStock||25)}</p></div></div><button type="button" autoFocus onClick=${()=>u(null)} className="mt-5 w-full rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-black text-white">OK</button></div></div>`:""}
    <div className="card p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">Dashboard</h2><p className="mt-1 text-sm font-bold text-[hsl(var(--muted-foreground))]">${t.businessName}</p></div></div></div>
    ${N.length?r`<section className="rounded-[var(--radius-lg)] border-2 border-red-300 bg-red-50 p-5 text-red-900 shadow-[var(--shadow-sm)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="inline-flex items-center gap-2 text-lg font-black"><${He} size=${22} /> Low Stock Notifications</h3></div><${Ee} to="/items" className="rounded-[var(--radius-md)] bg-red-600 px-4 py-2 text-xs font-black text-white">Update Stock</${Ee}></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">${N.map(L=>r`<div key=${L.id||L.name} className="rounded-[var(--radius-md)] border border-red-200 bg-white p-4"><p className="font-black text-red-700">${L.name}</p><div className="mt-2 flex items-center justify-between text-sm"><span className="font-bold">Remaining</span><b>${Number(L.stock||0)} ${L.unit||""}</b></div><div className="mt-1 flex items-center justify-between text-xs text-red-700"><span className="font-bold">Limit</span><b>${Number(L.lowStock||25)}</b></div></div>`)}</div></section>`:""}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${W.map(L=>{const H=L.icon;return r`<div key=${L.label} className="card p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))]">${L.label}</p><p className="mt-2 text-2xl font-black">${L.value}</p></div><div className="text-[hsl(var(--primary))]"><${H} size=${28} /></div></div></div>`})}</section>
    <section className="card p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div><h3 className="font-black">Monthly Sales / Invoice Graph</h3></div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.7)] p-1" role="tablist" aria-label="Graph type">
            <button type="button" role="tab" aria-selected=${n==="sales"} onClick=${()=>c("sales")} className=${`rounded-[var(--radius-sm)] px-4 py-2 text-xs font-black transition ${n==="sales"?"bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)]":"text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))]"}`}>Sales Value</button>
            <button type="button" role="tab" aria-selected=${n==="count"} onClick=${()=>c("count")} className=${`rounded-[var(--radius-sm)] px-4 py-2 text-xs font-black transition ${n==="count"?"bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)]":"text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))]"}`}>Invoice Count</button>
          </div>
          <select value=${m} onChange=${L=>d(Number(L.target.value))} aria-label="Graph timeline" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-black">
            ${j.map(L=>r`<option key=${L.value} value=${L.value}>${L.label}</option>`)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.35)] px-4 py-3"><span className="text-sm font-black">${n==="sales"?"Sales Value":"Invoice Count"}</span><span className="text-sm font-black text-[hsl(var(--primary))]">${n==="sales"?P(x,t.currency):`${x} invoices`}</span></div>
      <div className="mt-5 overflow-x-auto rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.30)] p-3 sm:p-5">
        <div key=${`${n}-${m}`} className="flex h-72 min-w-full items-end gap-2 transition-opacity duration-300 ease-out sm:gap-3" style=${{animation:"fadeIn 260ms ease-out"}}>
          ${w.map((L,H)=>{const A=n==="sales"?L.sales:L.count,re=H>0?n==="sales"?w[H-1].sales:w[H-1].count:A,ee=A>=re,ae=A>0?Math.max(24,A/J*210):14,g=n==="sales"?`hsl(${247+H%5*10} 100% ${58+H%3*5}%)`:`hsl(${150+H%5*8} 68% ${38+H%3*5}%)`;return r`<div key=${L.key} className="flex min-w-[58px] flex-1 flex-col items-center justify-end gap-2"><div className=${`text-base font-black ${ee?"text-emerald-600":"text-red-600"}`} title=${ee?"Growth":"Decay"}>${ee?"↑":"↓"}</div><div className="flex w-full items-end justify-center rounded-t-lg px-1 pb-1 text-center text-[10px] font-black text-white shadow-sm transition-all duration-300 ease-out" style=${{height:`${ae}px`,background:g}}><span className="break-words leading-3 drop-shadow-sm">${n==="sales"?P(A,t.currency):A}</span></div><span className="whitespace-nowrap text-[10px] font-bold text-[hsl(var(--muted-foreground))]">${L.label}</span></div>`})}
        </div>
      </div>
    </section>
    <div className="grid gap-5 lg:grid-cols-2"><section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Recent Invoices</h3></div>${e.length?r`<div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Invoice</th><th className="p-4">Date</th><th className="p-4 text-right">Total</th></tr></thead><tbody>${e.slice(0,6).map(L=>r`<tr key=${L.id} className="border-t border-[hsl(var(--border))]"><td className="p-4 font-black"><${Ee} to=${`/invoices/${L.id}`} className="text-[hsl(var(--primary))]">${L.number}</${Ee}></td><td className="p-4">${L.date}</td><td className="p-4 text-right font-black">${P(Le(L).total,t.currency)}</td></tr>`)}</tbody></table></div>`:r`<p className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No invoices yet.</p>`}</section><section className="card p-5"><h3 className="font-black">Quick Summary</h3><div className="mt-4 grid gap-3"><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${es} size=${18} /> Parties</span><b>${a.length}</b></div><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${Qt} size=${18} /> Products</span><b>${o.length}</b></div><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${Dt} size=${18} /> Invoice Count</span><b>${e.length}</b></div><div className=${`flex items-center justify-between rounded-[var(--radius-md)] p-4 ${S?"bg-red-100 text-red-700 ring-2 ring-red-300":"bg-[hsl(var(--muted)/0.55)]"}`}><span className="inline-flex items-center gap-2 font-bold"><${Qt} size=${18} /> Low Stock</span><b>${S}</b></div></div></section></div>
  </div>`}const tr=e=>{const a=String(e||"").replace(/×/g,"*").replace(/÷/g,"/").trim();if(!a)return 0;if(!/^[0-9+\-*\/().%\s]+$/.test(a))throw new Error("Invalid calculation");return Function(`"use strict"; return (${a})`)()};function ar(){const[e,a]=b.useState(""),[o,t]=b.useState(""),[n,c]=b.useState(""),[m,d]=b.useState(()=>JSON.parse(localStorage.getItem("sma-quick-notes")||"[]")),[l,u]=b.useState(""),y=["7","8","9","/","4","5","6","*","1","2","3","-","0",".","%","+"],k=S=>a(I=>`${I}${S}`),$=()=>{try{const S=tr(e);t(Number.isFinite(S)?String(S):"0"),u("")}catch{t("Error"),u("Calculation correct illa. Numbers and symbols mattum use pannunga.")}},h=()=>{if(!n.trim())return;const S=[{id:`note_${Date.now()}`,text:n.trim(),date:new Date().toLocaleString()},...m];d(S),localStorage.setItem("sma-quick-notes",JSON.stringify(S)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),c(""),u("")},N=S=>{const I=m.filter(C=>C.id!==S);d(I),localStorage.setItem("sma-quick-notes",JSON.stringify(I)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}}))};return r`
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-5">
        <h3 className="text-2xl font-black">🧮</h3>
        ${l?r`<p className="mt-3 rounded bg-amber-500/10 p-2 text-xs font-bold text-amber-700">${l}</p>`:""}
        <input value=${e} onInput=${S=>a(S.target.value)} onKeyDown=${S=>{S.key==="Enter"&&$()}} placeholder="0" className="focus-ring mt-4 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-4 text-right text-2xl font-black" />
        <div className="mt-3 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.7)] p-4 text-right text-xl font-black">${o||"0"}</div>
        <div className="mt-4 grid grid-cols-4 gap-2">${y.map(S=>r`<button key=${S} onClick=${()=>k(S)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-4 font-black hover:bg-[hsl(var(--muted))]">${S}</button>`)}</div>
        <div className="mt-2 grid grid-cols-2 gap-2"><button onClick=${()=>{a(""),t("")}} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-3 font-black">C</button><button onClick=${$} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] p-3 font-black text-white">=</button></div>
      </div>
      <div className="card p-5">
        <h3 className="text-2xl font-black">📝</h3>
        <textarea value=${n} onInput=${S=>c(S.target.value)} placeholder="Notes" className="focus-ring mt-4 min-h-36 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-4"></textarea>
        <button onClick=${h} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${$t} size=${18} /> Save</button>
        <div className="mt-4 space-y-3">${m.length?m.map(S=>r`<div key=${S.id} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-3"><div className="flex items-start justify-between gap-3"><div><p className="whitespace-pre-wrap text-sm font-bold">${S.text}</p><p className="mt-2 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">${S.date}</p></div><button onClick=${()=>N(S.id)} className="text-[hsl(var(--destructive))]"><${ct} size=${16} /></button></div></div>`):r`<p className="rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.6)] p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">No notes</p>`}</div>
      </div>
    </div>`}function sr({title:e,message:a,action:o}){return r`
    <div className="card grid place-items-center p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${Ts} /></div>
      <h3 className="mt-4 text-lg font-black">${e}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">${a}</p>
      ${o?r`<div className="mt-5">${o}</div>`:""}
    </div>
  `}function rr(){const[e,a]=b.useState(""),o=X(l=>l.invoices),t=X(l=>l.customers),n=X(l=>l.settings),c=X(l=>l.deleteInvoice),m=o.filter(l=>`${l.number} ${t.find(u=>u.id===l.customerId)?.name||""} ${l.status} ${l.paymentMode||""}`.toLowerCase().includes(e.toLowerCase())),d=l=>{confirm(`${l.number} invoice delete pannalama?`)&&c(l.id)};return r`
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><${Ls} size=${17} className="pointer-events-none absolute left-4 top-3.5 text-[hsl(var(--muted-foreground))]" /><input value=${e} onInput=${l=>a(l.target.value)} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 pl-11 pr-4" placeholder="Search bills, customers, status or payment mode" /></div>
        <${Ee} to="/invoices/new" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white"><${Ze} size=${18} /> New Invoice</${Ee}>
      </div>
      ${m.length===0?r`<${sr} title="No invoices found" message="Create a bill or adjust your search to locate an existing invoice." action=${r`<${Ee} to="/invoices/new" className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">Create invoice</${Ee}>`} />`:r`
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-[hsl(var(--muted))] text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Invoice</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Payment Mode</th><th className="p-4">Status</th><th className="p-4 text-right">Amount</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody>
                ${m.map(l=>{const u=t.find(y=>y.id===l.customerId);return r`<tr key=${l.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.45)]"><td className="p-4 font-black"><${Ee} to=${`/invoices/${l.id}`} className="text-[hsl(var(--primary))]">${l.number}</${Ee}></td><td className="p-4">${u?.name||"Walk-in Customer"}</td><td className="p-4">${l.date}</td><td className="p-4"><span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-black">${l.paymentMode||"Cash"}</span></td><td className="p-4"><span className="rounded-full bg-[hsl(var(--primary)/0.12)] px-3 py-1 text-xs font-black text-[hsl(var(--primary))]">${Le(l).balance<=0?"Paid":l.status}</span></td><td className="p-4 text-right font-black">${P(Le(l).total,n.currency)}</td><td className="p-4"><div className="flex flex-wrap justify-end gap-2"><${Ee} to=${`/invoices/${l.id}`} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] px-3 py-2 text-xs font-black hover:bg-[hsl(var(--muted))]" title="View invoice"><${os} size=${14} /> View</${Ee}><${Ee} to=${`/invoices/${l.id}/edit`} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white hover:opacity-90" title="Edit invoice"><${ea} size=${14} /> Edit</${Ee}><button onClick=${()=>d(l)} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[hsl(var(--destructive)/0.35)] px-3 py-2 text-xs font-black text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.10)]" title="Delete invoice"><${ct} size=${14} /> Delete</button></div></td></tr>`})}
              </tbody>
            </table>
          </div>
        </div>`}
    </div>
  `}const Wa=["Cash","UPI","GPay","PhonePe","Paytm","Card","Bank Transfer","NEFT / RTGS","Cheque","Credit","Other"];function Ua(){const e=Qa(),o=Ka().id||"",t=X(g=>g.customers),n=X(g=>g.items),c=X(g=>g.invoices),m=X(g=>g.settings),d=X(g=>g.addInvoice),l=X(g=>g.updateInvoice),u=X(g=>g.nextInvoiceNumber),y=o?c.find(g=>g.id===o):null,k=()=>({number:u(),date:Ke(),dueDate:Ke(),customerId:t[0]?.id||"",status:"Unpaid",paymentMode:"Cash",customPaymentMode:"",notes:"",discount:"",discountType:"amount",taxMode:"GST",cgstRate:Number(m.defaultCgstRate??9),sgstRate:Number(m.defaultSgstRate??9),paid:"",items:[]}),$=g=>Wa.includes(g.paymentMode||"")?{paymentMode:g.paymentMode||"Cash",customPaymentMode:g.customPaymentMode||""}:{paymentMode:"Other",customPaymentMode:g.paymentMode||g.customPaymentMode||""},[h,N]=b.useState(()=>y?{...k(),...y,...$(y),taxMode:y.taxMode==="CUSTOM"?"GST":y.taxMode||"GST",cgstRate:Number(y.cgstRate??m.defaultCgstRate??9),sgstRate:Number(y.sgstRate??m.defaultSgstRate??9),items:y.items||[]}:k()),[S,I]=b.useState(""),C=n.filter(g=>!g.partyId||g.partyId===h.customerId),w=Le(h);Ca(h);const J=Number(h.cgstRate||0)+Number(h.sgstRate||0),x=h.paymentMode==="Other"?h.customPaymentMode||"Other":h.paymentMode||"Cash",j=g=>g===""?"":Number(g),W=g=>Number(g||0)===0?"":g;if(b.useEffect(()=>{if(!o)return;const g=c.find(U=>U.id===o);g&&N({...k(),...g,...$(g),taxMode:g.taxMode==="CUSTOM"?"GST":g.taxMode||"GST",cgstRate:Number(g.cgstRate??m.defaultCgstRate??9),sgstRate:Number(g.sgstRate??m.defaultSgstRate??9),items:g.items||[]})},[o]),o&&!y)return r`<div className="card p-8"><p className="font-black">Invoice not found for edit.</p><${Ee} to="/invoices" className="mt-4 inline-flex items-center gap-2 text-[hsl(var(--primary))]"><${ua} size=${16} /> Back to invoices</${Ee}></div>`;const L=()=>{const g=C[0]||n[0];N(U=>({...U,items:[...U.items,g?{itemId:g.id,name:g.name,qty:1,price:g.salePrice,taxRate:g.taxRate,hsn:g.hsn,discount:"",discountType:"amount"}:{itemId:"",name:"",qty:"",price:"",taxRate:"",hsn:"",discount:"",discountType:"amount"}]}))},H=(g,U)=>N(p=>({...p,items:p.items.map((K,G)=>G===g?{...K,...U}:K)})),A=(g,U)=>{const p=n.find(K=>K.id===U);I(""),p?H(g,{itemId:p.id,name:p.name,price:p.salePrice,taxRate:p.taxRate,hsn:p.hsn}):H(g,{itemId:""})},re=(g,U)=>{const p=C.find(K=>String(K.name||"").trim().toLowerCase()===String(U||"").trim().toLowerCase());I(U.trim()&&!p?"Product not found in products list.":""),H(g,p?{itemId:p.id,name:p.name,price:p.salePrice,taxRate:p.taxRate,hsn:p.hsn}:{name:U,itemId:""})},ee=g=>N(U=>({...U,items:U.items.filter((p,K)=>K!==g)})),ae=()=>{if(h.items.length===0){L();return}if(h.items.some(G=>!String(G.name||"").trim()))return alert("Please select a product or type item name.");if(h.paymentMode==="Other"&&!String(h.customPaymentMode||"").trim())return alert("Please enter custom payment mode.");const g=h.paymentMode==="Other"?String(h.customPaymentMode||"").trim():h.paymentMode||"Cash",U=g==="Credit"?Number(h.paid||0)>=w.total?"Paid":Number(h.paid||0)>0?"Partial":h.status:"Paid",p=g==="Credit"?Number(h.paid||0):w.total,K={...h,paid:p,paymentMode:g,customPaymentMode:h.paymentMode==="Other"?g:"",taxMode:h.taxMode==="CUSTOM"?"GST":h.taxMode,status:U};o?l(o,K):d(K),e("/invoices")};return r`
    <div className="space-y-5">
      ${o?r`<div className="flex flex-wrap items-center justify-between gap-3"><${Ee} to=${`/invoices/${o}`} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-bold"><${ua} size=${17} /> Back</${Ee}><p className="rounded-full bg-[hsl(var(--primary)/0.12)] px-4 py-2 text-sm font-black text-[hsl(var(--primary))]">Editing: ${h.number}</p></div>`:""}
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-6">
          <label className="text-sm font-bold">Invoice No<input value=${h.number} onInput=${g=>N({...h,number:g.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
          <label className="text-sm font-bold">Customer<select value=${h.customerId} onChange=${g=>N({...h,customerId:g.target.value,items:[]})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">${t.map(g=>r`<option key=${g.id} value=${g.id}>${g.name}</option>`)}</select></label>
          <label className="text-sm font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Payment Mode<select value=${h.paymentMode||"Cash"} onChange=${g=>N({...h,paymentMode:g.target.value,status:g.target.value==="Credit"?h.status:"Paid"})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--primary))] bg-[hsl(var(--card))] p-3 text-base font-normal normal-case tracking-normal text-[hsl(var(--foreground))] shadow-[0_0_0_2px_hsl(var(--primary)/0.10)]">${Wa.map(g=>r`<option key=${g} value=${g}>${g}</option>`)}</select></label>
          <label className="text-sm font-bold">Tax Type<select value=${h.taxMode==="CUSTOM"?"GST":h.taxMode} onChange=${g=>N({...h,taxMode:g.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"><option value="GST">GST</option><option value="IGST">IGST</option></select></label>
          <label className="text-sm font-bold">Bill Date<input type="date" value=${h.date} onInput=${g=>N({...h,date:g.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
          <label className="text-sm font-bold">Due Date<input type="date" value=${h.dueDate} onInput=${g=>N({...h,dueDate:g.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
        </div>
        ${h.paymentMode==="Other"?r`<label className="mt-4 block text-sm font-bold">Custom Payment Mode<input value=${h.customPaymentMode||""} onInput=${g=>N({...h,customPaymentMode:g.target.value})} placeholder="Example: Amazon Pay / Finance / Split Payment" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--primary))] bg-transparent p-3" /></label>`:""}
        ${h.taxMode==="GST"||h.taxMode==="CUSTOM"?r`<div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">CGST %<input type="number" value=${h.cgstRate} onInput=${g=>N({...h,cgstRate:j(g.target.value)})} placeholder="CGST %" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label><label className="text-sm font-bold">SGST %<input type="number" value=${h.sgstRate} onInput=${g=>N({...h,sgstRate:j(g.target.value)})} placeholder="SGST %" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label></div>`:""}
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-4"><div><h3 className="font-black">Items</h3>${S?r`<p className="mt-1 text-xs font-bold text-red-600">${S}</p>`:""}</div><button onClick=${L} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-3 py-2 text-sm font-black text-white"><${Ze} size=${16} /> Add Item</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-3">Product Dropdown</th><th className="p-3">Product Name</th><th className="p-3">HSN</th><th className="p-3">Qty</th><th className="p-3">Rate</th><th className="p-3">Tax</th><th className="p-3">Discount</th><th className="p-3 text-right">Amount</th><th className="p-3"></th></tr></thead><tbody>
          ${h.items.map((g,U)=>r`<tr key=${`${g.itemId||"custom"}-${U}`} className="border-t border-[hsl(var(--border))]"><td className="p-3"><select value=${g.itemId||""} onChange=${p=>A(U,p.target.value)} className="w-44 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2"><option value="">${String(g.name||"").trim()||"Select Product"}</option>${C.map(p=>r`<option key=${p.id} value=${p.id}>${p.name}</option>`)}</select></td><td className="p-3"><input value=${g.name||""} onInput=${p=>re(U,p.target.value)} placeholder="Product name" className="w-56 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /></td><td className="p-3"><input value=${g.hsn||""} onInput=${p=>H(U,{hsn:p.target.value})} placeholder="HSN" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /></td><td className="p-3"><input type="number" value=${W(g.qty)} onInput=${p=>H(U,{qty:j(p.target.value)})} placeholder="Qty" className="w-20 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /></td><td className="p-3"><input type="number" value=${W(g.price)} onInput=${p=>H(U,{price:j(p.target.value)})} placeholder="Rate" className="w-28 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /></td><td className="p-3 font-bold">${h.taxMode==="IGST"?`${mt(h,g)}%`:`${J}%`} (${P(cs(h,g),m.currency)})</td><td className="p-3"><div className="flex items-center gap-2"><select value=${g.discountType||"amount"} onChange=${p=>H(U,{discountType:p.target.value})} className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2"><option value="amount">₹</option><option value="percent">%</option></select><input type="number" value=${W(g.discount)} onInput=${p=>H(U,{discount:j(p.target.value)})} placeholder="Disc" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2 text-right" /></div></td><td className="p-3 text-right font-black">${P(Bs(h,g),m.currency)}</td><td className="p-3 text-right"><button onClick=${()=>ee(U)} className="text-[hsl(var(--destructive))]"><${ct} size=${16} /></button></td></tr>`)}
        </tbody></table></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2"><div className="card p-5"><label className="text-sm font-bold">Invoice Notes<textarea value=${h.notes} onInput=${g=>N({...h,notes:g.target.value})} className="focus-ring mt-2 min-h-32 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" placeholder="Payment terms, transport details or delivery instructions"></textarea></label></div><div className="card space-y-3 p-5"><div className="flex justify-between"><span>Subtotal</span><b>${P(w.subtotal,m.currency)}</b></div><div className="flex justify-between"><span>Discount</span><b>${P(w.discount,m.currency)}</b></div><div className="flex justify-between"><span>Taxable Value</span><b>${P(w.taxable,m.currency)}</b></div><div className="flex justify-between"><span>Tax</span><b>${h.taxMode==="IGST"?mt(h,h.items[0]||{}):J}%</b></div><div className="flex justify-between rounded-[var(--radius-sm)] bg-[hsl(var(--muted)/0.55)] px-3 py-2 text-sm"><span>Payment Mode</span><b>${x}</b></div><label className="flex items-center justify-between gap-4">Paid<input type="number" value=${h.paymentMode==="Credit"?W(h.paid):w.total} disabled=${h.paymentMode!=="Credit"} onInput=${g=>N({...h,paid:j(g.target.value)})} placeholder="Paid amount" className="w-32 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2 text-right disabled:opacity-60" /></label><div className="border-t border-[hsl(var(--border))] pt-3"><div className="flex justify-between text-xl font-black"><span>Total</span><span>${P(w.total,m.currency)}</span></div></div><button onClick=${ae} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--secondary))] px-5 py-3 font-black text-[hsl(var(--secondary-foreground))]"><${$t} size=${18} /> ${o?"Update Invoice":"Save Invoice"}</button></div></div>
    </div>`}const Mt=async({doc:e,fileName:a,title:o,phone:t=""})=>{try{const c=`whatsapp://send?phone=${String(t||"").replace(/[^0-9]/g,"")||""}`,m=e.output("blob"),d=new File([m],a,{type:"application/pdf"});if(window.desktopApp&&window.desktopApp.isElectron&&window.desktopApp.shareFile){const l=new FileReader,u=new Promise(($,h)=>{l.onloadend=()=>{const N=l.result.split(",")[1];$(N)},l.onerror=h});l.readAsDataURL(m);const y=await u,k=await window.desktopApp.shareFile({base64:y,fileName:a});return window.location.href=c,k&&k.ok?"PDF generated successfully and WhatsApp opened!":"WhatsApp opened!"}if(navigator.share&&navigator.canShare&&navigator.canShare({files:[d]}))try{return await navigator.share({files:[d],title:o||"Document",text:`Please find attached ${o||"Document"}`}),"PDF shared successfully!"}catch(l){if(l.name==="AbortError")return"Share cancelled"}return window.location.href=c,"WhatsApp opened!"}catch(n){throw console.error("WhatsApp share error:",n),n}},bs=e=>String(e??"-").split("\f").join("").split("\v").join("").split(`
`).join(" ").split("\r").join(" ").split("₹").join("Rs.");function ta(e,a={},o=""){const t=e.internal.pageSize.getWidth(),n=34,c=t-n*2,m=bs,d=t/2;e.setTextColor(17,24,39),e.setDrawColor(17,24,39),e.setFillColor(255,255,255),e.rect(n,24,c,100,"S");let l=38;try{a.logo?(e.addImage(a.logo,void 0,(t-44)/2,l,44,44),l+=52):l+=6}catch{l+=6}e.setFont("helvetica","bold"),e.setFontSize(16),e.text(m(a.businessName||"SHREE MAHESHWARA AGENCIES").toUpperCase(),d,l,{align:"center",maxWidth:c-20}),l+=18,e.setFont("helvetica","bold"),e.setFontSize(9),e.text(m(a.address||"Company Address"),d,l,{align:"center",maxWidth:c-20}),l+=13,e.text(m(`Phone: ${a.phone||"9489544470"} | Email: ${a.email||"-"} | GSTIN: ${a.gstin||"-"}`),d,l,{align:"center",maxWidth:c-20}),o&&(e.setFont("helvetica","bold"),e.setFontSize(12),e.text(m(o),d,142,{align:"center"}))}function pt({settings:e,title:a="",dateTime:o=""}){const t={textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%"},n={textAlign:"center",width:"100%",margin:"0 auto"};return r`
    <header className="sma-doc-head border-b-2 border-slate-900 pb-5 mb-5 flex flex-col items-center justify-center gap-2 text-center" style=${t}>
      ${e.logo?r`
        <div className="sma-logo-box w-24 h-24 mb-2 flex items-center justify-center" style=${{margin:"0 auto"}}>
          <img src=${e.logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      `:""}
      <div className="sma-business-block w-full text-center" style=${n}>
        <h1 className="text-3xl font-black tracking-tight uppercase" style=${{...n,display:"block"}}>
          ${e.businessName||"SHREE MAHESHWARA AGENCIES"}
        </h1>
        <p className="text-sm mt-1 leading-relaxed font-bold" style=${{...n,display:"block"}}>
          ${e.address||"Company Address"}
        </p>
        <p className="text-sm leading-relaxed font-bold" style=${{...n,display:"block"}}>
          Phone: ${e.phone||"9489544470"} | Email: ${e.email||"-"} | GSTIN: ${e.gstin||"-"}
        </p>
      </div>
      ${a?r`
        <div className="mt-3 text-center" style=${n}>
          <div className="inline-block border-2 border-slate-900 px-6 py-1 text-sm font-black uppercase tracking-widest bg-slate-50" style=${{margin:"0 auto"}}>
            ${a}
          </div>
          ${o?r`<p className="text-[10px] mt-1 font-bold text-slate-500" style=${n}>${o}</p>`:""}
        </div>
      `:""}
    </header>
  `}function or(){const e=Ka(),a=X(i=>i.invoices),o=X(i=>i.customers),t=X(i=>i.settings),[n,c]=b.useState(()=>t.invoiceTemplateChoice||localStorage.getItem("sma-invoice-template-choice")||"sma"),[m,d]=b.useState(()=>localStorage.getItem("sma-custom-invoice-template")||""),[l,u]=b.useState(""),[y,k]=b.useState(""),[$,h]=b.useState({type:"",text:""}),[N,S]=b.useState(!1),I=b.useRef(null),C=a.find(i=>i.id===e.id);if(b.useEffect(()=>{t.invoiceTemplateChoice&&c(t.invoiceTemplateChoice)},[t.invoiceTemplateChoice]),b.useEffect(()=>{const i=()=>{d(localStorage.getItem("sma-custom-invoice-template")||"")};return window.addEventListener("storage",i),()=>window.removeEventListener("storage",i)},[]),!C)return r`<div className="card p-8"><p className="font-black">Invoice not found.</p><${Ee} to="/invoices" className="mt-4 inline-flex text-[hsl(var(--primary))]">Back to invoices</${Ee}></div>`;const w={...C,paymentMode:C.paymentMode||"Cash",taxMode:C.taxMode==="CUSTOM"?"GST":C.taxMode||"GST",cgstRate:Number(C.cgstRate??t.defaultCgstRate??9),sgstRate:Number(C.sgstRate??t.defaultSgstRate??9)},J=o.find(i=>i.id===w.customerId),x=Le(w);Ca(w);const j=w.taxMode==="IGST"?w.items[0]?.taxRate||Number(w.cgstRate||0)+Number(w.sgstRate||0)||18:Number(w.cgstRate||0)+Number(w.sgstRate||0),W=`${j}%`,L=n==="modern"?{head:"border-b-4 border-indigo-600 bg-indigo-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-indigo-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:n==="compact"?{head:"border-b pb-3",table:"bg-slate-100 text-slate-900 border-y",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-5 text-slate-900 shadow-[var(--shadow-md)] sm:p-7"}:n==="gst"?{head:"border-2 border-slate-900 p-4",table:"bg-emerald-700 text-white",article:"print-area mx-auto max-w-4xl rounded-none border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-8"}:n==="letterhead"?{head:"border-b-8 border-purple-600 bg-purple-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-purple-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:n==="professional"?{head:"border-b-4 border-teal-600 bg-teal-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-teal-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-teal-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:n==="elegant"?{head:"border-b-4 border-rose-500 bg-rose-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-rose-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-rose-950 bg-white p-6 text-rose-950 shadow-[var(--shadow-md)] sm:p-10"}:n==="minimalist"?{head:"border-b border-slate-300 pb-4",table:"bg-slate-100 text-slate-800 border-y",article:"print-area mx-auto max-w-4xl rounded-none border border-slate-200 bg-white p-6 text-slate-800 shadow-none sm:p-8"}:{head:"border-b-2 border-slate-900 pb-5",table:"bg-slate-900 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"},H=i=>String(i??"").replace(/[&<>"]/g,f=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[f]),A=i=>Number(i.qty||0)*Number(i.price||0),re=i=>{const f=A(i),D=i?.discountType==="percent"?f*Number(i?.discount||0)/100:Number(i?.discount||0);return Math.min(Math.max(0,D),Math.max(0,f))},ee=i=>Math.max(0,A(i)-re(i))*mt(w,i)/100,ae=i=>Math.max(0,A(i)-re(i))+ee(i),g=i=>`${mt(w,i)}% (${P(cs(w,i),t.currency)})`,U=i=>re(i)?P(re(i),t.currency):P(0,t.currency),p=w.items.map((i,f)=>`<tr><td>${f+1}</td><td>${H(i.name)}</td><td>${H(i.hsn||"-")}</td><td style="text-align:right">${H(i.qty)}</td><td style="text-align:right">${H(P(i.price,t.currency))}</td><td style="text-align:right">${H(g(i))}</td><td style="text-align:right">${H(U(i))}</td><td style="text-align:right">${H(P(ae(i),t.currency))}</td></tr>`).join(""),K=w.taxMode==="IGST"?`<p><span>IGST</span><b>${j}%</b></p>`:`<p><span>CGST</span><b>${w.cgstRate}%</b></p><p><span>SGST</span><b>${w.sgstRate}%</b></p>`,G=()=>{const f=m||'<div style="font-family:Arial;padding:24px"><h1>{{businessName}}</h1><h2>Tax Invoice - {{invoiceNumber}}</h2><p>{{businessAddress}}</p><hr/><p><b>Customer:</b> {{customerName}}<br/><b>Date:</b> {{invoiceDate}}<br/><b>Payment:</b> {{paymentMode}}</p><table style="width:100%;border-collapse:collapse" border="1"><thead><tr><th>#</th><th>Product</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Discount</th><th>Amount</th></tr></thead><tbody>{{itemRows}}</tbody></table><div style="width:320px;margin-left:auto"><p><span>Subtotal</span><b style="float:right">{{subtotal}}</b></p>{{taxSummaryHtml}}<h3 style="text-align:right;border-top:2px solid #111;padding-top:8px">Total: {{total}}</h3><p>Paid <b style="float:right">{{paid}}</b></p><p>Balance <b style="float:right">{{balance}}</b></p></div></div>',D={businessName:t.businessName,businessTagline:"",businessAddress:t.address||"Company Address",businessPhone:t.phone||"-",businessEmail:t.email||"-",businessGstin:t.gstin||"-",logo:t.logo||"",invoiceNumber:w.number,invoiceDate:w.date,dueDate:w.dueDate,status:w.status,paymentMode:w.paymentMode||"Cash",taxLabel:W,customerName:J?.name||"Walk-in Customer",customerAddress:J?.address||"Counter sale",customerPhone:J?.phone||"-",customerGstin:J?.gstin||"-",subtotal:P(x.subtotal,t.currency),cgst:`${w.cgstRate}%`,sgst:`${w.sgstRate}%`,taxSummaryHtml:K,tax:`${j}%`,discount:P(x.discount,t.currency),total:P(x.total,t.currency),paid:P(x.paid,t.currency),balance:P(x.balance,t.currency),notes:w.notes||"Thank you for your business.",itemRows:p};return f.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(R,B)=>D[B]??"")},q=w.taxMode==="IGST"?[["","IGST",`${j}%`]]:[["","CGST",`${w.cgstRate}%`],["","SGST",`${w.sgstRate}%`]],se=()=>{const i=new Nt({unit:"pt",format:"a4",orientation:"portrait"}),f=i.internal.pageSize.getWidth(),D=i.internal.pageSize.getHeight(),R=34,B=bs,Pe=132,ke=f-R*2,Ie=()=>ta(i,t,"TAX INVOICE");Ie(),dt(i,{startY:Pe+10,theme:"grid",margin:{left:R,right:R,top:Pe+10,bottom:34},styles:{font:"helvetica",fontSize:8.7,cellPadding:5,overflow:"linebreak",valign:"middle",lineColor:[17,24,39],lineWidth:.4,textColor:[17,24,39],minCellHeight:22},headStyles:{fillColor:[241,245,249],textColor:[17,24,39],fontStyle:"bold",halign:"center"},columnStyles:{0:{cellWidth:ke/2},1:{cellWidth:ke/2}},body:[[{content:`CUSTOMER DETAILS
${B(J?.name||"Walk-in Customer")}
${B(J?.address||"Counter sale")}
Phone: ${B(J?.phone||"-")}
GSTIN: ${B(J?.gstin||"-")}`},{content:`INVOICE DETAILS
Invoice No: ${B(w.number)}
Date: ${B(w.date||"-")}
Due Date: ${B(w.dueDate||"-")}
Payment: ${B(w.paymentMode||"Cash")}
Status: ${B(w.status||"-")}`}]],didDrawPage:Ce=>{Ce.pageNumber>1&&Ie()}}),dt(i,{startY:i.lastAutoTable.finalY+14,showHead:"everyPage",margin:{left:R,right:R,top:Pe+10,bottom:38},theme:"grid",head:[["#","Product / Details","HSN","Qty","Rate","Tax","Discount","Amount"]],body:w.items.map((Ce,bt)=>[bt+1,B(Ce.name||"Item"),B(Ce.hsn||"-"),B(Ce.qty||"-"),B(P(Ce.price,t.currency)),B(g(Ce)),B(U(Ce)),B(P(ae(Ce),t.currency))]),styles:{font:"helvetica",fontSize:7.8,cellPadding:{top:5,right:3,bottom:5,left:3},overflow:"linebreak",valign:"middle",lineColor:[17,24,39],lineWidth:.35,textColor:[17,24,39],minCellHeight:22},headStyles:{fillColor:[17,24,39],textColor:255,fontStyle:"bold",halign:"center",fontSize:7.8,minCellHeight:24},columnStyles:{0:{cellWidth:24,halign:"center"},1:{cellWidth:138},2:{cellWidth:42,halign:"center"},3:{cellWidth:34,halign:"right"},4:{cellWidth:62,halign:"right"},5:{cellWidth:86,halign:"right"},6:{cellWidth:60,halign:"right"},7:{cellWidth:ke-446,halign:"right"}},didDrawPage:Ce=>{Ce.pageNumber>1&&Ie()}});let Oe=i.lastAutoTable.finalY+16;Oe>D-200&&(i.addPage(),Ie(),Oe=Pe+12);const ut=[[`Notes
${B(w.notes||"Thank you for your business.")}`,"Subtotal",B(P(x.subtotal,t.currency))],...q,["","Total",B(P(x.total,t.currency))],["","Paid",B(P(x.paid,t.currency))],["","Balance",B(P(x.balance,t.currency))]];dt(i,{startY:Oe,theme:"grid",margin:{left:R,right:R,top:Pe+10,bottom:38},styles:{font:"helvetica",fontSize:8.8,cellPadding:5,overflow:"linebreak",lineColor:[17,24,39],lineWidth:.3,textColor:[17,24,39],minCellHeight:20},columnStyles:{0:{cellWidth:ke-240},1:{cellWidth:110,fontStyle:"bold"},2:{cellWidth:130,halign:"right",fontStyle:"bold"}},body:ut,didParseCell:Ce=>{Ce.column.index>0&&Ce.row.raw?.[1]==="Total"&&(Ce.cell.styles.fontStyle="bold",Ce.cell.styles.fontSize=11,Ce.cell.styles.fillColor=[241,245,249])},didDrawPage:Ce=>{Ce.pageNumber>1&&Ie()}}),Oe=i.lastAutoTable.finalY+55,Oe>D-40&&(i.addPage(),Ie(),Oe=Pe+70),i.setFont("helvetica","bold"),i.setFontSize(10),i.line(f-R-150,Oe-12,f-R,Oe-12),i.text("Authorized Signature",f-R,Oe,{align:"right"});const ft=i.internal.getNumberOfPages();for(let Ce=1;Ce<=ft;Ce++)i.setPage(Ce),i.setFont("helvetica","normal"),i.setFontSize(8),i.setTextColor(90),i.text(`Page ${Ce} of ${ft}`,f/2,D-14,{align:"center"}),i.setDrawColor(17,24,39),i.setLineWidth(1.5),i.rect(15,15,f-30,D-30,"S");return i.setTextColor(20),i},pe=async()=>{k("whatsapp"),h({type:"",text:""});try{const i=se();await Mt({doc:i,fileName:`${w.number}.pdf`,title:`${w.number} Invoice PDF`,phone:J?.phone}),h({type:"",text:""})}catch(i){h({type:"error",text:"PDF WhatsApp share failed: "+(i.message||"Please try again.")})}finally{k("")}},$e=()=>{window.print()};b.useEffect(()=>{if(N){const i=document.createElement("style");return i.id="invoice-print-preview-style",i.textContent=`
        @media print {
          @page { size: A4; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: 2px solid #111827 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
        }
      `,document.head.appendChild(i),()=>{i.remove()}}},[N]);const de=i=>{c(i),localStorage.setItem("sma-invoice-template-choice",i)},ue=i=>{const f=i.target.files?.[0];if(!f)return;const D=new FileReader;D.onload=R=>{const B=String(R.target.result||"");localStorage.setItem("sma-custom-invoice-template",B),d(B),de("custom"),u(""),i.target.value=""},D.onerror=()=>{u("Template file read panna mudiyala. HTML/TXT file select pannunga."),i.target.value=""},D.readAsText(f)},_e=i=>P(ae(i),t.currency),je=w.taxMode==="IGST"?r`<p className="flex justify-between"><span>IGST</span><b>${j}%</b></p>`:r`<p className="flex justify-between"><span>CGST</span><b>${w.cgstRate}%</b></p><p className="flex justify-between"><span>SGST</span><b>${w.sgstRate}%</b></p>`,s=(i=!1)=>r`
    <article className=${i?"print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]":L.article}>
      <div className=${i?"":L.head}>
        <${pt} settings=${t} />
      </div>
      
      ${i?r`<div className="sma-title-row"><span>TAX INVOICE</span></div>`:r`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Tax Invoice</p></div>`}
      
      <section className=${i?"sma-info-grid":"grid grid-cols-2 gap-4 border-b py-5 text-sm"}>
        <div>
          <p className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-1">Customer Details</p>
          <h3 className="text-lg font-black">${J?.name||"Walk-in Customer"}</h3>
          <p className="leading-6">${J?.address||"Counter sale"}<br/>Phone: ${J?.phone||"-"}<br/>GSTIN: ${J?.gstin||"-"}</p>
        </div>
        <div className=${i?"":"text-right"}>
          <p><b>Invoice No:</b> ${w.number}</p>
          <p><b>Date:</b> ${w.date}</p>
          <p><b>Due Date:</b> ${w.dueDate}</p>
          <p><b>Status:</b> ${w.status}</p>
          <p><b>Payment Mode:</b> ${w.paymentMode||"Cash"}</p>
          <p><b>Tax:</b> ${W}</p>
        </div>
      </section>
      
      <table className=${i?"sma-items-table":"mt-5 w-full text-sm"}>
        <thead className=${i?"":L.table}>
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">HSN</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Rate</th>
            <th className="p-2 text-right">Tax</th>
            <th className="p-2 text-right">Discount</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${w.items.map((f,D)=>r`<tr key=${`${f.name}-${D}`} className="border-b"><td className="p-2">${D+1}</td><td className="p-2 font-bold">${f.name}</td><td className="p-2">${f.hsn||"-"}</td><td className="p-2 text-right">${f.qty}</td><td className="p-2 text-right">${P(f.price,t.currency)}</td><td className="p-2 text-right">${g(f)}</td><td className="p-2 text-right">${U(f)}</td><td className="p-2 text-right font-bold">${_e(f)}</td></tr>`)}
        </tbody>
      </table>
      
      <section className=${i?"sma-bottom-grid":"ml-auto mt-6 max-w-sm space-y-2 text-sm"}>
        <div>
          <h3 className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-2">Notes</h3>
          <p className="text-sm italic">${w.notes||"Thank you for your business."}</p>
        </div>
        <div className=${i?"sma-total-box":""}>
          <p className="flex justify-between"><span>Subtotal</span><b>${P(x.subtotal,t.currency)}</b></p>
          ${je}
          <p className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${P(x.total,t.currency)}</span></p>
          <p className="flex justify-between"><span>Paid</span><b>${P(x.paid,t.currency)}</b></p>
          <p className="flex justify-between"><span>Balance</span><b>${P(x.balance,t.currency)}</b></p>
        </div>
      </section>
      
      <footer className="sma-sign-row mt-12 pt-8 flex justify-between">
        <div className="text-center w-48 border-t border-slate-300 pt-2 text-[10px] uppercase font-bold text-slate-400">Customer Signature</div>
        <div className="text-center w-48 border-t border-slate-900 pt-2 text-[10px] uppercase font-bold">Authorized Signature</div>
      </footer>
    </article>
  `;return r`
    <div className="space-y-4">
      <div className="no-print flex flex-wrap justify-between gap-3">
        <${Ee} to="/invoices" className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-bold">
          <${ua} size=${17} /> Back
        </${Ee}>
        <div className="flex flex-wrap gap-2">
          <select value=${n} onChange=${i=>de(i.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 font-black" aria-label="Invoice template">
            <option value="sma">SMA Print Format</option>
            <option value="classic">Classic Template</option>
            <option value="modern">Modern Template</option>
            <option value="compact">Compact Template</option>
            <option value="gst">GST Box Template</option>
            <option value="letterhead">Letterhead Template</option>
            <option value="professional">Professional Teal Template</option>
            <option value="elegant">Elegant Coral Template</option>
            <option value="minimalist">Minimalist Steel Template</option>
            ${m?r`<option value="custom">My Local Template</option>`:""}
          </select>
          <button onClick=${()=>S(!0)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white">
            <${rt} size=${17} /> WhatsApp PDF
          </button>
          <button onClick=${()=>I.current?.click()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black">
            <${wt} size=${17} /> Add Template
          </button>
          <input ref=${I} type="file" accept=".html,.htm,.txt,text/html,text/plain" onChange=${ue} className="hidden" />
          <button onClick=${()=>S(!0)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
            <${et} size=${17} /> Print Invoice
          </button>
        </div>
      </div>
      
      ${$.text?r`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${$.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}`}>${$.text}</div>`:""}
      ${l?r`<div className="no-print rounded-[var(--radius-md)] bg-emerald-500/10 p-3 text-sm font-bold text-emerald-700">${l}</div>`:""}
      
      ${n==="custom"?r`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{__html:G()}}></article>`:s(n==="sma")}

      ${N&&r`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Invoice #${w.number}</span>
            <div className="flex gap-2">
              <button disabled=${!!y} onClick=${pe} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
                <${rt} size=${17} /> ${y==="whatsapp"?"Sharing...":"WhatsApp Share"}
              </button>
              <button onClick=${$e} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
                <${et} size=${17} /> Print
              </button>
              <button onClick=${()=>S(!1)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
                <${Xe} size=${17} /> Close
              </button>
            </div>
          </div>
          ${$.text?r`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${$.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}">${$.text}</div>`:""}
          <div className="w-full max-w-4xl">
            ${n==="custom"?r`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{__html:G()}}></article>`:s(n==="sma")}
          </div>
        </div>
      `}
    </div>
  `}function nr(){const e=X(W=>W.settings),[a,o]=b.useState(()=>e.invoiceTemplateChoice||localStorage.getItem("sma-invoice-template-choice")||"sma"),[t,n]=b.useState(""),[c,m]=b.useState({type:"",text:""}),[d,l]=b.useState(!1),u=Number(e.defaultCgstRate??9),y=Number(e.defaultSgstRate??9),k=u+y,$=`QT-${new Date().getFullYear()}-0001`;b.useEffect(()=>{e.invoiceTemplateChoice&&o(e.invoiceTemplateChoice)},[e.invoiceTemplateChoice]);const h=()=>{const W=new Nt({unit:"pt",format:"a4"}),L=W.internal.pageSize.getWidth(),H=W.internal.pageSize.getHeight();return ta(W,e,`QUOTATION: ${$}`),W.setFont("helvetica","normal"),W.setFontSize(10),W.text(`Date: ${new Date().toISOString().slice(0,10)} | Tax: ${k}%`,40,145),W.text("Customer: Customer Name",40,165),W.text(`1. Product / Service | HSN - | Qty 1 | Rate ${P(0,e.currency)} | Tax ${k}%`,40,205,{maxWidth:515}),W.setFont("helvetica","bold"),W.setFontSize(13),W.text(`Grand Total: ${P(0,e.currency)}`,360,265),W.setDrawColor(17,24,39),W.setLineWidth(1.5),W.rect(15,15,L-30,H-30,"S"),W},N=async()=>{n("whatsapp"),m({type:"",text:""});try{await Mt({doc:h(),fileName:`${$}.pdf`,title:`${$} Quotation PDF`}),m({type:"",text:""})}catch(W){m({type:"error",text:"WhatsApp PDF share failed: "+(W.message||"Please allow file sharing permission.")})}finally{n("")}},S=a==="modern"?{head:"border-b-4 border-indigo-600 bg-indigo-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-indigo-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:a==="compact"?{head:"border-b pb-3",table:"bg-slate-100 text-slate-900 border-y",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-5 text-slate-900 shadow-[var(--shadow-md)] sm:p-7"}:a==="gst"?{head:"border-2 border-slate-900 p-4",table:"bg-emerald-700 text-white",article:"print-area mx-auto max-w-4xl rounded-none border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-8"}:a==="letterhead"?{head:"border-b-8 border-purple-600 bg-purple-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-purple-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:a==="professional"?{head:"border-b-4 border-teal-600 bg-teal-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-teal-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-teal-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:a==="elegant"?{head:"border-b-4 border-rose-500 bg-rose-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-rose-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-rose-950 bg-white p-6 text-rose-950 shadow-[var(--shadow-md)] sm:p-10"}:a==="minimalist"?{head:"border-b border-slate-300 pb-4",table:"bg-slate-100 text-slate-800 border-y",article:"print-area mx-auto max-w-4xl rounded-none border border-slate-200 bg-white p-6 text-slate-800 shadow-none sm:p-8"}:{head:"border-b-2 border-slate-900 pb-5",table:"bg-slate-900 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"},I=()=>{window.print()};b.useEffect(()=>{if(d){const W=document.createElement("style");return W.id="quotation-print-preview-style",W.textContent=`
        @media print {
          @page { size: A4; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: 2px solid #111827 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
        }
      `,document.head.appendChild(W),()=>{W.remove()}}},[d]);const C=W=>String(W??"").replace(/[&<>"]/g,L=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[L]),w=()=>{const W=localStorage.getItem("sma-custom-invoice-template")||"";if(!W)return"";const L=`<tr><td>1</td><td>${C("Product / Service")}</td><td>-</td><td style="text-align:right">1</td><td style="text-align:right">${C(P(0,e.currency))}</td><td style="text-align:right">${k}%</td><td style="text-align:right">-</td><td style="text-align:right">${C(P(0,e.currency))}</td></tr>`,H=`<p><span>CGST</span><b>${u}%</b></p><p><span>SGST</span><b>${y}%</b></p>`,A={businessName:e.businessName,businessTagline:"",businessAddress:e.address||"Company Address",businessPhone:e.phone||"-",businessEmail:e.email||"-",businessGstin:e.gstin||"-",logo:e.logo||"",invoiceNumber:$,invoiceDate:new Date().toISOString().slice(0,10),dueDate:"-",status:"Quotation",paymentMode:"-",taxLabel:`${k}%`,customerName:"Customer Name",customerAddress:"Address",customerPhone:"-",customerGstin:"-",subtotal:P(0,e.currency),cgst:`${u}%`,sgst:`${y}%`,taxSummaryHtml:H,tax:`${k}%`,discount:P(0,e.currency),total:P(0,e.currency),paid:P(0,e.currency),balance:P(0,e.currency),notes:"Thank you for your business.",itemRows:L};return W.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(re,ee)=>A[ee]??"")},J=()=>r`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Quotation</p></div>`,x=()=>r`<article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]"><div className="sma-doc-title">QUOTATION</div><${pt} settings=${e} /><section className="sma-info-grid"><div><h3>Quote To</h3><p className="sma-strong">Customer Name</p><p>Address</p><p>Phone: -</p><p>GSTIN: -</p></div><div><h3>Quotation Details</h3><p><b>Quotation No:</b> ${$}</p><p><b>Date:</b> ${new Date().toISOString().slice(0,10)}</p><p><b>Valid Until:</b> -</p><p><b>Tax:</b> ${k}%</p></div></section><table className="sma-items-table"><thead><tr><th>#</th><th className="text-left">Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Amount</th></tr></thead><tbody><tr><td>1</td><td className="text-left sma-strong">Product / Service</td><td>-</td><td>1</td><td>${P(0,e.currency)}</td><td>${k}%</td><td>${P(0,e.currency)}</td></tr></tbody></table><section className="sma-bottom-grid"><div><h3>Terms</h3><p>Thank you for your business.</p><p className="sma-tax-note">Prices are valid as per quotation validity.</p></div><div className="sma-total-box"><p><span>Subtotal</span><b>${P(0,e.currency)}</b></p><p><span>CGST</span><b>${u}%</b></p><p><span>SGST</span><b>${y}%</b></p><p className="sma-grand"><span>Grand Total</span><b>${P(0,e.currency)}</b></p></div></section><footer className="sma-sign-row"><div>Customer Signature</div><div>Authorized Signature</div></footer></article>`,j=()=>r`
    <article className=${S.article}>
      <div className=${S.head}>
        <${pt} settings=${e} />
      </div>
      ${J()}
      <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
        <div>
          <p className="font-black uppercase text-slate-500">Customer Details</p>
          <h3 className="mt-2 text-lg font-black">Customer Name</h3>
          <p className="leading-6">Address<br/>Phone: -<br/>GSTIN: -</p>
        </div>
        <div className="text-right">
          <p><b>Quotation No:</b> ${$}</p>
          <p><b>Date:</b> ${new Date().toISOString().slice(0,10)}</p>
          <p><b>Valid Until:</b> -</p>
          <p><b>Tax:</b> ${k}%</p>
        </div>
      </section>
      <table className="mt-5 w-full text-sm">
        <thead className=${S.table}>
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">HSN</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Rate</th>
            <th className="p-2 text-right">Tax</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">1</td>
            <td className="p-2 font-bold">Product / Service</td>
            <td className="p-2">-</td>
            <td className="p-2 text-right">1</td>
            <td className="p-2 text-right">${P(0,e.currency)}</td>
            <td className="p-2 text-right">${k}%</td>
            <td className="p-2 text-right font-bold">${P(0,e.currency)}</td>
          </tr>
        </tbody>
      </table>
      <section className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><b>${P(0,e.currency)}</b></div>
        <div className="flex justify-between"><span>CGST</span><b>${u}%</b></div>
        <div className="flex justify-between"><span>SGST</span><b>${y}%</b></div>
        <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${P(0,e.currency)}</span></div>
      </section>
    </article>
  `;return r`
    <div className="space-y-5">
      <div className="card p-6 no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black"><${Xt} /> Quotations</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value=${a} onChange=${W=>o(W.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-3 font-bold" aria-label="Quotation print template">
              <option value="sma">SMA Print Format</option>
              <option value="classic">Classic Template</option>
              <option value="modern">Modern Template</option>
              <option value="compact">Compact Template</option>
              <option value="gst">GST Box Template</option>
              <option value="letterhead">Letterhead Template</option>
              <option value="professional">Professional Teal Template</option>
              <option value="elegant">Elegant Coral Template</option>
              <option value="minimalist">Minimalist Steel Template</option>
              ${localStorage.getItem("sma-custom-invoice-template")?r`<option value="custom">My Local Template</option>`:""}
            </select>
            <button onClick=${()=>l(!0)} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-3 font-black text-white">
              <${rt} size=${18} /> WhatsApp PDF
            </button>
            <button onClick=${()=>l(!0)} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white">
              <${et} size=${18} /> Print
            </button>
            <${Ee} to="/invoices/new" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">
              <${Ze} size=${18} /> Create Quotation
            </${Ee}>
          </div>
        </div>
      </div>
      
      ${c.text?r`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${c.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}`}>${c.text}</div>`:""}
      
      ${a==="custom"?r`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{__html:w()}}></article>`:a==="sma"?x():j()}

      ${d&&r`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Quotation #${$}</span>
            <div className="flex gap-2">
              <button disabled=${!!t} onClick=${N} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
                <${rt} size=${17} /> ${t==="whatsapp"?"Sharing...":"WhatsApp Share"}
              </button>
              <button onClick=${I} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
                <${et} size=${17} /> Print
              </button>
              <button onClick=${()=>l(!1)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
                <${Xe} size=${17} /> Close
              </button>
            </div>
          </div>
          ${c.text?r`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${c.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}">${c.text}</div>`:""}
          <div className="w-full max-w-4xl">
            ${a==="custom"?r`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{__html:w()}}></article>`:a==="sma"?x():j()}
          </div>
        </div>
      `}
    </div>
  `}function ir(){const e=X(s=>s.settings),a=X(s=>s.customers),o=X(s=>s.items),[t,n]=b.useState(()=>e.invoiceTemplateChoice||localStorage.getItem("sma-invoice-template-choice")||"sma"),[c,m]=b.useState(""),[d,l]=b.useState({type:"",text:""}),[u,y]=b.useState(!1),[k,$]=b.useState(null),[h,N]=b.useState(!1);b.useEffect(()=>{e.invoiceTemplateChoice&&n(e.invoiceTemplateChoice)},[e.invoiceTemplateChoice]);const[S,I]=b.useState(()=>{try{const s=localStorage.getItem("sma-estimates-v1");if(s)return JSON.parse(s)}catch{}return[]}),[C,w]=b.useState({number:"",date:new Date().toISOString().slice(0,10),customerId:"",customerName:"",customerAddress:"",customerPhone:"",discount:"",discountType:"amount",items:[{itemId:"",name:"",hsn:"",qty:"",price:"",discount:"",discountType:"amount"}],notes:"Thank you for your business."}),J=s=>Number(s.qty||0)*Number(s.price||0),x=s=>{const i=J(s),f=s.discountType==="percent"?i*Number(s.discount||0)/100:Number(s.discount||0);return Math.min(Math.max(0,f),Math.max(0,i))},j=s=>Math.max(0,J(s)-x(s)),W=s=>(s.items||[]).reduce((i,f)=>i+J(f),0),L=s=>{const i=(s.items||[]).reduce((B,Pe)=>B+x(Pe),0),f=W(s),D=Math.max(0,f-i),R=s.discountType==="percent"?D*Number(s.discount||0)/100:Number(s.discount||0);return i+R},H=s=>{const i=W(s),f=(s.items||[]).reduce((B,Pe)=>B+x(Pe),0),D=Math.max(0,i-f),R=s.discountType==="percent"?D*Number(s.discount||0)/100:Number(s.discount||0);return Math.max(0,D-R)},A=s=>{const f=new Date().getFullYear(),D=s.length+1;return`EST-${f}-${String(D).padStart(4,"0")}`},re=()=>{const s=A(S);w({number:s,date:new Date().toISOString().slice(0,10),customerId:a[0]?.id||"custom",customerName:a[0]?.name||"",customerAddress:a[0]?.address||"",customerPhone:a[0]?.phone||"",discount:"",discountType:"amount",items:[{itemId:"",name:"",hsn:"",qty:"",price:"",discount:"",discountType:"amount"}],notes:"Thank you for your business."}),N(!0),l({type:"",text:""})},ee=s=>{if(s==="custom")w(i=>({...i,customerId:"custom",customerName:"",customerAddress:"",customerPhone:""}));else{const i=a.find(f=>f.id===s);i&&w(f=>({...f,customerId:s,customerName:i.name||"",customerAddress:i.address||"",customerPhone:i.phone||""}))}},ae=(s,i)=>{const f=o.find(D=>D.id===i);f&&w(D=>{const R=[...D.items];return R[s]={...R[s],itemId:i,name:f.name||"",hsn:f.hsn||"",price:f.salePrice||"",qty:1,discount:"",discountType:"amount"},{...D,items:R}})},g=(s,i,f)=>{w(D=>{const R=[...D.items];return R[s]={...R[s],[i]:f},{...D,items:R}})},U=()=>{w(s=>({...s,items:[...s.items,{itemId:"",name:"",hsn:"",qty:"",price:"",discount:"",discountType:"amount"}]}))},p=s=>{w(i=>i.items.length<=1?i:{...i,items:i.items.filter((f,D)=>D!==s)})},K=s=>{s.preventDefault();try{if(!C.number.trim())throw new Error("Please enter estimate number.");if(!C.customerName.trim())throw new Error("Please enter customer name.");if(C.items.some(D=>!D.name.trim()))throw new Error("Please select a product or enter description.");const i={...C,id:`est_${Date.now()}`},f=[i,...S];localStorage.setItem("sma-estimates-v1",JSON.stringify(f)),I(f),N(!1),$(i),y(!0),l({type:"",text:""})}catch(i){l({type:"error",text:i.message})}},G=s=>{if(confirm("Are you sure you want to delete this estimate?")){const i=S.filter(f=>f.id!==s);localStorage.setItem("sma-estimates-v1",JSON.stringify(i)),I(i),l({type:"",text:""})}},q=s=>{if(!s)return null;const i=new Nt({unit:"pt",format:"a4"}),f=i.internal.pageSize.getWidth(),D=i.internal.pageSize.getHeight();ta(i,e,`ESTIMATE: ${s.number}`),i.setFont("helvetica","normal"),i.setFontSize(10),i.text(`Date: ${s.date}`,40,145),i.text(`Customer: ${s.customerName||"Customer Name"}`,40,165);let R=205;return(s.items||[]).forEach((B,Pe)=>{const Ie=x(B)>0?` | Disc -${B.discountType==="percent"?`${B.discount}%`:P(B.discount,e.currency)}`:"";i.text(`${Pe+1}. ${B.name} | HSN ${B.hsn||"-"} | Qty ${B.qty} | Rate ${P(B.price,e.currency)}${Ie} | Amount ${P(j(B),e.currency)}`,40,R,{maxWidth:515}),R+=20}),i.setFont("helvetica","bold"),i.setFontSize(13),i.text(`Subtotal: ${P(W(s),e.currency)}`,360,R+15),i.text(`Discount: ${P(L(s),e.currency)}`,360,R+30),i.text(`Grand Total: ${P(H(s),e.currency)}`,360,R+45),i.setDrawColor(17,24,39),i.setLineWidth(1.5),i.rect(15,15,f-30,D-30,"S"),i},se=async s=>{m("whatsapp"),l({type:"",text:""});try{const i=s||k;if(!i)throw new Error("No estimate selected.");const f=await Mt({doc:q(i),fileName:`${i.number}.pdf`,title:`${i.number} Estimate PDF`,phone:i.customerPhone});f&&l({type:"success",text:f})}catch(i){l({type:"error",text:"WhatsApp PDF share failed: "+(i.message||"Please allow file sharing permission.")})}finally{m("")}},pe=()=>{window.print()};b.useEffect(()=>{if(u){const s=document.createElement("style");return s.id="estimate-print-preview-style",s.textContent=`
        @media print {
          @page { size: A4; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: 2px solid #111827 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
        }
      `,document.head.appendChild(s),()=>{s.remove()}}},[u]);const $e=s=>String(s??"").replace(/[&<>"]/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[i]),de=s=>{if(!s)return"";const i=localStorage.getItem("sma-custom-invoice-template")||"";if(!i)return"";const f=W(s),D=L(s),R=H(s),B=(s.items||[]).map((ke,Ie)=>{const ut=x(ke)>0?ke.discountType==="percent"?`${ke.discount}%`:P(ke.discount,e.currency):"-";return`<tr><td>${Ie+1}</td><td>${$e(ke.name)}</td><td>${$e(ke.hsn||"-")}</td><td style="text-align:right">${$e(ke.qty)}</td><td style="text-align:right">${$e(P(ke.price,e.currency))}</td><td style="text-align:right">-</td><td style="text-align:right">${$e(ut)}</td><td style="text-align:right">${$e(P(j(ke),e.currency))}</td></tr>`}).join(""),Pe={businessName:e.businessName,businessTagline:"",businessAddress:e.address||"Company Address",businessPhone:e.phone||"-",businessEmail:e.email||"-",businessGstin:e.gstin||"-",logo:e.logo||"",invoiceNumber:s.number,invoiceDate:s.date,dueDate:"-",status:"Estimate",paymentMode:"-",taxLabel:"0%",customerName:s.customerName||"Customer Name",customerAddress:s.customerAddress||"Address",customerPhone:s.customerPhone||"-",customerGstin:"-",subtotal:P(f,e.currency),textSummaryHtml:"<p>Estimate No Tax</p>",tax:"0%",discount:P(D,e.currency),total:P(R,e.currency),paid:P(0,e.currency),balance:P(R,e.currency),notes:s.notes||"Thank you for your business.",itemRows:B};return i.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(ke,Ie)=>Pe[Ie]??"")},ue=()=>r`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Estimate</p></div>`,_e=s=>{if(!s)return"";const i=W(s),f=L(s),D=H(s);return r`
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <div className="sma-doc-title">ESTIMATE</div>
        <${pt} settings=${e} />
        <section className="sma-info-grid">
          <div>
            <h3>Estimate To</h3>
            <p className="sma-strong">${s.customerName||"Customer Name"}</p>
            <p>${s.customerAddress||"Address"}</p>
            <p>Phone: ${s.customerPhone||"-"}</p>
          </div>
          <div>
            <h3>Estimate Details</h3>
            <p><b>Estimate No:</b> ${s.number}</p>
            <p><b>Date:</b> ${s.date}</p>
          </div>
        </section>
        <table className="sma-items-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-left">Description</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(s.items||[]).map((R,B)=>{const ke=x(R)>0?R.discountType==="percent"?`${R.discount}%`:P(R.discount,e.currency):"-";return r`
                <tr key=${B}>
                  <td>${B+1}</td>
                  <td className="text-left sma-strong">${R.name}</td>
                  <td>${R.hsn||"-"}</td>
                  <td>${R.qty}</td>
                  <td>${P(R.price,e.currency)}</td>
                  <td>${ke}</td>
                  <td>${P(j(R),e.currency)}</td>
                </tr>
              `})}
          </tbody>
        </table>
        <section className="sma-bottom-grid">
          <div>
            <h3>Terms</h3>
            <p>${s.notes||"Thank you for your business."}</p>
          </div>
          <div className="sma-total-box">
            <p><span>Subtotal</span><b>${P(i,e.currency)}</b></p>
            <p><span>Discount</span><b>${P(f,e.currency)}</b></p>
            <p className="sma-grand"><span>Grand Total</span><b>${P(D,e.currency)}</b></p>
          </div>
        </section>
        <footer className="sma-sign-row">
          <div>Customer Signature</div>
          <div>Authorized Signature</div>
        </footer>
      </article>
    `},je=s=>{if(!s)return"";const i=W(s),f=L(s),D=H(s),R=t==="modern"?{head:"border-b-4 border-indigo-600 bg-indigo-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-indigo-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:t==="compact"?{head:"border-b pb-3",table:"bg-slate-100 text-slate-900 border-y",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-5 text-slate-900 shadow-[var(--shadow-md)] sm:p-7"}:t==="gst"?{head:"border-2 border-slate-900 p-4",table:"bg-emerald-700 text-white",article:"print-area mx-auto max-w-4xl rounded-none border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-8"}:t==="letterhead"?{head:"border-b-8 border-purple-600 bg-purple-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-purple-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:t==="professional"?{head:"border-b-4 border-teal-600 bg-teal-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-teal-700 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-teal-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"}:t==="elegant"?{head:"border-b-4 border-rose-500 bg-rose-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8",table:"bg-rose-600 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-rose-950 bg-white p-6 text-rose-950 shadow-[var(--shadow-md)] sm:p-10"}:t==="minimalist"?{head:"border-b border-slate-300 pb-4",table:"bg-slate-100 text-slate-800 border-y",article:"print-area mx-auto max-w-4xl rounded-none border border-slate-200 bg-white p-6 text-slate-800 shadow-none sm:p-8"}:{head:"border-b-2 border-slate-900 pb-5",table:"bg-slate-900 text-white",article:"print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10"};return r`
      <article className=${R.article}>
        <div className=${R.head}>
          <${pt} settings=${e} />
        </div>
        ${ue()}
        <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
          <div>
            <p className="font-black uppercase text-slate-500">Customer Details</p>
            <h3 className="mt-2 text-lg font-black">${s.customerName||"Customer Name"}</h3>
            <p className="leading-6">${s.customerAddress||"Address"}<br/>Phone: ${s.customerPhone||"-"}</p>
          </div>
          <div className="text-right">
            <p><b>Estimate No:</b> ${s.number}</p>
            <p><b>Date:</b> ${s.date}</p>
          </div>
        </section>
        <table className="mt-5 w-full text-sm">
          <thead className=${R.table}>
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">HSN</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Rate</th>
              <th className="p-2 text-right">Discount</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(s.items||[]).map((B,Pe)=>{const Ie=x(B)>0?B.discountType==="percent"?`${B.discount}%`:P(B.discount,e.currency):"-";return r`
                <tr key=${Pe} className="border-b">
                  <td className="p-2">${Pe+1}</td>
                  <td className="p-2 font-bold">${B.name}</td>
                  <td className="p-2">${B.hsn||"-"}</td>
                  <td className="p-2 text-right">${B.qty}</td>
                  <td className="p-2 text-right">${P(B.price,e.currency)}</td>
                  <td className="p-2 text-right">${Ie}</td>
                  <td className="p-2 text-right font-bold">${P(j(B),e.currency)}</td>
                </tr>
              `})}
          </tbody>
        </table>
        <section className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>${P(i,e.currency)}</b></div>
          <div className="flex justify-between"><span>Discount</span><b>${P(f,e.currency)}</b></div>
          <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${P(D,e.currency)}</span></div>
        </section>
      </article>
    `};return r`
    <div className="space-y-5">
      <div className="card p-6 no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black"><${Yt} /> Estimates</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick=${re} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">
              <${Ze} size=${18} /> Create New Estimate
            </button>
          </div>
        </div>
      </div>
      
      ${d.text?r`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${d.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}`}>${d.text}</div>`:""}
      
      ${h?r`
        <section className="card overflow-hidden no-print">
          <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.04)] p-6 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">New Estimate</h2>
            <button onClick=${()=>N(!1)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"><${Xe} size=${22} /></button>
          </div>
          <form onSubmit=${K} className="p-6">
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <label className="text-sm font-bold">Estimate Number
                <input required value=${C.number} onInput=${s=>w({...C,number:s.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Customer Dropdown
                <select value=${C.customerId} onChange=${s=>ee(s.target.value)} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${a.map(s=>r`<option key=${s.id} value=${s.id}>${s.name}</option>`)}
                  <option value="custom">Custom Customer</option>
                </select>
              </label>
              <label className="text-sm font-bold">Bill Date
                <input type="date" required value=${C.date} onInput=${s=>w({...C,date:s.target.value})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <label className="text-sm font-bold">Customer Name
                <input required value=${C.customerName} onInput=${s=>w({...C,customerName:s.target.value})} placeholder="Enter customer name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Phone Number
                <input value=${C.customerPhone} onInput=${s=>w({...C,customerPhone:s.target.value})} placeholder="Enter customer phone" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Address
                <input value=${C.customerAddress} onInput=${s=>w({...C,customerAddress:s.target.value})} placeholder="Enter customer address" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
            </div>

            <div className="border border-[hsl(var(--border))] rounded-[var(--radius-lg)] overflow-hidden mb-6">
              <div className="bg-[hsl(var(--muted)/0.35)] px-4 py-2 flex justify-between items-center border-b border-[hsl(var(--border))]">
                <span className="font-black text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Estimate Items</span>
                <button type="button" onClick=${U} className="rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1 hover:opacity-90 cursor-pointer shadow-sm" style=${{minHeight:"30px",height:"30px",width:"auto",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
                  <${Ze} size=${14} style=${{width:"14px",height:"14px",flexShrink:0,marginRight:"4px"}} />
                  <span className="whitespace-nowrap">Add Row</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-xs">
                  <thead className="bg-[hsl(var(--muted))] text-left text-[11px] uppercase text-[hsl(var(--muted-foreground))]">
                    <tr>
                      <th className="p-2">Product Dropdown</th>
                      <th className="p-2">Product / Service</th>
                      <th className="p-2">HSN</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">Discount</th>
                      <th className="p-2 text-right">Amount</th>
                      <th className="p-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${C.items.map((s,i)=>r`
                      <tr key=${i} className="border-t border-[hsl(var(--border))]">
                        <td className="p-2">
                          <select value=${s.itemId||""} onChange=${f=>ae(i,f.target.value)} className="w-44 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 text-xs">
                            <option value="">Manual Entry</option>
                            ${o.map(f=>r`<option key=${f.id} value=${f.id}>${f.name}</option>`)}
                          </select>
                        </td>
                        <td className="p-2">
                          <input required value=${s.name||""} onInput=${f=>g(i,"name",f.target.value)} placeholder="Product/service description" className="w-56 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs" />
                        </td>
                        <td className="p-2">
                          <input value=${s.hsn||""} onInput=${f=>g(i,"hsn",f.target.value)} placeholder="HSN" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs" />
                        </td>
                        <td className="p-2">
                          <input type="number" required value=${s.qty} onInput=${f=>g(i,"qty",f.target.value)} placeholder="Qty" className="w-20 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                        </td>
                        <td className="p-2">
                          <input type="number" required value=${s.price} onInput=${f=>g(i,"price",f.target.value)} placeholder="Price" className="w-28 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <select value=${s.discountType||"amount"} onChange=${f=>g(i,"discountType",f.target.value)} className="w-14 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 text-xs">
                              <option value="amount">₹</option>
                              <option value="percent">%</option>
                            </select>
                            <input type="number" value=${s.discount||""} onInput=${f=>g(i,"discount",f.target.value)} placeholder="Disc" className="w-16 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                          </div>
                        </td>
                        <td className="p-2 text-right font-bold text-xs">
                          ${P(j(s),e.currency)}
                        </td>
                        <td className="p-2 text-right">
                          <button type="button" disabled=${C.items.length<=1} onClick=${()=>p(i)} className="text-[hsl(var(--destructive))] disabled:opacity-30">
                            <${ct} size=${14} />
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold">Notes / Terms
                <textarea value=${C.notes} onInput=${s=>w({...C,notes:s.target.value})} className="focus-ring mt-2 min-h-24 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" placeholder="Estimate validity, payment terms, or custom instructions"></textarea>
              </label>
              <div className="flex flex-col justify-end items-end space-y-3 pr-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-[hsl(var(--muted-foreground))]">Overall Estimate Discount:</span>
                  <select value=${C.discountType||"amount"} onChange=${s=>w({...C,discountType:s.target.value})} className="rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 text-xs font-bold" aria-label="Overall discount type">
                    <option value="amount">₹</option>
                    <option value="percent">%</option>
                  </select>
                  <input type="number" value=${C.discount||""} onInput=${s=>w({...C,discount:s.target.value})} placeholder="Overall Disc" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2 text-sm text-right font-bold border-[hsl(var(--border))]" />
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm text-[hsl(var(--muted-foreground))]">
                  <span>Subtotal:</span>
                  <span>${P(W(C),e.currency)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm text-[hsl(var(--muted-foreground))]">
                  <span>Total Discount:</span>
                  <span>${P(L(C),e.currency)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-xl font-black border-t border-[hsl(var(--border))] pt-2">
                  <span>Grand Total:</span>
                  <span>${P(H(C),e.currency)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick=${()=>N(!1)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-6 py-3 font-black">Cancel</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-6 py-3 font-black text-white shadow-[var(--shadow-sm)]">
                <${$t} size=${18} /> Save Estimate
              </button>
            </div>
          </form>
        </section>
      `:""}

      ${!h&&r`
        <section className="card overflow-hidden no-print">
          <div className="border-b border-[hsl(var(--border))] p-5">
            <h3 className="font-black">Estimates History</h3>
          </div>
          ${S.length?r`
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
                  <tr>
                    <th className="p-4">Estimate No</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${S.map(s=>r`
                    <tr key=${s.id} className="border-t border-[hsl(var(--border))]">
                      <td className="p-4 font-black">
                        <button onClick=${()=>{$(s),y(!0)}} className="text-[hsl(var(--primary))] hover:underline">
                          ${s.number}
                        </button>
                      </td>
                      <td className="p-4">${s.date}</td>
                      <td className="p-4">${s.customerName}</td>
                      <td className="p-4">${(s.items||[]).length}</td>
                      <td className="p-4 font-bold">${P(H(s),e.currency)}</td>
                      <td className="p-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick=${()=>{$(s),se(s)}} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-3 py-2 text-xs font-black text-white">
                            <${rt} size=${14} /> WhatsApp PDF
                          </button>
                          <button onClick=${()=>{$(s),y(!0)}} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white">
                            <${et} size=${14} /> View / Print
                          </button>
                          <button onClick=${()=>G(s.id)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-red-600 px-3 py-2 text-xs font-black text-white">
                            <${ct} size=${14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `:r`
            <div className="grid place-items-center p-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                <${Yt} size=${30} />
              </div>
              <h3 className="mt-4 text-lg font-black">No estimates yet</h3>
            </div>
          `}
        </section>
      `}

      ${u&&k&&r`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Estimate #${k.number}</span>
            <div className="flex flex-wrap gap-2">
              <select value=${t} onChange=${s=>n(s.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 font-bold text-sm" aria-label="Estimate print template">
                <option value="sma">SMA Print Format</option>
                <option value="classic">Classic Template</option>
                <option value="modern">Modern Template</option>
                <option value="compact">Compact Template</option>
                <option value="gst">GST Box Template</option>
                <option value="letterhead">Letterhead Template</option>
                <option value="professional">Professional Teal Template</option>
                <option value="elegant">Elegant Coral Template</option>
                <option value="minimalist">Minimalist Steel Template</option>
                ${localStorage.getItem("sma-custom-invoice-template")?r`<option value="custom">My Local Template</option>`:""}
              </select>
              <button disabled=${!!c} onClick=${()=>se(k)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
                <${rt} size=${17} /> ${c==="whatsapp"?"Sharing...":"WhatsApp Share"}
              </button>
              <button onClick=${pe} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
                <${et} size=${17} /> Print
              </button>
              <button onClick=${()=>{y(!1),$(null)}} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
                <${Xe} size=${17} /> Close
              </button>
            </div>
          </div>
          ${d.text?r`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${d.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}">${d.text}</div>`:""}
          <div className="w-full max-w-4xl">
            ${t==="custom"?r`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{__html:de(k)}}></article>`:t==="sma"?_e(k):je(k)}
          </div>
        </div>
      `}
    </div>
  `}const Ga={companyName:"",contactPerson:"",emailPhone:"",productService:"",quantity:"",details:"",attachmentName:""},gs="sma-purchase-orders",lr=()=>{try{return JSON.parse(localStorage.getItem(gs)||"[]")}catch{return[]}},dr=e=>`PO-${new Date().getFullYear()}-${String(e+1).padStart(4,"0")}`;function cr(){const e=X(x=>x.settings),[a,o]=b.useState(Ga),[t,n]=b.useState(lr),[c,m]=b.useState(!1),[d,l]=b.useState(!1),[u,y]=b.useState({type:"",text:""}),[k,$]=b.useState(null),h=(x,j)=>{o(W=>({...W,[x]:j})),u.text&&y({type:"",text:""})},N=x=>{const j=new Nt({unit:"pt",format:"a4"}),W=j.internal.pageSize.getWidth(),L=j.internal.pageSize.getHeight();return ta(j,e,`PURCHASE ORDER: ${x.number}`),j.setFont("helvetica","normal"),j.setFontSize(10),j.text(`Date: ${new Date(x.date).toLocaleString()}`,40,145),j.text(`Company: ${x.companyName}`,40,175),j.text(`Contact: ${x.contactPerson}`,40,195),j.text(`Email / Phone: ${x.emailPhone}`,40,215),j.text(`Product / Service: ${x.productService}`,40,255),j.text(`Quantity: ${x.quantity}`,40,275),j.text(`Details: ${x.details}`,40,315,{maxWidth:515}),j.setDrawColor(17,24,39),j.setLineWidth(1.5),j.rect(15,15,W-30,L-30,"S"),j},S=x=>Mt({doc:N(x),fileName:`${x.number}.pdf`,title:`${x.number} Purchase Order PDF`,phone:x.emailPhone}),I=async x=>{x.preventDefault(),l(!0),y({type:"",text:""});try{if(!a.companyName.trim()||!a.contactPerson.trim()||!a.emailPhone.trim()||!a.productService.trim()||!a.quantity.trim()||!a.details.trim())throw new Error("Please fill all required purchase order fields.");const j={...a,id:`po_${Date.now()}`,number:dr(t.length),date:new Date().toISOString()},W=[{...j,whatsappShared:!0,pdfGenerated:!0},...t];localStorage.setItem(gs,JSON.stringify(W)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),n(W),o(Ga),m(!1),$(j)}catch(j){y({type:"error",text:"Failed to create purchase order: "+(j.message||"Please try again.")})}finally{l(!1)}},C=async x=>{l(!0),y({type:"",text:""});try{await S(x),y({type:"",text:""})}catch(j){y({type:"error",text:"WhatsApp PDF share failed: "+(j.message||"Please allow file sharing permission.")})}finally{l(!1)}},w=()=>{window.print()};b.useEffect(()=>{if(k){const x=document.createElement("style");return x.id="purchase-order-print-preview-style",x.textContent=`
        @media print {
          @page { size: A4; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: 2px solid #111827 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
        }
      `,document.head.appendChild(x),()=>{x.remove()}}},[k]);const J=x=>x?r`
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <${pt} settings=${e} />
        
        <div className="text-center mt-4 mb-5">
          <p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">
            Purchase Order
          </p>
        </div>
        
        <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
          <div>
            <p className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-1">Vendor Details</p>
            <h3 className="text-lg font-black">${x.companyName}</h3>
            <p className="leading-6">
              Contact: ${x.contactPerson}<br/>
              Phone/Email: ${x.emailPhone}
            </p>
          </div>
          <div className="text-right">
            <p><b>PO Number:</b> ${x.number}</p>
            <p><b>Date:</b> ${new Date(x.date).toLocaleDateString()}</p>
            <p><b>Status:</b> Pending</p>
          </div>
        </section>
        
        <table className="mt-5 w-full text-sm sma-items-table">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Product / Service</th>
              <th className="p-2 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">1</td>
              <td className="p-2 font-bold">${x.productService}</td>
              <td className="p-2 text-right">${x.quantity}</td>
            </tr>
          </tbody>
        </table>
        
        <section className="grid grid-cols-1 gap-4 py-5 text-sm mt-4">
          <div>
            <h3 className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-2">Requirement Details</h3>
            <p className="text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 border rounded-[var(--radius-md)]">${x.details}</p>
          </div>
        </section>
        
        <footer className="sma-sign-row mt-12 pt-8 flex justify-between">
          <div className="text-center w-48 border-t border-slate-300 pt-2 text-[10px] uppercase font-bold text-slate-400">Vendor Signature</div>
          <div className="text-center w-48 border-t border-slate-900 pt-2 text-[10px] uppercase font-bold">Authorized Signature</div>
        </footer>
      </article>
    `:"";return r`<div className="space-y-5"><div className="card p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Purchase Module</p><h2 className="mt-2 flex items-center gap-2 text-2xl font-black"><${Za} /> Purchase Orders</h2></div><button disabled=${d} onClick=${()=>{m(!0),y({type:"",text:""})}} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white disabled:opacity-60"><${Ze} size=${18} /> New Purchase Order</button></div></div>${u.text?r`<div className=${`flex items-center gap-2 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${u.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}`}>${u.type==="success"?r`<${it} size=${18} />`:r`<${He} size=${18} />`}${u.text}</div>`:""}${c?r`<section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.04)] p-6"><h2 className="text-2xl font-black tracking-tight">New Purchase Order</h2></div><form onSubmit=${I} className="p-6"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-bold">Company Name<input required disabled=${d} value=${a.companyName} onInput=${x=>h("companyName",x.target.value)} placeholder="Supplier / company name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Contact Person<input required disabled=${d} value=${a.contactPerson} onInput=${x=>h("contactPerson",x.target.value)} placeholder="Contact person name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Email / Phone<input required disabled=${d} value=${a.emailPhone} onInput=${x=>h("emailPhone",x.target.value)} placeholder="email@example.com / mobile" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Product or Service<input required disabled=${d} value=${a.productService} onInput=${x=>h("productService",x.target.value)} placeholder="Product / service" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Quantity<input required disabled=${d} value=${a.quantity} onInput=${x=>h("quantity",x.target.value)} placeholder="Required quantity" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold md:col-span-2">Purchase Order Details<textarea required disabled=${d} value=${a.details} onInput=${x=>h("details",x.target.value)} placeholder="Requirement details, delivery terms, notes" className="focus-ring mt-1 min-h-32 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60"></textarea></label></div><div className="mt-6 flex flex-wrap justify-end gap-2"><button disabled=${d} type="button" onClick=${()=>m(!1)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-6 py-3 font-black disabled:opacity-60">Cancel</button><button disabled=${d} type="submit" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-6 py-3 font-black text-white shadow-[var(--shadow-sm)] disabled:opacity-60">${d?r`<${nt} className="animate-spin" size=${18} />`:r`<MessageCircle size=${18} />`} ${d?"Generating PDF & Opening WhatsApp...":"Submit & WhatsApp PDF"}</button></div></form></section>`:""}<section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Purchase Orders History</h3></div>${t.length?r`<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">PO Prefix</th><th className="p-4">Date</th><th className="p-4">Company</th><th className="p-4">Email / Phone</th><th className="p-4">Product</th><th className="p-4">Qty</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>${t.map(x=>r`<tr key=${x.id} className="border-t border-[hsl(var(--border))]"><td className="p-4 font-black"><button onClick=${()=>$(x)} className="text-[hsl(var(--primary))] hover:underline">${x.number}</button></td><td className="p-4">${new Date(x.date).toLocaleDateString()}</td><td className="p-4">${x.companyName}</td><td className="p-4">${x.emailPhone}</td><td className="p-4">${x.productService}</td><td className="p-4">${x.quantity}</td><td className="p-4 text-right"><div className="flex flex-wrap justify-end gap-2"><button onClick=${()=>$(x)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-3 py-2 text-xs font-black text-white"><${rt} size=${14} /> WhatsApp PDF</button><button onClick=${()=>$(x)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white"><${et} size=${14} /> Print</button></div></td></tr>`)}</tbody></table></div>`:r`<div className="grid place-items-center p-10 text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${os} size=${30} /></div><h3 className="mt-4 text-lg font-black">No purchase orders yet</h3></div>`}</section>${k&&r`<div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center"><div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print"><span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Purchase Order #${k.number}</span><div className="flex gap-2"><button disabled=${d} onClick=${()=>C(k)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60"><${rt} size=${17} /> ${d?"Sharing...":"WhatsApp Share"}</button><button onClick=${w} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white"><${et} size=${17} /> Print</button><button onClick=${()=>$(null)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]"><${Xe} size=${17} /> Close</button></div></div>${u.text?r`<div className="w-full max-w-4xl mb-4 flex items-center gap-2 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${u.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}">${u.type==="success"?r`<${it} size=${18} />`:r`<${He} size=${18} />`}${u.text}</div>`:""}<div className="w-full max-w-4xl">${J(k)}</div></div>`}</div>`}const Bt={name:"",hsn:"",unit:"pcs",category:"",barcode:"",salePrice:"",purchasePrice:"",taxRate:"",discount:"",stock:"",lowStock:25},ia={name:"",phone:"",email:"",address:"",gstin:""},mr=["pcs","box","kg","g","ltr","ml","meter","feet","roll","bundle","bag","packet","carton","dozen","set","pair","job","service"],Ha=["salePrice","purchasePrice","taxRate","discount","stock","lowStock"],la={category:"Category",hsn:"HSN / SAC",barcode:"Barcode / SKU",unit:"Select unit",salePrice:"Sale price",purchasePrice:"Purchase price",taxRate:"GST %",discount:"Discount %",stock:"Opening stock qty",lowStock:"Low stock limit"};function pr(){const e=X(I=>I.customers),a=X(I=>I.items),o=X(I=>I.settings),t=X(I=>I.addCustomer),n=X(I=>I.updateCustomer),c=X(I=>I.addItem),m=X(I=>I.deleteCustomer),[d,l]=b.useState(ia),[u,y]=b.useState(Bt),[k,$]=b.useState(""),h=I=>{$(I.id),l({name:I.name||"",phone:I.phone||"",email:I.email||"",address:I.address||"",gstin:I.gstin||""}),y(Bt)},N=()=>{$(""),l(ia),y(Bt)},S=()=>{if(!d.name.trim())return;if(k){n(k,d),N();return}const I=t(d);u.name.trim()&&c({...u,salePrice:Number(u.salePrice||0),purchasePrice:Number(u.purchasePrice||0),taxRate:Number(u.taxRate||0),discount:Number(u.discount||0),stock:Number(u.stock||0),lowStock:Number(u.lowStock||25),partyId:I,partyName:d.name}),l(ia),y(Bt)};return r`<div className="grid gap-5 lg:grid-cols-3"><div className="card p-5"><h3 className="text-lg font-black">${k?"Edit Party / Customer":"Add New Party / Customer"}</h3><div className="mt-4 space-y-3">${["name","phone","email","gstin","address"].map(I=>r`<input key=${I} value=${d[I]} onInput=${C=>l({...d,[I]:C.target.value})} placeholder=${I==="name"?"Party / Customer name":I==="phone"?"Phone number":I==="email"?"Email address":I==="gstin"?"GSTIN number":"Full address"} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />`)}${k?"":r`<div className="rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-3"><p className="mb-2 text-sm font-black">Add Product For This Party</p><input value=${u.name} onInput=${I=>y({...u,name:I.target.value})} placeholder="Product name for this party" className="focus-ring mb-2 w-full rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /><div className="grid grid-cols-2 gap-2">${["category","hsn","barcode","unit","salePrice","purchasePrice","taxRate","discount","stock","lowStock"].map(I=>{if(I==="unit")return r`<select key=${I} value=${u.unit||"pcs"} onChange=${C=>y({...u,unit:C.target.value})} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2" aria-label="Product unit"><option value="">${la.unit}</option>${mr.map(C=>r`<option key=${C} value=${C}>${C}</option>`)}</select>`;if(I==="category"){const C=u.category||"",w=C&&!["ELECTRICAL","HARDWARE","PLUMBING"].includes(C.toUpperCase());return r`<select key=${I} value=${C.toUpperCase()} onChange=${J=>y({...u,category:J.target.value})} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2" aria-label="Product category"><option value="">Category</option><option value="ELECTRICAL">ELECTRICAL</option><option value="HARDWARE">HARDWARE</option><option value="PLUMBING">PLUMBING</option>${w?r`<option value=${C.toUpperCase()}>${C.toUpperCase()}</option>`:""}</select>`}else return r`<input key=${I} type=${Ha.includes(I)?"number":"text"} value=${u[I]} onInput=${C=>y({...u,[I]:Ha.includes(I)?C.target.value===""?"":Number(C.target.value):C.target.value})} placeholder=${la[I]} aria-label=${la[I]} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" />`})}</div></div>`}<div className="grid gap-2 sm:grid-cols-2"><button onClick=${S} className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${k?$t:Ze} size=${18} /> ${k?"Update Party":"Save Party"}</button>${k?r`<button onClick=${N} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-3 font-black">Cancel</button>`:""}</div></div></div><div className="space-y-3 lg:col-span-2">${e.map(I=>{const C=a.filter(w=>w.partyId===I.id);return r`<div key=${I.id} className="card p-4"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-lg font-black">${I.name}</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">${I.phone||"-"} · ${I.email||"-"}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">${I.address||"-"} · GSTIN ${I.gstin||"-"}</p></div><div className="flex gap-2"><button onClick=${()=>h(I)} className="rounded-[var(--radius-sm)] p-2 text-[hsl(var(--primary))]" title="Edit party"><${ea} size=${18} /></button><button onClick=${()=>m(I.id)} className="rounded-[var(--radius-sm)] p-2 text-[hsl(var(--destructive))]" title="Delete party"><${ct} size=${18} /></button></div></div>${C.length?r`<div className="mt-4 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.35)] p-3">${C.map(w=>r`<div key=${w.id} className="flex flex-wrap justify-between gap-2 border-t border-[hsl(var(--border))] py-2 text-sm"><span className="font-bold">${w.name}</span><span>${P(w.salePrice,o.currency)} · ${w.unit||"pcs"} · GST ${w.taxRate||0}% · Disc ${w.discount||0}% · Stock ${w.stock||0}</span></div>`)}</div>`:""}</div>`})}</div></div>`}function ur(){const e=X(p=>p.customers),a=X(p=>p.invoices),o=X(p=>p.settings),t=X(p=>p.updateInvoice),[n,c]=b.useState(null),[m,d]=b.useState({}),[l,u]=b.useState(""),[y,k]=b.useState(""),[$,h]=b.useState(""),[N,S]=b.useState(()=>localStorage.getItem("sma-party-ledger-template")||"classic"),[I,C]=b.useState(null),[w,J]=b.useState(!1),x=p=>c({id:p.id,paid:p.totals.paid??0,status:p.status||"Unpaid"}),j=()=>c(null),W=()=>{if(!n)return;const p=a.find(se=>se.id===n.id);if(!p)return;const K=Number(n.paid||0);let G=Array.isArray(p.payments)?p.payments:Number(p.paid||0)>0?[{id:"pay_legacy",date:p.date||Ke(),amount:Number(p.paid||0),mode:p.paymentMode||"Cash",note:"Legacy payment"}]:[];const q=G.reduce((se,pe)=>se+Number(pe.amount||0),0);if(K!==q)if(K===0)G=[];else if(G.length===0)G=[{id:`pay_${Date.now().toString(36)}`,date:Ke(),amount:K,mode:"Cash",note:"Direct update"}];else{const se=K-q;G=[...G,{id:`pay_adj_${Date.now().toString(36)}`,date:Ke(),amount:se,mode:"Other",note:"Direct adjustment"}]}t(n.id,{paid:K,payments:G,status:n.status||"Unpaid"}),c(null)},L=p=>{S(p);try{localStorage.setItem("sma-party-ledger-template",p)}catch{}},H=p=>{const K=Number(m[p.id]?.amount||0);if(K<=0)return alert("Payment amount enter pannunga.");const G=Array.isArray(p.payments)?p.payments:Number(p.paid||0)>0?[{id:`${p.id}_old`,date:p.date||Ke(),amount:Number(p.paid||0),mode:p.paymentMode||"Credit",note:"Opening paid"}]:[],q=G.reduce(($e,de)=>$e+Number(de.amount||0),0)+K,se=q>=p.totals.total?"Paid":"Partial",pe={id:`pay_${Date.now().toString(36)}`,date:m[p.id]?.date||Ke(),amount:K,mode:m[p.id]?.mode||"Cash",note:m[p.id]?.note||""};t(p.id,{payments:[...G,pe],paid:q,status:se}),d($e=>({...$e,[p.id]:{amount:"",date:Ke(),mode:"Cash",note:""}}))},A=b.useMemo(()=>e.map(p=>{const K=a.filter(de=>de.customerId===p.id).map(de=>({...de,totals:Le(de)})).sort((de,ue)=>String(ue.date||"").localeCompare(String(de.date||""))),G=K.reduce((de,ue)=>de+ue.totals.total,0),q=K.reduce((de,ue)=>de+ue.totals.paid,0),se=K.reduce((de,ue)=>de+ue.totals.balance,0),pe=K.filter(de=>de.totals.balance>0||String(de.status||"").toLowerCase()!=="paid"),$e=K.flatMap(de=>(de.payments||[]).map(ue=>({...ue,invoice:de}))).sort((de,ue)=>String(ue.date||"").localeCompare(String(de.date||"")))[0]||K.find(de=>de.totals.paid>0);return{customer:p,invoices:K,totalInvoice:G,totalPaid:q,totalBalance:se,creditInvoices:pe,lastPayment:$e}}),[e,a]);b.useEffect(()=>{!$&&A[0]&&h(A[0].customer.id)},[A,$]);const re=A.find(p=>p.customer.id===$)||A[0],ee=A.reduce((p,K)=>p+K.totalBalance,0);b.useEffect(()=>{if(w){const p=document.createElement("style");return p.id="ledger-print-preview-style",p.textContent=`
        @media print {
          @page { size: A4 landscape; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
          .print-preview-modal .ledger-print-party {
            width: 267mm !important;
            max-width: 267mm !important;
            display: block !important;
            padding: 15mm !important;
          }
          .print-preview-modal .ledger-print-party table {
            table-layout: fixed !important;
            font-size: 8.5px !important;
            margin-top: 18px !important;
            width: 100% !important;
          }
          .print-preview-modal .ledger-print-party th,
          .print-preview-modal .ledger-print-party td {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            padding: 9px 6px !important;
            line-height: 1.45 !important;
            vertical-align: middle !important;
            text-align: center !important;
          }
          .print-preview-modal .ledger-print-party th {
            background: #f8fafc !important;
            font-weight: 900 !important;
          }
        }
      `,document.head.appendChild(p),()=>{p.remove()}}},[w]);const ae=async p=>{const K=document.querySelector(`.ledger-print-party[data-party-id="${CSS.escape(p.customer.id)}"]`);if(!K)throw new Error("Ledger print layout not found.");const G=document.createElement("div");G.style.cssText="position:absolute;left:-10000px;top:0;background:white;width:281mm;z-index:-1;";const q=K.cloneNode(!0);q.classList.add("print-selected"),q.style.cssText="display:block !important;width:281mm !important;max-width:281mm !important;margin:0 !important;box-shadow:none !important;border-radius:0 !important;background:white !important;color:#111827 !important;padding:15mm !important;",q.querySelectorAll(".no-print, button, input, select").forEach(se=>se.remove()),q.querySelectorAll("table").forEach(se=>{se.style.tableLayout="fixed",se.style.width="100%",se.style.borderCollapse="collapse",se.style.marginTop="18px"}),q.querySelectorAll("th,td").forEach(se=>{se.style.whiteSpace="normal",se.style.overflow="visible",se.style.textOverflow="clip",se.style.wordBreak="break-word",se.style.overflowWrap="anywhere",se.style.padding="10px 7px",se.style.lineHeight="1.45",se.style.verticalAlign="middle"}),G.appendChild(q),document.body.appendChild(G);try{await new Promise(R=>requestAnimationFrame(R));const se=await Fs(q,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,windowWidth:q.scrollWidth,windowHeight:q.scrollHeight}),pe=new Nt({orientation:"landscape",unit:"pt",format:"a4"}),$e=pe.internal.pageSize.getWidth(),de=pe.internal.pageSize.getHeight(),ue=34.02,_e=$e-ue*2,je=de-ue*2,s=se.width/_e,i=Math.floor(je*s);let f=0,D=0;for(;f<se.height;){const R=Math.min(i,se.height-f),B=document.createElement("canvas");B.width=se.width,B.height=R,B.getContext("2d").drawImage(se,0,f,se.width,R,0,0,se.width,R),D&&pe.addPage("a4","landscape"),pe.addImage(B.toDataURL("image/jpeg",.95),"JPEG",ue,ue,_e,R/s),f+=R,D+=1}return pe}finally{G.remove()}},g=async p=>{k(p.customer.id),u("");try{const K=await ae(p),G=`${(p.customer.name||"company").replace(/[^a-z0-9]+/gi,"-")}-ledger.pdf`;await Mt({doc:K,fileName:G,title:`${p.customer.name} Ledger`,phone:p.customer.phone}),u("")}catch(K){u("Ledger PDF share failed: "+(K.message||"Please try again."))}finally{k("")}},U=p=>{const K=p.customer;return r`<article className=${`card print-area sma-print-sheet ledger-print-party ledger-template-${N}`} data-party-id=${K.id}><${pt} settings=${o} /><section className="sma-info-grid"><div><h3>PARTY DETAILS</h3><p className="sma-strong sma-customer-name">${K.name}</p><p>${K.address||"-"}</p><p>Phone: ${K.phone||"-"} | Email: ${K.email||"-"}</p><p>GSTIN: ${K.gstin||"-"}</p></div><div><p><b>Total Invoice:</b> ${P(p.totalInvoice,o.currency)}</p><p><b>Paid:</b> ${P(p.totalPaid,o.currency)}</p><p><b>Unpaid/Credit:</b> ${P(p.totalBalance,o.currency)}</p><p><b>Credit Bills:</b> ${p.creditInvoices.length}</p><p><b>Last Paid:</b> ${p.lastPayment?`${P(p.lastPayment.amount||p.lastPayment.totals?.paid,o.currency)} on ${p.lastPayment.date||"-"}`:"-"}</p></div></section><div className="no-print mt-4 flex justify-end gap-2"><button onClick=${()=>{C(p),J(!0)}} className="inline-flex items-center gap-1 rounded border border-[hsl(var(--border))] px-3 py-2 text-sm font-black"><${et} size=${15} /> Print</button><button onClick=${()=>{C(p),J(!0)}} className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-sm font-black text-white"><${rt} size=${15} /> WhatsApp PDF</button></div><div className="mt-5 ledger-table-section"><div className="overflow-x-auto"><table className="sma-items-table ledger-report-table min-w-[900px]"><thead><tr><th>Date</th><th>Invoice</th><th>Bill Amount</th><th>Paid Updated</th><th>Credit/Balance</th><th>Payment History</th><th>Status</th><th className="no-print">Add Payment / Edit</th></tr></thead><tbody>${p.invoices.length?p.invoices.map(G=>{const q=n?.id===G.id,se=m[G.id]||{amount:"",date:Ke(),mode:"Cash",note:""};return r`<tr key=${G.id}><td>${G.date||"-"}</td><td className="sma-strong">${G.number||G.id}</td><td>${P(G.totals.total,o.currency)}</td><td>${q?r`<input type="number" value=${n.paid} onInput=${pe=>c({...n,paid:pe.target.value})} className="focus-ring w-24 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1" aria-label="Paid amount" />`:P(G.totals.paid,o.currency)}</td><td className=${G.totals.balance>0?"sma-strong text-[hsl(var(--destructive))]":"sma-strong text-[hsl(var(--primary))]"}>${P(G.totals.balance,o.currency)}</td><td>${(()=>{const pe=Array.isArray(G.payments)?G.payments:Number(G.paid||0)>0?[{id:"legacy",date:G.date||"-",amount:Number(G.paid||0),mode:G.paymentMode||"Cash",note:"Initial payment"}]:[],$e=pe.length;return r`<div className="space-y-1 text-left text-xs max-w-[220px]">
      ${$e>0?r`
        <div className="font-extrabold text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-block mb-1">
          Paid ${$e} ${$e===1?"time":"times"}
        </div>
        <div className="space-y-1 pl-1">
          ${pe.map((de,ue)=>r`
            <div key=${de.id||ue} className="border-l-2 border-emerald-300 pl-1.5 py-0.5 hover:bg-emerald-50/50 transition-colors">
              <span className="font-bold text-gray-800 block text-[11px]">${P(de.amount,o.currency)}</span>
              <span className="text-[10px] text-gray-500 block">${de.date||"-"} • <span className="font-medium text-blue-600">${de.mode||"-"}</span></span>
              ${de.note?r`<span className="text-[9px] text-gray-400 italic block">"${de.note}"</span>`:""}
            </div>
          `)}
        </div>
      `:r`<span className="text-gray-400 text-xs italic">No payments yet</span>`}
    </div>`})()}</td><td>${q?r`<select value=${n.status} onChange=${pe=>c({...n,status:pe.target.value})} className="focus-ring rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1" aria-label="Invoice status"><option>Paid</option><option>Partial</option><option>Unpaid</option><option>Credit</option></select>`:G.status||"-"}</td><td className="no-print">${q?r`<div className="flex gap-1"><button onClick=${W} className="rounded p-1 text-[hsl(var(--primary))]" title="Save ledger"><${$t} size=${16} /></button><button onClick=${j} className="rounded p-1 text-[hsl(var(--destructive))]" title="Cancel"><${Xe} size=${16} /></button></div>`:r`<div className="flex flex-wrap items-center gap-1.5">
    <div className="flex items-center gap-1">
      <input type="number" value=${se.amount} onInput=${pe=>d($e=>({...$e,[G.id]:{...se,amount:pe.target.value}}))} placeholder="Amount" className="w-20 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
      <input type="date" value=${se.date} onInput=${pe=>d($e=>({...$e,[G.id]:{...se,date:pe.target.value}}))} className="w-28 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
    </div>
    <div className="flex items-center gap-1">
      <select value=${se.mode||"Cash"} onChange=${pe=>d($e=>({...$e,[G.id]:{...se,mode:pe.target.value}}))} className="w-20 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 text-xs">
        <option value="Cash">Cash</option>
        <option value="UPI">UPI</option>
        <option value="GPay">GPay</option>
        <option value="PhonePe">PhonePe</option>
        <option value="Paytm">Paytm</option>
        <option value="Card">Card</option>
        <option value="Bank Transfer">Bank</option>
        <option value="Cheque">Cheque</option>
        <option value="NEFT / RTGS">NEFT</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" value=${se.note||""} onInput=${pe=>d($e=>({...$e,[G.id]:{...se,note:pe.target.value}}))} placeholder="Note" className="w-20 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
      <button onClick=${()=>H(G)} className="rounded p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]" title="Add payment"><${Ze} size=${16} /></button>
      <button onClick=${()=>x(G)} className="rounded p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]" title="Edit ledger"><${ea} size=${16} /></button>
    </div>
  </div>`}</td></tr>`}):r`<tr><td colSpan="8" className="py-3 text-center text-[hsl(var(--muted-foreground))]">No invoices for this party.</td></tr>`}</tbody></table></div></div><footer className="sma-sign-row"><div>Prepared By</div><div>Authorized Signature</div></footer></article>`};return r`<div className="space-y-5"><div className="card p-4 no-print"><div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-lg font-black"><${He} size=${18} /> Party Wise Outstandings</p><p className="rounded-full bg-[hsl(var(--destructive)/0.12)] px-3 py-1 text-sm font-black text-[hsl(var(--destructive))]">Total Balance: ${P(ee,o.currency)}</p></div>${l?r`<p className="mt-2 rounded bg-emerald-500/10 p-2 text-sm font-bold text-emerald-700 whitespace-pre-wrap">${l}</p>`:""}<div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">${A.map(p=>r`<button key=${p.customer.id} onClick=${()=>h(p.customer.id)} className=${`rounded-[var(--radius-md)] border p-3 text-left ${re?.customer.id===p.customer.id?"border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]":"border-[hsl(var(--border))]"}`}><div className="flex justify-between gap-2"><span className="font-black">${p.customer.name}</span><span className=${`font-black ${p.totalBalance>0?"text-[hsl(var(--destructive))]":"text-[hsl(var(--primary))]"}`}>${P(p.totalBalance,o.currency)}</span></div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Invoices ${p.invoices.length} · Paid ${P(p.totalPaid,o.currency)} · Credit Bills ${p.creditInvoices.length}</p></button>`)}</div></div><div className="card p-4 no-print"><div className="grid gap-3 md:grid-cols-2"><label className="text-sm font-black">Select Company / Party<select value=${$} onChange=${p=>h(p.target.value)} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 font-semibold">${A.map(p=>r`<option key=${p.customer.id} value=${p.customer.id}>${p.customer.name}</option>`)}</select></label><label className="text-sm font-black">Ledger Print Template<select value=${N} onChange=${p=>L(p.target.value)} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 font-semibold"><option value="classic">Classic</option><option value="modern">Modern</option><option value="compact">Compact</option><option value="gstbox">GST Box</option><option value="letterhead">Letterhead</option></select></label></div></div>${re?U(re):r`<div className="card p-6 text-center font-bold text-[hsl(var(--muted-foreground))]">No parties available.</div>`}
  
  ${w&&I&&r`
    <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
        <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Ledger (${I.customer.name})</span>
        <div className="flex gap-2">
          <button disabled=${y===I.customer.id} onClick=${()=>g(I)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
            <${rt} size=${17} /> ${y===I.customer.id?"Sharing...":"WhatsApp Share"}
          </button>
          <button onClick=${()=>window.print()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
            <${et} size=${17} /> Print
          </button>
          <button onClick=${()=>J(!1)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
            <${Xe} size=${17} /> Close
          </button>
        </div>
      </div>
      ${l?r`<div className="w-full max-w-4xl mb-4 bg-emerald-500/10 text-emerald-700 p-3 rounded font-bold text-sm text-center">${l}</div>`:""}
      <div className="w-full max-w-4xl">
        ${U(I)}
      </div>
    </div>
  `}
  </div>`}const da={name:"",hsn:"",unit:"pcs",category:"",barcode:"",salePrice:"",purchasePrice:"",taxRate:"",stock:"",lowStock:"",files:[]},qa=["purchasePrice","salePrice","taxRate","stock","lowStock"],br=["name","category","barcode","hsn","unit","purchasePrice","salePrice","taxRate","stock","lowStock"],fa=["pcs","box","kg","g","ltr","ml","medium","feet","roll","bundle","bag","packet","carton","dozen","set","pair","job","service"],Wt={name:"Product name (Example: LED Bulb 12W)",category:"Category (Electrical / Grocery / Service)",barcode:"Barcode / SKU code",hsn:"HSN / SAC code",unit:"Select unit",purchasePrice:"Purchase price",salePrice:"Sale price",taxRate:"GST / Tax %",stock:"Opening stock quantity",lowStock:"Low stock alert limit"},Ot=e=>{const a=$=>{for(const h of Object.keys(e)){const N=h.trim().toLowerCase();if($.some(S=>N===S||N.includes(S)))return e[h]}return""},o=a(["product name","item name","name","title","product","item"])||"",t=a(["hsn","sac","hsn/sac","code"])||"",n=a(["unit","uom","measure"])||"pcs",c=a(["category","group","type"])||"",m=a(["barcode","sku","upc","serial"])||"",d=parseFloat(String(a(["sale price","sale_price","price","rate","mrp"])||"").replace(/[^\d.]/g,""))||"",l=parseFloat(String(a(["purchase price","purchase_price","cost","buy price"])||"").replace(/[^\d.]/g,""))||"",u=parseFloat(String(a(["tax rate","tax","gst","tax%","gst%"])||"").replace(/[^\d.]/g,""))||"",y=parseFloat(String(a(["stock","qty","quantity","opening stock"])||"").replace(/[^\d.]/g,""))||"",k=parseFloat(String(a(["low stock","min stock","alert"])||"").replace(/[^\d.]/g,""))||25;return{name:String(o).trim(),hsn:String(t).trim(),unit:String(n).trim().toLowerCase()||"pcs",category:String(c).trim(),barcode:String(m).trim(),salePrice:isNaN(d)?"":d,purchasePrice:isNaN(l)?"":l,taxRate:isNaN(u)?"":u,stock:isNaN(y)?"":y,lowStock:isNaN(k)?25:k}},gr=e=>{const a=e.split(/\r?\n/).map(d=>d.trim()).filter(Boolean);if(a.length===0)return[];const o=a[0];let t=",";o.includes("	")?t="	":o.includes(";")&&(t=";");const n=d=>{const l=[];let u=!1,y="";for(let k=0;k<d.length;k++){const $=d[k];$==='"'||$==="'"?u=!u:$===t&&!u?(l.push(y.trim()),y=""):y+=$}return l.push(y.trim()),l},c=n(a[0]).map(d=>d.toLowerCase().replace(/["']/g,"").trim()),m=[];for(let d=1;d<a.length;d++){const l=n(a[d]);if(l.length===0||!l.some(Boolean))continue;const u={};c.forEach((k,$)=>{u[k]=l[$]||""});const y=Ot(u);y.name&&m.push(y)}return m},hr=async e=>{try{const a=await e.arrayBuffer(),o=ht.read(a,{type:"array"}),t=o.SheetNames[0],n=o.Sheets[t],c=ht.utils.sheet_to_json(n,{defval:""});if(c&&c.length>0&&typeof c[0]=="object"&&!Array.isArray(c[0])){const d=c.map(l=>Ot(l)).filter(l=>l.name&&l.name.trim().length>0);if(d.length>0)return d}const m=ht.utils.sheet_to_json(n,{header:1,defval:""});if(m&&m.length>1){const d=m[0].map(u=>String(u||"").trim().toLowerCase()),l=[];for(let u=1;u<m.length;u++){const y=m[u];if(!y||y.length===0||!y.some(Boolean))continue;const k={};y.forEach((h,N)=>{const S=d[N]||`col_${N}`;k[S]=h});const $=Ot(k);$.name&&l.push($)}if(l.length>0)return l}throw new Error('No products found in Excel sheet. Ensure columns like "Product Name" or "Name" exist.')}catch(a){throw new Error("Excel parsing failed: "+a.message)}},fr=async e=>{const a=e.name.toLowerCase();if(a.endsWith(".csv")||a.endsWith(".txt")||e.type==="text/csv"||e.type==="text/plain"){const o=await e.text();return gr(o)}if(a.endsWith(".json")||e.type==="application/json"){const o=await e.text();try{const t=JSON.parse(o);return(Array.isArray(t)?t:t.items||t.products||[]).map(c=>Ot(c))}catch(t){throw new Error("Invalid JSON format: "+t.message)}}if(a.endsWith(".xls")||a.endsWith(".xlsx"))return await hr(e);if(a.endsWith(".pdf")){if(!window.genmb?.docs?.parse)throw new Error("Document AI is currently offline or loading. Please use CSV, Excel, or JSON format instead.");let o;try{o=await window.genmb.docs.parse(e,"generic")}catch(n){throw new Error("Document AI failed to parse PDF: "+n.message)}if(!o)throw new Error("Document AI returned an empty response. Try CSV, Excel, or JSON format instead.");let t=[];if(o.tables&&Array.isArray(o.tables)&&o.tables.length>0)for(const n of o.tables){const c=n.rows||[];if(c.length===0)continue;const m=c.map(d=>(Array.isArray(d)?d:d.cells||d.values||[]).map(u=>typeof u=="string"?u:u&&typeof u=="object"&&(u.text||u.value)||""));if(m.length>0){const d=m[0].map(l=>String(l||"").trim().toLowerCase());for(let l=1;l<m.length;l++){const u=m[l];if(u.length===0||!u.some(Boolean))continue;const y={};u.forEach(($,h)=>{const N=d[h]||`col_${h}`;y[N]=$});const k=Ot(y);k.name&&t.push(k)}}}if(t.length===0&&o.text){const n=o.text.split(`
`).map(c=>c.trim()).filter(Boolean);for(const c of n){const m=c.split(/[,\t|]|\s{2,}/).map(l=>l.trim()).filter(Boolean),d=c.toLowerCase();if(!(d.includes("product name")||d.includes("item name")||d.includes("price list")||d.includes("rate list"))&&m.length>=2&&m[0].length>1){const l=m[0];let u="",y="pcs",k="",$="",h="",N="",S="Imported";const I=m.slice(1),C=[];I.forEach(w=>{const J=w.toLowerCase();if(fa.includes(J))y=J;else if(w.includes("%")){const x=parseFloat(w.replace(/[^\d.]/g,""));isNaN(x)||(h=x)}else{const x=w.replace(/[^\d.]/g,""),j=parseFloat(x);isNaN(j)?w.length>2&&!u&&!w.includes(" ")&&(S=w):C.push({raw:w,num:j})}}),C.length>0&&C.forEach((w,J)=>{const x=w.num,j=w.raw;J===0&&j.length>=4&&j.length<=8&&!j.includes(".")&&/^\d+$/.test(j)?u=j:!$&&!k?k=x:k&&!$?x<k?$=x:($=k,k=x):N||(N=x)}),t.push({name:l,hsn:u,unit:y,category:S,barcode:"",salePrice:k||"",purchasePrice:$||"",taxRate:h||"",stock:N||"",lowStock:25})}}}if(t=t.filter(n=>n.name&&n.name.trim().length>0),t.length>0)return t;throw new Error("No products could be extracted from the PDF. Check that the PDF contains a list of products.")}throw new Error("Please upload a CSV, JSON, PDF, or Excel file. (Note: Document AI is used for PDF and Excel parsing).")};function vr(){const e=X(s=>s.items),a=X(s=>s.invoices),o=X(s=>s.customers),t=X(s=>s.settings),n=X(s=>s.addItem),c=X(s=>s.updateItem),m=X(s=>s.deleteItem),[d,l]=b.useState(da),[u,y]=b.useState(""),[k,$]=b.useState(""),[h,N]=b.useState(""),[S,I]=b.useState(""),[C,w]=b.useState(""),[J,x]=b.useState([]),[j,W]=b.useState(!1),[L,H]=b.useState(""),[A,re]=b.useState(""),ee=b.useRef(null),ae=b.useMemo(()=>{const s=new Set;return e.forEach(i=>{i.category&&i.category.trim()&&s.add(i.category.trim())}),Array.from(s)},[e]),g=b.useMemo(()=>{if(!C.trim())return e;const s=C.toLowerCase().trim();return e.filter(i=>String(i.name||"").toLowerCase().includes(s)||String(i.category||"").toLowerCase().includes(s)||String(i.barcode||"").toLowerCase().includes(s)||String(i.hsn||"").toLowerCase().includes(s)).sort((i,f)=>{const D=String(i.name||"").toLowerCase().startsWith(s)||String(i.category||"").toLowerCase().startsWith(s),R=String(f.name||"").toLowerCase().startsWith(s)||String(f.category||"").toLowerCase().startsWith(s);return D&&!R?-1:!D&&R?1:0})},[e,C]),U=b.useMemo(()=>{if(!S)return[];const s=e.find(i=>i.id===S);return s?a.flatMap(i=>(i.items||[]).filter(f=>f.itemId&&f.itemId===s.id||!f.itemId&&String(f.name||"").trim().toLowerCase()===String(s.name||"").trim().toLowerCase()).map(f=>{const D=Number(f.qty||0),R=Number(f.price||0),B=D*R,Pe=o.find(Ie=>Ie.id===i.customerId),ke=Le(i);return{id:`${i.id}_${f.itemId||f.name}`,date:i.date,number:i.number,party:Pe?.name||"Walk-in / Cash",qty:D,unit:f.unit||s.unit||"pcs",rate:R,amount:B,invoiceTotal:ke.total,status:i.status||"-"}})):[]},[S,e,a,o]),p=e.find(s=>s.id===S),K=U.reduce((s,i)=>s+i.qty,0),G=U.reduce((s,i)=>s+i.amount,0),q=()=>{if(!d.name.trim()){N("Product name enter pannunga."),$("");return}const s=u?(c(u,d),u):n({...d,lowStock:d.lowStock===""?25:d.lowStock});I(s),l(da),y(""),N(""),$("")},se=s=>{y(s.id),l({...da,...s,files:s.files||[]}),I(s.id),$(""),N("")},pe=s=>{m(s.id),S===s.id&&I("")},$e=s=>{s.key==="Enter"&&(s.preventDefault(),q())},de=async s=>{const i=s.target.files?.[0];if(i){re(""),H(""),W(!0);try{const f=await fr(i);if(f.length===0)throw new Error("No valid products found in the file.");x(f),H(`Parsed ${f.length} products successfully. Review below and import!`)}catch(f){re(f.message||"File parse panna mudiyala. Confirm formats.")}finally{W(!1),s.target.value=""}}},ue=(s,i,f)=>{x(D=>D.map((R,B)=>B===s?{...R,[i]:f}:R))},_e=s=>{x(i=>i.filter((f,D)=>D!==s))},je=()=>{W(!0),re(""),H("");try{let s=0;for(const i of J)!i.name||!i.name.trim()||(n(i),s++);H(`${s} products successfully added to your list!`),x([])}catch(s){re("Import failed: "+s.message)}finally{W(!1)}};return r`<div className="grid gap-5 lg:grid-cols-3">
    <div className="flex flex-col gap-5">
      <!-- MAIN PRODUCT FORM -->
      <div className="card p-5">
        <h3 className="text-lg font-black">${u?"Edit Product":"Add New Product"}</h3>
        ${k?r`<p className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">${k}</p>`:""}
        ${h?r`<p className="mt-3 rounded bg-red-500/10 p-2 text-xs font-bold text-red-600">${h}</p>`:""}
        <div className="mt-4 grid gap-3" onKeyDown=${$e}>
          <input value=${d.name} onInput=${s=>l({...d,name:s.target.value})} placeholder=${Wt.name} aria-label="Product name" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <div className="grid grid-cols-2 gap-2">
            ${br.filter(s=>s!=="name").map(s=>{if(s==="unit")return r`<select key=${s} value=${d.unit||"pcs"} onChange=${i=>l({...d,unit:i.target.value})} aria-label="Product unit" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  <option value="">${Wt.unit}</option>
                  ${fa.map(i=>r`<option key=${i} value=${i}>${i}</option>`)}
                </select>`;if(s==="category"){const i=d.category||"",f=["ELECTRICAL","HARDWARE","PLUMBING",""].includes(i.toUpperCase());return r`<div key=${s} className="relative flex flex-col col-span-2 gap-2">
                  <select 
                    value=${f?i.toUpperCase():"CUSTOM"} 
                    onChange=${D=>{const R=D.target.value;l(R==="CUSTOM"?{...d,category:"NEW CATEGORY"}:{...d,category:R})}} 
                    aria-label="Product category" 
                    className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
                  >
                    <option value="">Select Category</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="CUSTOM">Other / Custom Category...</option>
                  </select>
                  ${!f&&r`<input 
                    value=${i} 
                    onInput=${D=>l({...d,category:D.target.value})} 
                    placeholder="Enter custom category" 
                    className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" 
                  />`}
                </div>`}else return r`<input key=${s} type=${qa.includes(s)?"number":"text"} value=${d[s]} onInput=${i=>l({...d,[s]:qa.includes(s)?i.target.value===""?"":Number(i.target.value):i.target.value})} placeholder=${Wt[s]} aria-label=${Wt[s]} className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />`})}
          </div>
          <button onClick=${q} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white">
            <${u?$t:Ze} size=${18} /> ${u?"Update Product":"Add Product"}
          </button>
        </div>
      </div>

      <!-- BULK PRODUCT IMPORT CARD -->
      <div className="card p-5">
        <h3 className="text-lg font-black">Bulk Import Products</h3>
        
        ${L?r`<div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700">
          <${it} size=${16} className="shrink-0" />
          <span>${L}</span>
        </div>`:""}
        
        ${A?r`<div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-red-500/10 p-3 text-xs font-bold text-red-600">
          <${He} size=${16} className="shrink-0" />
          <span>${A}</span>
        </div>`:""}

        <div className="mt-4">
          <div onClick=${()=>ee.current?.click()} className="border-2 border-dashed border-[hsl(var(--border))] rounded-[var(--radius-md)] p-6 text-center cursor-pointer hover:bg-[hsl(var(--muted)/0.15)] transition-all">
            <${wt} size=${32} className="mx-auto text-[hsl(var(--muted-foreground))]" />
            <p className="mt-2 text-xs font-bold text-[hsl(var(--foreground))]">Upload Product List</p>
            <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">PDF, Excel, CSV, or JSON</p>
          </div>
          <input ref=${ee} type="file" accept=".pdf,.xls,.xlsx,.csv,.json,.txt" onChange=${de} className="hidden" />
          
          ${j&&r`<div className="mt-4 flex items-center justify-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <${nt} className="animate-spin text-[hsl(var(--primary))]" size={16} />
            <span>Processing document...</span>
          </div>`}

          ${J.length>0&&r`<div className="mt-5 border-t border-[hsl(var(--border))] pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[hsl(var(--foreground))]">Parsed Products (${J.length})</span>
              <button onClick=${()=>x([])} className="text-[10px] font-bold text-red-600 hover:underline">Clear Drafts</button>
            </div>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              ${J.map((s,i)=>r`<div key=${i} className="p-3 border border-[hsl(var(--border))] rounded-md bg-[hsl(var(--muted)/0.1)] space-y-2 relative">
                <div className="flex justify-between items-center border-b border-[hsl(var(--border))] pb-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Draft Item #${i+1}</span>
                  <button onClick=${()=>_e(i)} className="text-[hsl(var(--destructive))] hover:opacity-80" aria-label="Remove item">
                    <${ct} size=${14} />
                  </button>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Product Name</label>
                    <input value=${s.name} onInput=${f=>ue(i,"name",f.target.value)} placeholder="Product Name" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">HSN Code</label>
                      <input value=${s.hsn} onInput=${f=>ue(i,"hsn",f.target.value)} placeholder="HSN" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Unit</label>
                      <select value=${s.unit} onChange=${f=>ue(i,"unit",f.target.value)} className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                        ${fa.map(f=>r`<option key=${f} value=${f}>${f}</option>`)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Purchase</label>
                      <input type="number" value=${s.purchasePrice} onInput=${f=>ue(i,"purchasePrice",f.target.value===""?"":Number(f.target.value))} placeholder="Cost" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Sale</label>
                      <input type="number" value=${s.salePrice} onInput=${f=>ue(i,"salePrice",f.target.value===""?"":Number(f.target.value))} placeholder="Price" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">GST %</label>
                      <input type="number" value=${s.taxRate} onInput=${f=>ue(i,"taxRate",f.target.value===""?"":Number(f.target.value))} placeholder="GST %" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Stock</label>
                      <input type="number" value=${s.stock} onInput=${f=>ue(i,"stock",f.target.value===""?"":Number(f.target.value))} placeholder="Stock" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Category</label>
                      <select 
                        value=${["ELECTRICAL","HARDWARE","PLUMBING",""].includes((s.category||"").toUpperCase())?(s.category||"").toUpperCase():"CUSTOM"} 
                        onChange=${f=>{const D=f.target.value;D==="CUSTOM"?ue(i,"category","NEW CATEGORY"):ue(i,"category",D)}} 
                        className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                      >
                        <option value="">Select Category</option>
                        <option value="ELECTRICAL">ELECTRICAL</option>
                        <option value="HARDWARE">HARDWARE</option>
                        <option value="PLUMBING">PLUMBING</option>
                        <option value="CUSTOM">Custom...</option>
                      </select>
                      ${!["ELECTRICAL","HARDWARE","PLUMBING",""].includes((s.category||"").toUpperCase())&&r`<input 
                        value=${s.category} 
                        onInput=${f=>ue(i,"category",f.target.value)} 
                        placeholder="Enter custom category" 
                        className="w-full mt-1 text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" 
                      />`}
                    </div>
                  </div>
                </div>
              </div>`)}
            </div>
            
            <button onClick=${je} disabled=${j} className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2.5 font-black text-white text-xs">
              <${Ze} size=${14} /> Add Parsed Products to App List
            </button>
          </div>`}
        </div>
      </div>
    </div>

    <!-- PRODUCTS TABLE AND LEDGER WITH SEARCH AND COUNT METRICS -->
    <div className="card overflow-hidden lg:col-span-2 p-5 flex flex-col gap-4">
      <!-- COUNT METRICS ROW -->
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[hsl(var(--muted)/0.3)] p-4 rounded-[var(--radius-md)]">
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] pr-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Total Products</span>
          <span className="text-xl font-black text-[hsl(var(--foreground))]">${e.length}</span>
        </div>
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] px-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Categories</span>
          <span className="text-xl font-black text-[hsl(var(--foreground))]">${ae.length}</span>
        </div>
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] px-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Low Stock Alert</span>
          <span className="text-xl font-black text-red-600">${e.filter(s=>Number(s.stock||0)<=Number(s.lowStock||25)).length}</span>
        </div>
        <div className="text-center sm:text-left pl-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Stock Value</span>
          <span className="text-xl font-black text-emerald-600">
            ${P(e.reduce((s,i)=>s+Number(i.stock||0)*Number(i.salePrice||0),0),t.currency)}
          </span>
        </div>
      </div>

      <!-- SEARCH BAR ROW -->
      <div className="border-b border-[hsl(var(--border))] pb-3 flex items-center justify-start">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[hsl(var(--muted-foreground))]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            value=${C} 
            onInput=${s=>w(s.target.value)} 
            placeholder="Search name, category, barcode..." 
            className="focus-ring pl-11 pr-8 py-2 w-full text-xs rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] placeholder-[hsl(var(--muted-foreground))] font-medium transition-all" 
          />
          ${C&&r`<button onClick=${()=>w("")} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <${Xe} size=${14} />
          </button>`}
        </div>
      </div>

      <!-- COMPACT VERTICALLY & HORIZONTALLY SCROLLABLE PRODUCT LIST TABLE -->
      <div className="overflow-auto max-h-[500px] border border-[hsl(var(--border))] rounded-[var(--radius-md)] relative bg-[hsl(var(--card))]">
        <table className="w-full min-w-[920px] text-xs border-collapse">
          <thead className="sticky top-0 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] text-left uppercase text-[hsl(var(--muted-foreground))] z-10 font-bold">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap">Product</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
              <th className="py-2.5 px-3 whitespace-nowrap">HSN</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Stock</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Purchase</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Sale</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">GST</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Ledger</th>
              <th className="py-2.5 px-3 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            ${g.map(s=>r`<tr key=${s.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.15)] bg-[hsl(var(--card))]">
              <td className="py-2.5 px-3 font-black">
                ${s.name||"-"}
                ${Number(s.stock||0)<=Number(s.lowStock||25)?r`<span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black text-red-700">LOW</span>`:""}
              </td>
              <td className="py-2.5 px-3 text-[11px]">${s.category||"-"}</td>
              <td className="py-2.5 px-3 text-[11px]">${s.hsn||"-"}</td>
              <td className="py-2.5 px-3 text-[11px]">
                <span className="font-bold">${s.stock??0}</span> ${s.unit||"pcs"}
                <div className="text-[9px] text-[hsl(var(--muted-foreground))]">Limit: ${s.lowStock||25}</div>
              </td>
              <td className="py-2.5 px-3 text-right text-[11px]">${P(s.purchasePrice,t.currency)}</td>
              <td className="py-2.5 px-3 text-right font-bold text-[11px] text-[hsl(var(--primary))]">${P(s.salePrice,t.currency)}</td>
              <td className="py-2.5 px-3 text-right text-[11px]">${s.taxRate||0}%</td>
              <td className="py-2.5 px-3 text-right">
                <button onClick=${()=>I(S===s.id?"":s.id)} className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] px-2.5 py-0.5 text-[10px] font-black text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.05] transition-all" aria-label=${`Open ledger for ${s.name}`}>
                  <${ts} size=${12} /> Ledger
                </button>
              </td>
              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                <button onClick=${()=>se(s)} className="mr-2.5 text-[hsl(var(--primary))] hover:opacity-80" aria-label=${`Edit ${s.name}`}><${ea} size=${14} /></button>
                <button onClick=${()=>pe(s)} className="text-[hsl(var(--destructive))] hover:opacity-80" aria-label=${`Delete ${s.name}`}><${ct} size=${14} /></button>
              </td>
            </tr>`)}
          </tbody>
        </table>
        ${g.length===0?r`<p className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">No products found.</p>`:""}
      </div>

      <!-- LEDGER DETAILS CONTAINER WITH COMPACT MAX HEIGHT -->
      ${p?r`<div className="border-t border-[hsl(var(--border))] pt-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-black text-sm">Product Ledger - ${p.name}</h3>
          <div className="flex flex-wrap gap-2 text-[10px] font-black">
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Sold: ${K} ${p.unit||"pcs"}</span>
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Value: ${P(G,t.currency)}</span>
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Stock: ${p.stock??0} ${p.unit||"pcs"}</span>
          </div>
        </div>
        <div className="overflow-auto max-h-[250px] border border-[hsl(var(--border))] rounded-[var(--radius-md)] relative bg-[hsl(var(--card))]">
          <table className="w-full min-w-[700px] text-xs border-collapse">
            <thead className="sticky top-0 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] text-left uppercase text-[hsl(var(--muted-foreground))] z-10 font-bold">
              <tr>
                <th className="py-2 px-2.5 whitespace-nowrap">Date</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Invoice</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Party</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Qty</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Rate</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Amount</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              ${U.map(s=>r`<tr key=${s.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.1)] bg-[hsl(var(--card))]">
                <td className="py-2 px-2.5 text-[11px]">${s.date||"-"}</td>
                <td className="py-2 px-2.5 font-bold text-[11px]">${s.number||"-"}</td>
                <td className="py-2 px-2.5 text-[11px]">${s.party}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${s.qty} ${s.unit}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${P(s.rate,t.currency)}</td>
                <td className="py-2 px-2.5 text-right font-bold text-[11px]">${P(s.amount,t.currency)}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${s.status}</td>
              </tr>`)}
            </tbody>
          </table>
          ${U.length===0?r`<p className="p-6 text-center text-xs text-[hsl(var(--muted-foreground))]">No ledger records for this product.</p>`:""}
        </div>
      </div>`:""}
    </div>
  </div>`}function xr(){const e=X(d=>d.settings),[a,o]=b.useState(()=>JSON.parse(localStorage.getItem("sma-expenses")||"[]")),[t,n]=b.useState({date:Ke(),category:"",vendor:"",amount:"",notes:""}),c=()=>{if(!t.category.trim()||Number(t.amount||0)<=0)return alert("Please enter expense category and amount.");const d=[{...t,amount:Number(t.amount||0),id:`exp_${Date.now()}`},...a];o(d),localStorage.setItem("sma-expenses",JSON.stringify(d)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),n({date:Ke(),category:"",vendor:"",amount:"",notes:""})},m=a.reduce((d,l)=>d+Number(l.amount||0),0);return r`
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="card p-5">
        <h3 className="flex items-center gap-2 text-lg font-black"><${Zt} size=${19} /> Add Expense</h3>
        <div className="mt-4 space-y-3">
          <input type="date" value=${t.date} onInput=${d=>n({...t,date:d.target.value})} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input value=${t.category} onInput=${d=>n({...t,category:d.target.value})} placeholder="Category (Rent, Transport, Salary...)" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input value=${t.vendor} onInput=${d=>n({...t,vendor:d.target.value})} placeholder="Paid to / Vendor" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input type="number" value=${t.amount} onInput=${d=>n({...t,amount:d.target.value===""?"":Number(d.target.value)})} placeholder="Amount" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <textarea value=${t.notes} onInput=${d=>n({...t,notes:d.target.value})} placeholder="Notes" className="focus-ring min-h-24 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3"></textarea>
          <button onClick=${c} className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${Ze} size=${18} /> Save Expense</button>
        </div>
      </div>
      <div className="card overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Expenses Register</h3><p className="text-lg font-black text-[hsl(var(--primary))]">${P(m,e.currency)}</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Date</th><th className="p-4">Category</th><th className="p-4">Vendor</th><th className="p-4">Notes</th><th className="p-4 text-right">Amount</th></tr></thead><tbody>${a.map(d=>r`<tr key=${d.id} className="border-t border-[hsl(var(--border))]"><td className="p-4">${d.date}</td><td className="p-4 font-black">${d.category}</td><td className="p-4">${d.vendor||"-"}</td><td className="p-4">${d.notes||"-"}</td><td className="p-4 text-right font-black">${P(d.amount,e.currency)}</td></tr>`)}</tbody></table>${a.length===0?r`<p className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No expenses added yet.</p>`:""}</div>
      </div>
    </div>`}function yr(){const e=X(u=>u.invoices),a=X(u=>u.customers),o=X(u=>u.items),t=X(u=>u.settings),n=e.reduce((u,y)=>u+Le(y).total,0),c=e.reduce((u,y)=>u+Le(y).tax,0),m=e.reduce((u,y)=>u+Le(y).balance,0),d=e.slice(0,8),l=[{label:"Sales Value",value:P(n,t.currency),icon:Dt},{label:"GST Collected",value:P(c,t.currency),icon:Zt},{label:"Outstanding",value:P(m,t.currency),icon:$a},{label:"Parties / Products",value:`${a.length} / ${o.length}`,icon:Qt}];return r`
    <div className="space-y-5">
      <div className="no-print flex justify-end"><button onClick=${()=>window.print()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white"><${et} size=${17} /> Print Report</button></div>
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <${pt} settings=${t} title="Sales & GST Report" />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 no-print">${l.map(u=>{const y=u.icon;return r`<div key=${u.label} className="card p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))]">${u.label}</p><p className="mt-2 text-2xl font-black">${u.value}</p></div><div className="text-[hsl(var(--primary))]"><${y} size=${28} /></div></div></div>`})}</section>
        <section className="sma-info-grid"><div><h3>REPORT SUMMARY</h3><p><b>Sales Value:</b> ${P(n,t.currency)}</p><p><b>GST Collected:</b> ${P(c,t.currency)}</p></div><div><h3>BALANCE SUMMARY</h3><p><b>Outstanding:</b> ${P(m,t.currency)}</p><p><b>Parties / Products:</b> ${a.length} / ${o.length}</p></div></section>
        <table className="sma-items-table"><thead><tr><th>Invoice</th><th>Date</th><th>Status</th><th>Tax</th><th>Total</th><th>Balance</th></tr></thead><tbody>${d.map(u=>{const y=Le(u);return r`<tr key=${u.id}><td className="sma-strong">${u.number}</td><td>${u.date}</td><td>${u.status}</td><td>${mt(u,u.items[0]||{})}% (${P(y.tax,t.currency)})</td><td className="sma-strong">${P(y.total,t.currency)}</td><td>${P(y.balance,t.currency)}</td></tr>`})}</tbody></table>
        <footer className="sma-sign-row"><div>Prepared By</div><div>Authorized Signature</div></footer>
      </article>
    </div>`}const zt="https://kvdb.io";async function kt(e){const a=new TextEncoder().encode(e.trim().toLowerCase()),o=await crypto.subtle.digest("SHA-256",a);return Array.from(new Uint8Array(o)).map(c=>c.toString(16).padStart(2,"0")).join("")}function Pa(e){return btoa(unescape(encodeURIComponent(e||"")))}function Ea(e){try{return decodeURIComponent(escape(atob(e||"")))}catch{return""}}const It=e=>{try{return JSON.parse(localStorage.getItem(e)||"[]")}catch{return[]}};let At={};async function Ft(e){if(!e||!e.includes("@"))return"sma_billing_fallback_v1";const a=e.trim().toLowerCase();if(At[a])return At[a];const o=await kt(a),t=`sma_cloud_sync_bucket_${o}`,n=localStorage.getItem(t);if(n&&n.length>=10&&n.length<=25)return At[a]=n,n;const c=`https://api.keyvalue.xyz/smabillingv1_${o}/bucket_id`;try{const m=await fetch(c);if(m.ok){const l=(await m.text()).trim();if(l&&l.length>=10&&l.length<=25)return localStorage.setItem(t,l),At[a]=l,l}}catch(m){console.warn("[CloudSync] Discovery registry fetch failed, trying creation...",m)}try{const m=await fetch(`${zt}/`,{method:"POST"});if(m.ok){const d=(await m.text()).trim();if(d&&d.length>=10)return await fetch(`https://api.keyvalue.xyz/smabillingv1_${o}/bucket_id`,{method:"POST",body:d}),localStorage.setItem(t,d),At[a]=d,d}}catch(m){console.error("[CloudSync] Failed to register or create a new kvdb.io bucket:",m)}return"sma_billing_fallback_v1"}function Ia(){const e=X.getState();return{store:{customers:e.customers,items:e.items,invoices:e.invoices,settings:e.settings},estimates:It("sma-estimates-v1"),expenses:It("sma-expenses"),purchaseOrders:It("sma-purchase-orders"),quickNotes:It("sma-quick-notes"),fontSettings:It("sma-global-font-settings-v1"),customTemplate:localStorage.getItem("sma-custom-invoice-template")||"",templateChoice:localStorage.getItem("sma-invoice-template-choice")||"",secureAccount:localStorage.getItem("sma-secure-account-v1")||"",lastUpdated:Number(localStorage.getItem("sma-last-updated-at")||Date.now())}}function va(e){return!e||!e.store?!1:(X.getState().importData(e.store),Array.isArray(e.estimates)&&localStorage.setItem("sma-estimates-v1",JSON.stringify(e.estimates)),Array.isArray(e.expenses)&&localStorage.setItem("sma-expenses",JSON.stringify(e.expenses)),Array.isArray(e.purchaseOrders)&&localStorage.setItem("sma-purchase-orders",JSON.stringify(e.purchaseOrders)),Array.isArray(e.quickNotes)&&localStorage.setItem("sma-quick-notes",JSON.stringify(e.quickNotes)),e.fontSettings&&typeof e.fontSettings=="object"&&!Array.isArray(e.fontSettings)&&localStorage.setItem("sma-global-font-settings-v1",JSON.stringify(e.fontSettings)),e.customTemplate!==void 0&&(e.customTemplate?localStorage.setItem("sma-custom-invoice-template",e.customTemplate):localStorage.removeItem("sma-custom-invoice-template")),e.templateChoice&&localStorage.setItem("sma-invoice-template-choice",e.templateChoice),e.secureAccount&&localStorage.setItem("sma-secure-account-v1",typeof e.secureAccount=="object"?JSON.stringify(e.secureAccount):String(e.secureAccount)),localStorage.setItem("sma-last-updated-at",String(e.lastUpdated||Date.now())),localStorage.setItem("sma-last-sync-time",String(Date.now())),localStorage.setItem("sma-last-sync-status","success"),X.persist.rehydrate(),window.dispatchEvent(new CustomEvent("sma-billing-live-refresh",{detail:{at:Date.now()}})),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),!0)}async function qt(e){if(!e||!e.includes("@")||!navigator.onLine)return!1;try{const a=await kt(e),o=Ia(),t=Date.now();o.lastUpdated=t,localStorage.setItem("sma-last-updated-at",String(t));let n=!1;if(window.genmb?.db?.set)try{await window.genmb.db.set(`sma_workspace_${a}`,JSON.stringify(o)),n=!0}catch(m){console.warn("[CloudSync] GenMB DB upload failed:",m)}let c=null;try{const m=new Blob([JSON.stringify(o)],{type:"application/json"}),d=new FormData;d.append("file",m,"sma_backup.json");const l=await fetch("/api/storage/upload",{method:"POST",body:d});l.ok&&(c=(await l.json()).url,c&&window.genmb?.db?.set&&(await window.genmb.db.set(`sma_backup_url_${a}`,c),n=!0))}catch(m){console.warn("[CloudSync] GCS upload failed:",m)}try{const m=await Ft(e),d=Pa(JSON.stringify(o));(await fetch(`${zt}/${m}/${a}`,{method:"POST",body:d})).ok&&(n=!0)}catch(m){console.warn("[CloudSync] kvdb upload fallback failed:",m)}if(n||c)return localStorage.setItem("sma-last-sync-time",String(t)),localStorage.setItem("sma-last-sync-status","success"),window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"success"}})),!0;throw new Error("All cloud storage layers failed to sync.")}catch(a){return console.warn("[CloudSync] Upload failed:",a),localStorage.setItem("sma-last-sync-status","error"),window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"error"}})),!1}}async function hs(e){if(!e||!e.includes("@")||!navigator.onLine)return null;const a=await kt(e);if(window.genmb?.db?.get)try{const o=await window.genmb.db.get(`sma_workspace_${a}`);if(o)return JSON.parse(o)}catch(o){console.warn("[CloudSync] GenMB DB download failed:",o)}if(window.genmb?.db?.get)try{const o=await window.genmb.db.get(`sma_backup_url_${a}`);if(o){const t=await fetch(o);if(t.ok)return await t.json()}}catch(o){console.warn("[CloudSync] GCS URL fetch failed:",o)}try{const o=await Ft(e),t=await fetch(`${zt}/${o}/${a}`);if(t.status===200){const n=await t.text();if(n){const c=Ea(n);if(c)return JSON.parse(c)}}}catch(o){console.warn("[CloudSync] kvdb download fallback failed:",o)}return null}async function Rt(e,a){if(!e||!e.includes("@"))return!1;const o=await kt(e);let t=!1;if(window.genmb?.db?.set)try{await window.genmb.db.set(`sma_sec_${o}`,JSON.stringify(a)),t=!0}catch(n){console.warn("[CloudSync] GenMB DB save security account failed:",n)}if(navigator.onLine)try{const n=await Ft(e),c=Pa(JSON.stringify(a));(await fetch(`${zt}/${n}/sec_${o}`,{method:"POST",body:c})).ok&&(t=!0)}catch(n){console.warn("[CloudSync] kvdb save security account failed:",n)}return t}async function xa(e){if(!e||!e.includes("@"))return null;const a=await kt(e);if(window.genmb?.db?.get)try{const o=await window.genmb.db.get(`sma_sec_${a}`);if(o)return JSON.parse(o)}catch(o){console.warn("[CloudSync] GenMB DB fetch security account failed:",o)}if(navigator.onLine)try{const o=await Ft(e),t=await fetch(`${zt}/${o}/sec_${a}`);if(t.status===200){const n=await t.text();if(n){const c=Ea(n);if(c)return JSON.parse(c)}}}catch(o){console.warn("[CloudSync] kvdb fetch security account failed:",o)}return null}function aa(e=[],a=[]){const o=new Map,t=n=>String(n.id||n.name||"").trim().toLowerCase();return a.forEach(n=>{n&&o.set(t(n),n)}),e.forEach(n=>{if(n){const c=t(n),m=o.get(c);if(m){const d=Number(n.updatedAt||0),l=Number(m.updatedAt||0);d>=l&&o.set(c,{...m,...n})}else o.set(c,n)}}),Array.from(o.values())}function sa(e=[],a=[]){const o=new Map,t=n=>n.barcode&&String(n.barcode).trim()?`bc_${String(n.barcode).trim().toLowerCase()}`:`nm_${String(n.name||n.id||"").trim().toLowerCase()}`;return a.forEach(n=>{n&&o.set(t(n),n)}),e.forEach(n=>{if(n){const c=t(n),m=o.get(c);if(m){const d=Number(n.updatedAt||0),l=Number(m.updatedAt||0);d>=l&&o.set(c,{...m,...n})}else o.set(c,n)}}),Array.from(o.values())}function ra(e=[],a=[]){const o=new Map,t=n=>String(n.number||n.id||"").trim().toLowerCase();return a.forEach(n=>{n&&o.set(t(n),n)}),e.forEach(n=>{if(n){const c=t(n),m=o.get(c);if(m){const d=Number(n.updatedAt||0),l=Number(m.updatedAt||0);d>=l&&o.set(c,{...m,...n})}else o.set(c,n)}}),Array.from(o.values())}function ot(e=[],a=[],o="id"){const t=new Map,n=c=>String(c[o]||c.number||c.id||"").trim().toLowerCase();return a.forEach(c=>{c&&t.set(n(c),c)}),e.forEach(c=>{if(c){const m=n(c),d=t.get(m);if(d){const l=Number(c.updatedAt||0),u=Number(d.updatedAt||0);l>=u&&t.set(m,{...d,...c})}else t.set(m,c)}}),Array.from(t.values())}async function Aa(e,a={}){if(!e||!e.includes("@"))return{success:!1,reason:"Invalid email"};if(!navigator.onLine)return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"offline"}})),{success:!1,reason:"Offline"};if(!(localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false")&&!a.forceUpload&&!a.forceDownload)return{success:!1,reason:"Auto-sync is disabled"};window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"syncing"}}));const{forceUpload:t=!1,forceDownload:n=!1}=a;try{if(t){const j=await qt(e);return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:j?"success":"error"}})),{success:j,action:"upload"}}const c=await hs(e);if(n&&c){const j=va(c);return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:j?"success":"error"}})),{success:j,action:"download"}}if(!c){const j=await qt(e);return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:j?"success":"error"}})),{success:j,action:"upload"}}const m=Ia(),d={customers:aa(m.store?.customers||[],c.store?.customers||[]),items:sa(m.store?.items||[],c.store?.items||[]),invoices:ra(m.store?.invoices||[],c.store?.invoices||[]),settings:{...c.store?.settings||{},...m.store?.settings||{}}},l=ot(m.estimates||[],c.estimates||[],"id"),u=ot(m.expenses||[],c.expenses||[],"id"),y=ot(m.purchaseOrders||[],c.purchaseOrders||[],"id"),k=ot(m.quickNotes||[],c.quickNotes||[],"id"),$=Number(localStorage.getItem("sma-last-updated-at")||"0"),h=Number(c.lastUpdated||"0");if($===h&&$>0)return localStorage.setItem("sma-last-sync-status","success"),window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"success"}})),{success:!0,action:"none"};const N=$>=h?m.fontSettings||c.fontSettings:c.fontSettings||m.fontSettings,S=$>=h?m.customTemplate||c.customTemplate:c.customTemplate||m.customTemplate,I=$>=h?m.templateChoice||c.templateChoice:c.templateChoice||m.templateChoice,C=$>=h?m.secureAccount||c.secureAccount:c.secureAccount||m.secureAccount,w=Math.max($,h,Date.now()),x=va({store:d,estimates:l,expenses:u,purchaseOrders:y,quickNotes:k,fontSettings:N,customTemplate:S,templateChoice:I,secureAccount:C,lastUpdated:w});if($>h){const j=await qt(e);return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:j&&x?"success":"error"}})),{success:j&&x,action:"merge-upload"}}else return window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:x?"success":"error"}})),{success:x,action:"merge-download"}}catch(c){return console.warn("[CloudSync] Sync cycle error:",c),localStorage.setItem("sma-last-sync-status","error"),window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"error"}})),{success:!1,reason:c.message}}}let ca=null;function fs(e){localStorage.setItem("sma-last-updated-at",String(Date.now())),localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false"&&(!e||!e.includes("@")||navigator.onLine&&(ca&&clearTimeout(ca),ca=setTimeout(async()=>{console.log("[CloudSync] Auto-Syncing changes to cloud..."),window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:"syncing"}}));const o=await Aa(e);window.dispatchEvent(new CustomEvent("sma-cloud-sync-status",{detail:{state:o.success?"success":"error"}}))},2500)))}const st=Object.freeze(Object.defineProperty({__proto__:null,dec:Ea,downloadFromCloud:hs,enc:Pa,fetchSecurityAccountFromCloud:xa,getUserBucketId:Ft,mergeCustomers:aa,mergeInvoices:ra,mergeProducts:sa,mergeSimple:ot,packLocalWorkspace:Ia,saveSecurityAccountToCloud:Rt,sha256:kt,syncWorkspace:Aa,triggerAutoSync:fs,unpackAndRestoreWorkspace:va,uploadToCloud:qt},Symbol.toStringTag,{value:"Module"})),vs="sma-secure-account-v1",wr="sma-global-font-settings-v1",Tt=e=>{try{return btoa(unescape(encodeURIComponent(e||"")))}catch{return e||""}},tt=e=>{try{return decodeURIComponent(escape(atob(e||"")))}catch{return""}},Lt=()=>{try{return JSON.parse(localStorage.getItem(vs)||"{}")}catch{return{}}},Va=e=>{try{return JSON.parse(localStorage.getItem(e)||"[]")}catch{return[]}};function $r(){const e=X(v=>v.settings),a=X(v=>v.updateSettings),o=X(v=>v.importData),{user:t,authBusy:n,authError:c,authMessage:m,sendEmailLink:d}=St(),[l,u]=b.useState("business"),[y,k]=b.useState(""),[$,h]=b.useState(Lt),[N,S]=b.useState(()=>{const v=Lt();return{email:v.email||"",password:tt(v.password)||"",mobile:tt(v.mobile)||"",code:tt(v.code)||"",verifyMobile:"",newPassword:"",newEmail:"",newMobile:"",verifyCode:""}}),[I,C]=b.useState({type:"",text:""}),[w,J]=b.useState({fontFamily:e.fontFamily||"Inter",fontSize:e.fontSize||"Medium",fontWeight:e.fontWeight||"Normal"}),[x,j]=b.useState({type:"",text:""}),[W,L]=b.useState(()=>localStorage.getItem("sma-custom-invoice-template")||""),[H,A]=b.useState(!1),[re,ee]=b.useState(""),[ae,g]=b.useState(""),[U,p]=b.useState(null),[K,G]=b.useState(!1),[q,se]=b.useState({type:"",text:""}),[pe,$e]=b.useState(()=>localStorage.getItem("sma-last-sync-time")),[de,ue]=b.useState(()=>localStorage.getItem("sma-last-sync-status")||"idle"),[_e,je]=b.useState(navigator.onLine),[s,i]=b.useState(()=>{const v=localStorage.getItem("sma-auto-cloud-sync-enabled");return v===null?!0:v==="true"}),[f,D]=b.useState(!1),[R,B]=b.useState(null),[Pe,ke]=b.useState(""),Ie=b.useRef(null),Oe=["businessName","tagline","phone","email","address","gstin","invoicePrefix","currency"],ut=["Poppins","Inter","Roboto","Open Sans","Montserrat","Lato","Arial","Times New Roman","Noto Sans Tamil"],ft=["Small","Medium","Large"],Ce=["Normal","Medium","Bold"];b.useEffect(()=>{J({fontFamily:e.fontFamily||"Inter",fontSize:e.fontSize||"Medium",fontWeight:e.fontWeight||"Normal"})},[e.fontFamily,e.fontSize,e.fontWeight]),b.useEffect(()=>{const v=()=>je(navigator.onLine);return window.addEventListener("online",v),window.addEventListener("offline",v),()=>{window.removeEventListener("online",v),window.removeEventListener("offline",v)}},[]),b.useEffect(()=>{$&&$.email&&S(v=>({...v,email:$.email||"",password:tt($.password)||"",mobile:tt($.mobile)||"",code:tt($.code)||""}))},[$]),b.useEffect(()=>{const v=oe=>{ue(oe.detail?.state||"idle"),$e(localStorage.getItem("sma-last-sync-time"))};return window.addEventListener("sma-cloud-sync-status",v),()=>window.removeEventListener("sma-cloud-sync-status",v)},[]),b.useEffect(()=>{const v=()=>{h(Lt())};return window.addEventListener("sma-billing-live-update",v),()=>window.removeEventListener("sma-billing-live-update",v)},[]);const bt=v=>{const oe={Small:"14px",Medium:"16px",Large:"18px"},F={Normal:"400",Medium:"500",Bold:"700"},De=`'${v.fontFamily}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Tamil", Arial, sans-serif`;document.documentElement.style.setProperty("--app-font-family",De),document.documentElement.style.setProperty("--app-font-size",oe[v.fontSize]||"16px"),document.documentElement.style.setProperty("--app-font-weight",F[v.fontWeight]||"400"),document.documentElement.style.fontFamily=De,document.body.style.fontFamily=De,document.body.style.fontSize=oe[v.fontSize]||"16px",document.body.style.fontWeight=F[v.fontWeight]||"400"},E=()=>{try{const v={fontFamily:w.fontFamily||"Inter",fontSize:w.fontSize||"Medium",fontWeight:w.fontWeight||"Normal"};localStorage.setItem(wr,JSON.stringify(v)),a(v),bt(v),j({type:"",text:""})}catch{j({type:"error",text:"Font save failed. Please try again."})}},T=v=>{localStorage.setItem(vs,JSON.stringify(v)),h(v)},O=async()=>{try{if(C({type:"",text:""}),!N.email||!N.email.includes("@")||N.password.length<6||N.mobile.length<6||!N.code.trim())throw new Error("Email, 6+ character password, 6+ digit mobile number, and secret security code are mandatory.");if(!navigator.onLine)throw new Error("You are currently offline. Internet connection is required to register and verify account security.");const v=Math.floor(1e5+Math.random()*9e5).toString(),oe={email:N.email,password:Tt(N.password),mobile:Tt(N.mobile),code:Tt(N.code),protectionDisabled:!1,verified:!1,updated:new Date().toISOString()};if(p(oe),ee(v),window.genmb?.email)await window.genmb.email.send({to:N.email,subject:"Verify Your SMA Billing Secure Account",html:`
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <h2 style="color: #0d9488; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">SMA Billing Secure Account Verification</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">To activate security and enable recovery options for <strong>SHREE MAHESHWARA AGENCIES</strong> billing software, please enter this verification code in Settings.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #2dd4bf;">
                <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Verification Code</p>
                <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: 900; color: #0d9488; font-family: monospace; letter-spacing: 0.15em;">${v}</p>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">This code is valid for 10 minutes. If you did not make this request, please disregard this email.</p>
            </div>
          `}),A(!0),C({type:"info",text:"Verification code sent! Please check your email inbox (including spam/promotions) and enter the 6-digit OTP code below to enable recovery."});else throw new Error("Email service is currently unavailable. Please check your internet connection.")}catch(v){C({type:"error",text:v.message})}},he=async()=>{C({type:"",text:""});try{if(ae.trim()!==re)throw new Error("Invalid verification code. Please check the code sent to your email.");const v={...U,verified:!0,recoveryEnabled:!0,verifiedAt:new Date().toISOString()};T(v);let oe=!1;try{oe=await Rt(v.email,v)}catch(F){console.warn("[CloudSync] Background security sync failed:",F)}if(A(!1),ee(""),g(""),p(null),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),navigator.onLine)try{const{syncWorkspace:F}=await at(async()=>{const{syncWorkspace:De}=await Promise.resolve().then(()=>st);return{syncWorkspace:De}},void 0,import.meta.url);await F(v.email)}catch{}C(oe?{type:"success",text:"Email verified successfully! Account security registered, recovery enabled, and safely backed up to the cloud database."}:{type:"info",text:"Account registered and saved locally on this PC! (Cloud recovery backup is pending connection/sync, but your local login is secure)."})}catch(v){C({type:"error",text:v.message})}},xe=()=>tt($.mobile)&&N.verifyMobile===tt($.mobile),Ne=()=>tt($.code)&&N.verifyCode===tt($.code),M=async()=>{if(!xe())return C({type:"error",text:"Registered mobile number verification failed."});if(N.newPassword.length<6)return C({type:"error",text:"New password must be 6+ characters."});const v={...$,password:Tt(N.newPassword),updated:new Date().toISOString()};T(v);let oe=!1;try{oe=await Rt($.email,v)}catch(F){console.warn("[CloudSync] Background security password sync failed:",F)}window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),C(oe?{type:"success",text:"Password updated and synchronized successfully!"}:{type:"info",text:"Password updated locally on this PC! (Cloud sync is pending connectivity)."}),S(F=>({...F,verifyMobile:"",newPassword:""}))},Ae=async()=>{if(!xe())return C({type:"error",text:"Registered mobile number verification failed."});if(!N.newEmail.includes("@"))return C({type:"error",text:"Enter valid new email."});const v={...$,email:N.newEmail,updated:new Date().toISOString()};T(v);let oe=!1;try{oe=await Rt(N.newEmail,v)}catch(F){console.warn("[CloudSync] Background security email sync failed:",F)}window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),C(oe?{type:"success",text:"Email updated and synchronized successfully!"}:{type:"info",text:"Email updated locally on this PC! (Cloud sync is pending connectivity)."}),S(F=>({...F,verifyMobile:"",newEmail:""}))},Re=async()=>{if(!Ne())return C({type:"error",text:"Secret security code verification failed."});if(N.newMobile.length<6)return C({type:"error",text:"Enter valid new mobile number."});const v={...$,mobile:Tt(N.newMobile),updated:new Date().toISOString()};T(v);let oe=!1;try{oe=await Rt($.email,v)}catch(F){console.warn("[CloudSync] Background security mobile sync failed:",F)}window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),C(oe?{type:"success",text:"Mobile number updated and synchronized successfully!"}:{type:"info",text:"Mobile number updated locally on this PC! (Cloud sync is pending connectivity)."}),S(F=>({...F,verifyCode:"",newMobile:""}))},Je=()=>{confirm("Disable Account Login Protection? Use only for emergency recovery.")&&(T({...$,protectionDisabled:!0,emergencyDisabledAt:new Date().toISOString()}),C({type:"success",text:"Account Login Protection has been disabled."}))},gt=v=>{const oe=v.target.files[0];if(oe){const F=new FileReader;F.onloadend=()=>a({logo:F.result}),F.readAsDataURL(oe)}},Ct=v=>{const oe=v.target.files?.[0];if(!oe)return;const F=new FileReader;F.onload=De=>{const Be=String(De.target.result||"");localStorage.setItem("sma-custom-invoice-template",Be),localStorage.setItem("sma-invoice-template-choice","custom"),a({invoiceTemplateChoice:"custom"}),L(Be),alert("Local template imported successfully! It has been set as your default template."),v.target.value=""},F.onerror=()=>{alert("Template file read error. Please upload a valid HTML or TXT template file."),v.target.value=""},F.readAsText(oe)},vt=()=>{confirm("Are you sure you want to remove the imported custom template?")&&(localStorage.removeItem("sma-custom-invoice-template"),localStorage.setItem("sma-invoice-template-choice","sma"),a({invoiceTemplateChoice:"sma"}),L(""),alert("Custom template removed."))},xt=async()=>{G(!0),se({type:"",text:""});try{const v=Lt(),oe=t?.email||v.email||e.email;if(!oe||!oe.includes("@"))throw new Error('No registered email address found. Please register your email under "Account Security & Recovery" or configure your business email.');if(!navigator.onLine)throw new Error("You are currently offline. Internet connection is required for Cloud Sync.");const{syncWorkspace:F,packLocalWorkspace:De}=await at(async()=>{const{syncWorkspace:ze,packLocalWorkspace:We}=await Promise.resolve().then(()=>st);return{syncWorkspace:ze,packLocalWorkspace:We}},void 0,import.meta.url),Be=await F(oe,{forceUpload:!0});if(!Be.success)throw new Error(Be.reason||"Cloud Database Sync failed.");if(window.genmb?.email){const ze=De(),We=JSON.stringify(ze,null,2),qe=`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-top: 0;">SHREE MAHESHWARA AGENCIES - Cloud Sync Backup</h2>
            <p style="font-size: 14px; line-height: 1.6;">Your LedgerCraft offline billing data has been backed up securely to the cloud. You can restore your workspace anytime using the JSON backup provided below.</p>
            
            <h3 style="color: #0f766e; font-size: 16px; margin: 20px 0 10px 0;">Backup Data Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Entity</th>
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Record Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Parties / Customers</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${ze.store?.customers?.length||0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Products / Items</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${ze.store?.items?.length||0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Invoices</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${ze.store?.invoices?.length||0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Purchase Orders</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${ze.purchaseOrders?.length||0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Expenses</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${ze.expenses?.length||0}</td>
                </tr>
              </tbody>
            </table>

            <div style="background-color: #f0fdfa; padding: 15px; border: 1px dashed #2dd4bf; border-radius: 8px; margin-top: 20px; font-size: 13px; line-height: 1.6; color: #0f766e;">
              <strong style="display: block; margin-bottom: 5px;">💡 How to restore this backup:</strong>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Select and copy the entire raw JSON text code shown below.</li>
                <li>Save it as a text file named <code>sma_backup.json</code> on your PC.</li>
                <li>Open the billing application, go to <strong>Backup & Export</strong> page.</li>
                <li>Click <strong>Import Data</strong> and select your saved JSON file to restore everything!</li>
              </ol>
            </div>

            <h4 style="margin: 25px 0 8px 0; color: #475569;">Raw Backup JSON:</h4>
            <textarea style="width: 100%; height: 180px; font-family: monospace; font-size: 11px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #f8fafc; color: #334155; resize: vertical;" readonly>${We}</textarea>
            
            <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              <p>Sync timestamp: ${new Date().toLocaleString()}</p>
              <p>© 2026 SHREE MAHESHWARA AGENCIES. All rights reserved.</p>
            </div>
          </div>
        `;await window.genmb.email.send({to:oe,subject:`SMA Billing Cloud Sync Backup - ${new Date().toLocaleDateString()}`,html:qe})}const Ye=Date.now();localStorage.setItem("sma-last-sync-time",String(Ye)),localStorage.setItem("sma-last-sync-status","success"),$e(String(Ye)),ue("success"),se({type:"success",text:`Cloud Sync Successful! All local data is securely updated on the cloud under ${oe}.`})}catch(v){se({type:"error",text:v.message||"Cloud Sync failed."})}finally{G(!1)}},Y=async v=>{D(!0),ke(""),B(null);try{const oe=v.name.toLowerCase();let F={customers:[],items:[],invoices:[],purchaseOrders:[],expenses:[],settings:{}};const De=fe=>{const _=fe.map(Q=>String(Q).trim().toLowerCase());return _.some(Q=>["barcode","sku","sale price","sale_price","mrp","hsn","purchase price","purchase_price","cost"].includes(Q))?"items":_.some(Q=>["invoice number","invoice_number","invoice no","invoice_no","bill no","bill_no","payment mode","payment_mode"].includes(Q))?"invoices":_.some(Q=>["po number","po_number","po no","po_no","company name","company_name","contact person"].includes(Q))?"purchaseOrders":_.some(Q=>["expense","vendor","category","amount"].includes(Q))&&_.includes("vendor")?"expenses":_.some(Q=>["customer","party","phone","mobile","gstin","gst","address"].includes(Q))?"customers":_.some(Q=>Q.includes("product")||Q.includes("item")||Q.includes("price"))?"items":"customers"},Be=fe=>{const _=Q=>{for(const ce of Object.keys(fe))if(Q.some(te=>ce.trim().toLowerCase()===te||ce.trim().toLowerCase().includes(te)))return fe[ce];return""};return{id:_(["id","customerid","partyid"])||`cust_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,name:String(_(["name","party","customer","buyer","client"])||"").trim(),phone:String(_(["phone","mobile","contact","tele"])||"").replace(/[^\d+]/g,"").trim(),email:String(_(["email","mail"])||"").trim(),address:String(_(["address","location","street","city"])||"").trim(),gstin:String(_(["gst","gstin","tax no","tax_no","tin"])||"").toUpperCase().trim(),balance:parseFloat(String(_(["balance","due","outstanding"])||"").replace(/[^\d.]/g,""))||0,updatedAt:Date.now()}},Ye=fe=>{const _=Q=>{for(const ce of Object.keys(fe))if(Q.some(te=>ce.trim().toLowerCase()===te||ce.trim().toLowerCase().includes(te)))return fe[ce];return""};return{id:_(["id","itemid","productid"])||`item_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,name:String(_(["product name","item name","name","title","product","item"])||"").trim(),hsn:String(_(["hsn","sac","hsn/sac","code"])||"").trim(),unit:String(_(["unit","uom","measure"])||"pcs").trim().toLowerCase(),category:String(_(["category","group","type"])||"Imported").trim(),barcode:String(_(["barcode","sku","upc","serial"])||"").trim(),salePrice:parseFloat(String(_(["sale price","sale_price","price","rate","mrp"])||"").replace(/[^\d.]/g,""))||0,purchasePrice:parseFloat(String(_(["purchase price","purchase_price","cost","buy price"])||"").replace(/[^\d.]/g,""))||0,taxRate:parseFloat(String(_(["tax rate","tax","gst","tax%","gst%"])||"").replace(/[^\d.]/g,""))||0,stock:parseFloat(String(_(["stock","qty","quantity","opening stock"])||"").replace(/[^\d.]/g,""))||0,lowStock:parseFloat(String(_(["low stock","min stock","alert"])||"").replace(/[^\d.]/g,""))||25,updatedAt:Date.now()}},ze=fe=>{const _=te=>{for(const ve of Object.keys(fe))if(te.some(ye=>ve.trim().toLowerCase()===ye||ve.trim().toLowerCase().includes(ye)))return fe[ve];return""},Q=parseFloat(String(_(["total","amount","grand total","net amount"])||"").replace(/[^\d.]/g,""))||0,ce=parseFloat(String(_(["paid","amount paid","received"])||"").replace(/[^\d.]/g,""))||0;return{id:_(["id","invoiceid","billid"])||`inv_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,number:String(_(["number","invoice number","invoice no","invoice_no","bill no","bill_no"])||"").trim(),date:String(_(["date","invoice date","bill date"])||new Date().toISOString().slice(0,10)).trim(),dueDate:String(_(["due date","due_date","due"])||"").trim(),customerId:_(["customerId","customerId","customer"])||"",customerName:String(_(["customer","party","buyer","name"])||"Walk-in Customer").trim(),total:Q,paid:ce,balance:parseFloat(String(_(["balance","due","outstanding"])||"").replace(/[^\d.]/g,""))||Q-ce,paymentMode:String(_(["payment mode","payment_mode","mode","type"])||"Cash").trim(),status:String(_(["status","state"])||"Paid").trim(),items:[],updatedAt:Date.now()}},We=fe=>{const _=Q=>{for(const ce of Object.keys(fe))if(Q.some(te=>ce.trim().toLowerCase()===te||ce.trim().toLowerCase().includes(te)))return fe[ce];return""};return{id:_(["id","poid","orderid"])||`po_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,number:String(_(["number","po number","po no","order no"])||"").trim(),date:String(_(["date","po date","order date"])||"").trim(),companyName:String(_(["company","supplier","vendor","name"])||"").trim(),contactPerson:String(_(["contact","person","attention"])||"").trim(),emailPhone:String(_(["email","phone","contact info","mobile"])||"").trim(),productService:String(_(["product","item","details","service"])||"").trim(),quantity:String(_(["quantity","qty"])||"").trim(),details:String(_(["details","notes","description"])||"").trim(),updatedAt:Date.now()}},qe=fe=>{const _=Q=>{for(const ce of Object.keys(fe))if(Q.some(te=>ce.trim().toLowerCase()===te||ce.trim().toLowerCase().includes(te)))return fe[ce];return""};return{id:_(["id","expenseid"])||`exp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,date:String(_(["date","expense date"])||new Date().toISOString().slice(0,10)).trim(),category:String(_(["category","type","group"])||"General").trim(),vendor:String(_(["vendor","payee","paid to"])||"").trim(),amount:parseFloat(String(_(["amount","total","cost"])||"").replace(/[^\d.]/g,""))||0,notes:String(_(["notes","description","remark"])||"").trim(),updatedAt:Date.now()}},be=fe=>{const _=fe.split(/\r?\n/).map(ye=>ye.trim()).filter(Boolean);if(_.length===0)return[];let Q=",";_[0].includes("	")?Q="	":_[0].includes(";")&&(Q=";");const ce=ye=>{let Se=[],ie=!1,Qe="";for(let Ge=0;Ge<ye.length;Ge++){const yt=ye[Ge];yt==='"'||yt==="'"?ie=!ie:yt===Q&&!ie?(Se.push(Qe.trim()),Qe=""):Qe+=yt}return Se.push(Qe.trim()),Se},te=ce(_[0]).map(ye=>ye.toLowerCase().replace(/["']/g,"").trim()),ve=[];for(let ye=1;ye<_.length;ye++){const Se=ce(_[ye]);if(Se.length===0||!Se.some(Boolean))continue;const ie={};te.forEach((Qe,Ge)=>{ie[Qe]=Se[Ge]||""}),ve.push(ie)}return{headers:te,rows:ve}},z=async fe=>{const _=ht.read(fe,{type:"array"}),Q={customers:[],items:[],invoices:[],purchaseOrders:[],expenses:[],settings:{}};for(const ce of _.SheetNames){const te=_.Sheets[ce],ve=ht.utils.sheet_to_json(te,{defval:""});if(ve&&ve.length>0){const ye=Object.keys(ve[0]).map(ie=>String(ie||"").trim().toLowerCase()),Se=De(ye);Se==="customers"?Q.customers.push(...ve.map(Be).filter(ie=>ie.name)):Se==="items"?Q.items.push(...ve.map(Ye).filter(ie=>ie.name)):Se==="invoices"?Q.invoices.push(...ve.map(ze).filter(ie=>ie.number)):Se==="purchaseOrders"?Q.purchaseOrders.push(...ve.map(We).filter(ie=>ie.number)):Se==="expenses"&&Q.expenses.push(...ve.map(qe).filter(ie=>ie.amount>0))}}return Q};if(oe.endsWith(".json")){const fe=await v.text(),_=JSON.parse(fe);if(_.customers||_.items||_.invoices||_.store){const Q=_.store||_;F={customers:Q.customers||_.customers||[],items:Q.items||_.items||[],invoices:Q.invoices||_.invoices||[],purchaseOrders:_.purchaseOrders||[],expenses:_.expenses||[],settings:Q.settings||_.settings||{}}}else{const Q=Array.isArray(_)?_:[_];if(Q.length>0){const ce=De(Object.keys(Q[0]));ce==="customers"?F.customers=Q.map(Be).filter(te=>te.name):ce==="items"?F.items=Q.map(Ye).filter(te=>te.name):ce==="invoices"?F.invoices=Q.map(ze).filter(te=>te.number):ce==="purchaseOrders"?F.purchaseOrders=Q.map(We).filter(te=>te.number):ce==="expenses"&&(F.expenses=Q.map(qe).filter(te=>te.amount>0))}}}else if(oe.endsWith(".csv")||oe.endsWith(".txt")){const fe=await v.text(),{headers:_,rows:Q}=be(fe);if(Q.length>0){const ce=De(_);ce==="customers"?F.customers=Q.map(Be).filter(te=>te.name):ce==="items"?F.items=Q.map(Ye).filter(te=>te.name):ce==="invoices"?F.invoices=Q.map(ze).filter(te=>te.number):ce==="purchaseOrders"?F.purchaseOrders=Q.map(We).filter(te=>te.number):ce==="expenses"&&(F.expenses=Q.map(qe).filter(te=>te.amount>0))}}else if(oe.endsWith(".xls")||oe.endsWith(".xlsx")){const fe=await v.arrayBuffer();F=await z(fe)}else if(oe.endsWith(".zip")){const fe=await ls.loadAsync(v);for(const _ of Object.keys(fe.files)){const Q=fe.files[_];if(!Q.dir){const ce=_.toLowerCase();if(ce.endsWith(".json")){const te=await Q.async("string"),ve=JSON.parse(te),ye=ve.store||ve;ye.customers&&F.customers.push(...(ye.customers||[]).map(Be).filter(Se=>Se.name)),ye.items&&F.items.push(...(ye.items||[]).map(Ye).filter(Se=>Se.name)),ye.invoices&&F.invoices.push(...(ye.invoices||[]).map(ze).filter(Se=>Se.number)),ve.purchaseOrders&&F.purchaseOrders.push(...(ve.purchaseOrders||[]).map(We).filter(Se=>Se.number)),ve.expenses&&F.expenses.push(...(ve.expenses||[]).map(qe).filter(Se=>Se.amount>0)),ye.settings&&(F.settings={...F.settings,...ye.settings})}else if(ce.endsWith(".csv")||ce.endsWith(".txt")){const te=await Q.async("string"),{headers:ve,rows:ye}=be(te),Se=De(ve);Se==="customers"?F.customers.push(...ye.map(Be).filter(ie=>ie.name)):Se==="items"?F.items.push(...ye.map(Ye).filter(ie=>ie.name)):Se==="invoices"?F.invoices.push(...ye.map(ze).filter(ie=>ie.number)):Se==="purchaseOrders"?F.purchaseOrders.push(...ye.map(We).filter(ie=>ie.number)):Se==="expenses"&&F.expenses.push(...ye.map(qe).filter(ie=>ie.amount>0))}else if(ce.endsWith(".xlsx")||ce.endsWith(".xls")){const te=await Q.async("arraybuffer"),ve=await z(te);F.customers.push(...ve.customers),F.items.push(...ve.items),F.invoices.push(...ve.invoices),F.purchaseOrders.push(...ve.purchaseOrders),F.expenses.push(...ve.expenses)}}}}else if(oe.endsWith(".pdf")){if(!window.genmb?.docs?.parse)throw new Error("Document AI service is offline. Please use Excel, CSV, JSON, TXT, or ZIP instead.");const fe=await window.genmb.docs.parse(v,"generic");if(!fe)throw new Error("Document AI returned an empty response.");if(fe.tables&&Array.isArray(fe.tables))for(const Q of fe.tables){const ce=Q.rows||[];if(ce.length>1){const te=ce.map(ie=>(Array.isArray(ie)?ie:ie.cells||ie.values||[]).map(Ge=>typeof Ge=="string"?Ge:Ge?.text||Ge?.value||"")),ve=te[0].map(ie=>String(ie||"").trim().toLowerCase()),ye=De(ve),Se=[];for(let ie=1;ie<te.length;ie++){const Qe=te[ie];if(Qe.length===0||!Qe.some(Boolean))continue;const Ge={};Qe.forEach((yt,La)=>{Ge[ve[La]||`col_${La}`]=yt}),Se.push(Ge)}ye==="customers"?F.customers.push(...Se.map(Be).filter(ie=>ie.name)):ye==="items"?F.items.push(...Se.map(Ye).filter(ie=>ie.name)):ye==="invoices"?F.invoices.push(...Se.map(ze).filter(ie=>ie.number)):ye==="purchaseOrders"?F.purchaseOrders.push(...Se.map(We).filter(ie=>ie.number)):ye==="expenses"&&F.expenses.push(...Se.map(qe).filter(ie=>ie.amount>0))}}if(F.customers.length+F.items.length+F.invoices.length+F.purchaseOrders.length+F.expenses.length===0&&fe.text){const Q=fe.text.split(`
`).map(te=>te.trim()).filter(Boolean);fe.text.toLowerCase().includes("product")||fe.text.toLowerCase().includes("item")||fe.text.toLowerCase().includes("price")?F.items=Q.map(te=>{const ve=te.split(/[,\t|]|\s{2,}/).map(ye=>ye.trim()).filter(Boolean);return ve.length>=2?{name:ve[0],salePrice:parseFloat(ve[1].replace(/[^\d.]/g,""))||0,unit:"pcs",updatedAt:Date.now()}:null}).filter(te=>te&&te.name):F.customers=Q.map(te=>{const ve=te.split(/[,\t|]|\s{2,}/).map(ye=>ye.trim()).filter(Boolean);return ve.length>=2?{name:ve[0],phone:ve[1].replace(/[^\d+]/g,""),updatedAt:Date.now()}:null}).filter(te=>te&&te.name)}}else throw new Error("Unsupported file extension.");if(F.customers.length+F.items.length+F.invoices.length+F.purchaseOrders.length+F.expenses.length===0)throw new Error("We could not detect or extract any structured billing data from this file. Please check file format.");const le=X.getState().customers||[],Z=aa(le,F.customers),me=X.getState().items||[],ge=sa(me,F.items),we=X.getState().invoices||[],ne=ra(we,F.invoices),Ue=Va("sma-purchase-orders"),Fe=ot(Ue,F.purchaseOrders,"id"),lt=Va("sma-expenses"),_t=ot(lt,F.expenses,"id"),Ta={...X.getState().settings||{},...F.settings||{}};o({customers:Z,items:ge,invoices:ne,settings:Ta}),localStorage.setItem("sma-purchase-orders",JSON.stringify(Fe)),localStorage.setItem("sma-expenses",JSON.stringify(_t)),B({customers:F.customers.length,items:F.items.length,invoices:F.invoices.length,purchaseOrders:F.purchaseOrders.length,expenses:F.expenses.length,ledger:F.invoices.length});const oa=t?.email||Lt().email||Ta.email;if(oa&&oa.includes("@")&&navigator.onLine){const{triggerAutoSync:fe}=await at(async()=>{const{triggerAutoSync:_}=await Promise.resolve().then(()=>st);return{triggerAutoSync:_}},void 0,import.meta.url);fe(oa)}}catch(oe){ke(oe.message||"Smart Import failed.")}finally{D(!1),Ie.current&&(Ie.current.value="")}},Me=t?.email||$?.email||e.email;return r`<div className="space-y-6">
    <!-- Settings Section Tab-Bar Selector (Issues 3 & 4) -->
    <div className="flex border-b border-[hsl(var(--border))] gap-2 overflow-x-auto no-print pb-1" aria-label="Settings categories">
      <button 
        onClick=${()=>u("business")} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${l==="business"?"border-[hsl(var(--primary))] text-[hsl(var(--primary))]":"border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
      >
        🏢 Business & Branding
      </button>
      <button 
        onClick=${()=>u("security")} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${l==="security"?"border-[hsl(var(--primary))] text-[hsl(var(--primary))]":"border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
      >
        🔒 Account Security
      </button>
      <button 
        onClick=${()=>u("data")} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${l==="data"?"border-[hsl(var(--primary))] text-[hsl(var(--primary))]":"border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
      >
        📁 Data / Backup
      </button>
    </div>

    <!-- Active Tab Panel Content -->
    ${l==="business"&&r`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-xl font-black">Business Customization</h3>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="relative grid h-32 w-32 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                ${e.logo?r`<${b.Fragment}><img src=${e.logo} className="h-full w-full object-contain" /><button onClick=${()=>a({logo:""})} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow-sm"><${Xe} size=${14} /></button></${b.Fragment}>`:r`<${Rs} className="text-[hsl(var(--muted-foreground))]" size=${32} />`}
              </div>
              <label className="cursor-pointer rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-black text-white shadow-sm">
                <${wt} size=${12} className="mr-1 inline" /> ${e.logo?"Change Logo":"Upload Logo"}
                <input type="file" accept="image/*" onChange=${gt} className="hidden" />
              </label>
            </div>
            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              ${Oe.map(v=>r`<label key=${v} className=${v==="address"||v==="tagline"?"text-sm font-bold sm:col-span-2":"text-sm font-bold"}>${v.replace(/([A-Z])/g," $1").toUpperCase()}<input value=${e[v]} onInput=${oe=>a({[v]:oe.target.value})} placeholder=${v.replace(/([A-Z])/g," $1")} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>`)}
            </div>
          </div>
          
          <div className="mt-5 card p-5">
            <h3 className="font-black">Global Font Settings</h3>
            ${x.text?r`<p className=${`mt-3 rounded p-2 text-xs font-bold ${x.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-600"}`}>${x.text}</p>`:""}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-bold">Font Style
                <select value=${w.fontFamily} onChange=${v=>J({...w,fontFamily:v.target.value})} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${ut.map(v=>r`<option key=${v} value=${v}>${v}</option>`)}
                </select>
              </label>
              <label className="text-sm font-bold">Font Size
                <select value=${w.fontSize} onChange=${v=>J({...w,fontSize:v.target.value})} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${ft.map(v=>r`<option key=${v} value=${v}>${v}</option>`)}
                </select>
              </label>
              <label className="text-sm font-bold">Font Weight
                <select value=${w.fontWeight} onChange=${v=>J({...w,fontWeight:v.target.value})} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${Ce.map(v=>r`<option key=${v} value=${v}>${v}</option>`)}
                </select>
              </label>
            </div>
            <button onClick=${E} className="mt-4 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">Set Font</button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-black">GST & Alerts</h3>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-bold">Default CGST %<input type="number" value=${e.defaultCgstRate??9} onInput=${v=>a({defaultCgstRate:Number(v.target.value)})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
              <label className="text-sm font-bold">Default SGST %<input type="number" value=${e.defaultSgstRate??9} onInput=${v=>a({defaultSgstRate:Number(v.target.value)})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
              <label className="text-sm font-bold">Due reminder before days<input type="number" value=${e.dueReminderDays??3} onInput=${v=>a({dueReminderDays:Number(v.target.value)})} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2"><${Xt} size=${18} /> Invoice Templates</h3>
            <div className="mt-4 space-y-4">
              <label className="text-sm font-bold block">
                Default Print Template
                <select 
                  value=${e.invoiceTemplateChoice||localStorage.getItem("sma-invoice-template-choice")||"sma"} 
                  onChange=${v=>{const oe=v.target.value;localStorage.setItem("sma-invoice-template-choice",oe),a({invoiceTemplateChoice:oe})}} 
                  className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
                >
                  <option value="sma">SMA Print Format</option>
                  <option value="classic">Classic Template</option>
                  <option value="modern">Modern Template</option>
                  <option value="compact">Compact Template</option>
                  <option value="gst">GST Box Template</option>
                  <option value="letterhead">Letterhead Template</option>
                  <option value="professional">Professional Teal Template</option>
                  <option value="elegant">Elegant Coral Template</option>
                  <option value="minimalist">Minimalist Steel Template</option>
                  ${W?r`<option value="custom">My Local Template</option>`:""}
                </select>
              </label>

              <div className="border border-dashed border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--muted)/0.1)] text-center">
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
                  Import a custom HTML template file from your local system (.html, .htm, .txt)
                </p>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-black text-white hover:opacity-90 shadow-sm">
                    <${wt} size=${14} /> Import Local Template
                    <input 
                      type="file" 
                      accept=".html,.htm,.txt,text/html,text/plain" 
                      onChange=${Ct} 
                      className="hidden" 
                    />
                  </label>
                  
                  ${W?r`
                    <button 
                      onClick=${vt} 
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-black text-white hover:opacity-90 shadow-sm"
                    >
                      <${Xe} size=${14} /> Remove Custom Template
                    </button>
                  `:""}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-black">Theme</h3>
            <label className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.6)] p-4 font-bold">Dark mode<input type="checkbox" checked=${e.darkMode} onChange=${v=>a({darkMode:v.target.checked})} /></label>
          </div>
        </div>
      </div>
    `}

    ${l==="security"&&r`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-black"><${Ht} size=${18} /> Account Security & Recovery</h3>
          ${I.text?r`<p className=${`mt-3 rounded p-2 text-xs font-bold ${I.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-600"}`}>${I.text}</p>`:""}
          
          ${H?r`
            <div className="mt-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
              <h4 className="font-black text-sm text-blue-700">Enter Verification Code</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">A 6-digit verification code has been sent to <strong>${U?.email}</strong>. Enter it here to complete security setup and enable account recovery.</p>
              <div className="flex gap-2">
                <input value=${ae} onInput=${v=>g(v.target.value)} placeholder="6-digit OTP" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3 text-center tracking-widest font-black text-lg max-w-[200px]" />
                <button onClick=${he} className="rounded bg-emerald-600 px-6 py-3 font-black text-white hover:opacity-90">Verify & Enable Recovery</button>
              </div>
              <button onClick=${()=>{A(!1),ee(""),g(""),p(null),C({type:"",text:""})}} className="text-xs font-bold text-red-500 hover:underline">Cancel Registration</button>
            </div>
          `:r`
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value=${N.email} onInput=${v=>S({...N,email:v.target.value})} placeholder="Register email" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input type="password" value=${N.password} onInput=${v=>S({...N,password:v.target.value})} placeholder="Register password (6+ chars)" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input value=${N.mobile} onInput=${v=>S({...N,mobile:v.target.value})} placeholder="Secret mobile number" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input type="password" value=${N.code} onInput=${v=>S({...N,code:v.target.value})} placeholder="Secret security code" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <button onClick=${O} className="rounded bg-[hsl(var(--primary))] p-3 font-black text-white sm:col-span-2">Register / Save Secure Account</button>
              
              <div className="sm:col-span-2 border-t border-[hsl(var(--border))] my-2 pt-4">
                <p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))] mb-3">Verification & Updates</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value=${N.verifyMobile} onInput=${v=>S({...N,verifyMobile:v.target.value})} placeholder="Verify registered mobile" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                  <input type="password" value=${N.newPassword} onInput=${v=>S({...N,newPassword:v.target.value})} placeholder="New password" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                  <button onClick=${M} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)]">Forgot / Update Password</button>
                  
                  <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 border-t border-[hsl(var(--border)/0.5)] pt-3">
                    <input value=${N.newEmail} onInput=${v=>S({...N,newEmail:v.target.value})} placeholder="New email" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <button onClick=${Ae} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)]">Change Email</button>
                  </div>

                  <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 border-t border-[hsl(var(--border)/0.5)] pt-3">
                    <input type="password" value=${N.verifyCode} onInput=${v=>S({...N,verifyCode:v.target.value})} placeholder="Secret code to change mobile" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <input value=${N.newMobile} onInput=${v=>S({...N,newMobile:v.target.value})} placeholder="New mobile number" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <button onClick=${Re} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)] sm:col-span-2">Update Mobile</button>
                  </div>
                </div>
              </div>
              
              <button onClick=${Je} className="rounded bg-red-600 p-3 font-black text-white sm:col-span-2">Disable Account Login Protection</button>
            </div>
          `}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-black">Account Login / Forgot Password</h3>
            ${t?r`<p className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">Logged in: ${t.email}</p>`:r`<div className="mt-3 flex gap-2"><input type="email" value=${y} onInput=${v=>k(v.target.value)} placeholder="Email address" disabled=${n} className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 text-sm" /><button disabled=${n} onClick=${()=>d(y)} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-3 text-white disabled:opacity-50"><${Na} size=${17} /></button></div>`}
            ${c?r`<p className="mt-2 rounded bg-red-500/10 p-2 text-xs font-bold text-red-600">${c}</p>`:""}
            ${m?r`<p className="mt-2 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">${m}</p>`:""}
          </div>
        </div>
      </div>
    `}

    ${l==="data"&&r`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <!-- Smart Backup Import UI inside Settings (Issue 4) -->
          <div className="card p-5 space-y-4">
            <h3 className="flex items-center gap-2 font-black text-lg text-[hsl(var(--foreground))]">
              <${ns} size=${20} className="text-[hsl(var(--primary))]" />
              <span>Smart Backup Import & Auto Mapping</span>
            </h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed font-bold">
              Upload any billing backup data file (PDF, Excel, CSV, JSON, TXT, or ZIP). The smart parser automatically reads, parses, analyzes columns, segregates records (Customers, Products, Invoices, Purchase Orders, Expenses), merges duplicates securely (using latest timestamp), and auto-syncs everything to the cloud!
            </p>

            ${Pe&&r`
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold flex items-center gap-2">
                <${He} size=${15} />
                <span>${Pe}</span>
              </div>
            `}

            ${R&&r`
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h4 className="font-black text-xs text-emerald-700 flex items-center gap-1.5">
                  <${it} size=${15} /> Smart Backup Mapping Completed Successfully!
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-center text-xs">
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${R.customers}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Parties</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${R.items}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Products</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${R.invoices}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Invoices</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${R.purchaseOrders}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">PO</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${R.ledger}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Ledger Rows</p>
                  </div>
                </div>
              </div>
            `}

            <div className="flex justify-start">
              <button 
                disabled=${f}
                onClick=${()=>Ie.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 py-3 font-black text-xs text-white hover:opacity-90 disabled:opacity-50 shadow-sm"
              >
                ${f?r`<${nt} className="animate-spin" size={14} />`:r`<${wt} size=${14} />`}
                <span>${f?"Analyzing & Segregating...":"Upload & Import Backup File"}</span>
              </button>
              <input 
                ref=${Ie} 
                type="file" 
                accept=".pdf,.xls,.xlsx,.csv,.json,.txt,.zip,application/json,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain" 
                onChange=${v=>{const oe=v.target.files?.[0];oe&&Y(oe)}} 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <!-- Cloud Sync Card inside Settings UI (Issue 3 / Data / Backup Option) -->
          <div className="card p-5 border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.03)] space-y-4">
            <h3 className="font-black flex items-center gap-2 text-base text-[hsl(var(--foreground))]">
              <span className="text-[hsl(var(--primary))]">☁</span> Cloud Sync
            </h3>
            <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] font-bold mt-1">
              Keep PC and Mobile versions fully synchronized. Local changes are uploaded instantly when online.
            </p>

            ${q.text&&r`
              <div className=${`p-2.5 rounded-lg flex items-center gap-2.5 font-bold text-[11px] ${q.type==="error"?"bg-red-500/10 text-red-600":"bg-emerald-500/10 text-emerald-700"}`}>
                ${q.type==="error"?r`<${He} size=${14} />`:r`<${it} size=${14} />`}
                <span>${q.text}</span>
              </div>
            `}

            <div className="space-y-3 bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))] text-xs">
              <div className="flex items-center justify-between border-b pb-1.5 border-[hsl(var(--border)/0.5)]">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Sync Status:</span>
                <span className="font-black">
                  ${_e?de==="syncing"||K?r`<span className="text-amber-500 flex items-center gap-1 animate-pulse"><span className="text-amber-500">●</span> Syncing...</span>`:r`<span className="text-emerald-500 flex items-center gap-1"><span className="text-emerald-500">●</span> Synced</span>`:r`<span className="text-red-600 flex items-center gap-1"><span className="text-red-600">●</span> Offline</span>`}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5 border-[hsl(var(--border)/0.5)]">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Last Sync Time:</span>
                <span className="font-black text-[hsl(var(--foreground))]">
                  ${pe?new Date(Number(pe)).toLocaleString():"Never synced"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Cloud Identity:</span>
                <span className="font-black text-[hsl(var(--foreground))] truncate max-w-[120px]" title=${Me||"None"}>
                  ${Me||r`<span className="text-red-500 italic">No Sync Email</span>`}
                </span>
              </div>
            </div>

            <!-- Real-Time Auto Sync Option -->
            <div className="p-3 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] space-y-2">
              <label className="text-xs font-black text-[hsl(var(--foreground))] flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked=${s} 
                  onChange=${v=>{const oe=v.target.checked;i(oe),localStorage.setItem("sma-auto-cloud-sync-enabled",String(oe)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}}))}} 
                  className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" 
                />
                <span>Enable Real-Time Cloud Auto-Sync</span>
              </label>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-bold pl-6 leading-normal">
                Automatically upload local offline modifications and auto-update/download cloud data whenever your device is online.
              </p>
            </div>

            <button 
              disabled=${K||!Me} 
              onClick=${xt} 
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-black text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              ${K?r`<${nt} className="animate-spin" size=${14} />`:r`<${is} size=${14} />`}
              <span>${K?"Syncing...":"Sync to Cloud Now"}</span>
            </button>
          </div>
        </div>
      </div>
    `}
  </div>`}const Nr="sma-secure-account-v1",Ut=()=>{try{return JSON.parse(localStorage.getItem(Nr)||"{}")}catch{return{}}};function Sr(){const{customers:e,items:a,invoices:o,settings:t,importData:n}=X(),{user:c}=St(),[m,d]=b.useState(!1),[l,u]=b.useState({type:"",text:""}),[y,k]=b.useState(null),[$,h]=b.useState(!1),[N,S]=b.useState({type:"",text:""}),[I,C]=b.useState(()=>localStorage.getItem("sma-last-sync-time")),[w,J]=b.useState(()=>localStorage.getItem("sma-last-sync-status")||"idle"),[x,j]=b.useState(navigator.onLine),[W,L]=b.useState(()=>{const E=localStorage.getItem("sma-auto-cloud-sync-enabled");return E===null?!0:E==="true"}),[H,A]=b.useState(null),[re,ee]=b.useState(""),ae=!!(window.desktopApp?.saveTextFile||window.showSaveFilePicker);b.useEffect(()=>()=>{y?.url&&URL.revokeObjectURL(y.url)},[y?.url]),b.useEffect(()=>{const E=()=>{const T=navigator.onLine;if(j(T),T){const O=localStorage.getItem("sma-auto-cloud-sync-enabled")!=="false",he=Ut(),xe=c?.email||he.email||t.email;O&&xe&&xe.includes("@")&&(h(!0),S({type:"info",text:"Device connected online! Automatically syncing & backing up your workspace..."}),at(async()=>{const{syncWorkspace:Ne}=await Promise.resolve().then(()=>st);return{syncWorkspace:Ne}},void 0,import.meta.url).then(({syncWorkspace:Ne})=>{Ne(xe).then(M=>{h(!1),M.success?S({type:"success",text:"Online Auto-Sync completed! All data backed up to the cloud."}):S({type:"error",text:"Online Auto-Sync failed: "+(M.reason||"Cloud sync error")})}).catch(M=>{h(!1),S({type:"error",text:"Online Auto-Sync error: "+M.message})})}))}};return window.addEventListener("online",E),window.addEventListener("offline",E),()=>{window.removeEventListener("online",E),window.removeEventListener("offline",E)}},[c,t.email]),b.useEffect(()=>{const E=T=>{J(T.detail?.state||"idle"),C(localStorage.getItem("sma-last-sync-time"))};return window.addEventListener("sma-cloud-sync-status",E),()=>window.removeEventListener("sma-cloud-sync-status",E)},[]);const g=E=>{try{return JSON.parse(localStorage.getItem(E)||"[]")}catch{return[]}},U=E=>{console.log("[LedgerCraftPC Backup]",E)},p=E=>{},K=E=>u({type:"error",text:E}),G=()=>{const E={customers:e,items:a,invoices:o,settings:t,expenses:g("sma-expenses"),quickNotes:g("sma-quick-notes"),purchaseOrders:g("sma-purchase-orders"),exportDate:new Date().toISOString(),version:"1.0-offline"};return U(`Backup data loaded: ${E.invoices.length} invoices, ${E.customers.length} parties, ${E.items.length} products, ${E.expenses.length} expenses, ${E.purchaseOrders.length} purchase orders`),E},q=E=>String(E??"").replace(/[&<>"]/g,T=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[T]),se=E=>e.find(T=>T.id===E)?.name||"Walk-in Customer",pe=(E,T)=>{if(!(E instanceof Blob)||E.size<=0)throw new Error(`${T} file content was not generated.`);return U(`File generated in app memory: ${T}, size ${E.size} bytes`),E},$e=E=>new Promise((T,O)=>{const he=new FileReader;he.onload=()=>T(String(he.result||"")),he.onerror=()=>O(new Error("Unable to store generated file in app storage.")),he.readAsDataURL(E)}),de=E=>{const[T,O]=String(E||"").split(",");if(!O)throw new Error("Stored backup data is empty.");const he=(T.match(/data:([^;]+)/)||[])[1]||"application/octet-stream",xe=atob(O),Ne=new Uint8Array(xe.length);for(let M=0;M<xe.length;M+=1)Ne[M]=xe.charCodeAt(M);return new Blob([Ne],{type:he})},ue=async(E,T)=>{const O=await $e(T),he={fileName:E,type:T.type,size:T.size,base64:O,createdAt:new Date().toISOString(),temporaryPath:`localStorage://ledgercraftpc-last-backup-file/${E}`};return localStorage.setItem("ledgercraftpc-last-backup-file",JSON.stringify(he)),U(`Temporary path: ${he.temporaryPath}`),he},_e=(E,T)=>{if(E?.canceled)throw new Error("Save cancelled.");if(E?.error)throw new Error(E.error);if(!E?.filePath)throw new Error("Exported file path was not created.");if(U(`Exported path: ${E.filePath}`),U(`File size: ${Number(E.size||0)} bytes`),!E.exists||Number(E.size||0)<=0)throw new Error("Saved file could not be verified or file size is zero.");U(`Export status: ${E.status||"exported"}`),p(`Exported to device storage: ${E.filePath}`)},je=async(E,T,O)=>{pe(E,O);const he=await ue(T,E),xe=URL.createObjectURL(E);if(!String(xe).startsWith("blob:"))throw new Error(`${O} object URL creation failed.`);y?.url&&URL.revokeObjectURL(y.url),k({url:xe,fileName:T,type:E.type});const Ne=document.createElement("a");return Ne.href=xe,Ne.download=T,Ne.target="_self",Ne.style.position="fixed",Ne.style.left="-9999px",document.body.appendChild(Ne),Ne.click(),setTimeout(()=>Ne.remove(),500),U(`Exported path: browser Downloads/${T}`),U(`File size: ${E.size} bytes`),U("Export status: browser download requested; browser controls final filesystem verification"),he},s=async(E,T,O,he)=>{pe(E,T),await ue(T,E);const xe=await window.showSaveFilePicker({suggestedName:T,types:[{description:O,accept:he}]}),Ne=await xe.createWritable();await Ne.write(E),await Ne.close();const M=await xe.getFile();if(U(`Exported path: ${xe.name||T}`),U(`File size: ${M.size} bytes`),!M.size)throw new Error("Saved file could not be verified or file size is zero.");U("Export status: exported with native browser Save As"),p(`Exported to device storage: ${xe.name||T}`)},i=async()=>{try{const E=JSON.parse(localStorage.getItem("ledgercraftpc-last-backup-file")||"{}");if(!E.base64||!E.size)throw new Error("No generated backup file found in app storage.");const T=de(E.base64);pe(T,"Stored backup"),await je(T,E.fileName,"Stored backup")}catch(E){U(`Errors: ${E.message||E}`),K("Export Backup File failed: "+(E.message||"Please generate backup again."))}},f=()=>{const E=G(),T=E.invoices.map(M=>{const Ae=Le(M),Re=(M.items||[]).map(Je=>`${Je.name} x ${Je.qty} @ ${Je.price}`).join(", ");return`<tr><td>${q(M.number)}</td><td>${q(M.date)}</td><td>${q(M.dueDate)}</td><td>${q(se(M.customerId))}</td><td>${q(M.paymentMode||"Cash")}</td><td>${q(M.status)}</td><td>${Ae.subtotal}</td><td>${Ae.tax}</td><td>${Ae.discount}</td><td>${Ae.total}</td><td>${Ae.paid}</td><td>${Ae.balance}</td><td>${q(Re)}</td></tr>`}).join(""),O=E.customers.map(M=>`<tr><td>${q(M.name)}</td><td>${q(M.phone)}</td><td>${q(M.email)}</td><td>${q(M.gstin)}</td><td>${q(M.address)}</td></tr>`).join(""),he=E.items.map(M=>`<tr><td>${q(M.name)}</td><td>${q(M.category)}</td><td>${q(M.hsn)}</td><td>${q(M.unit)}</td><td>${M.purchasePrice||0}</td><td>${M.salePrice||0}</td><td>${M.taxRate||0}</td><td>${M.stock||0}</td><td>${M.lowStock||0}</td></tr>`).join(""),xe=E.expenses.map(M=>`<tr><td>${q(M.date)}</td><td>${q(M.category)}</td><td>${q(M.vendor)}</td><td>${M.amount||0}</td><td>${q(M.notes)}</td></tr>`).join(""),Ne=E.purchaseOrders.map(M=>`<tr><td>${q(M.number)}</td><td>${q(M.date)}</td><td>${q(M.companyName)}</td><td>${q(M.contactPerson)}</td><td>${q(M.emailPhone)}</td><td>${q(M.productService)}</td><td>${q(M.quantity)}</td><td>${q(M.details)}</td></tr>`).join("");return`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial}table{border-collapse:collapse;margin:18px 0;width:100%}th,td{border:1px solid #999;padding:6px}th{background:#eee}.title{font-size:22px;font-weight:bold}</style></head><body><div class="title">${q(t.businessName)} - Complete Offline Export</div><p>Export Date: ${q(new Date().toLocaleString())}</p><h2>Business Details</h2><table><tr><th>Name</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Address</th><th>Invoice Prefix</th></tr><tr><td>${q(t.businessName)}</td><td>${q(t.phone)}</td><td>${q(t.email)}</td><td>${q(t.gstin)}</td><td>${q(t.address)}</td><td>${q(t.invoicePrefix)}</td></tr></table><h2>Invoices</h2><table><tr><th>Invoice No</th><th>Date</th><th>Due Date</th><th>Customer</th><th>Payment</th><th>Status</th><th>Subtotal</th><th>Tax</th><th>Discount</th><th>Total</th><th>Paid</th><th>Balance</th><th>Items</th></tr>${T||'<tr><td colspan="13">No invoices</td></tr>'}</table><h2>Parties</h2><table><tr><th>Name</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Address</th></tr>${O||'<tr><td colspan="5">No parties</td></tr>'}</table><h2>Products</h2><table><tr><th>Name</th><th>Category</th><th>HSN</th><th>Unit</th><th>Purchase</th><th>Sale</th><th>GST %</th><th>Stock</th><th>Low Limit</th></tr>${he||'<tr><td colspan="9">No products</td></tr>'}</table><h2>Expenses</h2><table><tr><th>Date</th><th>Category</th><th>Vendor</th><th>Amount</th><th>Notes</th></tr>${xe||'<tr><td colspan="5">No expenses</td></tr>'}</table><h2>Purchase Orders</h2><table><tr><th>PO No</th><th>Date</th><th>Company</th><th>Contact</th><th>Email / Phone</th><th>Product</th><th>Qty</th><th>Details</th></tr>${Ne||'<tr><td colspan="8">No purchase orders</td></tr>'}</table></body></html>`},D=()=>{const E=G(),T=new Nt({unit:"pt",format:"a4"}),O=t.businessName||"SHREE MAHESHWARA AGENCIES",he=new Date().toLocaleString(),xe=t.logo,Ne=Y=>{const Me=Y.internal.getNumberOfPages();for(let v=1;v<=Me;v++){if(Y.setPage(v),Y.setFont("helvetica","bold"),Y.setFontSize(18),Y.setTextColor(40,40,40),xe)try{Y.addImage(xe,"PNG",40,25,40,40,void 0,"FAST"),Y.text(O,90,45),Y.setFontSize(9),Y.setFont("helvetica","normal"),Y.setTextColor(100,100,100),Y.text(`${t.address||""} | ${t.phone||""}`,90,58)}catch{Y.text(O,40,45),Y.setFontSize(9),Y.setFont("helvetica","normal"),Y.setTextColor(100,100,100),Y.text(`${t.address||""} | ${t.phone||""}`,40,58)}else Y.text(O,40,45),Y.setFontSize(9),Y.setFont("helvetica","normal"),Y.setTextColor(100,100,100),Y.text(`${t.address||""} | ${t.phone||""}`,40,58);Y.setFontSize(8),Y.setFont("helvetica","italic"),Y.setTextColor(150,150,150),Y.text(`Generated on: ${he} | LedgerCraft PC Billing`,40,810),Y.text(`Page ${v} of ${Me}`,510,810),Y.setDrawColor(230,230,230),Y.line(40,800,555,800)}};let M=85;const Ae={theme:"grid",headStyles:{fillColor:[75,85,99],textColor:255,fontSize:9,fontStyle:"bold",halign:"center"},bodyStyles:{fontSize:8,textColor:50},margin:{top:85,bottom:65,left:40,right:40},styles:{overflow:"linebreak",cellPadding:5},alternateRowStyles:{fillColor:[248,250,252]}},Re=(Y,Me)=>(T.setFontSize(13),T.setFont("helvetica","bold"),T.setTextColor(30,41,59),T.text(Y,40,Me),T.setDrawColor(30,41,59),T.setLineWidth(1),T.line(40,Me+4,120,Me+4),Me+20);M=Re("INVOICES SUMMARY",M);const Je=E.invoices.map(Y=>{const Me=Le(Y);return[Y.number,Y.date,se(Y.customerId),Y.paymentMode||"Cash",Y.status,P(Me.total,t.currency),P(Me.balance,t.currency)]});dt(T,{...Ae,startY:M,head:[["Number","Date","Customer","Mode","Status","Amount","Balance"]],body:Je.length?Je:[["No data","-","-","-","-","-","-"]]}),M=T.lastAutoTable.finalY+40,M>750&&(T.addPage(),M=85),M=Re("PARTIES / CUSTOMERS",M);const gt=E.customers.map(Y=>[Y.name,Y.phone||"-",Y.email||"-",Y.gstin||"-",Y.address||"-"]);dt(T,{...Ae,startY:M,head:[["Party Name","Phone","Email","GSTIN","Address"]],body:gt.length?gt:[["No data","-","-","-","-"]]}),M=T.lastAutoTable.finalY+40,M>750&&(T.addPage(),M=85),M=Re("PRODUCT CATALOG",M);const Ct=E.items.map(Y=>[Y.name,Y.hsn||"-",Y.unit||"pcs",P(Y.salePrice,t.currency),Y.stock||0,Y.lowStock||0]);dt(T,{...Ae,startY:M,head:[["Product Name","HSN","Unit","Price","Stock","Limit"]],body:Ct.length?Ct:[["No data","-","-","-","-","-"]]}),M=T.lastAutoTable.finalY+40,M>750&&(T.addPage(),M=85),M=Re("EXPENSES TRACKER",M);const vt=E.expenses.map(Y=>[Y.date||"-",Y.category||"-",Y.vendor||"-",P(Y.amount,t.currency),Y.notes||"-"]);dt(T,{...Ae,startY:M,head:[["Date","Category","Vendor","Amount","Notes"]],body:vt.length?vt:[["No data","-","-","-","-"]]}),M=T.lastAutoTable.finalY+40,M>750&&(T.addPage(),M=85),M=Re("PURCHASE ORDERS",M);const xt=E.purchaseOrders.map(Y=>[Y.number||"-",Y.date||"-",Y.companyName||"-",Y.productService||"-",Y.quantity||"-",Y.details||"-"]);return dt(T,{...Ae,startY:M,head:[["PO No","Date","Supplier","Product","Qty","Details"]],body:xt.length?xt:[["No data","-","-","-","-","-"]]}),Ne(T),T},R=async({fileName:E,label:T,blob:O,content:he,base64:xe,desktopBinary:Ne,pickerAccept:M,pickerDescription:Ae})=>{if(pe(O,T),await ue(E,O),window.desktopApp?.[Ne?"saveBinaryFile":"saveTextFile"]){U(`Opening native Save As dialog for ${E}`);const Re=await window.desktopApp[Ne?"saveBinaryFile":"saveTextFile"]({fileName:E,base64:xe,content:he,dialog:{title:`Choose ${T} save location`,filters:[{name:T,extensions:[E.split(".").pop()]}]}});_e(Re);return}if(window.showSaveFilePicker){await s(O,E,Ae,M);return}await je(O,E,T)},B=async E=>{d(!0),u({type:"",text:""}),k(null);try{await E()}catch(T){console.error("[LedgerCraftPC Backup] Export failure",T),U(`Errors: ${T.message||T}`),K(T.message||"Export failed.")}finally{d(!1)}},Pe=()=>B(async()=>{const E=`SHREE_MAHESHWARA_AGENCIES_All_Details_${new Date().toISOString().slice(0,10)}.xls`,T=f();await R({fileName:E,label:"Excel",blob:new Blob([T],{type:"application/vnd.ms-excel;charset=utf-8"}),content:T,pickerDescription:"Excel File",pickerAccept:{"application/vnd.ms-excel":[".xls"]}})}),ke=()=>B(async()=>{const E=`SHREE_MAHESHWARA_AGENCIES_All_Details_${new Date().toISOString().slice(0,10)}.pdf`,T=D(),O=T.output("blob"),he=T.output("datauristring").split(",")[1];if(!he)throw new Error("PDF binary generation failed.");await R({fileName:E,label:"PDF",blob:O,base64:he,desktopBinary:!0,pickerDescription:"PDF File",pickerAccept:{"application/pdf":[".pdf"]}})}),Ie=()=>B(async()=>{const E=`SHREE_MAHESHWARA_AGENCIES_Backup_${new Date().toISOString().slice(0,10)}.json`,T=JSON.stringify(G(),null,2);await R({fileName:E,label:"JSON Backup",blob:new Blob([T],{type:"application/json;charset=utf-8"}),content:T,pickerDescription:"JSON Backup",pickerAccept:{"application/json":[".json"]}})}),Oe=async E=>{d(!0),ee(""),A(null);try{const T=E.name.toLowerCase();let O={customers:[],items:[],invoices:[],purchaseOrders:[],expenses:[],settings:{}};const he=be=>{const z=be.map(V=>String(V).trim().toLowerCase());return z.some(V=>["barcode","sku","sale price","sale_price","mrp","hsn","purchase price","purchase_price","cost"].includes(V))?"items":z.some(V=>["invoice number","invoice_number","invoice no","invoice_no","bill no","bill_no","payment mode","payment_mode"].includes(V))?"invoices":z.some(V=>["po number","po_number","po no","po_no","company name","company_name","contact person"].includes(V))?"purchaseOrders":z.some(V=>["expense","vendor","category","amount"].includes(V))&&z.includes("vendor")?"expenses":z.some(V=>["customer","party","phone","mobile","gstin","gst","address"].includes(V))?"customers":z.some(V=>V.includes("product")||V.includes("item")||V.includes("price"))?"items":"customers"},xe=be=>{const z=V=>{for(const le of Object.keys(be))if(V.some(Z=>le.trim().toLowerCase()===Z||le.trim().toLowerCase().includes(Z)))return be[le];return""};return{id:z(["id","customerid","partyid"])||`cust_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,name:String(z(["name","party","customer","buyer","client"])||"").trim(),phone:String(z(["phone","mobile","contact","tele"])||"").replace(/[^\d+]/g,"").trim(),email:String(z(["email","mail"])||"").trim(),address:String(z(["address","location","street","city"])||"").trim(),gstin:String(z(["gst","gstin","tax no","tax_no","tin"])||"").toUpperCase().trim(),balance:parseFloat(String(z(["balance","due","outstanding"])||"").replace(/[^\d.]/g,""))||0,updatedAt:Date.now()}},Ne=be=>{const z=V=>{for(const le of Object.keys(be))if(V.some(Z=>le.trim().toLowerCase()===Z||le.trim().toLowerCase().includes(Z)))return be[le];return""};return{id:z(["id","itemid","productid"])||`item_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,name:String(z(["product name","item name","name","title","product","item"])||"").trim(),hsn:String(z(["hsn","sac","hsn/sac","code"])||"").trim(),unit:String(z(["unit","uom","measure"])||"pcs").trim().toLowerCase(),category:String(z(["category","group","type"])||"Imported").trim(),barcode:String(z(["barcode","sku","upc","serial"])||"").trim(),salePrice:parseFloat(String(z(["sale price","sale_price","price","rate","mrp"])||"").replace(/[^\d.]/g,""))||0,purchasePrice:parseFloat(String(z(["purchase price","purchase_price","cost","buy price"])||"").replace(/[^\d.]/g,""))||0,taxRate:parseFloat(String(z(["tax rate","tax","gst","tax%","gst%"])||"").replace(/[^\d.]/g,""))||0,stock:parseFloat(String(z(["stock","qty","quantity","opening stock"])||"").replace(/[^\d.]/g,""))||0,lowStock:parseFloat(String(z(["low stock","min stock","alert"])||"").replace(/[^\d.]/g,""))||25,updatedAt:Date.now()}},M=be=>{const z=Z=>{for(const me of Object.keys(be))if(Z.some(ge=>me.trim().toLowerCase()===ge||me.trim().toLowerCase().includes(ge)))return be[me];return""},V=parseFloat(String(z(["total","amount","grand total","net amount"])||"").replace(/[^\d.]/g,""))||0,le=parseFloat(String(z(["paid","amount paid","received"])||"").replace(/[^\d.]/g,""))||0;return{id:z(["id","invoiceid","billid"])||`inv_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,number:String(z(["number","invoice number","invoice no","invoice_no","bill no","bill_no"])||"").trim(),date:String(z(["date","invoice date","bill date"])||new Date().toISOString().slice(0,10)).trim(),dueDate:String(z(["due date","due_date","due"])||"").trim(),customerId:z(["customerId","customerId","customer"])||"",customerName:String(z(["customer","party","buyer","name"])||"Walk-in Customer").trim(),total:V,paid:le,balance:parseFloat(String(z(["balance","due","outstanding"])||"").replace(/[^\d.]/g,""))||V-le,paymentMode:String(z(["payment mode","payment_mode","mode","type"])||"Cash").trim(),status:String(z(["status","state"])||"Paid").trim(),items:[],updatedAt:Date.now()}},Ae=be=>{const z=V=>{for(const le of Object.keys(be))if(V.some(Z=>le.trim().toLowerCase()===Z||le.trim().toLowerCase().includes(Z)))return be[le];return""};return{id:z(["id","poid","orderid"])||`po_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,number:String(z(["number","po number","po no","order no"])||"").trim(),date:String(z(["date","po date","order date"])||"").trim(),companyName:String(z(["company","supplier","vendor","name"])||"").trim(),contactPerson:String(z(["contact","person","attention"])||"").trim(),emailPhone:String(z(["email","phone","contact info","mobile"])||"").trim(),productService:String(z(["product","item","details","service"])||"").trim(),quantity:String(z(["quantity","qty"])||"").trim(),details:String(z(["details","notes","description"])||"").trim(),updatedAt:Date.now()}},Re=be=>{const z=V=>{for(const le of Object.keys(be))if(V.some(Z=>le.trim().toLowerCase()===Z||le.trim().toLowerCase().includes(Z)))return be[le];return""};return{id:z(["id","expenseid"])||`exp_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,date:String(z(["date","expense date"])||new Date().toISOString().slice(0,10)).trim(),category:String(z(["category","type","group"])||"General").trim(),vendor:String(z(["vendor","payee","paid to"])||"").trim(),amount:parseFloat(String(z(["amount","total","cost"])||"").replace(/[^\d.]/g,""))||0,notes:String(z(["notes","description","remark"])||"").trim(),updatedAt:Date.now()}},Je=be=>{const z=be.split(/\r?\n/).map(ge=>ge.trim()).filter(Boolean);if(z.length===0)return[];let V=",";z[0].includes("	")?V="	":z[0].includes(";")&&(V=";");const le=ge=>{let we=[],ne=!1,Ue="";for(let Fe=0;Fe<ge.length;Fe++){const lt=ge[Fe];lt==='"'||lt==="'"?ne=!ne:lt===V&&!ne?(we.push(Ue.trim()),Ue=""):Ue+=lt}return we.push(Ue.trim()),we},Z=le(z[0]).map(ge=>ge.toLowerCase().replace(/["']/g,"").trim()),me=[];for(let ge=1;ge<z.length;ge++){const we=le(z[ge]);if(we.length===0||!we.some(Boolean))continue;const ne={};Z.forEach((Ue,Fe)=>{ne[Ue]=we[Fe]||""}),me.push(ne)}return{headers:Z,rows:me}},gt=async be=>{const z=ht.read(be,{type:"array"}),V={customers:[],items:[],invoices:[],purchaseOrders:[],expenses:[],settings:{}};for(const le of z.SheetNames){const Z=z.Sheets[le],me=ht.utils.sheet_to_json(Z,{defval:""});if(me&&me.length>0){const ge=Object.keys(me[0]).map(ne=>String(ne||"").trim().toLowerCase()),we=he(ge);we==="customers"?V.customers.push(...me.map(xe).filter(ne=>ne.name)):we==="items"?V.items.push(...me.map(Ne).filter(ne=>ne.name)):we==="invoices"?V.invoices.push(...me.map(M).filter(ne=>ne.number)):we==="purchaseOrders"?V.purchaseOrders.push(...me.map(Ae).filter(ne=>ne.number)):we==="expenses"&&V.expenses.push(...me.map(Re).filter(ne=>ne.amount>0))}}return V};if(T.endsWith(".json")){const be=await E.text(),z=JSON.parse(be);if(z.customers||z.items||z.invoices||z.store){const V=z.store||z;O={customers:V.customers||z.customers||[],items:V.items||z.items||[],invoices:V.invoices||z.invoices||[],purchaseOrders:z.purchaseOrders||[],expenses:z.expenses||[],settings:V.settings||z.settings||{}}}else{const V=Array.isArray(z)?z:[z];if(V.length>0){const le=he(Object.keys(V[0]));le==="customers"?O.customers=V.map(xe).filter(Z=>Z.name):le==="items"?O.items=V.map(Ne).filter(Z=>Z.name):le==="invoices"?O.invoices=V.map(M).filter(Z=>Z.number):le==="purchaseOrders"?O.purchaseOrders=V.map(Ae).filter(Z=>Z.number):le==="expenses"&&(O.expenses=V.map(Re).filter(Z=>Z.amount>0))}}}else if(T.endsWith(".csv")||T.endsWith(".txt")){const be=await E.text(),{headers:z,rows:V}=Je(be);if(V.length>0){const le=he(z);le==="customers"?O.customers=V.map(xe).filter(Z=>Z.name):le==="items"?O.items=V.map(Ne).filter(Z=>Z.name):le==="invoices"?O.invoices=V.map(M).filter(Z=>Z.number):le==="purchaseOrders"?O.purchaseOrders=V.map(Ae).filter(Z=>Z.number):le==="expenses"&&(O.expenses=V.map(Re).filter(Z=>Z.amount>0))}}else if(T.endsWith(".xls")||T.endsWith(".xlsx")){const be=await E.arrayBuffer();O=await gt(be)}else if(T.endsWith(".zip")){const be=await ls.loadAsync(E);for(const z of Object.keys(be.files)){const V=be.files[z];if(!V.dir){const le=z.toLowerCase();if(le.endsWith(".json")){const Z=await V.async("string"),me=JSON.parse(Z),ge=me.store||me;ge.customers&&O.customers.push(...(ge.customers||[]).map(xe).filter(we=>we.name)),ge.items&&O.items.push(...(ge.items||[]).map(Ne).filter(we=>we.name)),ge.invoices&&O.invoices.push(...(ge.invoices||[]).map(M).filter(we=>we.number)),me.purchaseOrders&&O.purchaseOrders.push(...(me.purchaseOrders||[]).map(Ae).filter(we=>we.number)),me.expenses&&O.expenses.push(...(me.expenses||[]).map(Re).filter(we=>we.amount>0)),ge.settings&&(O.settings={...O.settings,...ge.settings})}else if(le.endsWith(".csv")||le.endsWith(".txt")){const Z=await V.async("string"),{headers:me,rows:ge}=Je(Z),we=he(me);we==="customers"?O.customers.push(...ge.map(xe).filter(ne=>ne.name)):we==="items"?O.items.push(...ge.map(Ne).filter(ne=>ne.name)):we==="invoices"?O.invoices.push(...ge.map(M).filter(ne=>ne.number)):we==="purchaseOrders"?O.purchaseOrders.push(...ge.map(Ae).filter(ne=>ne.number)):we==="expenses"&&O.expenses.push(...ge.map(Re).filter(ne=>ne.amount>0))}else if(le.endsWith(".xlsx")||le.endsWith(".xls")){const Z=await V.async("arraybuffer"),me=await gt(Z);O.customers.push(...me.customers),O.items.push(...me.items),O.invoices.push(...me.invoices),O.purchaseOrders.push(...me.purchaseOrders),O.expenses.push(...me.expenses)}}}}else if(T.endsWith(".pdf")){if(!window.genmb?.docs?.parse)throw new Error("Document AI service is offline. Please use Excel, CSV, JSON, TXT, or ZIP instead.");const be=await window.genmb.docs.parse(E,"generic");if(!be)throw new Error("Document AI returned an empty response.");if(be.tables&&Array.isArray(be.tables))for(const V of be.tables){const le=V.rows||[];if(le.length>1){const Z=le.map(ne=>(Array.isArray(ne)?ne:ne.cells||ne.values||[]).map(Fe=>typeof Fe=="string"?Fe:Fe?.text||Fe?.value||"")),me=Z[0].map(ne=>String(ne||"").trim().toLowerCase()),ge=he(me),we=[];for(let ne=1;ne<Z.length;ne++){const Ue=Z[ne];if(Ue.length===0||!Ue.some(Boolean))continue;const Fe={};Ue.forEach((lt,_t)=>{Fe[me[_t]||`col_${_t}`]=lt}),we.push(Fe)}ge==="customers"?O.customers.push(...we.map(xe).filter(ne=>ne.name)):ge==="items"?O.items.push(...we.map(Ne).filter(ne=>ne.name)):ge==="invoices"?O.invoices.push(...we.map(M).filter(ne=>ne.number)):ge==="purchaseOrders"?O.purchaseOrders.push(...we.map(Ae).filter(ne=>ne.number)):ge==="expenses"&&O.expenses.push(...we.map(Re).filter(ne=>ne.amount>0))}}if(O.customers.length+O.items.length+O.invoices.length+O.purchaseOrders.length+O.expenses.length===0&&be.text){const V=be.text.split(`
`).map(Z=>Z.trim()).filter(Boolean);be.text.toLowerCase().includes("product")||be.text.toLowerCase().includes("item")||be.text.toLowerCase().includes("price")?O.items=V.map(Z=>{const me=Z.split(/[,\t|]|\s{2,}/).map(ge=>ge.trim()).filter(Boolean);return me.length>=2?{name:me[0],salePrice:parseFloat(me[1].replace(/[^\d.]/g,""))||0,unit:"pcs",updatedAt:Date.now()}:null}).filter(Z=>Z&&Z.name):O.customers=V.map(Z=>{const me=Z.split(/[,\t|]|\s{2,}/).map(ge=>ge.trim()).filter(Boolean);return me.length>=2?{name:me[0],phone:me[1].replace(/[^\d+]/g,""),updatedAt:Date.now()}:null}).filter(Z=>Z&&Z.name)}}else throw new Error("Unsupported file extension.");if(O.customers.length+O.items.length+O.invoices.length+O.purchaseOrders.length+O.expenses.length===0)throw new Error("We could not detect or extract any structured billing data from this file. Please check file format.");const vt=X.getState().customers||[],xt=aa(vt,O.customers),Y=X.getState().items||[],Me=sa(Y,O.items),v=X.getState().invoices||[],oe=ra(v,O.invoices),F=g("sma-purchase-orders"),De=ot(F,O.purchaseOrders,"id"),Be=g("sma-expenses"),Ye=ot(Be,O.expenses,"id"),We={...X.getState().settings||{},...O.settings||{}};n({customers:xt,items:Me,invoices:oe,settings:We}),localStorage.setItem("sma-purchase-orders",JSON.stringify(De)),localStorage.setItem("sma-expenses",JSON.stringify(Ye)),A({customers:O.customers.length,items:O.items.length,invoices:O.invoices.length,purchaseOrders:O.purchaseOrders.length,expenses:O.expenses.length,ledger:O.invoices.length});const qe=c?.email||Ut().email||We.email;qe&&qe.includes("@")&&navigator.onLine&&fs(qe)}catch(T){ee(T.message||"Smart Import failed.")}finally{d(!1),bt.current&&(bt.current.value="")}},ut=async()=>{h(!0),S({type:"",text:""});try{const E=Ut(),T=c?.email||E.email||t.email;if(!T||!T.includes("@"))throw new Error('No registered email address found. Please register your email in Settings under "Account Security & Recovery" or configure your business email.');if(!navigator.onLine)throw new Error("You are currently offline. Internet connection is required for Cloud Sync.");const O=await Aa(T,{forceUpload:!0});if(!O.success)throw new Error(O.reason||"Cloud Database Sync failed.");if(window.genmb?.email){const xe=G(),Ne=JSON.stringify(xe,null,2),M=`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-top: 0;">SHREE MAHESHWARA AGENCIES - Cloud Sync Backup</h2>
            <p style="font-size: 14px; line-height: 1.6;">Your LedgerCraft offline billing data has been backed up securely to the cloud. You can restore your workspace anytime using the JSON backup provided below.</p>
            
            <h3 style="color: #0f766e; font-size: 16px; margin: 20px 0 10px 0;">Backup Data Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Entity</th>
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Record Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Parties / Customers</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${xe.customers.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Products / Items</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${xe.items.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Invoices</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${xe.invoices.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Purchase Orders</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${xe.purchaseOrders.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Expenses</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${xe.expenses.length}</td>
                </tr>
              </tbody>
            </table>

            <div style="background-color: #f0fdfa; padding: 15px; border: 1px dashed #2dd4bf; border-radius: 8px; margin-top: 20px; font-size: 13px; line-height: 1.6; color: #0f766e;">
              <strong style="display: block; margin-bottom: 5px;">💡 How to restore this backup:</strong>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Select and copy the entire raw JSON text code shown below.</li>
                <li>Save it as a text file named <code>sma_backup.json</code> on your PC.</li>
                <li>Open the billing application, go to <strong>Backup & Export</strong> page.</li>
                <li>Click <strong>Import Data</strong> and select your saved JSON file to restore everything!</li>
              </ol>
            </div>

            <h4 style="margin: 25px 0 8px 0; color: #475569;">Raw Backup JSON:</h4>
            <textarea style="width: 100%; height: 180px; font-family: monospace; font-size: 11px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #f8fafc; color: #334155; resize: vertical;" readonly>${Ne}</textarea>
            
            <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              <p>Sync timestamp: ${new Date().toLocaleString()}</p>
              <p>© 2026 SHREE MAHESHWARA AGENCIES. All rights reserved.</p>
            </div>
          </div>
        `;await window.genmb.email.send({to:T,subject:`SMA Billing Cloud Sync - ${new Date().toLocaleDateString()}`,html:M})}const he=Date.now();localStorage.setItem("sma-last-sync-time",String(he)),localStorage.setItem("sma-last-sync-status","success"),C(String(he)),J("success"),S({type:"success",text:`Cloud Sync Successful! All local data is securely updated on the cloud under ${T}.`})}catch(E){S({type:"error",text:E.message||"Cloud Sync failed."})}finally{h(!1)}},ft=Ut(),Ce=c?.email||ft.email||t.email,bt=b.useRef(null);return r`<div className="space-y-6"><div className="card p-6 bg-[hsl(var(--primary)/0.03)] border-[hsl(var(--primary)/0.2)]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-2xl font-black"><${as} className="text-[hsl(var(--primary))]" /> Backup & Export</h2></div>${c?r`<div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-600 border border-emerald-500/20"><${Ht} size=${14} /> Connected: ${c.email}</div>`:r`<div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-black text-amber-600 border border-amber-500/20"><${He} size=${14} /> Offline Mode: Local only</div>`}</div></div>

  <!-- Cloud Sync Option -->
  <div className="card p-6 bg-[hsl(var(--primary)/0.04)] border-2 border-[hsl(var(--primary)/0.25)] space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary)/0.1)] grid place-items-center text-[hsl(var(--primary))] font-bold">
          <${ss} size=${22} />
        </div>
        <div>
          <h3 className="font-black text-lg text-[hsl(var(--foreground))]">Cloud Database Sync</h3>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-bold">
            Keep your devices (PC & Mobile) perfectly in sync. Changes upload immediately and sync automatically on login.
          </p>
        </div>
      </div>
      ${Ce?r`<span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 font-black">Active & Secure</span>`:r`<span className="text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full border border-amber-500/20 font-black">Not Registered</span>`}
    </div>

    ${N.text&&r`
      <div className=${`p-3.5 rounded-lg flex items-center gap-2.5 font-bold text-xs ${N.type==="error"?"bg-red-500/10 text-red-600":N.type==="info"?"bg-amber-500/10 text-amber-600":"bg-emerald-500/10 text-emerald-600"}`}>
        ${N.type==="error"?r`<${He} size=${15} />`:r`<${Ht} size=${15} />`}
        <span>${N.text}</span>
      </div>
    `}

    <div className="grid gap-4 md:grid-cols-2 bg-[hsl(var(--card))] p-4 rounded-xl border border-[hsl(var(--border))]">
      <div className="space-y-1">
        <p className="text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Sync Email ID</p>
        <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate max-w-full">
          ${Ce||r`<span className="text-red-500 italic">No registered email address found. (Go to Settings to register secure account email)</span>`}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Sync Status</p>
        <div className="text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-1.5 mt-0.5">
          ${x?w==="syncing"||$?r`<span className="flex items-center gap-1 text-xs font-black text-amber-600 animate-pulse"><span className="text-amber-500 text-[14px]">●</span> Syncing</span>`:r`<span className="flex items-center gap-1 text-xs font-black text-emerald-600"><span className="text-emerald-500 text-[14px]">●</span> Synced</span>`:r`<span className="flex items-center gap-1 text-xs font-black text-red-600"><span className="text-red-600 text-[14px]">●</span> Offline</span>`}
          ${I&&r`<span className="text-xs text-[hsl(var(--muted-foreground))] font-normal">(${new Date(Number(I)).toLocaleString()})</span>`}
        </div>
      </div>
    </div>

    <!-- Additional Option of Cloud Sync Toggle (User Requested) -->
    <div className="p-4 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-black text-[hsl(var(--foreground))] flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked=${W} 
              onChange=${E=>{const T=E.target.checked;L(T),localStorage.setItem("sma-auto-cloud-sync-enabled",String(T)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),T&&x&&Ce?(h(!0),S({type:"info",text:"Auto-Sync enabled! Starting synchronization..."}),at(async()=>{const{syncWorkspace:O}=await Promise.resolve().then(()=>st);return{syncWorkspace:O}},void 0,import.meta.url).then(({syncWorkspace:O})=>{O(Ce).then(he=>{h(!1),he.success?S({type:"success",text:"Cloud Auto-Sync is now active and data has been fully synchronized."}):S({type:"error",text:"Cloud Sync failed: "+(he.reason||"Network error")})}).catch(he=>{h(!1),S({type:"error",text:"Cloud Sync error: "+he.message})})})):S({type:"info",text:T?"Auto-sync enabled. It will trigger automatically when you go online.":"Auto-sync disabled. Backup uploads will only occur manually."})}} 
              className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" 
            />
            <span>Enable Real-Time Cloud Auto-Sync</span>
          </label>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-bold pl-6">
            Automatically upload local offline modifications and auto-update/download cloud data whenever your device is online.
          </p>
        </div>
        <span className=${`text-xs px-2.5 py-1 rounded-full font-black ${W?"bg-teal-500/10 text-teal-600 border border-teal-500/20":"bg-slate-500/10 text-slate-500 border border-slate-500/20"}`}>
          ${W?"AUTO-SYNC ACTIVE":"MANUAL ONLY"}
        </span>
      </div>
    </div>

    <div className="flex justify-end gap-3 pt-2">
      <button 
        disabled=${$||!Ce} 
        onClick=${ut} 
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-6 py-3 font-black text-white disabled:opacity-50 disabled:cursor-not-allowed transition hover:opacity-90 shadow-sm"
      >
        ${$?r`<${nt} className="animate-spin" size=${18} />`:r`<${is} size=${18} />`}
        <span>${$?"Syncing...":"Sync to Cloud Now"}</span>
      </button>
    </div>
  </div>

  ${l.text&&r`<div className=${`p-4 rounded-[var(--radius-md)] flex items-center gap-3 font-bold text-sm ${l.type==="error"?"bg-red-500/15 text-red-600":"bg-emerald-500/15 text-emerald-600"}`}>${l.type==="error"?r`<${He} size=${18} />`:r`<${Ht} size=${18} />`}${l.text}</div>`}${y?r`<div className="rounded-[var(--radius-md)] border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-800"><button onClick=${i} className="rounded bg-amber-600 px-3 py-2 text-white">Export Backup File</button> <a href=${y.url} download=${y.fileName} className="ml-2 underline">Direct file link</a></div>`:""}<div className="card border-[hsl(var(--primary)/0.25)] p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="font-black">Professional Offline Backup Files</h3></div><div className="grid gap-3 sm:grid-cols-2"><button disabled=${m} onClick=${ke} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white disabled:opacity-50">${m?r`<${nt} className="animate-spin" size=${18} />`:r`<${Xt} size=${18} />`} ${ae?"PDF - Save As":"Export PDF to Downloads"}</button><button disabled=${m} onClick=${Pe} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] px-5 py-3 font-black text-[hsl(var(--primary))] disabled:opacity-50">${m?r`<${nt} className="animate-spin" size=${18} />`:r`<${Yt} size=${18} />`} ${ae?"Excel - Save As":"Export Excel to Downloads"}</button></div></div></div>

  <!-- Smart Backup Import Summary Card -->
  ${H&&r`
    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
      <h4 className="font-black text-sm text-emerald-700 flex items-center gap-1.5">
        <${it} size=${18} /> Smart Backup Mapping & Import Completed Successfully!
      </h4>
      <p className="text-xs text-emerald-800 font-bold">
        We have automatically analyzed, categorized and segregated your records safely. No duplicate records were created. Matching IDs or invoice numbers have been successfully updated.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-center text-xs">
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${H.customers}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Parties / Customers</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${H.items}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Products / Items</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${H.invoices}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Invoices</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${H.purchaseOrders}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Purchase Orders</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${H.ledger}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Ledger Rows</p>
        </div>
      </div>
    </div>
  `}

  ${re&&r`
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-black flex items-center gap-2.5">
      <${He} size=${18} />
      <span>${re}</span>
    </div>
  `}

  <div className="card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-600"><${ns} /></div>
      <div>
        <h3 className="font-black">Smart Backup Import & Mapping</h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] font-bold mt-0.5">
          Accepts ZIP, PDF, Excel (.xls/.xlsx), CSV, JSON, TXT. Segregates Customers, Products, Invoices, POs automatically.
        </p>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <button disabled=${m} onClick=${Ie} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white disabled:opacity-50">
        ${ae?r`<${Ds} size=${18} />`:r`<${Os} size=${18} />`} 
        ${ae?"JSON Backup - Save As":"Export JSON to Downloads"}
      </button>
      
      <label className=${`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 font-black ${m?"cursor-not-allowed opacity-50":"cursor-pointer hover:bg-[hsl(var(--muted))]"}`}>
        <${wt} size=${18} />
        <span>${m?"Analyzing Backup...":"Import Data / Backup File"}</span>
        <input 
          disabled=${m} 
          type="file" 
          ref=${bt}
          accept=".pdf,.xls,.xlsx,.csv,.json,.txt,.zip,application/json,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain" 
          onChange=${E=>{const T=E.target.files?.[0];T&&Oe(T)}} 
          className="hidden" 
        />
      </label>
    </div>
  </div>

  <div className="card p-6 bg-slate-50 border-dashed">
    <h3 className="font-black text-sm uppercase tracking-wider text-slate-500">Summary</h3>
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-2xl font-black">${e.length}</p>
        <p className="text-xs font-bold text-slate-400">Parties</p>
      </div>
      <div>
        <p className="text-2xl font-black">${o.length}</p>
        <p className="text-xs font-bold text-slate-400">Invoices</p>
      </div>
      <div>
        <p className="text-2xl font-black">${a.length}</p>
        <p className="text-xs font-bold text-slate-400">Products</p>
      </div>
      <div>
        <p className="text-2xl font-black">${g("sma-purchase-orders").length}</p>
        <p className="text-xs font-bold text-slate-400">Purchase Orders</p>
      </div>
    </div>
  </div>
</div>`}function kr(){return r`<div className="card grid place-items-center p-10 text-center"><h2 className="text-4xl font-black">Page not found</h2><p className="mt-3 text-[hsl(var(--muted-foreground))]">The billing section you opened does not exist.</p><${Ee} to="/" className="mt-6 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">Go to dashboard</${Ee}></div>`}const Vt="sma-secure-account-v1",ma=()=>{try{return JSON.parse(localStorage.getItem(Vt)||"{}")}catch{return{}}},Gt=e=>{try{return decodeURIComponent(escape(atob(e||"")))}catch{return""}},Cr=e=>{try{return btoa(unescape(encodeURIComponent(e||"")))}catch{return e||""}};function Pr(){const{user:e,authLoading:a,authBusy:o,authError:t,authMessage:n,passcodeAuthorized:c,loginWithPasscode:m,signInGoogle:d,sendEmailLink:l}=St(),u=X(D=>D.settings),y=Qa(),k=wa(),[$,h]=b.useState(""),[N,S]=b.useState(""),[I,C]=b.useState("passcode"),[w,J]=b.useState("none"),[x,j]=b.useState(""),[W,L]=b.useState(""),[H,A]=b.useState(""),[re,ee]=b.useState(""),[ae,g]=b.useState(!1),[U,p]=b.useState(""),[K,G]=b.useState(""),[q,se]=b.useState("");b.useEffect(()=>{if(!a&&(e||c)){const D=k.state?.from?.pathname||"/dashboard";y(D,{replace:!0})}},[e,c,a,y,k]);const pe=async()=>{try{await d()}catch(D){console.error("Google sign in error:",D)}},$e=async D=>{if(D.preventDefault(),!(!$||!$.includes("@")))try{await l($)}catch(R){console.error("Email sign in error:",R)}},de=D=>{D.preventDefault(),N&&m(N)},ue=async D=>{if(D.preventDefault(),p(""),G(""),!x||!x.includes("@")){p("Enter a valid email address.");return}if(!navigator.onLine){p("You are offline. Email recovery requires an active internet connection.");return}g(!0);try{let R=await xa(x);if(!R){const B=ma();B&&B.email&&B.email.trim().toLowerCase()===x.trim().toLowerCase()&&(R=B)}if(!R)throw new Error("No registered account security was found for this email address.");if(localStorage.setItem(Vt,JSON.stringify(R)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),window.genmb?.email){const B=Gt(R.password)||"1234";await window.genmb.email.send({to:R.email,subject:"SMA Billing Software - Passcode Recovery",html:`
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <h2 style="color: #0d9488; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">SMA Billing Passcode Recovery</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">You requested passcode recovery for your <strong>SHREE MAHESHWARA AGENCIES</strong> billing software account.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Your Secure Login Passcode</p>
                <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 900; color: #0f766e; font-family: monospace; letter-spacing: 0.1em;">${B}</p>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">If you did not make this request, please log in and change your passcode immediately under Settings -> Account Security & Recovery.</p>
            </div>
          `}),G("Identity Verified! Your recovery passcode has been sent to your email address. Please check your inbox and spam folders.")}else throw new Error("Email service is not available at this moment.")}catch(R){p(R.message||"Failed to recover account.")}finally{g(!1)}},_e=D=>{D.preventDefault(),p(""),G("");const R=ma(),B=Gt(R.mobile),Pe=Gt(R.code);if(!B||!Pe){p("No offline security credentials found on this PC. Please use default passcode (1234 or SMA-2026) to enter.");return}if(W.trim()===B.trim()&&H.trim()===Pe.trim()){const ke=Gt(R.password);se(ke),G(`Verification Successful! Your current passcode is: "${ke}". You can now set a new passcode below or log in directly.`)}else p("Invalid mobile number or secret security code. Verification failed.")},je=async D=>{if(D.preventDefault(),p(""),G(""),!x||!x.includes("@")){p("Enter a valid email address.");return}if(!navigator.onLine){p("You are offline. Cloud Sync restoration requires an active internet connection.");return}g(!0);try{let R=await xa(x);R&&localStorage.setItem(Vt,JSON.stringify(R));const{downloadFromCloud:B,unpackAndRestoreWorkspace:Pe}=await at(async()=>{const{downloadFromCloud:Ie,unpackAndRestoreWorkspace:Oe}=await Promise.resolve().then(()=>st);return{downloadFromCloud:Ie,unpackAndRestoreWorkspace:Oe}},void 0,import.meta.url),ke=await B(x);if(ke)if(Pe(ke))G("Workspace successfully restored from Cloud Sync! All Invoices, Products, Parties, Settings, and Passcode have been restored. You can now use your passcode to open the app.");else throw new Error("Unpacking cloud backup failed.");else throw new Error("No cloud sync backup data was found for this email address.")}catch(R){p("Restore failed: "+(R.message||"Please check your email and try again."))}finally{g(!1)}},s=D=>{if(D.preventDefault(),p(""),G(""),re.length<6){p("New passcode must be at least 6 characters.");return}const B={...ma(),password:Cr(re),updated:new Date().toISOString()};localStorage.setItem(Vt,JSON.stringify(B)),window.dispatchEvent(new CustomEvent("sma-billing-live-update",{detail:{at:Date.now()}})),G("Passcode reset successfully! You can now use your new passcode to log in."),J("none"),S(re),ee(""),se("")};if(a)return r`
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent"></div>
          <p className="text-sm font-black animate-pulse">Verifying secure session...</p>
        </div>
      </div>
    `;const i=`flex items-center justify-center gap-1.5 py-2.5 text-xs font-black rounded-lg transition-all ${I==="passcode"?"bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border border-[hsl(var(--border))]":"text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`,f=`flex items-center justify-center gap-1.5 py-2.5 text-xs font-black rounded-lg transition-all ${I==="cloud"?"bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border border-[hsl(var(--border))]":"text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`;return r`
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-4 py-12 relative overflow-hidden">
      <!-- Decorative background lights -->
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[hsl(var(--primary)/0.15)] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[hsl(var(--primary)/0.15)] rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <!-- Logo and Brand -->
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white shadow-xl overflow-hidden mb-4">
            ${u.logo?r`<img src=${u.logo} className="h-full w-full object-contain" />`:r`<${Pt} size=${32} />`}
          </div>
          <h2 className="text-2xl font-black tracking-tight">${u.businessName}</h2>
          <p className="mt-2 text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Billing Portal Access</p>
        </div>

        <!-- Main Card -->
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-black border border-red-500/20">
              <${Pt} size=${14} /> Restricted Area
            </div>
            <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">
              Access protection active. Please verify your credentials to continue.
            </p>
          </div>

          <!-- Alert / Info Box -->
          ${t?r`
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-bold flex items-start gap-2.5">
              <span className="mt-0.5"><${Pt} size=${15} /></span>
              <span>${t}</span>
            </div>
          `:""}

          ${n?r`
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-start gap-2.5">
              <span className="mt-0.5"><${it} size=${15} /></span>
              <span>${n}</span>
            </div>
          `:""}

          <!-- Recovery Modes UI -->
          ${w!=="none"?r`
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 mb-2">
                <h3 className="font-black text-sm text-[hsl(var(--foreground))] uppercase tracking-wider">Account Recovery</h3>
                <button onClick=${()=>{J("none"),p(""),G("")}} className="text-xs font-black text-red-500 hover:underline">Cancel</button>
              </div>

              ${U?r`
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold flex items-start gap-2">
                  <span className="mt-0.5"><${Pt} size=${14} /></span>
                  <span>${U}</span>
                </div>
              `:""}

              ${K?r`
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 font-bold flex items-start gap-2">
                  <span className="mt-0.5"><${it} size=${14} /></span>
                  <span>${K}</span>
                </div>
              `:""}

              ${w==="select"?r`
                <div className="space-y-3">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-bold text-center mb-2">
                    Choose a secure recovery option to regain access to your billing system:
                  </p>
                  
                  <button onClick=${()=>{J("email"),p(""),G("")}} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">✉️</span>
                      <span>Recover via Registered Email</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Verify identity on cloud database and get passcode in secure recovery email.
                    </p>
                  </button>

                  <button onClick=${()=>{J("code"),p(""),G("")}} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">🔑</span>
                      <span>Recover via Security Code (Offline)</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Verify using your secret security code and registered mobile number offline.
                    </p>
                  </button>

                  <button onClick=${()=>{J("cloud"),p(""),G("")}} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">☁️</span>
                      <span>Restore Backup from Cloud Sync</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Download and unpack your entire database and security settings directly from cloud sync.
                    </p>
                  </button>
                </div>
              `:""}

              ${w==="email"?r`
                <form onSubmit=${ue} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Registered Email Address</label>
                    <input required type="email" placeholder="Enter your registered recovery email" value=${x} onInput=${D=>j(D.target.value)} disabled=${ae} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                  </div>
                  <button type="submit" disabled=${ae||!x} className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition">
                    ${ae?r`<${nt} className="animate-spin" size=${16} />`:""}
                    <span>Verify & Recover Passcode</span>
                  </button>
                  <button type="button" onClick=${()=>{J("select"),p(""),G("")}} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                </form>
              `:""}

              ${w==="code"?r`
                ${q?r`
                  <form onSubmit=${s} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Set New Secure Passcode</label>
                      <input required type="password" placeholder="Enter new passcode (6+ chars)" value=${re} onInput=${D=>ee(D.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 transition">
                      <span>Reset Passcode & Close</span>
                    </button>
                  </form>
                `:r`
                  <form onSubmit=${_e} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Registered Mobile Number</label>
                      <input required type="text" placeholder="Enter registered mobile" value=${W} onInput=${D=>L(D.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Secret Security Code</label>
                      <input required type="password" placeholder="Enter secret security code" value=${H} onInput=${D=>A(D.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 transition">
                      <span>Verify offline credentials</span>
                    </button>
                    <button type="button" onClick=${()=>{J("select"),p(""),G("")}} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                  </form>
                `}
              `:""}

              ${w==="cloud"?r`
                <form onSubmit=${je} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Sync Email Identity</label>
                    <input required type="email" placeholder="Enter your Cloud Sync email" value=${x} onInput=${D=>j(D.target.value)} disabled=${ae} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                  </div>
                  <button type="submit" disabled=${ae||!x} className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition">
                    ${ae?r`<${nt} className="animate-spin" size=${16} />`:""}
                    <span>Restore and Download Data</span>
                  </button>
                  <button type="button" onClick=${()=>{J("select"),p(""),G("")}} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                </form>
              `:""}
            </div>
          `:r`
            <!-- Regular Forms -->
            <!-- Tabs Switcher -->
            <div className="grid grid-cols-2 p-1 bg-[hsl(var(--muted))] rounded-xl border border-[hsl(var(--border))]">
              <button
                type="button"
                onClick=${()=>C("passcode")}
                className=${i}
              >
                <${Ms} size=${14} />
                <span>Secret Passcode</span>
              </button>
              <button
                type="button"
                onClick=${()=>C("cloud")}
                className=${f}
              >
                <${zs} size=${14} />
                <span>Cloud Account</span>
              </button>
            </div>

            <!-- Passcode Tab Content -->
            ${I==="passcode"?r`
              <form onSubmit=${de} className="space-y-4">
                <div>
                  <label htmlFor="passcode" className="block text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">
                    Enter Passcode or Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[hsl(var(--muted-foreground))] pointer-events-none">
                      <${Pt} size=${16} />
                    </span>
                    <input
                      id="passcode"
                      type="password"
                      required
                      placeholder="Enter secret passcode"
                      value=${N}
                      onInput=${D=>S(D.target.value)}
                      className="w-full block pl-10 pr-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition font-mono tracking-widest text-center"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled=${!N}
                  className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition active:scale-[0.98]"
                >
                  <span>Verify & Open App</span>
                  <${Oa} size=${16} />
                </button>

                <div className="flex justify-center pt-1.5">
                  <button
                    type="button"
                    onClick=${()=>{J("select"),p(""),G("")}}
                    className="text-xs font-black text-[hsl(var(--primary))] hover:underline"
                  >
                    Forgot Passcode? Recover Account
                  </button>
                </div>

                <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-xl border border-[hsl(var(--border))] text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] font-medium text-center">
                  💡 <span className="font-bold">First time?</span> Use default passcode: <code className="font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded border text-[hsl(var(--primary))] font-black">1234</code> or <code className="font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded border text-[hsl(var(--primary))] font-black">SMA-2026</code>. 
                  <p className="mt-1">You can customize this secure password anytime in the Settings page under Security.</p>
                </div>
              </form>
            `:r`
              <!-- Cloud Account Tab Content -->
              <div className="space-y-6">
                <!-- Google Sign-In -->
                <div>
                  <button
                    type="button"
                    disabled=${o}
                    onClick=${pe}
                    className="w-full flex items-center justify-center gap-3 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition active:scale-[0.98]"
                  >
                    <${rs} size=${18} />
                    <span>${o?"Connecting...":"Sign in with Google"}</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[hsl(var(--border))]"></div>
                  </div>
                  <span className="relative px-3 bg-[hsl(var(--card))] text-[10px] font-black uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    or use magic link
                  </span>
                </div>

                <!-- Email Magic Link Form -->
                <form onSubmit=${$e} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[hsl(var(--muted-foreground))] pointer-events-none">
                        <${Na} size=${16} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        required
                        disabled=${o}
                        placeholder="name@company.com"
                        value=${$}
                        onInput=${D=>h(D.target.value)}
                        className="w-full block pl-10 pr-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled=${o||!$.includes("@")}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] font-black text-sm px-4 py-3 rounded-xl transition disabled:opacity-50 active:scale-[0.98]"
                  >
                    <span>Send Secure Magic Link</span>
                    <${Oa} size=${16} />
                  </button>
                </form>
              </div>
            `}
          `}
        </div>

        <!-- Footer / Notes -->
        <div className="text-center text-[10px] font-bold text-[hsl(var(--muted-foreground))] space-y-1">
          <p>© 2026 ${u.businessName}. All rights reserved.</p>
          <p>This software operates offline-first. Your transaction logs and ledger database are cached securely in this browser's IndexedDB sandbox.</p>
        </div>
      </div>
    </div>
  `}function Ja({children:e}){const{user:a,authLoading:o,passcodeAuthorized:t}=St(),n=wa();return o?r`
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent"></div>
          <p className="text-sm font-black animate-pulse">Verifying secure session...</p>
        </div>
      </div>
    `:!a&&!t?r`<${Xa} to="/login" state=${{from:n}} replace=${!0} />`:e}function Er(){return r`
    <${Ra}>
      <${Da}>
        <${Te} path="/login" element=${r`<${Pr} />`} />
        
        <${Te} element=${r`<${Ja}><${Zs} /></${Ja}>`}>
          <${Te} path="/" element=${r`<${Xa} to="/dashboard" replace=${!0} />`} />
          <${Te} path="/dashboard" element=${r`<${er} />`} />
          <${Te} path="/tools" element=${r`<${ar} />`} />
          <${Te} path="/invoices" element=${r`<${rr} />`} />
          <${Te} path="/invoices/new" element=${r`<${Ua} />`} />
          <${Te} path="/invoices/:id/edit" element=${r`<${Ua} />`} />
          <${Te} path="/invoices/:id" element=${r`<${or} />`} />
          <${Te} path="/quotations" element=${r`<${nr} />`} />
          <${Te} path="/estimates" element=${r`<${ir} />`} />
          <${Te} path="/purchase-orders" element=${r`<${cr} />`} />
          <${Te} path="/customers" element=${r`<${pr} />`} />
          <${Te} path="/items" element=${r`<${vr} />`} />
          <${Te} path="/ledger" element=${r`<${ur} />`} />
          <${Te} path="/expenses" element=${r`<${xr} />`} />
          <${Te} path="/reports" element=${r`<${yr} />`} />
          <${Te} path="/data" element=${r`<${Sr} />`} />
          <${Te} path="/settings" element=${r`<${$r} />`} />
          <${Te} path="*" element=${r`<${kr} />`} />
        </${Te}>
      </${Da}>
    </${Ra}>
  `}window.desktopApp&&window.desktopApp.isElectron&&(navigator.share||(navigator.share=async e=>{if(e&&e.files&&e.files.length>0){const a=e.files[0],o=new FileReader,t=new Promise((m,d)=>{o.onloadend=()=>{const l=o.result.split(",")[1];m(l)},o.onerror=d});o.readAsDataURL(a);const n=await t,c=await window.desktopApp.shareFile({base64:n,fileName:a.name,title:e.title,text:e.text});if(!c.ok)throw new Error(c.error||"Failed to share file in Electron.")}else throw new Error("No files provided to share in Electron.")}),navigator.canShare||(navigator.canShare=e=>!!(e&&e.files&&e.files.length>0)));const Ir=()=>{const e="sma-billing-db",a="localstorage-mirror",o=()=>new Promise((l,u)=>{const y=indexedDB.open(e,1);y.onupgradeneeded=k=>{const $=k.target.result;$.objectStoreNames.contains(a)||$.createObjectStore(a)},y.onsuccess=k=>l(k.target.result),y.onerror=k=>u(k.target.error)}),t=async()=>{try{const y=(await o()).transaction(a,"readonly").objectStore(a),k=y.getAllKeys();k.onsuccess=()=>{k.result.forEach(h=>{const N=y.get(h);N.onsuccess=()=>{const S=N.result;if(S!=null&&!localStorage.getItem(h))try{localStorage.setItem(h,S)}catch(I){console.warn(`[Sync] Failed restoring key ${h} to localStorage:`,I)}}})}}catch(l){console.warn("[Sync] Failed to restore from IndexedDB:",l)}},n=async(l,u)=>{try{(await o()).transaction(a,"readwrite").objectStore(a).put(u,l)}catch(y){console.warn(`[Sync] Failed saving key ${l} to IndexedDB:`,y)}},c=async l=>{try{(await o()).transaction(a,"readwrite").objectStore(a).delete(l)}catch(u){console.warn(`[Sync] Failed removing key ${l} from IndexedDB:`,u)}};t().then(()=>{console.log("[Sync] IndexedDB restore completed.")});const m=localStorage.setItem;localStorage.setItem=function(l,u){m.apply(this,arguments),n(l,u)};const d=localStorage.removeItem;localStorage.removeItem=function(l){d.apply(this,arguments),c(l)}};try{Ir()}catch(e){console.error("[Sync] Failed setup:",e)}try{const e="shree-maheshwara-agencies-offline-v1",a=localStorage.getItem(e);if(a){const o=JSON.parse(a);o&&o.state&&o.state.settings&&(!o.state.settings.securityMode||o.state.settings.securityMode==="public")&&(o.state.settings.securityMode="private",localStorage.setItem(e,JSON.stringify(o)),console.log("[Migration] Migrated securityMode to private"))}}catch(e){console.warn("[Migration] Error migrating securityMode:",e)}ys.createRoot(document.getElementById("root")).render(r`<${ja}><${Er} /></${ja}>`);const xs=()=>{['a[href*="genmb"]','button[aria-label*="remix"]',"a.genmb-remix","div.genmb-remix"].forEach(o=>{document.querySelectorAll(o).forEach(t=>{t.remove()})}),Array.from(document.body.children).forEach(o=>{(o.textContent||"").toLowerCase().includes("remix on genmb")&&o.remove()})};xs();let Ya;const Ar=new MutationObserver(e=>{e.some(o=>o.addedNodes.length>0)&&(clearTimeout(Ya),Ya=setTimeout(xs,100))});Ar.observe(document.body,{childList:!0});const ya="sma-installed-app-version",Tr=async()=>{if(!navigator.onLine)return"";try{const e=await fetch(`./app-version.json?t=${Date.now()}`,{cache:"no-store"});if(!e.ok)throw new Error("Version check failed");const a=await e.json();return String(a.version||"").trim()}catch{return""}},Jt=e=>window.dispatchEvent(new CustomEvent("sma-update-available",{detail:{version:e}})),Lr=async e=>{if(e?.waiting)e.waiting.postMessage({type:"SKIP_WAITING"});else if(navigator.onLine)try{await e?.update?.()}catch{}},Rr=async()=>{try{const e=await caches?.keys?.()||[];await Promise.all(e.filter(o=>o.includes("sma-")).map(o=>caches.delete(o)));const a=await navigator.serviceWorker?.getRegistrations?.()||[];await Promise.all(a.map(o=>o.unregister()))}catch{}},Dr=async()=>{try{window.__smaTriggeredUpdate=!0;const e=await navigator.serviceWorker?.getRegistrations?.()||[];await Promise.all(e.map(o=>Lr(o))),await Rr();const a=localStorage.getItem("sma-pending-app-version");a&&localStorage.setItem(ya,a),window.location.href=window.location.href.split("?")[0]+"?update="+Date.now()+window.location.hash}catch{window.location.reload()}},pa=async e=>{if(navigator.onLine)try{const a=await Tr();if(!a)return;const o=localStorage.getItem(ya);o&&o!==a?(localStorage.setItem("sma-pending-app-version",a),e&&await e.update().catch(()=>{}),Jt(a)):o||localStorage.setItem(ya,a)}catch{}};window.addEventListener("sma-refresh-update-now",async()=>{await Dr()});"serviceWorker"in navigator&&window.addEventListener("load",()=>{if(new URLSearchParams(window.location.search).has("update")){const t=window.location.pathname+window.location.hash;window.history.replaceState({},document.title,t)}let a=!1;const o=()=>{a||caches.keys().then(t=>{t.some(n=>n.startsWith("sma-core-"))&&(console.log("Cache Created"),a=!0)})};navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(t=>{console.log("SW Registered"),o();let n=0;const c=setInterval(()=>{o(),n++,(n>15||a)&&clearInterval(c)},400);navigator.serviceWorker.ready.then(m=>{o(),console.log("Offline Ready"),m.active&&m.active.postMessage({type:"START_CRAWL"})}),pa(t),setInterval(()=>pa(t),60*1e3),window.addEventListener("online",()=>{pa(t)}),t.waiting&&Jt(localStorage.getItem("sma-pending-app-version")||"latest"),t.addEventListener("updatefound",()=>{const m=t.installing;m&&m.addEventListener("statechange",()=>{m.state==="installed"&&navigator.serviceWorker.controller&&Jt(localStorage.getItem("sma-pending-app-version")||"latest")})})}).catch(t=>{console.error("[SW] Registration failed:",t)}),navigator.serviceWorker.addEventListener("message",t=>{(t.data?.type==="APP_UPDATED"||t.data==="APP_UPDATED")&&Jt(localStorage.getItem("sma-pending-app-version")||"latest")}),navigator.serviceWorker.addEventListener("controllerchange",()=>{window.__smaTriggeredUpdate&&window.location.reload()})});
