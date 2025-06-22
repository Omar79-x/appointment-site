document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointment-form");
    const tableBody = document.querySelector("#appointment-table tbody");

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    function saveAppointments() {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    function renderAppointments() {
        tableBody.innerHTML = "";
        appointments.forEach((appt, index) => { // استخدم index كـ ID مؤقت
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

    function deleteAppointment(idToDelete) {
        appointments = appointments.filter((_, index) => index.toString() !== idToDelete);
        saveAppointments();
        renderAppointments();
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const appointmentIdToDelete = event.target.dataset.id;
            const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا الموعد؟");
            if (confirmDelete) {
                deleteAppointment(appointmentIdToDelete);
            }
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const note = document.getElementById("note").value;

        appointments.push({ name, date, time, note });
        saveAppointments();
        renderAppointments();
        form.reset();
    });

    renderAppointments();
});
