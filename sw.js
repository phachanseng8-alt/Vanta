/* VANTA service worker — ແຈ້ງເຕືອນແອດມິນ (Web Push). ວາງຄຽງຂ້າງ index.html ໃນໂຮສດຽວກັນ */
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  e.waitUntil((async()=>{
    /* ຖ້າແອດມິນເປີດໜ້າເວັບຢູ່ ແລະ ເຫັນຢູ່ ໃຫ້ໜ້າເວັບແຈ້ງເອງ (ບໍ່ເດັ້ງຊ້ຳ) */
    const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    if(cl.some(c=>c.visibilityState==='visible'&&c.focused))return;
    await self.registration.showNotification(d.title||'VANTA',{
      body:d.body||'ມີລາຍການໃໝ່',
      tag:d.tag||'vanta-admin',renotify:true,
      icon:'icon-192.png',badge:'icon-192.png',
      vibrate:[200,100,200],
      data:{url:d.url||'#admin'}
    });
  })());
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||'#admin',self.registration.scope).href;
  e.waitUntil((async()=>{
    const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of cl){if(c.url.startsWith(self.registration.scope)){await c.focus();return}}
    await self.clients.openWindow(url);
  })());
});
