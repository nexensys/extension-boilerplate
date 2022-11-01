export default {
  onOpen: () =>
    console.debug(
      "[livereload] Connected to livereload server, waiting for message..."
    ),
  onMessage: () =>
    console.debug(
      "[livereload] Recieved message from livereload server, reloading..."
    ),
  onError: (e: Event) => console.debug("[livereload] Encountered an error: ", e)
};
