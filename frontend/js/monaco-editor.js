document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.querySelector(".user-section");
  const userName = prompt(`Give your name to use editor`);

  const HOST = `http://localhost:8001`;
  const socket = io(HOST);

  let editorContent = null;
  let editorPosition = { lineNumber: 0, column: 0 };

  const editor = initializeEditor();

  function initializeEditor() {
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs",
      },
    });

    let editorInstance = null;
    require(["vs/editor/editor.main"], function () {
      editorInstance = monaco.editor.create(
        document.getElementById("monaco-editor"),
        {
          language: "javascript",
          automaticLayout: true,
          value: editorInstance,
        }
      );
      handleSocketEvents(editorInstance);
    });
    return editorInstance;
  }

  function handleSocketEvents(editorInstance) {
    editorInstance.onKeyDown(() => {
      editorContent = editorInstance.getModel().getValue().trim();
      editorPosition = editorInstance.getPosition();

      socket.emit("editor-update", {
        content: editorContent,
        position: editorPosition,
      });
    });

    socket.on("broadcast-update", (data) => {
      editorInstance.getModel().setValue(data.content);
      editorInstance.setPosition(data.position);
    });

    if (userName) {
      socket.emit(`user-join`, userName);
    }

    socket.on("joined-user", (userDetails) => {
      showUserJoinNotification(userDetails, 1500);
    });

    // Handle user disconnect notification
    socket.on("user-disconnect", (userId) => {
      const disconnectedUser = document.querySelector(`[data-id="${userId}"]`);
      if (disconnectedUser) {
        userSection.removeChild(disconnectedUser);
        showDisconnectNotification(userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  }

  function showUserJoinNotification(userDetails, timer = 1500) {
    const popUp = document.createElement("div");
    if (userDetails.userId === socket.id) {
      popUp.textContent = `You Joined to use Editor`;
    } else {
      popUp.textContent = `${userDetails.userName}, Collab with your code.`;
    }
    popUp.classList.add("popup");
    popUp.dataset.id = userDetails.userId;
    userSection.appendChild(popUp);

    setTimeout(() => {
      popUp.remove();
    }, timer);
  }

  function showDisconnectNotification(userId) {
    const popUp = document.createElement("div");
    popUp.textContent = `User ${userId} disconnected`;
    popUp.classList.add("popup");
    userSection.appendChild(popUp);

    setTimeout(() => {
      popUp.remove();
    }, 1500);
  }
});
