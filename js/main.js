const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//const point = "https://www.plurg.me/api/v1";
const point = "http://localhost:8181/api/v1";

postDesc.addEventListener("input", (e) => {
  const target = e.currentTarget;
  const currentLength = target.value.length;
  postFieldCount.innerText = `${currentLength}/127`;
});

proceedBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let note = postDesc.value;
  const email = postEmail.value;
  const amt = 1 * 800;

  if (!note || !email || !email.match(mailformat)) {
    showMsg("All fields are required");
    return;
  }

  note = note.replace("/\n/g", " ");
  proceedBtn.enabled = false;

  try {
    const doc = {
      note: note,
      email: email,
      utc: new Date().toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    credit(amt, email, doc);
  } catch (error) {
    console.log(error);
  }
});

function credit(amt, email, doc) {
  const handler = PaystackPop.setup({
    key: payHash(),
    email: email,
    amount: `${amt}00`,
    callback: (response) => {
      if (response.status == "success") {
        axios
          .post(`${point}/note`, doc)
          .then(() => {
            postDesc.value = null;
            postEmail.value = null;
            showMsg("Note updated successfully!");
          })
          .catch(() => {
            showMsg(`Oops, something went wrong, try again`);
          });

        proceedBtn.enabled = true;
      } else {
        showMsg("Something went wrong try again");
      }
    },
    onClose: function () {
      proceedBtn.enabled = true;
      showMsg("Transaction cancelled");
    },
  });
  handler.openIframe();
}
