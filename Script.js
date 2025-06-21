document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  const tableBody = document.querySelector("#appointment-table tbody");

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }

  function renderAppointments() {
    tableBody.innerHTML = "";
    appointments.forEach((appt, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appt.name}</td>
        <td>${appt.phone}</td>
        <td>${appt.account}</td>
        <td>${appt.date}</td>
        <td>${appt.timeFrom}</td>
        <td>${appt.timeTo}</td>
        <td>${appt.note}</td>
        <td><button class="delete-button" data-index="${index}">🗑️</button></td>
      `;
      tableBody.appendChild(row);
    });

    // إضافة حدث الحذف لكل زر
    document.querySelectorAll(".delete-button").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        appointments.splice(index, 1);
        saveAppointments();
        renderAppointments();
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const account = document.getElementById("account").value;
    const date = document.getElementById("date").value;
    const timeFrom = document.getElementById("time-from").value;
    const timeTo = document.getElementById("time-to").value;
    const note = document.getElementById("note").value;

    appointments.push({ name, phone, account, date, timeFrom, timeTo, note });
    saveAppointments();
    renderAppointments();
    form.reset();
  });

  renderAppointments();
});
