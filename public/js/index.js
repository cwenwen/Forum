let contentToBeDeleted, commentToBeRemove;

document.querySelector('body').addEventListener('click', e => {

  // create new comment
  if (e.target.classList.contains('create-comment__btn')) {
    const topic = e.target.previousElementSibling.previousElementSibling.previousElementSibling.value;
    const content = e.target.previousElementSibling.previousElementSibling.value;
    const parentId = e.target.previousElementSibling.value;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.responseText === 'ok') document.location.href = '/';
      }
    }
    xhr.open('POST', '/insert_comment');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`topic=${topic}&content=${content}&parentId=${parentId}`);
  }

  // edit comment: 'edit' btn
  if (e.target.classList.contains('edit__btn')) {
    const content = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
    const newTextArea = document.createElement('textarea');
    
    newTextArea.classList.add('edit-textarea', 'mt-2', 'rounded');
    newTextArea.setAttribute("placeholder", "Comment");
    newTextArea.setAttribute("required", "");
    newTextArea.innerHTML = content.innerText;
    content.outerHTML = newTextArea.outerHTML;
    
    // change buttons
    e.target.nextElementSibling.style.display = 'none';
    e.target.outerHTML = '<button type="button" class="submit__btn btn btn-secondary btn-sm mr-1">Submit</button>';
  }

  // edit comment: 'submit' btn
  if (e.target.classList.contains('submit__btn')) {
    const content = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
    const commentId = content.nextElementSibling.innerText;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.responseText === 'modified') {
          if (e.target.parentNode.parentNode.classList.contains('comment')) {
            content.outerHTML = `
            <p class="comment--content pb-3">
              ${content.value.replace(/\n/g, '<br/>')}
            </p>
            `
          } else {
            content.outerHTML = `
            <p class="subcomment--content m-0 p-0">
              ${content.value.replace(/\n/g, '<br/>')}
            </p>
            `
          }
          // change buttons
          e.target.nextElementSibling.style.display = 'inline';
          e.target.outerHTML = '<button type="button" class="edit__btn btn btn-secondary btn-sm mr-1">Edit</button>';
        }
      }
    }

    xhr.open('POST', '/modify_comment');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(`commentId=${commentId}&content=${content.value}`);
  }
  
  // confirm deletion
  if (e.target.classList.contains('confrm__deletion__btn')) {
    contentToBeDeleted = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
    commentToBeRemove = e.target.parentNode.parentNode;
  }

  // delete comment
  if (e.target.classList.contains('delete__btn')) {
    const commentId = contentToBeDeleted.nextElementSibling.innerText;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.responseText === 'deleted') commentToBeRemove.remove();
      }
    }
    xhr.open('DELETE', '/delete_comment');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`commentId=${commentId}`);
  }
})

//// create new comment
//document.querySelectorAll('.create-comment__btn').forEach(btn => {
//  btn.addEventListener('click', e => {
//
//    const topic = e.target.previousElementSibling.previousElementSibling.previousElementSibling.value;
//    const content = e.target.previousElementSibling.previousElementSibling.value;
//    const parentId = e.target.previousElementSibling.value;
//
//    const xhr = new XMLHttpRequest();
//
//    xhr.onreadystatechange = () => {
//      if (xhr.readyState === XMLHttpRequest.DONE) {
//        if (xhr.responseText === 'ok') document.location.href = '/';
//      }
//    }
//    xhr.open('POST', '/insert_comment');
//    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//    xhr.send(`topic=${topic}&content=${content}&parentId=${parentId}`);
//  })
//})

//// edit comment: 'edit' btn
//document.querySelectorAll('.edit__btn').forEach(btn => {
//  btn.addEventListener('click', e => {
//
//    const content = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
//    const newTextArea = document.createElement('textarea');
//    
//    newTextArea.classList.add('edit-textarea', 'mt-2', 'rounded');
//    newTextArea.setAttribute("placeholder", "Comment");
//    newTextArea.setAttribute("required", "");
//    newTextArea.innerHTML = content.innerText;
//    content.outerHTML = newTextArea.outerHTML;
//    
//    // change buttons
//    e.target.innerText = 'Submit';
//    e.target.className = 'submit__btn btn btn-secondary btn-sm mr-1';
//    e.target.nextElementSibling.style.display = 'none'; 
//
//    // edit comment: 'submit' btn
//    document.querySelectorAll('.submit__btn').forEach(btn => {
//      btn.addEventListener('click', e => {
//
//        const content = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
//        const commentId = content.nextElementSibling.innerText;
//
//        const xhr = new XMLHttpRequest();
//
//        xhr.onreadystatechange = () => {
//          if (xhr.readyState === XMLHttpRequest.DONE) {
//            if (xhr.responseText === 'modified') {
//              if (e.target.parentNode.parentNode.classList.contains('comment')) {
//                content.outerHTML = `
//                <p class="comment--content pb-3">
//                  ${content.value.replace(/\n/g, '<br/>')}
//                </p>
//                `
//              } else {
//                content.outerHTML = `
//                <p class="subcomment--content m-0 p-0">
//                  ${content.value.replace(/\n/g, '<br/>')}
//                </p>
//                `
//              }
//              e.target.innerText = 'Edit';
//              e.target.className = 'edit__btn btn btn-secondary btn-sm mr-1';
//              e.target.nextElementSibling.style.display = 'inline'; 
//            }
//          }
//        }
//
//        xhr.open('POST', '/modify_comment');
//        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//        xhr.send(`commentId=${commentId}&content=${content.value}`);
//      })
//    })
//  })
//})

//// delete comment
//document.querySelectorAll('.delete__btn').forEach(btn => {
//  btn.addEventListener('click', e => {
//
//    const content = e.target.parentNode.nextElementSibling.nextElementSibling.nextElementSibling;
//    const commentId = content.nextElementSibling.innerText;
//
//    const xhr = new XMLHttpRequest();
//
//    xhr.onreadystatechange = () => {
//      if (xhr.readyState === XMLHttpRequest.DONE) {
//        if (xhr.responseText === 'deleted') e.target.parentNode.parentNode.remove();
//      }
//    }
//    xhr.open('DELETE', '/delete_comment');
//    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//    xhr.send(`commentId=${commentId}`);
//  })
//})