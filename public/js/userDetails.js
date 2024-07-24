document.addEventListener("DOMContentLoaded", function() {
    const customerBtn = document.querySelector(".customerBtn");
    const subCustomerBtn = document.querySelector(".subCustomerBtn");
    const dealerCustomers = document.querySelector(".dealer-customers");
    const subDealerCustomers = document.querySelector(".subDealer-customers");

    
    dealerCustomers.style.display = "block";
    subDealerCustomers.style.display = "none";
    customerBtn.classList.add("activeBtn");

    customerBtn.addEventListener("click", function() {
        dealerCustomers.style.display = "block";
        subDealerCustomers.style.display = "none";
        subCustomerBtn.classList.remove("activeBtn");
        customerBtn.classList.add("activeBtn");
    });

    subCustomerBtn.addEventListener("click", function() {
        dealerCustomers.style.display = "none";
        subDealerCustomers.style.display = "block";
        customerBtn.classList.remove("activeBtn");
        subCustomerBtn.classList.add("activeBtn");
    });
});