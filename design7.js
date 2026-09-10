// ================= Variables สำหรับ Design 7 =================
let d7Tab = 'staff';
let selectedD7StaffId = 1;
let selectedD7PendingId = null;

// ================= ฟังก์ชันสลับ Tab =================
function setD7Tab(tab) {
    d7Tab = tab;
    const tabs = ['staff', 'admin', 'user', 'pending'];
    const idMap = { 'staff': 'd7TabStaff', 'admin': 'd7TabAdmin', 'user': 'd7TabUser', 'pending': 'd7TabPending' };
    
    tabs.forEach(t => {
        const el = document.getElementById(idMap[t]);
        if(el) {
            if (t === tab) {
                el.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
                el.classList.remove('text-slate-500', 'hover:text-slate-700');
            } else {
                el.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
                el.classList.add('text-slate-500', 'hover:text-slate-700');
            }
        }
    });
    // เรียก render หลักเพื่อให้มันอัปเดตหน้าจอทันที
    if (typeof render === 'function') render(); 
}

// ================= ฟังก์ชันสร้างโครงร่าง HTML (Skeleton) =================
function initDesign7Skeleton() {
    const container = document.getElementById('design7Container');
    if (!container) return;

    // ถ้าไม่มีข้อมูลข้างใน ค่อยสร้างโครงใหม่
    if (container.innerHTML.trim() === '') {
        container.innerHTML = `
            <div class="bg-white border border-slate-200 rounded-3xl p-4 md:p-8 shadow-sm">
                
                <div class="flex items-center justify-between gap-4 pb-4 md:pb-6 border-b border-slate-100 flex-nowrap">
                    <div class="min-w-0 flex-1">
                        <span class="hidden md:inline-block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-1">Hybrid Master-Detail</span>
                        <h1 class="text-base sm:text-xl md:text-2xl font-black text-slate-900 truncate">จัดการเจ้าหน้าที่ในหน่วยงาน</h1>
                    </div>
                    <button onclick="openModal('qrModal')" class="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 md:px-4 py-2 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1.5"><span class="material-icons text-sm">qr_code</span> <span class="hidden sm:inline">QR Code เชิญ</span></button>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 md:mt-6">
                    <div class="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar flex-nowrap">
                        <button onclick="setD7Tab('staff')" id="d7TabStaff" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm">ทั้งหมด</button>
                        <button onclick="setD7Tab('admin')" id="d7TabAdmin" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-700">ผู้ดูแลระบบ</button>
                        <button onclick="setD7Tab('user')" id="d7TabUser" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-700">เจ้าหน้าที่</button>
                        <button onclick="setD7Tab('pending')" id="d7TabPending" class="flex-1 md:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-700 flex justify-center items-center gap-1">รออนุมัติ <span id="d7PendingCount" class="bg-amber-500 text-white px-1.5 py-0.5 rounded-md text-[10px]">0</span></button>
                    </div>
                    <div class="relative w-full md:w-64 shrink-0">
                        <span class="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                        <input type="text" placeholder="ค้นหาในหน่วยงาน..." oninput="handleSearch(this.value)" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                    <div class="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 h-[300px] lg:h-[600px] overflow-y-auto hide-scrollbar space-y-2" id="d7ListPanel"></div>
                    <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 md:p-8 flex flex-col justify-between shadow-sm h-auto min-h-[300px] lg:h-[600px] overflow-y-auto hide-scrollbar" id="d7DetailPanel"></div>
                </div>
            </div>
        `;
    }
}

// ================= ฟังก์ชัน Render ข้อมูล =================
function renderDesign7(filtered, pendingFiltered, pendingList, staffList) {
    initDesign7Skeleton(); // เรียกใช้โครงสร้าง

    const listEl = document.getElementById('d7ListPanel');
    const detailEl = document.getElementById('d7DetailPanel');
    const pendBadge = document.getElementById('d7PendingCount');
    
    // อัปเดตตัวเลขการรอพิจารณาอย่างปลอดภัย
    if(pendBadge) pendBadge.innerText = pendingList.length;

    if(d7Tab === 'pending') {
        let listHtml = '';
        pendingFiltered.forEach(p => {
            const isSel = selectedD7PendingId === p.id;
            listHtml += `<div onclick="selectedD7PendingId=${p.id}; render();" class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${isSel ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'}">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 shrink-0 rounded-xl font-bold flex items-center justify-center ${isSel ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}">${p.initial}</div>
                    <div class="min-w-0">
                        <p class="font-bold text-xs truncate">${p.name}</p>
                        <p class="text-[10px] ${isSel?'text-white/80':'text-slate-500'} truncate">${p.requestDate}</p>
                    </div>
                </div>
            </div>`;
        });
        listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><span class="material-icons text-4xl">inbox</span><p class="text-xs font-bold">ไม่มีคำขออนุมัติ</p></div>';

        const p = pendingList.find(x => x.id === selectedD7PendingId) || pendingFiltered[0];
        if(p) {
            const roleBadgeClass = p.requestRole === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700';

            detailEl.innerHTML = `
                <div class="space-y-6">
                    <div class="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 relative">
                        <div class="w-16 h-16 shrink-0 rounded-2xl bg-amber-100 text-amber-700 font-black text-2xl flex items-center justify-center">${p.initial}</div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-xl font-black text-slate-900 truncate">${p.name}</h3>
                            <p class="text-xs text-slate-500 mt-1">${p.phone}</p>
                            <span class="inline-block mt-1.5 bg-amber-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold">คำขอเข้าร่วมหน่วยงาน</span>
                        </div>
                    </div>
                    
                    <div class="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden mb-6">
                        <div class="flex items-center justify-between p-4 md:px-5 border-b border-slate-100">
                            <span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">บทบาทที่ต้องการ</span>
                            <span class="px-3 py-1.5 ${roleBadgeClass} border rounded-xl text-[10px] font-bold shadow-sm">${p.requestRole === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่'}</span>
                        </div>
                        <div class="flex items-center justify-between p-4 md:px-5">
                            <span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">วันที่ส่งคำขอ</span>
                            <span class="text-xs font-bold text-slate-800">${p.requestDate}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                        <button onclick="showPendingInfo('${p.name}', '${p.phone}')" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs whitespace-nowrap transition-colors">ข้อมูล</button>
                        <button onclick="handleReject(${p.id})" class="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold py-3 rounded-xl text-xs whitespace-nowrap transition-colors">ปฏิเสธ</button>
                        <button onclick="handleApprove(${p.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs whitespace-nowrap transition-colors shadow-sm shadow-emerald-600/20">อนุมัติ</button>
                    </div>
                </div>
            `;
        } else { detailEl.innerHTML = ''; }
    } else {
        const d7Staffs = filtered.filter(s => {
            if(d7Tab === 'staff') return true;
            if(d7Tab === 'admin') return s.role === 'admin';
            if(d7Tab === 'user') return s.role === 'staff';
            return true;
        });
        
        let listHtml = '';
        d7Staffs.forEach(s => {
            const isSel = selectedD7StaffId === s.id;
            
            // ปรับให้การ์ดที่ถูกเลือกเป็นสีดำเสมอ
            const bgClass = isSel 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900';

            const iconBgClass = isSel 
                ? 'bg-white/20' 
                : (s.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700');

            listHtml += `<div onclick="selectedD7StaffId=${s.id}; render();" class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${bgClass}">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 shrink-0 rounded-xl font-bold flex items-center justify-center ${iconBgClass}">${s.initial}</div>
                    <div class="min-w-0">
                        <p class="font-bold text-xs truncate">${s.name}</p>
                        <p class="text-[10px] ${isSel ? 'text-slate-300' : 'text-slate-500'} font-mono truncate">${s.phone}</p>
                    </div>
                </div>
            </div>`;
        });
        listEl.innerHTML = listHtml || '<div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><span class="material-icons text-4xl">search_off</span><p class="text-xs font-bold">ไม่พบข้อมูล</p></div>';

        const s = staffList.find(x => x.id === selectedD7StaffId) || d7Staffs[0];
        if(s) {
            
            // แยกสีป้ายสถานะด้านขวา Admin (Indigo) กับ Staff (Slate)
            const roleBadgeClass = s.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700 border-slate-200';
            const roleIcon = s.role === 'admin' ? 'admin_panel_settings' : 'badge';
            const roleSmallIcon = s.role === 'admin' ? 'security' : 'person';

            // สีรูปโปรไฟล์ 
            const profileBgClass = s.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800';

            detailEl.innerHTML = `
                <div class="flex flex-col h-full bg-white/80 backdrop-blur-md rounded-3xl p-2 md:p-4">
                    
                    <!-- Header -->
                    <div class="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 relative">
                        <div class="w-16 h-16 shrink-0 rounded-2xl ${profileBgClass} font-black text-2xl flex items-center justify-center">${s.initial}</div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-xl font-black text-slate-900 truncate">${s.name}</h3>
                            <p class="text-xs text-slate-500 mt-1">${s.phone}</p>
                        </div>
                    </div>

                    <!-- Role & Responsibilities -->
                    <div class="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden mb-6">
                        <!-- บรรทัดที่ 1: บทบาท -->
                        <div class="flex items-center justify-between p-4 md:px-5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                    <span class="material-icons text-[16px]">${roleIcon}</span>
                                </div>
                                <span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">บทบาท</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="px-3 py-1.5 ${roleBadgeClass} border rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                    <span class="material-icons text-[14px]">${roleSmallIcon}</span>
                                    ${s.role === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่'}
                                </span>
                                <button onclick="handleToggleRole(${s.id})" class="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-slate-400 transition-all shadow-sm" title="สลับสิทธิ์">
                                    <span class="material-icons text-[16px]">swap_horiz</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- บรรทัดที่ 2: ความรับผิดชอบ -->
                        <div class="flex items-center justify-between p-4 md:px-5 hover:bg-slate-50/50 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                    <span class="material-icons text-[16px]">assignment</span>
                                </div>
                                <span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">รับผิดชอบ</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex flex-wrap justify-end gap-1.5 max-w-[150px] md:max-w-[250px]">
                                    ${s.resp && s.resp.length > 0 
                                        ? s.resp.map(r => `<span class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-sm">${r}</span>`).join('') 
                                        : `<span class="text-[10px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">ไม่ได้ระบุ</span>`}
                                </div>
                                <button onclick="openResponsibilitiesModal(${s.id})" class="w-8 h-8 shrink-0 flex items-center justify-center bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-slate-400 transition-all shadow-sm" title="แก้ไขหน้าที่">
                                    <span class="material-icons text-[14px]">edit</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 3 Status Cards -->
                    <div class="grid grid-cols-3 gap-2 md:gap-4 mb-auto">
                        <div class="p-2.5 md:p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                            <span class="material-icons text-emerald-500 text-[18px]">verified</span>
                            <div>
                                <div class="text-[9px] font-bold text-emerald-600/70 mb-0.5">สถานะ Authen</div>
                                <div class="text-[10px] md:text-[11px] font-bold text-emerald-700 truncate">ผ่านการ Authen</div>
                            </div>
                        </div>
                        <div class="p-2.5 md:p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                            <span class="material-icons text-blue-500 text-[18px]">login</span>
                            <div>
                                <div class="text-[9px] font-bold text-blue-600/70 mb-0.5">เข้าครั้งแรก</div>
                                <div class="text-[10px] md:text-[11px] font-bold text-blue-700 truncate">10 มี.ค. 2024</div>
                            </div>
                        </div>
                        <div class="p-2.5 md:p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                            <span class="material-icons text-amber-500 text-[18px]">history</span>
                            <div>
                                <div class="text-[9px] font-bold text-amber-600/70 mb-0.5">ใช้งานล่าสุด</div>
                                <div class="text-[10px] md:text-[11px] font-bold text-amber-700 truncate">วันนี้ 08:15</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action -->
                    <div class="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                        <button onclick="handleRemoveStaff(${s.id})" class="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors shadow-sm">
                            <span class="material-icons text-[16px]">person_remove</span> ลบออกจากหน่วยงาน
                        </button>
                    </div>
                </div>
            `;
        } else { detailEl.innerHTML = ''; }
    }
}