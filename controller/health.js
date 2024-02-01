export function checkHealth(req, res) {
  const object = {
    health: "OK",
  };
  res.status(200).json(object);
}
