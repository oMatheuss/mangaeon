export function isUUID(uuid: string) {
  // https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid

  const regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return regex.test(uuid);
}
