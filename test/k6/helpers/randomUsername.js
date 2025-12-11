export function randomUsername() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `user_${timestamp}_${random}`;
}
