
function setYear(){const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();}
function submitMessage(event){event.preventDefault();const m=document.getElementById('form-message');if(m)m.textContent='Thanks. Your request has been captured for the next build phase.';event.target.reset();return false;}
function fmt(v,d=2){return Number(v).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});}
function num(id){const el=document.getElementById(id);return el?parseFloat(el.value):NaN;}
function txt(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}

function calcConcrete(){const l=num('length'),w=num('width'),t=num('thickness'),u=document.getElementById('thicknessUnit').value,e=document.getElementById('error');
if([l,w,t].some(v=>!isFinite(v)||v<=0)){e.textContent='Enter positive values for all fields.';return;} e.textContent='';
const tf=u==='in'?t/12:t, cf=l*w*tf, cy=cf/27, bags=cf/0.60;
txt('resultMain',`${fmt(cy,2)} yd³`); txt('resultSub',`Equivalent volume: ${fmt(cf,2)} ft³`);
txt('detail1',`${fmt(bags,0)} bags of 80 lb premix (approx.)`); txt('detail2',`${fmt(cy*1.1,2)} yd³ with 10% waste allowance`);
txt('formulaOut',`(${l} × ${w} × ${fmt(tf,3)}) ÷ 27 = ${fmt(cy,2)} yd³`);
}

function calcProfitMargin(){const c=num('cost'),p=num('price'),e=document.getElementById('error');
if(!isFinite(c)||!isFinite(p)||c<0||p<=0){e.textContent='Enter a valid cost and a selling price greater than zero.';return;} e.textContent='';
const profit=p-c, margin=(profit/p)*100, markup=c===0?0:(profit/c)*100;
txt('resultMain',`${fmt(margin,2)}%`); txt('resultSub',`Profit amount: $${fmt(profit,2)}`);
txt('detail1',`Markup: ${fmt(markup,2)}%`); txt('detail2',`Break-even selling price: $${fmt(c,2)}`);
txt('formulaOut',`(Selling Price - Cost) ÷ Selling Price × 100 = ${fmt(margin,2)}%`);
}

function calcLoadFactor(){const k=num('annualKwh'),p=num('peakKw'),e=document.getElementById('error');
if(!isFinite(k)||!isFinite(p)||k<=0||p<=0){e.textContent='Enter valid annual kWh and peak demand values.';return;} e.textContent='';
const avg=k/8760, lf=(avg/p)*100; txt('resultMain',`${fmt(lf,2)}%`); txt('resultSub',`Average demand: ${fmt(avg,2)} kW`);
txt('detail1','Annual hours used in calculation: 8,760'); txt('detail2',`Equivalent annual kWh check: ${fmt(avg*8760,0)} kWh`);
txt('formulaOut',`(Annual kWh ÷ 8,760) ÷ Peak kW × 100 = ${fmt(lf,2)}%`);
}

function calcKwhDeposit(){const kw=num('connectedKw'),lf=num('loadFactorPct'),rate=num('rate'),months=num('months'),e=document.getElementById('error');
if([kw,lf,rate,months].some(v=>!isFinite(v)||v<=0)){e.textContent='Enter positive values for all fields.';return;} e.textContent='';
const annual=kw*(lf/100)*8760, monthly=annual/12, bill=monthly*rate, dep=bill*months;
txt('resultMain',`$${fmt(dep,2)}`); txt('resultSub',`Estimated monthly bill: $${fmt(bill,2)}`);
txt('detail1',`Estimated annual usage: ${fmt(annual,0)} kWh`); txt('detail2',`Estimated monthly usage: ${fmt(monthly,0)} kWh`);
txt('formulaOut',`Connected kW × Load Factor × 8,760 × Rate ÷ 12 × Deposit Months = $${fmt(dep,2)}`);
}

function calcVoltageDrop(){const a=num('amps'),ft=num('oneWayFeet'),phase=document.getElementById('phase').value,volts=num('systemVoltage'),mat=document.getElementById('material').value,size=document.getElementById('conductorSize').value,e=document.getElementById('error');
const r={copper:{'14':2.525,'12':1.588,'10':0.999,'8':0.6282,'6':0.3951,'4':0.2485,'2':0.1563,'1/0':0.0983,'2/0':0.0779,'4/0':0.0490},aluminum:{'12':2.62,'10':1.65,'8':1.04,'6':0.653,'4':0.410,'2':0.258,'1/0':0.162,'2/0':0.128,'4/0':0.0808}};
if([a,ft,volts].some(v=>!isFinite(v)||v<=0)){e.textContent='Enter positive values for amps, one-way length, and system voltage.';return;}
const rp=r[mat][size]; if(!rp){e.textContent='Selected conductor data is unavailable.';return;} e.textContent='';
const factor=phase==='single'?2:1.732, drop=factor*a*(ft/1000)*rp, pct=(drop/volts)*100;
txt('resultMain',`${fmt(drop,2)} V`); txt('resultSub',`Voltage drop percentage: ${fmt(pct,2)}%`);
txt('detail1',`Resistance used: ${rp} Ω / 1000 ft`); txt('detail2',pct<=3?'Generally within a common 3% design target.':'Above a common 3% design target. Consider upsizing conductor.');
txt('formulaOut',`${factor} × ${a} × (${ft} ÷ 1000) × ${rp} = ${fmt(drop,2)} V`);
}

document.addEventListener('DOMContentLoaded',function(){setYear();
const ids=[['calcConcreteBtn',calcConcrete],['calcProfitBtn',calcProfitMargin],['calcLoadFactorBtn',calcLoadFactor],['calcKwhDepositBtn',calcKwhDeposit],['calcVoltageDropBtn',calcVoltageDrop]];
ids.forEach(([id,fn])=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn);});
});
