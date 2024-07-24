function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const todayDate = getTodayDate();
  document.getElementById("startDate").value = todayDate;
  document.getElementById("endDate").value = todayDate;
});
