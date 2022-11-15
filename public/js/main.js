$(document).ready(() => {

  // Main
  $("#login-menu-btn").click((e) => { $(".drop-down").toggle("active"); });
  $(".toggle-menu .toggle-btn").click((e) => {
  $(".main-nav__list").toggleClass("active");
  $(".main-nav").toggleClass("active"); });

  // * Javascript for GET users/login
  if (document.getElementById("view-account-login")) {
    let form = document.getElementById("form-login");
    form.onsubmit = (e) => {
      e.preventDefault();

      let username = $(`input[name="username"]`).val();
      let password = $(`input[name="password"]`).val();

      let data = {
        username,
        password,
      };

      // Ajax
      $.post("/users/login", data, (response) => {
        // show Message to user
        if (response.success) {
          window.location.href = "/";
        } else {
          showMessage(response.message, "error");
        }
      });
    };
  }
  // * Javascript for GET users/change-password
  if (document.getElementById("view-account-user-change-pw")) {
    let form = document.getElementById("acc-change-password");
    form.onsubmit = (e) => {
      e.preventDefault();

      let currentPass = $(`input[name="currentpass"]`).val();
      let newPass = $(`input[name="newpass"]`).val();
      let renewPass = $(`input[name="renewpass"]`).val();

      let data = {
        currentPass,
        newPass,
        renewPass,
      };

      // Ajax
      $.post("/users/change-password", data, (response) => {
        // show Message to user
        if (response.success) {
          window.location.href = "/";
        } else {
          showMessage(response.message, "error");
        }
      });
    };
  }

  // * Javascript for GET users/first-login
  if (document.getElementById("view-account-user-change-pw-first-login")) {
    let form = document.getElementById("acc-change-password");
    form.onsubmit = (e) => {
      e.preventDefault();

      let newPass = $(`input[name="newpass"]`).val();
      let renewPass = $(`input[name="renewpass"]`).val();

      let data = {
        newPass,
        renewPass,
      };

      // Ajax
      $.post("/users/first-login", data, (response) => {
        // show Message to user
        if (response.success) {
          window.location.href = "/";
        } else {
          showMessage(response.message, "error");
        }
      });
    };
  }

  // * Javascript for GET /withdraw
  if (document.getElementById("view-exchange-withdraw")) {
    let form = document.getElementById("form-withdraw");
    form.onsubmit = (e) => {
      e.preventDefault();

      let cardNumber = $(`input[name="card-number"]`).val();
      let expireDate = $(`input[name="expire-date"]`).val();
      let cvv = $(`input[name="cvv"]`).val();

      let amount = $(`input[name="amount"]`).val();
      let note = $(`input[name="note"]`).val();

      let data = {
        cardNumber,
        expireDate,
        cvv,
        amount,
        note,
      };

      $.post("/withdraw", data, (response) => {
        if (response.success) {
          showMessage(response.message);
        } else {
          showMessage(response.message, "error");
        }
      });
    };
  }

  // * Javascript for GET /deposit
  if (document.getElementById("view-exchange-deposit")) {
    const myAlert = document.getElementById("my-alert");
    const money = document.getElementById("money");
    const feeDeposit = document.getElementById("feeDeposit");
    if (money) {
      money.addEventListener("input", async (e) => {
        //xu ly nếu nhập số tiền chuyển hơn số dư

        const myFetch = await fetch(location.href + "/info");
        const res = await myFetch.json();
        if (!res.code) {
          const data = res.data;
          const rest = data.total_value;

          if (rest < e.target.value) {
            showAlert("Your money not enough");
          } else {
            myAlert.innerHTML = "";
          }
          //xu ly fee 5%
          let fee = e.target.value * 0.05;
          feeDeposit.innerHTML = fee;
        }
        //console.log(res)
      });
    }
    //auto hiện tên ghi nhập đúng sdt
    const phone_receiver = document.getElementById("phone_receiver");
    const name_receiver = document.getElementById("name");

    phone_receiver.addEventListener("blur", async (e) => {
      let phone = phone_receiver.value;
      //console.log(phone);
      const myFetch = await fetch(location.href + "/info", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await myFetch.json();
      if (!res.code) {
        const data = res.data;
        const name = data.name;
        name_receiver.value = name;
        myAlert.innerHTML = "";
      } else {
        showAlert(res.message);
        name_receiver.value = "";
      }
    });

    function showAlert(message) {
      myAlert.innerHTML = "";
      const content = `
        <div class="alert alert-danger" role="alert">
          ${message}
        </div>
      `;
      myAlert.insertAdjacentHTML("beforeend", content);
    }
  }

  // view-admin-account
  // * Javascript for GET /phone-card
  if (document.getElementById("view-exchange-phone-card")) {
    const formCardPhone = document.getElementById("phone-card-form");
    const networkProviderBox = document.getElementById("networkProvider");
    const myAlert = document.getElementById("my-alert");
    let myFee;

    if (networkProviderBox) {
      networkProviderBox.addEventListener("change", async (e) => {
        const myFetch = await fetch(
          location.href + "/fee?code=" + e.target.value
        );
        const res = await myFetch.json();
        myFee = res.data[0].fee;
        document.querySelector("#fee").innerHTML = res.data[0].fee;
      });
    }

    if (formCardPhone) {
      formCardPhone.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { networkProvider, type, amount } = Object.fromEntries(formData);
        if (networkProvider === undefined) {
          showMessage("Please select your network provider", "error");
        } else if (type === undefined) {
          showMessage("Please choose our price type", "error");
        } else if (amount === undefined) {
          showMessage("Please select amount", "error");
        } else {
          myAlert.innerHTML = "";
          const myFetch = await fetch(location.href, {
            method: "POST",
            body: JSON.stringify({
              name: networkProvider,
              type,
              amount,
              fee: myFee,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const res = await myFetch.json();
          console.log(res);
          if (!res.code) {
            alert(
              "Ticket purchase was successful. Here are your code: " +
              res.data +
              "\nYou can view your code again in Dashbroad"
            );
            window.location.reload();
          } else showMessage(res.message, "error");
        }
      });
    }
    function showAlert(message) {
      myAlert.innerHTML = "";
      const content = ` <div class="alert alert-danger" role="alert"> ${message}</div> `;
      myAlert.insertAdjacentHTML("beforeend", content);
    }
  }

  // * Javascript for GET /recharge
  if (document.getElementById("view-exchange-recharge")) {
    let form = document.getElementById("form-recharge");
    form.onsubmit = (e) => {
      e.preventDefault();

      let card_number = $(`input[name="card-number"]`).val();
      let expire_date = $(`input[name="expire-date"]`).val();
      let cvv = $(`input[name="cvv"]`).val();

      let money = $(`input[name="amount"]`).val();

      let data = {
        card_number,
        expire_date,
        cvv,
        money,
      };

      $.post("/recharge", data, (response) => {
        if (response.success) {
          showMessage(response.message);
        } else {
          showMessage(response.message, "error");
        }
      });
    };
  }

  // view-admin-account
  // * Javascript for GET /admin/account
  if (document.getElementById("view-admin-account")) {

  }

  // * Javascript for GET /admin/withdraw
  if (document.getElementById("view-admin-withdraw")) {
    loadData();
    function loadData() {
      $("#tbody tr").remove();
      $.get("/admin/withdraw/api", (response) => {
        if (response.success) {
          let withdraws = response.data;
          withdraws.forEach((currVal) => {
            renderData(currVal);
          });

          $(".btn").click(onClickButton);
        }
      });
    }
    function renderData(withdraw) {
      /**
       * Render a row of data to table body
       * Input: withdraw Object
       * Output: Data has been append to the table
       */
      let tableBody = $("#tbody");
      let tableContent = `
      <tr>
          <th scope="row">${withdraw.id}</th>
          <td>${withdraw.username}</td>
          <td>${withdraw.card_number}</td>
          <td>${withdraw.value}</td>
          <td>${withdraw.date}</td>
          <td>        
            <a href="/admin/withdraw/${withdraw.id}" class="btn btn-primary">
              <i class="fa-solid fa-eye"></i>
            </a>
            <button class="btn btn-success" data-approve="true"  data-id="${withdraw.id}" >
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn btn-danger" data-approve="false" data-id="${withdraw.id}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </td>
        </tr>
      `;

      tableBody.append(tableContent);
    }

    function onClickButton(e) {
      /**
       * Xử lý click event của approve/disapprove
       * Input: e Event
       * Output: lấy dữ liệu và POST lên /admin/withdraw
       */
      let isApproved = this.getAttribute("data-approve");
      let id = this.getAttribute("data-id");

      let data = { id, isApproved };

      $.post("/admin/withdraw", data, (response) => {
        if (response.success) {
          loadData();
          showMessage(response.message);
        } else {
          showMessage(response.message, "error");
        }
      });
    }
  }

  // * Javascript for GET /admin/deposit
  if (document.getElementById("view-admin-deposit")) {
  }

  // * Javascript for GET /admin/trans-history
  if (document.getElementById("view-admin-trans-history")) {
    let selectBox = document.getElementById("history-type");

    selectBox.onchange = (e) => {
      let choice = e.target.value;
      loadData(choice);
    };

    function loadData(choice) {
      $("#tbody tr").remove();
      $.get(`/admin/trans-history/${choice}`, (response) => {
        if (response.success) {
          let data = response.data;
          data.forEach((currVal) => {
            renderData(currVal, choice);
          });
        }
      });
    }
    function renderData(data, choice) {
      /**
       * Render a row of data to table body
       * Input: withdraw Object
       * Output: Data has been append to the table
       */
      let tableBody = $("#tbody");

      console.log(data);
      if (choice === "5") {
        data.value = data.price;
      }
      let tableContent = `
      <tr>
          <th scope="row">${data.id}</th>
          <td>${data.username}</td>
          <td>${data.value}</td>
          <td>${data.date}</td>
          ${data.status}
          <td>
            <a href="/admin/trans-history/${choice}/${data.id}" class="btn btn-sm btn-primary">
              <i class="fa-solid fa-eye"></i>
            </a>
          </td>
        </tr>
      `;

      tableBody.append(tableContent);
    }
  }

  // * Javascript for GET /users/register
  if (document.getElementById("view-account-register")) {
    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function () {
      //var numFiles =
      $("input:file")[0].files.length;
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    });
    $(".custom-file-input2").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label2")
        .addClass("selected")
        .html(fileName);
    });

    handleUpload();
    function handleUpload() {
      let form = document.getElementById("form-register");

      form.onsubmit = (e) => {
        e.preventDefault();
        const suppported_extensions = ["jpg", "png"];

        let phone = document.getElementById("phone").value;
        let email = document.getElementById("email").value;
        let name = document.getElementById("name").value;
        let date_of_birth = document.getElementById("date_of_birth").value;
        let address = document.getElementById("address").value;
        let frontCMND = document.getElementById("file-front-cmnd");
        let backCMND = document.getElementById("file-back-cmnd");
        if (phone.length === 0) {
          console.log(phone.length);
          showMessage("Please enter your phone", "error");
        } else if (email.length === 0) {
          showMessage("Please enter your email", "error");
        } else if (name.length === 0) {
          showMessage("Please enter your name", "error");
        } else if (date_of_birth.length === 0) {
          showMessage("Please enter your date of birth", "error");
        } else if (address.length === 0) {
          showMessage("Please enter your address", "error");
        } else if (frontCMND.files[0] == undefined) {
          showMessage("Please enter front CMND", "error");
        } else if (backCMND.files[0] == undefined) {
          showMessage("Please enter back CMND", "error");
        } else {
          //console.log(frontCMND.files[0].name.split('.').pop().toLowerCase())
          let extensionFrontCMND = frontCMND.files[0].name
            .split(".")
            .pop()
            .toLowerCase();
          let extensionBackCMND = backCMND.files[0].name
            .split(".")
            .pop()
            .toLowerCase();

          if (
            !suppported_extensions.includes(extensionFrontCMND) ||
            !suppported_extensions.includes(extensionBackCMND)
          ) {
            showMessage(
              "File type is not supported! Only allow image png or jpg",
              "error"
            );
          } else {
            let data = new FormData();

            data.append("phone", phone);
            data.append("email", email);
            data.append("name", name);
            data.append("date_of_birth", date_of_birth);
            data.append("address", address);
            data.append("front_cmnd", frontCMND.files[0]);
            data.append("back_cmnd", backCMND.files[0]);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/users/register", true);
            xhr.send(data);
            xhr.onload = function () {
              if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                  let response = JSON.parse(xhr.responseText);
                  if (response.code === 0) {
                    console.log(response.code);
                    // SUCCESS
                    showMessage(response.message);
                  } else {
                    // FAIL
                    showMessage(response.message, "error");
                  }
                }
              }
            };
          }
        }
      };
    }
  }

  // * Javascript for GET /users/register
  if (document.getElementById("view-account-detail")) {
    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function () {
      //var numFiles =
      $("input:file")[0].files.length;
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
    });
    $(".custom-file-input2").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this)
        .siblings(".custom-file-label2")
        .addClass("selected")
        .html(fileName);
    });

    handleUpload();
    function handleUpload() {
      let form = document.getElementById("form-cmnd");

      form.onsubmit = (e) => {
        e.preventDefault();
        const suppported_extensions = ["jpg", "png"];

        let frontCMND = document.getElementById("file-front-cmnd");
        let backCMND = document.getElementById("file-back-cmnd");
        if (frontCMND.files[0] == undefined) {
          showMessage("Please enter front CMND", "error");
        } else if (backCMND.files[0] == undefined) {
          showMessage("Please enter back CMND", "error");
        } else {
          //console.log(frontCMND.files[0].name.split('.').pop().toLowerCase())
          let extensionFrontCMND = frontCMND.files[0].name
            .split(".")
            .pop()
            .toLowerCase();
          let extensionBackCMND = backCMND.files[0].name
            .split(".")
            .pop()
            .toLowerCase();

          if (
            !suppported_extensions.includes(extensionFrontCMND) ||
            !suppported_extensions.includes(extensionBackCMND)
          ) {
            showMessage(
              "File type is not supported! Only allow image png or jpg",
              "error"
            );
          } else {
            let data = new FormData();

            data.append("front_cmnd", frontCMND.files[0]);
            data.append("back_cmnd", backCMND.files[0]);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/users/profile", true);
            xhr.send(data);
            xhr.onload = function () {
              if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                  console.log(xhr.responseText);

                  let response = JSON.parse(xhr.responseText);
                  if (response.code === 0) {
                    console.log(response.code);
                    // SUCCESS
                    showMessage(response.message);
                    window.location.reload();
                  } else {
                    // FAIL
                    showMessage(response.message, "error");
                    window.location.reload();
                  }
                }
              }
            };
          }
        }
      };
    }
  }

  if (document.getElementById("view-account-sendOpt")) {

    let btnResendOTP = document.getElementById('btnResendOTP');
    btnResendOTP.addEventListener('submit', function () {
      intervalResend();
    })

    function intervalResend() {
      btnResendOTP.disabled = true;
      let count = 60;
      let resendtime = setInterval(() => {
        btnResendOTP.innerHTML = "Resend OTP in: " + count + " seconds";
        //console.log(count)
        count--;
        if (count < 0) {
          clearInterval(resendtime);
          btnResendOTP.disabled = false;
          btnResendOTP.innerHTML = "Resend OTP";

        }
      }, 1000)
    }
    intervalResend()

  }

  if (document.getElementById("view-admin-account-info")) {
    const myUrl = location.origin + "/"
    let tmp = location.href
    tmp = tmp.split('/')
    
    let withdrawContent
    let depositContent
    let phonecardContent
    let rechargeContent
    let data

    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const username = tmp[tmp.length-1]

    const withdrawBody = document.querySelector('#withdraw-body')
    const depositBody = document.querySelector('#deposit-body')
    const phonecardBody = document.querySelector('#phonecard-body')
    const rechargeBody = document.querySelector('#recharge-body');
    const receiveBody = document.querySelector('#receive-body');

    const handleBox = document.getElementById('handle-box')


    if (handleBox) {
      // Get origin and pathname
      const myURL = location.origin + "/admin/account"
      const actionList = ['verify', 'cancel', 'request', 'unclock']
      console.log(username)
      handleBox.addEventListener('click', async (e) => {
        const myID = e.target.id
        if (actionList.includes(myID)) {
          console.log(myID)
          if (confirm(`Are you sure want to ${myID} ${username}`) == true) {
            const myFetch = await fetch(myURL, {
              method: "PUT",
              body: JSON.stringify({
                username,
                action: myID
              }),
              headers: {
                'Content-Type': 'application/json'
              },
            })
            const res = await myFetch.json()
            if (!res.code) {
              alert("Update successful!")
              window.location.reload();
            }
          }
        }
      })
    }


    // Get withdraw 
    (async () => {
      const myFetch = await fetch(myUrl + "withdraw/api?username=" + username)
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.card_number}</td>
                        <td>${e.value}</td>
                        ${e.status}
                        <td>${e.date}</td>
                    </tr>
                    `
        ).join("")

        withdrawBody.insertAdjacentHTML('beforeend', context)
      }
      console.log(res)
    })();

    // Get deposit
    (async () => {
      const myFetch = await fetch(myUrl + "deposit/api/sender?username=" + username)
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.phone_receiver}</td>
                        <td>${e.value}</td>
                        <td>${e.fee}</td>
                        ${e.status}
                        <td>${e.feeperson}</td>
                        <td>${e.date}</td>
                    </tr>
                    `
        ).join("")

        depositBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();


    // Get receive
    (async () => {
      const myFetch = await fetch(myUrl + "deposit/api/receiver?username=" + username)
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.phone_sender}</td>
                        <td>${e.value}</td>
                        <td>${e.fee}</td>
                        <td>${e.feeperson}</td>
                        ${e.status}
                        <td>${e.date}</td>
                    </tr>
                    `
        ).join("")
        receiveBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();


    // Get phone card
    (async () => {
      const myFetch = await fetch(myUrl + "phonecard/api?username=" + username)
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.provider_number}</td>
                        <td>${e.price}</td>
                        <td>${e.quantity}</td>
                        <td>${e.date}</td>
                    </tr>
                    `
        ).join("")

        phonecardBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();

    // Get recharge
    (async () => {
      const myFetch = await fetch(myUrl + "users/card/api?username=" + username)
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.card_number}</td>
                        <td>${e.value}</td>
                        <td>${e.date}</td>
                    </tr>
                    `
        ).join("")
        rechargeBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();
  }

  if (document.getElementById("view-admin-account-home")) {

    const accountStatus = document.getElementById('account-type');
    const myTbody = document.getElementById('tbody')
    if (accountStatus && myTbody) {
      accountStatus.addEventListener('change', async (e) => {

        try {
          const myURL = location.href + "/api?status=" + e.target.value
          const fetchURL = await fetch(myURL)
          const res = await fetchURL.json()
          if (res.code) {
            throw new Error(res.message)
          }
          const data = res.data
          let context = data.map(e => `
            <tr class="item">
              <td>${e.id}</td>
              <td><a href="account/${e.username}">${e.username}</a></td>
              <td>${e.last_modified}</td>
            </tr>
        `).join("")
          console.log(data.length)
          if (!data.length) {
            context = `
          <td colspan="4" class="text-center">Data is empty</td>
          `
          }
          myTbody.innerHTML = ""
          myTbody.insertAdjacentHTML('beforeend', context)
        } catch (err) {
          console.error(err.message)
        }

      })
    }

  }

  if (document.getElementById("view-index")) {

    const myUrl = location.href
    let withdrawContent
    let depositContent
    let phonecardContent
    let rechargeContent
    let data

    const withdrawBody = document.querySelector('#withdraw-body')
    const depositBody = document.querySelector('#deposit-body')
    const phonecardBody = document.querySelector('#phonecard-body')
    const rechargeBody = document.querySelector('#recharge-body');
    const receiveBody = document.querySelector('#receive-body');


    function handleView(id, status) {
      console.log(id, status)
    }


    // Get withdraw 
    (async () => {
      const myFetch = await fetch(myUrl + "withdraw/api")
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.card_number}</td>
                    <td>${e.value}</td>
                    ${e.status}
                    <td>${e.date}</td>
                </tr>
                `
        ).join("")

        withdrawBody.insertAdjacentHTML('beforeend', context)
      }
      console.log(res)
    })();

    // Get deposit
    (async () => {
      const myFetch = await fetch(myUrl + "deposit/api/sender")
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.phone_receiver}</td>
                    <td>${e.value}</td>
                    <td>${e.fee}</td>
                    ${e.status}
                    <td>${e.feeperson}</td>
                    <td>${e.date}</td>
                </tr>
                `
        ).join("")

        depositBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();


    // Get receive
    (async () => {
      const myFetch = await fetch(myUrl + "deposit/api/receiver")
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.phone_sender}</td>
                    <td>${e.value}</td>
                    <td>${e.fee}</td>
                    <td>${e.feeperson}</td>
                    ${e.status}
                    <td>${e.date}</td>
                </tr>
                `
        ).join("")
        receiveBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();


    // Get phone card
    (async () => {
      const myFetch = await fetch(myUrl + "phonecard/api")
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.provider_number}</td>
                    <td>${e.price}</td>
                    <td>${e.quantity}</td>
                    <td>${e.date}</td>
                </tr>
                `
        ).join("")

        phonecardBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();

    // Get recharge
    (async () => {
      const myFetch = await fetch(myUrl + "users/card/api")
      const res = await myFetch.json()
      if (res.code == 0) {
        const context = res.data.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.card_number}</td>
                    <td>${e.value}</td>
                    <td>${e.date}</td>
                </tr>
                `
        ).join("")
        rechargeBody.insertAdjacentHTML('beforeend', context)
      }
      else console.error(res.message)
      console.log(res)
    })();

  }
});

function toast_header({
  title = "",
  message = "",
  type = "info",
  duration = 3000,
}) {
  const main = document.getElementById("custom-toast");
  if (main) {
    const toast = document.createElement("div");

    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    toast.onclick = function (e) {
      if (e.target.closest(".custom-toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fas fa-check-circle",
      info: "fas fa-info-circle",
      warning: "fas fa-exclamation-circle",
      error: "fas fa-exclamation-circle",
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("custom-toast", `custom-toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `
                    <div class="custom-toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="custom-toast__body">
                        <h3 class="custom-toast__title">${title}</h3>
                        <p class="custom-toast__msg">${message}</p>
                    </div>
                    <div class="custom-toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
    main.appendChild(toast);
  }
}

function showMessage(message, type = "success") {
  /**
   *  Dùng để hiển thị toast, có 4 type: success, info, warning, error
   *
   */

  let titles = {
    success: "Thành công!",
    error: "Thất bại!",
    warning: "Cảnh báo!",
    info: "Thông báo",
  };
  toast_header({
    title: titles[type],
    message: message,
    type: type,
    duration: 5000,
  });
}

// admin deposit javascript
async function checkClick(
  id,
  phone_sender,
  phone_receiver,
  value,
  fee,
  feeperson
) {
  const myURL = location.origin + location.pathname;
  //console.log(myURL)
  const myFetch = await fetch(myURL, {
    method: "POST",
    body: JSON.stringify({
      id,
      phone_sender,
      phone_receiver,
      value,
      fee,
      feeperson,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const res = await myFetch.json();
  if (!res.code) {
    showMessage("Approved this deposit succesfully");
    window.location.reload();
  }
}

async function rejectClick(id) {
  console.log(id);
  const myURL = location.origin + location.pathname + 2;
  const myFetch = await fetch(myURL, {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });
  console.log(myFetch);
  const res = await myFetch.json();
  if (!res.code) {
    showMessage("Reject this deposit ","error");
    window.location.reload();
  }
}
