document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  const tableBody = document.querySelector("#appointment-table tbody");

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }

  function renderAppointments() {
    tableBody.innerHTML = "";
    appointments.forEach((appt) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appt.name}</td>
        <td>${appt.date}</td>
        <td>${appt.time}</td>
        <td>${appt.note}</td>
      `;
      tableBody.appendChild(row);
    });
  }

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
