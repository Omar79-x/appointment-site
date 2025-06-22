document.addEventListener("DOMContentLoaded", () => {
    // الحصول على عناصر DOM الأساسية
    const form = document.getElementById("appointment-form");
    const tableBody = document.querySelector("#appointment-table tbody");

    // تحميل المواعيد من Local Storage، أو بدء مصفوفة فارغة إذا لم تكن موجودة
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // دالة لحفظ مصفوفة المواعيد الحالية في Local Storage
    function saveAppointments() {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    // دالة لعرض جميع المواعيد في الجدول
    function renderAppointments() {
        tableBody.innerHTML = ""; // مسح المحتوى الحالي للجدول قبل إعادة الرسم

        // المرور على كل موعد في المصفوفة وإنشاء صف جديد له في الجدول
        appointments.forEach((appt, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appt.name}</td>
                <td>${appt.account || ''}</td> <td>${appt.date}</td>
                <td>${appt.time}</td>
                <td>${appt.note || ''}</td>   <td><button class="delete-button" data-id="${index}">حذف</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // دالة لحذف موعد معين بناءً على الـ ID (المؤشر) الخاص به في المصفوفة
    function deleteAppointment(idToDelete) {
        // فلترة المواعيد: الاحتفاظ بجميع المواعيد ما عدا الموعد المحدد للحذف
        // نستخدم `toString()` للمقارنة لضمان التطابق بين الـ ID (الذي هو نص من data-id) والـ index (الذي هو رقم)
        appointments = appointments.filter((_, index) => index.toString() !== idToDelete);
        saveAppointments(); // حفظ القائمة الجديدة للمواعيد في Local Storage
        renderAppointments(); // إعادة عرض المواعيد لتحديث الواجهة
    }

    // الاستماع لحدث النقر على زر الحذف داخل الجدول
    // نستخدم "event delegation" عن طريق الاستماع على tableBody لتحسين الأداء
    // هذا يضمن أن الأزرار التي يتم إضافتها ديناميكيًا ستعمل أيضًا
    tableBody.addEventListener('click', function(event) {
        // التحقق مما إذا كان العنصر الذي تم النقر عليه هو زر يحمل الكلاس 'delete-button'
        if (event.target.classList.contains('delete-button')) {
            const appointmentIdToDelete = event.target.dataset.id; // الحصول على الـ ID من السمة data-id للزر
            
            // طلب تأكيد من المستخدم قبل تنفيذ عملية الحذف
            const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا الموعد؟");
            if (confirmDelete) {
                deleteAppointment(appointmentIdToDelete); // استدعاء دالة الحذف إذا تم التأكيد
            }
        }
    });

    // الاستماع لحدث إرسال النموذج (Form Submission) لإضافة موعد جديد
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للنموذج (وهو إعادة تحميل الصفحة)

        // الحصول على قيم الحقول من النموذج
        const name = document.getElementById("name").value;
        const account = document.getElementById("account").value; // حقل الحساب (اختياري)
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const note = document.getElementById("note").value; // حقل الملاحظة (اختياري)

        // التحقق من الحقول المطلوبة (الاسم، التاريخ، الوقت)
        // حقل 'account' و 'note' ليسا ضمن هذا التحقق لأنهما اختياريان
        if (!name || !date || !time) {
            alert('الرجاء ملء الحقول المطلوبة (الاسم، التاريخ، الوقت).');
            return; // إيقاف الدالة إذا كانت أي من الحقول المطلوبة فارغة
        }

        // إنشاء كائن يمثل بيانات الموعد الجديد
        const newAppointment = {
            name: name,
            account: account, // سيتم تخزين قيمته حتى لو كانت فارغة
            date: date,
            time: time,
            note: note     // سيتم تخزين قيمته حتى لو كانت فارغة
        };

        // إضافة الموعد الجديد إلى مصفوفة المواعيد
        appointments.push(newAppointment);
        saveAppointments(); // حفظ المواعيد المحدثة في Local Storage
        renderAppointments(); // تحديث عرض الجدول بالموعد الجديد
        form.reset(); // مسح حقول النموذج بعد الإضافة الناجحة
    });

    // عند تحميل الصفحة لأول مرة، قم بعرض أي مواعيد مخزنة في Local Storage
    renderAppointments();
});
