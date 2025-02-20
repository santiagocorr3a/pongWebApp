document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('load', function() {
    setTimeout(() => {
      document.querySelectorAll('.card').forEach(card => {
        card.style.transform = 'rotate(calc(var(--i) * 10deg))';
      });
    }, 500);
  });

  document.getElementById("visibility_icon").addEventListener("click", function() {
    show_password();
  });

  function show_password() {
    var password = document.getElementById("password");
    var icon = document.getElementById("visibility_icon");
    if (password.type === "password") {
      password.type = "text";
      icon.textContent = 'visibility';
    } else {
      password.type = "password";
      icon.textContent = 'visibility_off';
    }
  }

  var username = document.getElementById('username');
  var username_warning = document.getElementById('username_warning');
  var button = document.getElementById("signup_button");
  var password = document.getElementById('password');
  var password_warning = document.getElementById('password_warning');
  var icon = document.getElementById("visibility_icon");

  username.addEventListener("input", function() {
    if (/\s/.test(this.value)) {
      username_warning.textContent = 'Username should not contain spaces';
      username_warning.style.display = 'block';
      icon.style.right = '37px';
      button.disabled = true;
    } else {
      username_warning.textContent = '';
      icon.style.right = '13px';
      username_warning.style.display = 'none';
      button.disabled = false;
    }
  });

  password.addEventListener("input", function () {
    let messages = [];
    let hasUpperCase = /[A-Z]/.test(password.value);
    let hasLowerCase = /[a-z]/.test(password.value);
    let hasDigit = /\d/.test(password.value);
    let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
    let isEmpty = password.value.trim() === '';

    if (!hasUpperCase) {
      messages.push('Add an UPPERCASE character');
    }
    if (!hasLowerCase) {
      messages.push('ADD A lowercase CHARACTER');
    }
    if (!hasDigit) {
      messages.push('4DD NUMB3R5');
    }
    if (!hasSpecialChar) {
      messages.push('Add $pec!a| ch@racter$');
    }
    if (isEmpty) {
      button.style.color = 'black';
      button.style.border = '0.5px solid black';
    }

    if (messages.length > 0) {
      password_warning.textContent = messages.join(', ');
      password_warning.style.display = 'block';
      button.disabled = true;
      button.style.color = 'black';
      button.style.border = '0.5px solid black';
    } else {
      password_warning.textContent = '';
      password_warning.style.display = 'none';
      button.disabled = false;
      button.style.color = '#ff5555';
      button.style.border = '0.5px solid #ff5555';
    }
  });

});
document.addEventListener('DOMContentLoaded', function () {

  const popupOverlay = document.getElementById('popupOverlay');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const playerCount = document.getElementById('player_count');
  const startGame = document.getElementById('start_game');

  function openPopup() {
      popupOverlay.style.display = 'block';
  }

  function closePopupFunc() {
      popupOverlay.style.display = 'none';
  }

  function submitForm() {
      const player_count = playerCount.value;
      closePopupFunc();
  }

  startGame.addEventListener('click', openPopup)
  closePopup.addEventListener('click', closePopupFunc);
  popupOverlay.addEventListener('click', function (event) {

      if (event.target === popupOverlay) {
          closePopupFunc();
      }
  });
});

function addPoints(playerId) {
  const pointsInput = document.getElementById(`add-points-${playerId}`);
  const pointsToAdd = parseInt(pointsInput.value);
  fetch(`/update_score`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ player_id: playerId, points: pointsToAdd })
  })
  .then(response => response.json())
  .then(data => {
      const scoreCell = document.getElementById(`score-${playerId}`);
      scoreCell.innerHTML = `<button type="button" class="filled_button">
                        <span style="font-weight: 600; font-size: 30px">${data.new_score}</span>
                      </button>`;
      pointsInput.value = '';
  })
  .catch(error => console.error("Error updating score:", error));
  updatePodium(playerId);
}
function updatePodium(playerId) {
  const firstStep = document.getElementById('podium_first');
  const secondStep = document.getElementById('podium_second');
  const thirdStep = document.getElementById('podium_third');
  fetch(`/update_podium`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ player_id: playerId })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    firstStep.innerHTML = `${data.firstPlace.name} (${data.firstPlace.points} points)`;
    secondStep.innerHTML = `${data.secondPlace.name} (${data.secondPlace.points} points)`;
    thirdStep.innerHTML = `${data.thirdPlace.name} (${data.thirdPlace.points} points)`;
})
.catch(error => console.error("Error updating podium:", error));
}

function editName(playerId, playerName) {

  const nameField = document.getElementById(`player_name-${playerId}`);
  const editIcon = document.getElementById(`edit_icon-${playerId}`);
  if (nameField.innerHTML.includes('form')) {
    nameField.innerHTML = `${playerName}`;
    editIcon.innerHTML = '<span class="material-symbols-outlined" style="font-weight: 600; font-size: 20px">edit</span>';
  } else {
    nameField.innerHTML = `
      <div class="container" style="flex-direction: row">
        <form>
          <input class="form player_add" name="new_name" placeholder="New name" type="text" id="new_name_field-${playerId}">
        </form>
        <button class="button" style="color: var(--red);; border: none; padding: 0px; margin: 0px;" onclick="changeName(${playerId})">
          <span class="material-symbols-outlined" style="font-weight: 900; font-size: 24px">check</span>
        </button>
      </div>`;
    editIcon.innerHTML = '<span class="material-symbols-outlined" style="font-weight: 600; font-size: 20px">cancel</span>';
  }
}



function changeName(playerId) {
  const newNameField = document.getElementById(`new_name_field-${playerId}`);
  fetch(`/change_name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ new_name: newNameField.value, player_id: playerId })
  })
  .then(response => response.json())
  .then(data => {
    const nameBox = document.getElementById(`player_name-${playerId}`);
    const editIcon = document.getElementById(`edit_icon-${playerId}`);
    nameBox.innerHTML = `${data.new_name}`;
    editIcon.innerHTML = '<span class="material-symbols-outlined" style="font-weight: 600; font-size: 20px">edit</span>';
    nameBox.onclick = null;
  })
  .catch(error => console.error("Error changing name:", error));
  updatePodium(playerId);
}

function addPlayer(game_code) {
  const playerName = document.getElementById(`player_add_name`);
  const playerScore = document.getElementById(`player_add_score`);
  const table = document.getElementById(`players_table`);

  fetch(`/add_player`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ player_name: playerName.value, player_score: playerScore.value, game_code: game_code })
  })
    .then(response => response.json())
    .then(data => {
      const newRow = document.createElement('tr');
      console.log(data);
      newRow.innerHTML = `
        <td>
          <button class="button" style="color: var(--red);; border: none; padding: 0px; margin: 0px;" id="edit_icon-${data.id}">
            <span class="material-symbols-outlined" style="font-weight: 600; font-size: 20px">edit</span>
          </button>
        </td>
        <td id="player_name-${data.id}">
          ${data.player_name}
        </td>
        <td id="score-${data.id}">
          <button type="button" class="filled_button">
            <span style="font-weight: 600; font-size: 30px">${data.points}</span>
          </button>
        </td>
        <td>
          <div class="container" style="flex-direction: row">
            <form>
              <input class="form points_add" name="add_points" placeholder="±Points" type="text" id="add-points-${data.id}">
            </form>
            <button type="button" class="filled_button" id="add-points-btn-${data.id}">
              <span class="material-symbols-outlined" style="font-weight: 600; font-size: 30px">add</span>
            </button>
          </div>
        </td>
      `;
      table.appendChild(newRow);

      playerName.value = '';
      playerScore.value = '';

      const editButton = document.getElementById(`edit_icon-${data.id}`);
      const addPointsButton = document.getElementById(`add-points-btn-${data.id}`);

      updatePodium(data.id);

      editButton.addEventListener('click', () => {
        editName(data.id, data.player_name);
      });

      addPointsButton.addEventListener('click', () => {
        addPoints(data.id);
      });
    });
}

window.onload = function() {
  updatePodium(playerId);
};
