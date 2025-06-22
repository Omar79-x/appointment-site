document.addEventListener("DOMContentLoaded", () => {
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
                <td>${appt.date}</td>
                <td>${appt.time}</td>
                <td>${appt.note}</td>
                <td><button class="delete-button" data-id="${index}">حذف</button></td>
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
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const note = document.getElementById("note").value;

        // إضافة الموعد الجديد إلى المصفوفة
        appointments.push({ name, date, time, note });
        saveAppointments(); // حفظ المواعيد
        renderAppointments(); // تحديث العرض
        form.reset(); // مسح حقول النموذج
    });

    // استدعاء دالة عرض المواعيد عند تحميل الصفحة لأول مرة
    renderAppointments();
});
function saveAppointment() {
    const name = document.getElementById('nameInput').value; // افتراضًا عندك حقل اسم
    const date = document.getElementById('dateInput').value; // افتراضًا عندك حقل تاريخ
    const time = document.getElementById('timeInput').value; // افتراضًا عندك حقل وقت
    const notes = document.getElementById('notesInput').value;
    const account = document.getElementById('accountInput').value; // ده الحقل الجديد

    // هنا بتستخدم المتغيرات دي، سواء بتبعتها لـ API أو بتضيفها لجدول
    console.log('الاسم:', name);
    console.log('التاريخ:', date);
    console.log('الوقت:', time);
    console.log('الملاحظة:', notes);
    console.log('الحساب:', account);

    // أكمل باقي منطق حفظ الموعد
}

