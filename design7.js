// ================= Variables สำหรับ Design 7 =================
let d7Tab = 'staff';
let selectedD7StaffId = 1;
let selectedD7PendingId = null;
let isD7EditMode = false; // ตัวแปรสำหรับควบคุมการเปิด/ปิดโหมดแก้ไข

// ================= ฟังก์ชันสลับ Tab =================
function setD7Tab(tab) {
    d7Tab = tab;
    isD7EditMode = false; // รีเซ็ตโหมดแก้ไขเมื่อเปลี่ยน Tab
    const tabs = ['staff', 'admin', 'user', 'pending'];
    const idMap = { 'staff': 'd7TabStaff', 'admin': 'd7TabAdmin', 'user': 'd7TabUser', 'pending': 'd7TabPending' };
    
    tabs.forEach(t => {
        const el = document.getElementById(idMap[t]);
        if(el) {
            if (t === tab) {
                el.classList.add('bg-white', 'text-slate-900', 'border', 'border-slate-200');
                el.classList.remove('text-slate-500', 'hover:text-slate-700', 'border-transparent');
            } else {
                el.classList.remove('bg-white', 'text-slate-900', 'border-slate-200');
                el.classList.add('text-slate-500', 'hover:text-slate-700', 'border-transparent');
            }
        }
    });
    if (typeof render === 'function') render(); 
}

// ================= ฟังก์ชันเปิด/ปิด โหมดแก้ไข =================
function toggleD7EditMode() {
    isD7EditMode = !isD7EditMode;
    if (typeof render === 'function') render();
}

// ================= ฟังก์ชันสร้างโครงร่าง HTML แบบขาวคลีน แบนราบ =================
function initDesign7Skeleton() {
    const container = document.getElementById('design7Container');
    if (!container) return;

    if (container.innerHTML.trim() === '') {
        container.innerHTML = `
            <div class="bg-white p-4 md:p-8">
                <div class="flex items-center justify-between gap-4 pb-4 md:pb-6 border-b border-slate-100 flex-nowrap">
                    <div class="min-w-0 flex-1">
                        <span class="hidden md:inline-block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-1">Clean & Flat Design</span>
                        <h1 class="text-base sm:text-xl md:text-2xl font-black text-slate-900 truncate">จัดการเจ้าหน้าที่ในหน่วยงาน</h1>
                    </div>
                    <button onclick="openModal('qrModal')" class="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 md:px-4 py-2 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1.5 transition-colors"><span class="material-icons text-sm">qr_code</span> <span class="hidden sm:inline">QR Code เชิญ</span></button>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 md:mt-6">
                    <div class="flex bg-slate-50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar flex-nowrap border border-slate-100">
                        <button onclick="setD7Tab('staff')" id="d7TabStaff" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 border border-slate-200">ทั้งหมด</button>
                        <button onclick="setD7Tab('admin')" id="d7TabAdmin" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 border border-transparent hover:text-slate-700">ผู้ดูแลระบบ</button>
                        <button onclick="setD7Tab('user')" id="d7TabUser" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 border border-transparent hover:text-slate-700">เจ้าหน้าที่</button>
                        <button onclick="setD7Tab('pending')" id="d7TabPending" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 border border-transparent hover:text-slate-700 flex justify-center items-center gap-1">รออนุมัติ <span id="d7PendingCount" class="bg-amber-500 text-white px-1.5 py-0.5 rounded-md text-[10px]">0</span></button>
                    </div>
                    <div class="relative w-full md:w-64 shrink-0">
                        <span class="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                        <input type="text" placeholder="ค้นหารายชื่อ..." oninput="handleSearch(this.value)" class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors">
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-3 h-[300px] lg:h-[550px] overflow-y-auto hide-scrollbar space-y-2" id="d7ListPanel"></div>
                    <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-8 flex flex-col h-auto min-h-[300px] lg:h-[550px] overflow-y-auto hide-scrollbar" id="d7DetailPanel"></div>
                </div>
            </div>
        `;
    }
}

// ================= ฟังก์ชัน Render ข้อมูล =================
function renderDesign7(filtered, pendingFiltered, pendingList, staffList) {
    initDesign7Skeleton();

    const listEl = document.getElementById('d7ListPanel');
    const detailEl = document.getElementById('d7DetailPanel');
    const pendBadge = document.getElementById('d7PendingCount');
    
    if(pendBadge) pendBadge.innerText = pendingList.length;

    // ----------- กรณีเลือกรอพิจารณา -----------
    if(d7Tab === 'pending') {
        let listHtml = '';
        pendingFiltered.forEach(p => {
            const isSel = selectedD7PendingId === p.id;
            const bgClass = isSel ? 'bg-[#151b2b] text-white border-[#151b2b]' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900';
            const iconBgClass = isSel ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600';
            const selTextClass = isSel ? 'text-slate-400' : 'text-slate-500';
            const badgeBgClass = isSel ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600 border border-amber-100';

            // เมื่อกดเลือกคนใหม่ ให้รีเซ็ตโหมดแก้ไข
            listHtml += '<div onclick="selectedD7PendingId=' + p.id + '; isD7EditMode=false; render();" class="p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ' + bgClass + '">';
            listHtml += '    <div class="flex items-center gap-4 min-w-0">';
            listHtml += '        <div class="w-11 h-11 shrink-0 rounded-lg font-bold flex items-center justify-center text-[15px] ' + iconBgClass + '">' + p.initial + '</div>';
            listHtml += '        <div class="min-w-0">';
            listHtml += '            <p class="font-bold text-[13px] truncate">' + p.name + '</p>';
            listHtml += '            <p class="text-[11px] ' + selTextClass + ' font-mono mt-0.5 truncate">' + p.requestDate + '</p>';
            listHtml += '        </div>';
            listHtml += '    </div>';
            listHtml += '    <span class="shrink-0 text-[10px] px-3 py-1 rounded-full font-bold ' + badgeBgClass + '">คำขอใหม่</span>';
            listHtml += '</div>';
        });
        listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><span class="material-icons text-4xl">inbox</span><p class="text-xs font-bold">ไม่มีคำขออนุมัติ</p></div>';

        const p = pendingList.find(x => x.id === selectedD7PendingId) || pendingFiltered[0];
        if(p) {
            let reqRoleBadge = p.requestRole === 'admin' 
                ? '<span class="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold">ผู้ดูแลระบบ</span>'
                : '<span class="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold">เจ้าหน้าที่</span>';

            let detailHtml = '<div class="flex flex-col h-full">';
            detailHtml += '<div class="flex items-start gap-5 pb-6">';
            detailHtml += '<div class="w-[64px] h-[64px] shrink-0 rounded-2xl bg-amber-100 text-amber-700 font-black text-2xl flex items-center justify-center">' + p.initial + '</div>';
            detailHtml += '<div class="min-w-0 flex-1 pt-1"><h3 class="text-[18px] font-black text-slate-900 truncate">' + p.name + '</h3><p class="text-[13px] text-slate-500 font-mono mb-1.5">' + p.phone + '</p><span class="inline-block bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-100">คำขอเข้าร่วมหน่วยงาน</span></div></div>';
            detailHtml += '<div class="w-full h-px bg-slate-100 mb-6"></div>';
            detailHtml += '<div class="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-auto">';
            detailHtml += '<div class="flex justify-between items-center mb-4"><span class="text-[11px] font-bold text-slate-400">บทบาทที่ต้องการ</span>' + reqRoleBadge + '</div>';
            detailHtml += '<div class="flex justify-between items-center border-t border-slate-200 pt-4"><span class="text-[11px] font-bold text-slate-400">วันที่ส่งคำขอ</span><span class="text-[13px] font-bold text-slate-800">' + p.requestDate + '</span></div></div>';
            detailHtml += '<div class="flex gap-2 pt-6"><button onclick="showPendingInfo(\'' + p.name + '\', \'' + p.phone + '\')" class="flex-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors"><span class="material-icons text-[14px] mr-1.5">info</span> ข้อมูล</button>';
            detailHtml += '<button onclick="handleReject(' + p.id + ')" class="flex-[1] bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors">ปฏิเสธ</button>';
            detailHtml += '<button onclick="handleApprove(' + p.id + ')" class="flex-[1.5] bg-[#059669] hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-[11px] md:text-xs flex items-center justify-center transition-colors">อนุมัติ</button></div></div>';
            
            detailEl.innerHTML = detailHtml;
        } else { detailEl.innerHTML = ''; }
    } else {
        // ----------- กรณีแสดงรายชื่อปกติ -----------
        const d7Staffs = filtered.filter(s => {
            if(d7Tab === 'staff') return true;
            if(d7Tab === 'admin') return s.role === 'admin';
            if(d7Tab === 'user') return s.role === 'staff';
            return true;
        });
        
        let listHtml = '';
        d7Staffs.forEach(s => {
            const isSel = selectedD7StaffId === s.id;
            
            const bgClass = isSel ? 'bg-[#151b2b] text-white border-[#151b2b]' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900';
            const iconBgClass = isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700';
            const selTextClass = isSel ? 'text-slate-400' : 'text-slate-500';
            const badgeClass = isSel ? 'bg-white/20 text-white' : (s.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600 border border-slate-100');
            const roleName = s.role === 'admin' ? 'ผู้ดูแล' : 'เจ้าหน้าที่';

            // เมื่อคลิกเปลี่ยนคน ให้รีเซ็ตโหมดแก้ไขเสมอ
            listHtml += '<div onclick="selectedD7StaffId=' + s.id + '; isD7EditMode=false; render();" class="p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ' + bgClass + '">';
            listHtml += '    <div class="flex items-center gap-4 min-w-0">';
            listHtml += '        <div class="w-11 h-11 shrink-0 rounded-lg font-bold flex items-center justify-center text-[15px] ' + iconBgClass + '">' + s.initial + '</div>';
            listHtml += '        <div class="min-w-0">';
            listHtml += '            <p class="font-bold text-[13px] truncate">' + s.name + '</p>';
            listHtml += '            <p class="text-[11px] ' + selTextClass + ' font-mono mt-0.5 truncate">' + s.phone + '</p>';
            listHtml += '        </div>';
            listHtml += '    </div>';
            listHtml += '    <span class="shrink-0 text-[10px] px-3 py-1 rounded-full font-bold ' + badgeClass + '">' + roleName + '</span>';
            listHtml += '</div>';
        });
        listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><span class="material-icons text-4xl">search_off</span><p class="text-xs font-bold">ไม่พบข้อมูล</p></div>';

        const s = staffList.find(x => x.id === selectedD7StaffId) || d7Staffs[0];
        if(s) {
            const profileBgClass = 'bg-[#c6f6d5] text-[#065f46]';
            let roleBadgeClass = s.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700';
            let roleNameDetail = s.role === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่';
            let roleToggleBtnText = s.role === 'admin' ? 'ปรับเป็นเจ้าหน้าที่' : 'ปรับเป็น Admin';

            let respHtml = '';
            if (s.resp && s.resp.length > 0) {
                respHtml = s.resp.map(r => '<span class="text-[13px] font-bold text-slate-800">' + r + '</span>').join('<span class="text-[13px] text-slate-800">, </span>');
            } else {
                respHtml = '<span class="text-[13px] font-medium text-slate-400">ไม่ได้ระบุ</span>';
            }

            let isAuthen = s.isAuthen !== false;
            let statusCardsHtml = '';

            if (isAuthen) {
                statusCardsHtml += '<div class="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex flex-col gap-1.5"><span class="material-icons text-emerald-500 text-[16px]">verified</span><div><div class="text-[9px] font-bold text-emerald-600/70 mb-0.5">สถานะ Authen</div><div class="text-[10px] md:text-[11px] font-bold text-emerald-700 truncate">ผ่านการ Authen</div></div></div>';
                statusCardsHtml += '<div class="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl flex flex-col gap-1.5"><span class="material-icons text-blue-500 text-[16px]">login</span><div><div class="text-[9px] font-bold text-blue-600/70 mb-0.5">เข้าครั้งแรก</div><div class="text-[10px] md:text-[11px] font-bold text-blue-700 truncate">10 มี.ค. 2024</div></div></div>';
                statusCardsHtml += '<div class="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl flex flex-col gap-1.5"><span class="material-icons text-amber-500 text-[16px]">history</span><div><div class="text-[9px] font-bold text-amber-600/70 mb-0.5">ใช้งานล่าสุด</div><div class="text-[10px] md:text-[11px] font-bold text-amber-700 truncate">วันนี้ 08:15</div></div></div>';
            } else {
                statusCardsHtml += '<div class="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col gap-1.5"><span class="material-icons text-slate-400 text-[16px]">hourglass_empty</span><div><div class="text-[9px] font-bold text-slate-400 mb-0.5">สถานะ Authen</div><div class="text-[10px] md:text-[11px] font-bold text-slate-500 truncate">ยังไม่ Authen</div></div></div>';
                statusCardsHtml += '<div class="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col gap-1.5 opacity-60"><span class="material-icons text-slate-300 text-[16px]">login</span><div><div class="text-[9px] font-bold text-slate-400 mb-0.5">เข้าครั้งแรก</div><div class="text-[10px] md:text-[11px] font-bold text-slate-400 truncate">-</div></div></div>';
                statusCardsHtml += '<div class="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col gap-1.5 opacity-60"><span class="material-icons text-slate-300 text-[16px]">history</span><div><div class="text-[9px] font-bold text-slate-400 mb-0.5">ใช้งานล่าสุด</div><div class="text-[10px] md:text-[11px] font-bold text-slate-400 truncate">-</div></div></div>';
            }

            // ปุ่มที่แสดงเมื่ออยู่ในโหมดแก้ไข
            let roleToggleBtnHtml = isD7EditMode 
                ? '<button onclick="handleToggleRole(' + s.id + ')" class="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-colors shadow-sm"><span class="material-icons text-[12px]">swap_horiz</span> ' + roleToggleBtnText + '</button>' 
                : '';

            let respEditBtnHtml = isD7EditMode 
                ? '<button onclick="openResponsibilitiesModal(' + s.id + ')" class="w-8 h-8 shrink-0 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors shadow-sm" title="แก้ไขหน้าที่"><span class="material-icons text-[14px]">edit</span></button>' 
                : '';

            // ปรับปุ่ม "บันทึก" และ "ยกเลิก"
            let mainEditBtnHtml = isD7EditMode 
                ? '<div class="flex items-center gap-2">' +
                  '<button onclick="toggleD7EditMode()" class="shrink-0 px-3 py-1.5 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-[11px] font-bold"><span class="material-icons text-[14px]">close</span> ยกเลิก</button>' +
                  '<button onclick="toggleD7EditMode()" class="shrink-0 px-3 py-1.5 flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm text-[11px] font-bold"><span class="material-icons text-[14px]">save</span> บันทึก</button>' +
                  '</div>'
                : '<button onclick="toggleD7EditMode()" class="shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors shadow-sm" title="เปิดโหมดแก้ไข"><span class="material-icons text-[14px]">edit</span></button>';

            let deleteBtnHtml = isD7EditMode 
                ? '<div class="pt-6 mt-6 border-t border-slate-100 flex justify-end"><button onclick="handleRemoveStaff(' + s.id + ')" class="flex items-center gap-1.5 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors"><span class="material-icons text-[16px]">person_remove</span> ลบออกจากหน่วยงาน</button></div>' 
                : '';

            let detailHtml = '<div class="flex flex-col h-full">';
            
            detailHtml += '<div class="flex items-start gap-5 pb-6">';
            detailHtml += '<div class="w-[64px] h-[64px] shrink-0 rounded-2xl ' + profileBgClass + ' font-black text-2xl flex items-center justify-center">' + s.initial + '</div>';
            detailHtml += '<div class="min-w-0 flex-1 pt-1">';
            detailHtml += '<h3 class="text-[18px] font-black text-slate-900 truncate">' + s.name + '</h3>';
            detailHtml += '<p class="text-[13px] text-slate-500 font-mono mb-1.5">' + s.phone + '</p>';
            detailHtml += '<div class="flex items-center gap-2 mt-1">';
            detailHtml += '<span class="inline-block ' + roleBadgeClass + ' px-3 py-1 rounded-full text-[10px] font-bold">' + roleNameDetail + '</span>';
            detailHtml += roleToggleBtnHtml; // แสดงปุ่มสลับ Role เมื่อเปิด Edit Mode
            detailHtml += '</div></div>';
            detailHtml += mainEditBtnHtml; // แสดงปุ่ม ยกเลิก/บันทึก หรือ ดินสอแก้ไข
            detailHtml += '</div>';

            detailHtml += '<div class="w-full h-px bg-slate-100 mb-6"></div>';

            detailHtml += '<div class="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">';
            detailHtml += '<div><p class="text-[11px] font-bold text-slate-400 mb-1">ด้านความรับผิดชอบ</p><div>' + respHtml + '</div></div>';
            detailHtml += respEditBtnHtml; // แสดงปุ่มแก้ความรับผิดชอบเมื่อเปิด Edit Mode
            detailHtml += '</div>';

            detailHtml += '<div class="grid grid-cols-3 gap-2 md:gap-4 mb-auto">';
            detailHtml += statusCardsHtml;
            detailHtml += '</div>';

            detailHtml += deleteBtnHtml; // แสดงปุ่มลบเมื่อเปิด Edit Mode

            detailHtml += '</div>';
            
            detailEl.innerHTML = detailHtml;
        } else { detailEl.innerHTML = ''; }
    }
}