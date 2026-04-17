function submitMessage(event) {
  event.preventDefault();

  const message = document.getElementById("form-message");
  message.textContent = "Thanks. Your request has been captured for the next build phase.";

  event.target.reset();
  return false;
}

document.getElementById("year").textContent = new Date().getFullYear();
