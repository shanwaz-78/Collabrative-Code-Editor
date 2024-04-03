window.addEventListener("DOMContentLoaded", () => {
  const HOST = `http://localhost:8001`;
  const socket = io(HOST);

  let editorContent = "";
  let editorPosition = { lineNumber: 0, column: 0 };

  function configEditor() {
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs",
      },
    });

    require(["vs/editor/editor.main"], function () {
      const editor = monaco.editor.create(
        document.getElementById("monaco-editor"),
        {
          language: "javascript",
          automaticLayout: true,
          value: editorContent,
        }
      );

      editor.onKeyDown(
        () => {
          editorContent = editor.getModel().getValue();
          editorPosition = editor.getPosition();

          socket.emit("editor-update", {
            content: editorContent,
            position: editorPosition,
          });
        },
        null,
        null,
        true
      );

      socket.on("broadcast-update", (data) => {
        editor.getModel().setValue(data.content);
        editor.setPosition(data.position);
      });
    });
  }

  configEditor();
});
