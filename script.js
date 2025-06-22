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
    const name = document.getElementById('nameInput').value;
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;
    const notes = document.getElementById('notesInput').value;

    // لاحظ: لا يوجد أي استدعاء لـ document.getElementById('accountInput').value; هنا

    // الآن، بيانات الموعد التي سيتم التعامل معها هي: name, date, time, notes فقط
    const appointmentData = {
        name: name,
        date: date,
        time: time,
        notes: notes
    };

    console.log('بيانات الموعد الجاري حفظها:', appointmentData);

    // هنا ستكمل منطق إرسال appointmentData إلى قاعدة البيانات أو تخزينها
    // (مثل استخدام fetch() أو XMLHttpRequest لإرسال البيانات إلى API)

    // مثال (إذا كنت ستضيفها إلى جدول محلي في الصفحة):
    addAppointmentToTable(appointmentData);

    // يمكنك مسح حقل الحساب بعد الإضافة لو أردت
    document.getElementById('accountInput').value = '';
}

// دالة افتراضية لإضافة البيانات للجدول في الواجهة (للتوضيح فقط)
function addAppointmentToTable(data) {
    const tableBody = document.querySelector('.appointments-table tbody'); // افترض أن لديك جدول بهذا الـ selector
    if (tableBody) {
        const newRow = tableBody.insertRow();
        newRow.insertCell().textContent = data.name;
        newRow.insertCell().textContent = data.date;
        newRow.insertCell().textContent = data.time;
        newRow.insertCell().textContent = data.notes;
        newRow.insertCell().textContent = 'حذف'; // زر الحذف
    }
}
