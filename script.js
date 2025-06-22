document.addEventListener("DOMContentLoaded", () => {
    // تأكد أن هذه IDs موجودة في الـ HTML
    const form = document.getElementById("appointment-form");
    const tableBody = document.querySelector("#appointment-table tbody");

    // نستخدم 'let' بدلاً من 'const' للسماح بتغيير مصفوفة المواعيد بعد الحذف
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // دالة لحفظ المواعيد في Local Storage
    function saveAppointments() {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    // دالة لعرض المواعيد في الجدول
    function renderAppointments() {
        tableBody.innerHTML = ""; // مسح المحتوى الحالي للجدول قبل إعادة الرسم
        appointments.forEach((appt, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appt.name}</td>
                <td>${appt.account || ''}</td> <td>${appt.date}</td>
                <td>${appt.time}</td>
                <td>${appt.note || ''}</td> <td><button class="delete-button" data-id="${index}">حذف</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // دالة لحذف موعد معين
    function deleteAppointment(idToDelete) {
        // فلترة المواعيد: الاحتفاظ بجميع المواعيد ما عدا الموعد المحدد للحذف
        // نستخدم `toString()` للمقارنة لضمان التطابق بين الـ ID المستلم والـ index
        appointments = appointments.filter((_, index) => index.toString() !== idToDelete);
        saveAppointments(); // حفظ القائمة الجديدة للمواعيد
        renderAppointments(); // إعادة عرض المواعيد لتحديث الواجهة
    }

    // الاستماع لحدث الضغط على أي زر في المستند
    document.addEventListener('click', function(event) {
        // التحقق مما إذا كان العنصر الذي تم النقر عليه هو زر الحذف
        if (event.target.classList.contains('delete-button')) {
            const appointmentIdToDelete = event.target.dataset.id; // الحصول على الـ ID من الزر
            
            // طلب تأكيد من المستخدم قبل الحذف
            const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا الموعد؟");
            if (confirmDelete) {
                deleteAppointment(appointmentIdToDelete); // استدعاء دالة الحذف إذا تم التأكيد
            }
        }
    });

    // الاستماع لحدث إرسال النموذج (إضافة موعد جديد)
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للنموذج (إعادة تحميل الصفحة)

        // الحصول على قيم الحقول
        const name = document.getElementById("name").value;
        const account = document.getElementById("account").value; // **جلب قيمة الحساب الجديد هنا**
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const note = document.getElementById("note").value;

        // **التحقق من الحقول المطلوبة فقط (الاسم، التاريخ، الوقت)**
        // لاحظ أن 'account' غير موجود هنا في شرط التحقق لأنها اختيارية!
        if (!name || !date || !time) {
            alert('الرجاء ملء الحقول المطلوبة (الاسم، التاريخ، الوقت).');
            return; // إيقاف الدالة إذا كانت الحقول المطلوبة فارغة
        }

        // إضافة الموعد الجديد إلى المصفوفة
        // **تضمين 'account' في الكائن الذي يتم حفظه**
        appointments.push({ name, account, date, time, note });
        saveAppointments(); // حفظ المواعيد في Local Storage
        renderAppointments(); // تحديث العرض في الجدول
        form.reset(); // مسح حقول النموذج
    });

    // استدعاء دالة عرض المواعيد عند تحميل الصفحة لأول مرة
    renderAppointments();
});

// **تم حذف الدالة saveAppointment() و addAppointmentToTable() المنفصلتين**
// **لأن منطق الإضافة والعرض تم دمجه بالكامل داخل Document.addEventListener("DOMContentLoaded")**
