const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");


function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const todayDate = getTodayDate();
  startDate.value = todayDate;
  endDate.value = todayDate;

  endDate.setAttribute("min", startDate.value);
  startDate.addEventListener("change",()=>{
  endDate.setAttribute("min", startDate.value);
  })
});
