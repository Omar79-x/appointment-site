document.addEventListener("DOMContentLoaded", () => {
    // الحصول على عناصر النموذج والجدول من HTML
    const form = document.getElementById("appointment-form");
    const tableBody = document.querySelector("#appointment-table tbody");

    // تحميل المواعيد من Local Storage أو بدء مصفوفة فارغة إذا لم توجد
    // نستخدم 'let' بدلاً من 'const' للسماح بتغيير مصفوفة المواعيد بعد الحذف
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // دالة لحفظ المواعيد الحالية في Local Storage
    function saveAppointments() {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    // دالة لعرض جميع المواعيد في الجدول
    function renderAppointments() {
        tableBody.innerHTML = ""; // مسح المحتوى الحالي للجدول قبل إعادة الرسم
        appointments.forEach((appt, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appt.name}</td>
                <td>${appt.date}</td>
                <td>${appt.start_time} - ${appt.end_time}</td> <td>${appt.note}</td>
                <td><button class="delete-button" data-id="${index}">حذف</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // دالة لحذف موعد معين بناءً على الـ ID (الـ index هنا)
    function deleteAppointment(idToDelete) {
        // فلترة المواعيد: الاحتفاظ بجميع المواعيد ما عدا الموعد المحدد للحذف
        // نستخدم `toString()` للمقارنة لضمان التطابق بين الـ ID المستلم والـ index
        appointments = appointments.filter((_, index) => index.toString() !== idToDelete);
        saveAppointments(); // حفظ القائمة الجديدة للمواعيد في Local Storage
        renderAppointments(); // إعادة عرض المواعيد لتحديث الواجهة بعد الحذف
    }

    // إضافة مستمع للأحداث (Event Listener) للتعامل مع النقر على الأزرار
    document.addEventListener('click', function(event) {
        // التحقق مما إذا كان العنصر الذي تم النقر عليه يحتوي على الـ class "delete-button"
        if (event.target.classList.contains('delete-button')) {
            const appointmentIdToDelete = event.target.dataset.id; // الحصول على الـ ID من الزر
            
            // طلب تأكيد من المستخدم قبل تنفيذ عملية الحذف
            const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا الموعد؟");
            if (confirmDelete) {
                deleteAppointment(appointmentIdToDelete); // استدعاء دالة الحذف إذا تم التأكيد
            }
        }
    });

    // إضافة مستمع لحدث إرسال النموذج (submit) لإضافة موعد جديد
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // منع السلوك الافتراضي للنموذج (إعادة تحميل الصفحة)

        // الحصول على قيم الحقول من النموذج
        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        const startTime = document.getElementById("start-time").value; // الحصول على وقت البدء
        const endTime = document.getElementById("end-time").value;     // الحصول على وقت الانتهاء
        const note = document.getElementById("note").value;

        // إضافة الموعد الجديد إلى مصفوفة المواعيد
        // نستخدم أسماء keys جديدة لوقتي البدء والانتهاء: start_time و end_time
        appointments.push({ name, date, start_time: startTime, end_time: endTime, note });
        saveAppointments();   // حفظ المواعيد المحدثة في Local Storage
        renderAppointments(); // تحديث عرض المواعيد في الجدول
        form.reset();         // مسح حقول النموذج بعد الإضافة
    });

    // استدعاء دالة عرض المواعيد عند تحميل الصفحة لأول مرة لضمان ظهور أي مواعيد محفوظة
    renderAppointments();
});
