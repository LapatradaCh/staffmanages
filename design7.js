// ================= Variables สำหรับ Design 7 =================
let d7Tab = 'staff';
let selectedD7StaffId = null;
let selectedD7PendingId = null;
let isD7EditMode = false;
let d7TempRole = null; 
let d7TempResp = null; 

// ================= Custom CSS สำหรับ Scrollbar แนวนอนและแนวตั้ง =================
if (!document.getElementById('d7CustomStyle')) {
    const style = document.createElement('style');
    style.id = 'd7CustomStyle';
    style.innerHTML = `
        /* เลื่อนแนวตั้ง (ความรับผิดชอบ) */
        .d7-scroll-y::-webkit-scrollbar { width: 4px; }
        .d7-scroll-y::-webkit-scrollbar-track { background: transparent; }
        .d7-scroll-y::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .d7-scroll-y { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        
        /* เลื่อนแนวนอน (สิทธิ์การใช้งาน) */
        .d7-scroll-x::-webkit-scrollbar { height: 4px; }
        .d7-scroll-x::-webkit-scrollbar-track { background: transparent; }
        .d7-scroll-x::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .d7-scroll-x { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
    `;
    document.head.appendChild(style);
}

// ================= ฟังก์ชันสลับ Tab =================
window.setD7Tab = function(tab) {
    d7Tab = tab;
    isD7EditMode = false; 
    const tabs = ['staff', 'admin', 'user', 'pending'];
    const idMap = { 'staff': 'd7TabStaff', 'admin': 'd7TabAdmin', 'user': 'd7TabUser', 'pending': 'd7TabPending' };
    
    tabs.forEach(t => {
        const el = document.getElementById(idMap[t]);
        if(el) {
            if (t === tab) {
                el.classList.add('bg-white', 'text-slate-900', 'border', 'border-slate-200');
                el.classList.remove('text-slate-500', 'hover:text-slate-700', 'border-transparent');
                el.setAttribute('aria-selected', 'true');
            } else {
                el.classList.remove('bg-white', 'text-slate-900', 'border-slate-200');
                el.classList.add('text-slate-500', 'hover:text-slate-700', 'border-transparent');
                el.setAttribute('aria-selected', 'false');
            }
        }
    });
    if (typeof render === 'function') render(); 
};

// ================= ★ ฟังก์ชันเข้าสู่โหมดแก้ไข (Single Edit) ★ =================
window.enterD7Edit = function() {
    const s = staffList.find(x => x.id === selectedD7StaffId);
    if(s) {
        d7TempRole = s.role;
        d7TempResp = [...(s.resp || [])];
    }
    isD7EditMode = true;
    render();
};

window.cancelD7Edit = function() {
    isD7EditMode = false;
    d7TempRole = null; 
    d7TempResp = null; 
    render();
};

window.saveD7Edit = function() {
    const s = staffList.find(x => x.id === selectedD7StaffId);
    if (s) {
        s.role = d7TempRole; 
        s.resp = [...d7TempResp];
        alert('✅ บันทึกข้อมูลสำเร็จ');
    } else {
        alert('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
    isD7EditMode = false;
    d7TempRole = null;
    d7TempResp = null;
    render();
};

window.d7ToggleRole = function() {
    d7TempRole = d7TempRole === 'admin' ? 'staff' : 'admin';
    render(); 
};

// ================= ฟังก์ชัน Scroll สำหรับ iPhone / iOS =================
window.d7ScrollToDetail = function() {
    if (window.innerWidth < 1024) {
        setTimeout(() => {
            const el = document.getElementById('d7DetailPanel');
            if(el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const y = rect.top + scrollTop - 16;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 150);
    }
};

// ================= ฟังก์ชันสร้างโครงร่าง HTML =================
function initDesign7Skeleton() {
    const container = document.getElementById('design7Container');
    if (!container) return;

    if (container.innerHTML.trim() === '') {
        let skelHtml = '<div class="bg-white p-3 sm:p-5 md:p-8">';
        
        skelHtml += '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 md:pb-6 border-b border-slate-100">';
        skelHtml += '<div class="min-w-0 flex-1"><span class="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full mb-1">Clean & Flat Design</span><h1 class="text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate">จัดการเจ้าหน้าที่ในหน่วยงาน</h1></div>';
        skelHtml += '<button aria-label="เปิด QR Code เชิญเจ้าหน้าที่" onclick="openModal(\'qrModal\')" class="self-start sm:self-auto shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 md:px-4 py-2 rounded-xl font-bold text-[11px] md:text-xs flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"><span class="material-icons text-sm" aria-hidden="true">qr_code</span> <span>QR Code เชิญ</span></button>';
        skelHtml += '</div>';

        skelHtml += '<div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mt-4 md:mt-6">';
        skelHtml += '<div role="tablist" class="flex bg-slate-50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar flex-nowrap border border-slate-100">';
        skelHtml += '<button role="tab" aria-selected="true" onclick="setD7Tab(\'staff\')" id="d7TabStaff" class="cursor-pointer flex-1 md:flex-none whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">ทั้งหมด</button>';
        skelHtml += '<button role="tab" aria-selected="false" onclick="setD7Tab(\'admin\')" id="d7TabAdmin" class="cursor-pointer flex-1 md:flex-none whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-slate-600 border border-transparent hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">ผู้ดูแลระบบ</button>';
        skelHtml += '<button role="tab" aria-selected="false" onclick="setD7Tab(\'user\')" id="d7TabUser" class="cursor-pointer flex-1 md:flex-none whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-slate-600 border border-transparent hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">เจ้าหน้าที่</button>';
        skelHtml += '<button role="tab" aria-selected="false" onclick="setD7Tab(\'pending\')" id="d7TabPending" class="cursor-pointer flex-1 md:flex-none whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-slate-600 border border-transparent hover:text-slate-800 flex justify-center items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">รออนุมัติ <span id="d7PendingCount" class="bg-amber-600 text-white px-2 py-0.5 rounded-md text-[10px] sm:text-[11px]">0</span></button>';
        skelHtml += '</div>';
        skelHtml += '<div class="relative w-full md:w-64 shrink-0"><span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" aria-hidden="true">search</span><input type="text" aria-label="ค้นหารายชื่อ" placeholder="ค้นหารายชื่อ..." oninput="handleSearch(this.value)" class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-[11px] sm:text-xs font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-800"></div>';
        skelHtml += '</div>';

        skelHtml += '<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6">';
        skelHtml += '<div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-2 sm:p-3 h-[350px] lg:h-[550px] overflow-y-auto hide-scrollbar space-y-2" id="d7ListPanel"></div>';
        skelHtml += '<div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col h-auto min-h-[350px] lg:h-[550px] overflow-y-auto hide-scrollbar" id="d7DetailPanel" role="region" aria-live="polite"></div>';
        skelHtml += '</div></div>';
        
        container.innerHTML = skelHtml;
    }
}

// ================= ฟังก์ชัน Render ข้อมูล =================
window.renderDesign7 = function(filtered, pendingFiltered, pendingList, staffList) {
    initDesign7Skeleton();

    const listEl = document.getElementById('d7ListPanel');
    const detailEl = document.getElementById('d7DetailPanel');
    const pendBadge = document.getElementById('d7PendingCount');
    
    let currentScroll = 0;
    if (listEl) currentScroll = listEl.scrollTop;
    
    if(pendBadge) pendBadge.innerText = pendingList.length;

    // ----------- กรณีเลือกรอพิจารณา -----------
    if(d7Tab === 'pending') {
        if (pendingFiltered.length > 0) {
            const found = pendingFiltered.find(p => p.id === selectedD7PendingId);
            if (!found) selectedD7PendingId = pendingFiltered[0].id;
        } else {
            selectedD7PendingId = null;
        }

        let listHtml = '';
        pendingFiltered.forEach(p => {
            const isSel = selectedD7PendingId === p.id;
            const bgClass = isSel ? 'bg-[#151b2b] text-white border-[#151b2b]' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900';
            const iconBgClass = isSel ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800';
            const selTextClass = isSel ? 'text-slate-300' : 'text-slate-600';
            const badgeBgClass = isSel ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200';

            listHtml += '<button type="button" aria-pressed="' + isSel + '" onclick="selectedD7PendingId=' + p.id + '; isD7EditMode=false; render(); d7ScrollToDetail();" class="w-full text-left p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-slate-500 ' + bgClass + '">';
            listHtml += '    <div class="flex items-center gap-3 sm:gap-4 min-w-0">';
            listHtml += '        <div class="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg font-bold flex items-center justify-center text-[14px] sm:text-[15px] ' + iconBgClass + '" aria-hidden="true">' + p.initial + '</div>';
            listHtml += '        <div class="min-w-0">';
            listHtml += '            <p class="font-bold text-[13px] sm:text-[14px] truncate">' + p.name + '</p>';
            listHtml += '            <p class="text-[10px] sm:text-[11px] ' + selTextClass + ' font-mono mt-0.5 truncate">' + p.requestDate + '</p>';
            listHtml += '        </div>';
            listHtml += '    </div>';
            listHtml += '    <span class="shrink-0 text-[9px] sm:text-[11px] px-2 sm:px-3 py-1 rounded-full font-bold ' + badgeBgClass + '">คำขอใหม่</span>';
            listHtml += '</button>';
        });
        
        if (listEl) {
            listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-500 gap-2"><span class="material-icons text-3xl sm:text-4xl" aria-hidden="true">inbox</span><p class="text-xs sm:text-sm font-bold">ไม่มีคำขออนุมัติ</p></div>';
            listEl.scrollTop = currentScroll;
        }

        const p = pendingList.find(x => x.id === selectedD7PendingId);
        if(p && detailEl) {
            let reqRoleBadge = p.requestRole === 'admin' 
                ? '<span class="px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-[10px] sm:text-[11px] font-bold shrink-0 min-w-max flex-none" style="white-space: nowrap;">ผู้ดูแลระบบ</span>'
                : '<span class="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-slate-800 border border-slate-300 rounded-lg text-[10px] sm:text-[11px] font-bold shrink-0 min-w-max flex-none" style="white-space: nowrap;">เจ้าหน้าที่</span>';

            let detailHtml = '<div class="flex flex-col min-h-full relative">';
            detailHtml += '<div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-5 pb-4 sm:pb-6 shrink-0">';
            detailHtml += '<div class="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] shrink-0 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl sm:text-2xl flex items-center justify-center" aria-hidden="true">' + p.initial + '</div>';
            detailHtml += '<div class="min-w-0 flex-1 pt-1"><h2 class="text-[16px] sm:text-[18px] font-black text-slate-900 truncate">' + p.name + '</h2><p class="text-[12px] sm:text-[13px] text-slate-600 font-mono mb-1.5">' + p.phone + '</p><span class="inline-block bg-amber-50 text-amber-700 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold border border-amber-200 shrink-0 flex-none min-w-max" style="white-space: nowrap;">คำขอเข้าร่วมหน่วยงาน</span></div></div>';
            detailHtml += '<div class="w-full h-px bg-slate-200 mb-4 sm:mb-6 shrink-0"></div>';
            detailHtml += '<div class="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 mb-auto shrink-0">';
            detailHtml += '<div class="flex justify-between items-center mb-3 sm:mb-4"><span class="text-[10px] sm:text-[11px] font-bold text-slate-500">บทบาทที่ต้องการ</span>' + reqRoleBadge + '</div>';
            detailHtml += '<div class="flex justify-between items-center border-t border-slate-200 pt-3 sm:pt-4"><span class="text-[10px] sm:text-[11px] font-bold text-slate-500">วันที่ส่งคำขอ</span><span class="text-[12px] sm:text-[13px] font-bold text-slate-800">' + p.requestDate + '</span></div></div>';
            
            detailHtml += '<div class="flex flex-col sm:flex-row gap-2 pt-4 sm:pt-6 shrink-0"><button type="button" aria-label="ดูข้อมูลผู้ขอ" onclick="showPendingInfo(\'' + p.name + '\', \'' + p.phone + '\')" class="cursor-pointer w-full sm:flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-2.5 sm:py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"><span class="material-icons text-[14px] mr-1.5" aria-hidden="true">info</span> <span style="white-space: nowrap;">ข้อมูล</span></button>';
            detailHtml += '<div class="flex gap-2 w-full"><button type="button" aria-label="ปฏิเสธคำขอ" onclick="handleReject(' + p.id + ')" class="cursor-pointer flex-[1] bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold py-2.5 sm:py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"><span style="white-space: nowrap;">ปฏิเสธ</span></button>';
            detailHtml += '<button type="button" aria-label="อนุมัติคำขอ" onclick="handleApprove(' + p.id + ')" class="cursor-pointer flex-[1.5] bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 sm:py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"><span style="white-space: nowrap;">อนุมัติ</span></button></div></div></div>';
            
            detailEl.innerHTML = detailHtml;
        } else if(detailEl) { detailEl.innerHTML = ''; }

    } else {
        // ----------- กรณีแสดงรายชื่อปกติ -----------
        const d7Staffs = filtered.filter(s => {
            if(d7Tab === 'staff') return true;
            if(d7Tab === 'admin') return s.role === 'admin';
            if(d7Tab === 'user') return s.role === 'staff';
            return true;
        });

        if (d7Staffs.length > 0) {
            const found = d7Staffs.find(s => s.id === selectedD7StaffId);
            if (!found) selectedD7StaffId = d7Staffs[0].id;
        } else {
            selectedD7StaffId = null;
        }
        
        let listHtml = '';
        d7Staffs.forEach(s => {
            const isSel = selectedD7StaffId === s.id;
            
            const bgClass = isSel ? 'bg-[#151b2b] text-white border-[#151b2b]' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900';
            const iconBgClass = isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800';
            const selTextClass = isSel ? 'text-slate-300' : 'text-slate-600';
            const badgeClass = isSel ? 'bg-white/20 text-white' : (s.role === 'admin' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200');
            const roleName = s.role === 'admin' ? 'ผู้ดูแล' : 'เจ้าหน้าที่';

            listHtml += '<button type="button" aria-pressed="' + isSel + '" onclick="selectedD7StaffId=' + s.id + '; isD7EditMode=false; render(); d7ScrollToDetail();" class="w-full text-left p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-slate-500 ' + bgClass + '">';
            listHtml += '    <div class="flex items-center gap-3 sm:gap-4 min-w-0">';
            listHtml += '        <div class="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg font-bold flex items-center justify-center text-[14px] sm:text-[15px] ' + iconBgClass + '" aria-hidden="true">' + s.initial + '</div>';
            listHtml += '        <div class="min-w-0">';
            listHtml += '            <p class="font-bold text-[13px] sm:text-[14px] truncate">' + s.name + '</p>';
            listHtml += '            <p class="text-[10px] sm:text-[11px] ' + selTextClass + ' font-mono mt-0.5 truncate">' + s.phone + '</p>';
            listHtml += '        </div>';
            listHtml += '    </div>';
            listHtml += '    <span class="shrink-0 text-[9px] sm:text-[11px] px-2 sm:px-3 py-1 rounded-full font-bold border ' + badgeClass + '">' + roleName + '</span>';
            listHtml += '</button>';
        });
        
        if(listEl) {
            listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-500 gap-2"><span class="material-icons text-3xl sm:text-4xl" aria-hidden="true">search_off</span><p class="text-xs sm:text-sm font-bold">ไม่พบข้อมูล</p></div>';
            listEl.scrollTop = currentScroll;
        }

        const s = staffList.find(x => x.id === selectedD7StaffId);
        if(s && detailEl) {
            const profileBgClass = 'bg-[#c6f6d5] text-[#065f46]';
            
            const displayRole = isD7EditMode ? d7TempRole : s.role;
            const displayResp = isD7EditMode ? (d7TempResp || []) : (s.resp || []);
            
            let roleBadgeClass = displayRole === 'admin' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-800 border-slate-200';
            let roleNameDetail = displayRole === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่';
            let roleToggleBtnText = displayRole === 'admin' ? 'ปรับเป็นเจ้าหน้าที่' : 'ปรับเป็น Admin';

            let respHtml = '';
            let respCountText = '';
            if (displayResp && displayResp.length > 0) {
                // สร้างชิปส์ทั้งหมด
                let chipsHtml = displayResp.map(r => '<span class="inline-flex items-center h-6 sm:h-7 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] sm:text-[11px] font-bold shadow-sm max-w-[120px] sm:max-w-[160px] shrink-0"><span class="truncate w-full text-left" title="'+r+'">' + r + '</span></span>').join('');
                
                // ★ เปลี่ยนโครงสร้างเป็น flex-wrap + เลื่อนแนวตั้ง (Vertical Scroll) เพื่อให้มองเห็นและปัดอ่านง่ายขึ้น
                respHtml = '<div class="w-full mt-1.5 overflow-y-auto max-h-[90px] sm:max-h-[110px] pr-2 d7-scroll-y">';
                respHtml += '<div class="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">';
                respHtml += chipsHtml;
                respHtml += '</div></div>';
                
                respCountText = ' (' + displayResp.length + ' หมวด)';
            } else {
                respHtml = '<span class="inline-flex items-center h-6 sm:h-7 text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">ไม่ได้ระบุ</span>';
            }

            let isAuthen = s.isAuthen !== false;
            let statusCardsHtml = '';

            if (isAuthen) {
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-emerald-700 text-[14px] sm:text-[16px]" aria-hidden="true">verified</span><div><div class="text-[9px] sm:text-[11px] font-bold text-emerald-800 mb-0.5">สถานะ Authen</div><div class="text-[10px] sm:text-xs font-bold text-emerald-900 truncate">ผ่านการ Authen</div></div></div>';
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-blue-700 text-[14px] sm:text-[16px]" aria-hidden="true">login</span><div><div class="text-[9px] sm:text-[11px] font-bold text-blue-800 mb-0.5">เข้าครั้งแรก</div><div class="text-[10px] sm:text-xs font-bold text-blue-900 truncate">10 มี.ค. 2024</div></div></div>';
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-amber-700 text-[14px] sm:text-[16px]" aria-hidden="true">history</span><div><div class="text-[9px] sm:text-[11px] font-bold text-amber-800 mb-0.5">ใช้งานล่าสุด</div><div class="text-[10px] sm:text-xs font-bold text-amber-900 truncate">วันนี้ 08:15</div></div></div>';
            } else {
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-slate-100 border border-slate-300 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-slate-500 text-[14px] sm:text-[16px]" aria-hidden="true">hourglass_empty</span><div><div class="text-[9px] sm:text-[11px] font-bold text-slate-600 mb-0.5">สถานะ Authen</div><div class="text-[10px] sm:text-xs font-bold text-slate-700 truncate">ยังไม่ Authen</div></div></div>';
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-slate-100 border border-slate-300 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-slate-500 text-[14px] sm:text-[16px]" aria-hidden="true">login</span><div><div class="text-[9px] sm:text-[11px] font-bold text-slate-600 mb-0.5">เข้าครั้งแรก</div><div class="text-[10px] sm:text-xs font-bold text-slate-700 truncate">-</div></div></div>';
                statusCardsHtml += '<div class="shrink-0 w-[115px] sm:w-auto p-2.5 sm:p-3 bg-slate-100 border border-slate-300 rounded-xl flex flex-col gap-1 sm:gap-1.5"><span class="material-icons text-slate-500 text-[14px] sm:text-[16px]" aria-hidden="true">history</span><div><div class="text-[9px] sm:text-[11px] font-bold text-slate-600 mb-0.5">ใช้งานล่าสุด</div><div class="text-[10px] sm:text-xs font-bold text-slate-700 truncate">-</div></div></div>';
            }

            // ปุ่มแก้ไขสิทธิ์ ไถเลื่อนแนวนอนได้
            let roleToggleBtnHtml = isD7EditMode 
                ? '<button type="button" onclick="d7ToggleRole()" aria-label="สลับบทบาทสิทธิ์การใช้งาน" class="cursor-pointer shrink-0 flex-none min-w-max inline-flex items-center justify-center gap-1 px-2.5 h-6 sm:h-7 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 whitespace-nowrap" style="white-space: nowrap;"><span class="material-icons text-[12px] sm:text-[14px] flex-none" aria-hidden="true">swap_horiz</span> <span class="whitespace-nowrap flex-none" style="white-space: nowrap;">' + roleToggleBtnText + '</span></button>' 
                : '';

            // ปุ่มแก้ไขหมวดหมู่
            let respEditBtnHtml = isD7EditMode 
                ? '<button type="button" onclick="openResponsibilitiesModal(' + s.id + ')" aria-label="แก้ไขข้อมูลด้านความรับผิดชอบ" class="cursor-pointer shrink-0 flex-none min-w-max px-2.5 py-1 sm:px-3 sm:py-1.5 inline-flex items-center justify-center gap-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 whitespace-nowrap"><span class="material-icons text-[12px] sm:text-[14px]">edit</span> เลือกหมวดหมู่</button>' 
                : '';

            // ★ ปุ่มแก้ไข / บันทึก วางไว้มุมขวาบนแบบตายตัว ไม่กระเทือนโครงสร้างอื่น ★
            let mainEditBtnHtml = isD7EditMode 
                ? '<div class="absolute top-0 right-0 flex items-center gap-1 sm:gap-2 z-20 bg-white/90 backdrop-blur-sm pl-2 pb-1 rounded-bl-xl">' +
                  '<button type="button" aria-label="ยกเลิกการแก้ไข" onclick="cancelD7Edit()" class="cursor-pointer flex-none shrink-0 min-w-max inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 h-7 sm:h-8 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-[10px] sm:text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-slate-400 whitespace-nowrap shadow-sm"><span class="material-icons text-[12px] sm:text-[14px]" aria-hidden="true">close</span> <span class="hidden sm:inline whitespace-nowrap flex-none">ยกเลิก</span></button>' +
                  '<button type="button" aria-label="บันทึกการแก้ไข" onclick="saveD7Edit()" class="cursor-pointer flex-none shrink-0 min-w-max inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 h-7 sm:h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm text-[10px] sm:text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 whitespace-nowrap"><span class="material-icons text-[12px] sm:text-[14px]" aria-hidden="true">save</span> <span class="hidden sm:inline whitespace-nowrap flex-none">บันทึก</span></button>' +
                  '</div>'
                : '<button type="button" aria-label="เปิดโหมดแก้ไข" onclick="enterD7Edit()" class="absolute top-0 right-0 cursor-pointer flex-none shrink-0 min-w-max px-2.5 sm:px-3 h-7 sm:h-8 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 whitespace-nowrap z-20" title="เปิดโหมดแก้ไข"><span class="material-icons text-[12px] sm:text-[14px]" aria-hidden="true">edit</span> แก้ไขข้อมูล</button>';

            let deleteBtnHtml = isD7EditMode 
                ? '<div class="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 flex justify-end shrink-0"><button type="button" aria-label="ลบเจ้าหน้าที่ออกจากหน่วยงาน" onclick="handleRemoveStaff(' + s.id + ')" class="cursor-pointer flex-none shrink-0 min-w-max inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-[11px] sm:text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 whitespace-nowrap" style="white-space: nowrap;"><span class="material-icons text-[16px] sm:text-[18px] flex-none" aria-hidden="true">person_remove</span> <span class="whitespace-nowrap flex-none" style="white-space: nowrap;">ลบออกจากหน่วยงาน</span></button></div>' 
                : '';

            let detailHtml = '<div class="flex flex-col min-h-full">';
            
            // ★ โครงสร้าง Profile: ปลดล็อก pr-140 ออกจากชื่อ เพื่อไม่ให้แหว่ง ★
            detailHtml += '<div class="relative w-full pb-4 sm:pb-6 shrink-0" id="d7ProfileContainer">';
            detailHtml += mainEditBtnHtml; // วางปุ่ม absolute ที่มุมขวาบน
            
            detailHtml += '<div class="flex flex-row gap-3 sm:gap-4 min-w-0 flex-1 overflow-hidden">';
            
            // รูปโปรไฟล์
            detailHtml += '<div class="w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] shrink-0 flex-none rounded-2xl ' + profileBgClass + ' font-black text-xl sm:text-2xl flex items-center justify-center" aria-hidden="true">' + s.initial + '</div>';
            
            // กล่องข้อความ ชื่อและเบอร์โทร (เว้นที่ว่างด้านขวาเฉพาะบรรทัดนี้ เพื่อหลบปุ่ม)
            detailHtml += '<div class="min-w-0 pt-0.5 sm:pt-1 flex-1 w-full">';
            detailHtml += '<div class="pr-[75px] sm:pr-[130px] w-full">';
            detailHtml += '<h2 class="text-[16px] sm:text-[18px] font-black text-slate-900 truncate">' + s.name + '</h2>';
            detailHtml += '<p class="text-[11px] sm:text-[13px] text-slate-600 font-mono mb-1.5 truncate">' + s.phone + '</p>';
            detailHtml += '</div>';
            
            // ★ กล่องป้ายยศและปุ่มสลับสิทธิ์ ให้ยืดสุดขอบ และเลื่อนซ้ายขวาได้ (ไม่โดน pr บีบแล้ว) ★
            detailHtml += '<div class="w-full overflow-x-auto hide-scrollbar pb-1 mt-0.5 d7-scroll-x">';
            detailHtml += '<div class="flex flex-nowrap items-center gap-1.5 sm:gap-2 w-max pr-2">';
            detailHtml += '<span class="shrink-0 flex-none min-w-max inline-flex items-center justify-center h-6 sm:h-7 border ' + roleBadgeClass + ' px-2.5 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap" style="white-space: nowrap;">' + roleNameDetail + '</span>';
            detailHtml += roleToggleBtnHtml;
            detailHtml += '</div></div></div></div></div>'; // จบ Profile Container

            detailHtml += '<div class="w-full h-px bg-slate-200 mb-4 sm:mb-6 shrink-0"></div>';

            detailHtml += '<div class="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 mb-4 sm:mb-6 flex flex-col w-full shrink-0">';
            detailHtml += '<div class="flex justify-between items-center w-full border-b border-slate-200 pb-2.5 sm:pb-3 mb-1.5 sm:mb-2">';
            detailHtml += '<p class="text-[11px] sm:text-[12px] font-bold text-slate-700 m-0">ด้านความรับผิดชอบ<span class="text-slate-500 font-normal">' + respCountText + '</span></p>';
            detailHtml += '<div class="shrink-0 flex-none">' + respEditBtnHtml + '</div>';
            detailHtml += '</div>';
            detailHtml += '<div class="w-full">' + respHtml + '</div>';
            detailHtml += '</div>';

            detailHtml += '<div class="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-3 gap-2 sm:gap-4 mb-auto pb-2 sm:pb-0 shrink-0">';
            detailHtml += statusCardsHtml;
            detailHtml += '</div>';

            detailHtml += deleteBtnHtml;

            detailHtml += '</div>';
            
            detailEl.innerHTML = detailHtml;
        } else if(detailEl) { detailEl.innerHTML = ''; }
    }
};
