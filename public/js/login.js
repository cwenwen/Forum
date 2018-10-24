document.querySelector('.login__btn').addEventListener('click', () => {

  const username = document.querySelector('[name=username]');
  const password = document.querySelector('[name=password]');
  
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {

      if (xhr.responseText === 'error') showWarning('Invalid username or password');
      if (xhr.responseText === 'ok') document.location.href = '/';
    }
  }
  xhr.open('POST', '/login');
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`username=${username.value}&password=${password.value}`);
})

function showWarning(warning) {
  document.querySelector('.warning').innerText = warning;
	document.querySelector('.warning').style.display = 'inline';
}