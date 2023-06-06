export function getUserById(userId: string) {
  return {
    $or: [{ _id: userId }, { userId: userId }]
  };
}
