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
    const account = document.getElementById('accountInput').value; // استرجاع قيمة الحساب
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;
    const notes = document.getElementById('notesInput').value;

    // التحقق من الحقول المطلوبة فقط (الاسم، التاريخ، الوقت)
    // لاحظ أن 'account' غير موجود هنا في شرط التحقق!
    if (!name || !date || !time) {
        alert('الرجاء ملء الحقول المطلوبة (الاسم، التاريخ، الوقت).');
        return; // إيقاف الدالة إذا كانت الحقول المطلوبة فارغة
    }

    const appointmentData = {
        name: name,
        account: account, // إضافة الحساب لبيانات الموعد (ممكن تكون فارغة)
        date: date,
        time: time,
        notes: notes
    };

    console.log('بيانات الموعد الجاري حفظها:', appointmentData);

    // هنا يتم إضافة البيانات للجدول في الواجهة
    addAppointmentToTable(appointmentData);

    // هنا تضيف الكود الخاص بإرسال البيانات إلى الـ Backend (API) إذا كنت تستخدم قاعدة بيانات
    // (الـ 'account' سيُرسل بقيمته، حتى لو كانت فارغة)

    // مسح حقول الإدخال بعد الإضافة
    document.getElementById('nameInput').value = '';
    document.getElementById('accountInput').value = ''; // مسح الحساب أيضًا
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';
    document.getElementById('notesInput').value = '';
}

// دالة لإضافة البيانات للجدول في الواجهة (بدون تغيير في هذه الدالة)
function addAppointmentToTable(data) {
    const tableBody = document.getElementById('appointmentsTableBody'); // الحصول على العنصر الحاوي لصفوف الجدول

    const newRow = document.createElement('ion-row');

    const nameCol = document.createElement('ion-col');
    nameCol.textContent = data.name;
    newRow.appendChild(nameCol);

    const accountCol = document.createElement('ion-col'); // العمود الجديد للحساب
    accountCol.textContent = data.account; // سيعرض القيمة، حتى لو كانت فارغة
    newRow.appendChild(accountCol);

    const dateCol = document.createElement('ion-col');
    dateCol.textContent = data.date;
    newRow.appendChild(dateCol);

    const timeCol = document.createElement('ion-col');
    timeCol.textContent = data.time;
    newRow.appendChild(timeCol);

    const notesCol = document.createElement('ion-col');
    notesCol.textContent = data.notes;
    newRow.appendChild(notesCol);

    const deleteCol = document.createElement('ion-col');
    const deleteButton = document.createElement('ion-button');
    deleteButton.setAttribute('fill', 'clear');
    deleteButton.setAttribute('color', 'danger');
    deleteButton.textContent = 'حذف';
    deleteCol.appendChild(deleteButton);
    newRow.appendChild(deleteCol);

    tableBody.appendChild(newRow);
}

